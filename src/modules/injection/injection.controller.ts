import type { Response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../../shared/utils/asyncHandler.ts";
import type { AuthRequest } from "../../shared/middleware/auth.middleware.ts";
import { AppError } from "../../shared/utils/AppError.ts";
import { SupermarketModel } from "../supermarket/supermarket.model.ts";
import { InjectionJobModel } from "./injectionJob.model.ts";
import { InjectionLogModel } from "./injectionLog.model.ts";
import { runInjectionOnceNow } from "./injection.scheduler.ts";
import logger from "../../shared/utils/logger.ts";

function requireObjectId(id: string): mongoose.Types.ObjectId {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid supermarket id", 400);
  }
  return new mongoose.Types.ObjectId(id);
}

export const getOverview = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const supermarkets = await SupermarketModel.find().sort({ supermarket_name: 1 }).lean();
  const ids = supermarkets.map((s) => s._id);
  const jobs = await InjectionJobModel.find({ supermarketId: { $in: ids } }).lean();
  const jobBySm = new Map(jobs.map((j) => [j.supermarketId.toString(), j]));

  const jobsOut = supermarkets.map((sm) => {
    const j = jobBySm.get(sm._id.toString());
    return {
      supermarketId: sm._id.toString(),
      supermarketName: sm.supermarket_name,
      organizationId: sm.organization_id,
      status: (j?.status as string) ?? "disconnected",
      invoicesSent: j?.invoicesSent ?? 0,
      invoicesFailed: j?.invoicesFailed ?? 0,
      connectedAt: j?.connectedAt ? j.connectedAt.toISOString() : null,
      lastInvoiceAt: j?.lastInvoiceAt ? j.lastInvoiceAt.toISOString() : null,
      intervalMs: j?.intervalMs ?? 60_000,
    };
  });

  res.status(200).json({ success: true, jobs: jobsOut });
});

export const getLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supermarketId = requireObjectId(req.params.supermarketId as string);
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(Math.max(1, Number(req.query.limit) || 15), 100);
  const skip = (page - 1) * limit;
  const statusRaw = typeof req.query.status === "string" ? req.query.status.toLowerCase() : "";
  const filter: Record<string, unknown> = { supermarketId };
  if (statusRaw === "success") {
    filter.success = true;
  } else if (statusRaw === "failed" || statusRaw === "failure") {
    filter.success = false;
  }

  const [total, logs] = await Promise.all([
    InjectionLogModel.countDocuments(filter),
    InjectionLogModel.find(filter).sort({ injectedAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  res.status(200).json({
    success: true,
    logs: logs.map((log) => ({
      id: log._id.toString(),
      timestamp: log.injectedAt.toISOString(),
      invoiceId: log.invoiceId,
      totalAmount: log.totalAmount,
      customerName: log.customerName,
      paymentMethod: log.paymentMethod,
      itemCount: log.itemCount,
      success: log.success,
      status: log.success ? "success" : "failed",
      error: log.error,
      httpStatus: log.httpStatus,
      payload: log.payload,
    })),
    total,
    page,
    limit,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  });
});

export const getDailyStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supermarketId = requireObjectId(req.params.supermarketId as string);
  const daily = await InjectionLogModel.aggregate([
    { $match: { supermarketId } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$injectedAt" } },
        total: { $sum: 1 },
        successful: { $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ["$success", true] }, 0, 1] } },
      },
    },
    { $sort: { _id: -1 } },
    { $limit: 60 },
  ]);
  res.status(200).json({
    success: true,
    daily: daily.map((d) => ({
      date: d._id,
      total: d.total,
      successful: d.successful,
      failed: d.failed,
    })),
  });
});

/**
 * Paginated report: injections grouped by UTC calendar day × supermarket.
 * Backed by aggregation on InjectionLog (no separate collection).
 */
export const getDailyInjectionReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(Math.max(1, Number(req.query.limit) || 20), 100);
  const skip = (page - 1) * limit;

  const outcomeRaw =
    typeof req.query.outcome === "string" ? req.query.outcome.toLowerCase() : "all";

  const match: Record<string, unknown> = {};
  if (
    typeof req.query.supermarketId === "string" &&
    mongoose.isValidObjectId(req.query.supermarketId)
  ) {
    match.supermarketId = new mongoose.Types.ObjectId(req.query.supermarketId);
  }
  if (outcomeRaw === "success") {
    match.success = true;
  } else if (outcomeRaw === "failed" || outcomeRaw === "failure") {
    match.success = false;
  }

  if (typeof req.query.from === "string" || typeof req.query.to === "string") {
    const injectedAt: Record<string, Date> = {};
    if (typeof req.query.from === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.from)) {
      injectedAt.$gte = new Date(`${req.query.from}T00:00:00.000Z`);
    }
    if (typeof req.query.to === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.to)) {
      injectedAt.$lte = new Date(`${req.query.to}T23:59:59.999Z`);
    }
    if (Object.keys(injectedAt).length > 0) {
      match.injectedAt = injectedAt;
    }
  }

  const pipeline: mongoose.PipelineStage[] = [
    { $match: match },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$injectedAt", timezone: "UTC" } },
          supermarketId: "$supermarketId",
        },
        injectCount: { $sum: 1 },
        successCount: { $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] } },
        failedCount: { $sum: { $cond: [{ $eq: ["$success", true] }, 0, 1] } },
      },
    },
    {
      $lookup: {
        from: "supermarkets",
        localField: "_id.supermarketId",
        foreignField: "_id",
        as: "sm",
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        supermarketId: "$_id.supermarketId",
        supermarketName: { $ifNull: [{ $arrayElemAt: ["$sm.supermarket_name", 0] }, "—"] },
        injectCount: 1,
        successCount: 1,
        failedCount: 1,
      },
    },
    { $sort: { date: -1, supermarketName: 1 } },
    {
      $facet: {
        meta: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ];

  const [agg] = await InjectionLogModel.aggregate(pipeline);
  const total = agg?.meta?.[0]?.total ?? 0;
  const rows = (agg?.data ?? []).map(
    (r: {
      date: string;
      supermarketId: mongoose.Types.ObjectId;
      supermarketName: string;
      injectCount: number;
      successCount: number;
      failedCount: number;
    }) => ({
      date: r.date,
      supermarketId: r.supermarketId.toString(),
      supermarketName: r.supermarketName,
      injectCount: r.injectCount,
      successCount: r.successCount,
      failedCount: r.failedCount,
    })
  );

  res.status(200).json({
    success: true,
    rows,
    total,
    page,
    limit,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  });
});

export const startInjection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const smIdRaw = req.params.supermarketId as string;
  const supermarketId = requireObjectId(smIdRaw);
  const sm = await SupermarketModel.findById(supermarketId);
  if (!sm) {
    throw new AppError("Supermarket not found", 404);
  }

  let job = await InjectionJobModel.findOne({ supermarketId });
  if (!job) {
    job = await InjectionJobModel.create({
      supermarketId,
      status: "connected",
      connectedAt: new Date(),
    });
  } else {
    job.status = "connected";
    job.connectedAt = job.connectedAt ?? new Date();
    await job.save();
  }

  void runInjectionOnceNow(smIdRaw).catch((err: unknown) => {
    logger.error(
      `Immediate injection failed: ${err instanceof Error ? err.message : String(err)}`
    );
  });

  res.status(200).json({ success: true, job });
});

export const pauseInjection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supermarketId = requireObjectId(req.params.supermarketId as string);
  const job = await InjectionJobModel.findOneAndUpdate(
    { supermarketId },
    { $set: { status: "stopped" } },
    { returnDocument: "after" }
  );
  if (!job) {
    throw new AppError("No injection job for this supermarket", 404);
  }
  res.status(200).json({ success: true, job });
});

export const stopInjection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supermarketId = requireObjectId(req.params.supermarketId as string);
  const job = await InjectionJobModel.findOneAndUpdate(
    { supermarketId },
    { $set: { status: "disconnected", connectedAt: null } },
    { returnDocument: "after" }
  );
  if (!job) {
    throw new AppError("No injection job for this supermarket", 404);
  }
  res.status(200).json({ success: true, job });
});

export const resumeInjection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const smIdRaw = req.params.supermarketId as string;
  const supermarketId = requireObjectId(smIdRaw);
  const job = await InjectionJobModel.findOneAndUpdate(
    { supermarketId },
    { $set: { status: "connected", connectedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!job) {
    throw new AppError("No injection job for this supermarket — start (connect) first", 404);
  }

  void runInjectionOnceNow(smIdRaw).catch((err: unknown) => {
    logger.error(
      `Resume injection failed: ${err instanceof Error ? err.message : String(err)}`
    );
  });

  res.status(200).json({ success: true, job });
});

export const clearLogsOnly = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supermarketId = requireObjectId(req.params.supermarketId as string);
  await InjectionLogModel.deleteMany({ supermarketId });
  res.status(200).json({ success: true });
});

export const clearInjectionData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supermarketId = requireObjectId(req.params.supermarketId as string);
  await InjectionLogModel.deleteMany({ supermarketId });
  const job = await InjectionJobModel.findOneAndUpdate(
    { supermarketId },
    {
      $set: {
        status: "disconnected",
        connectedAt: null,
        invoicesSent: 0,
        invoicesFailed: 0,
        lastInvoiceAt: null,
      },
    },
    { returnDocument: "after" }
  );
  res.status(200).json({ success: true, job });
});
