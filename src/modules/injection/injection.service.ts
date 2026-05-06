import mongoose from "mongoose";
import { SupermarketModel } from "../supermarket/supermarket.model.ts";
import { InjectionJobModel } from "./injectionJob.model.ts";
import { InjectionLogModel } from "./injectionLog.model.ts";
import { buildInvoicePayload, type InvoicePayload } from "./invoicePayloadBuilder.ts";
import logger from "../../shared/utils/logger.ts";

const INGEST_URL = "https://hysomer-ingestion-server.onrender.com/api/v1/invoices";

export async function postToIngestion(
  payload: InvoicePayload,
  apiKey: string,
  organizationId: string
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const fetchRes = await fetch(INGEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Ingestion-Key": apiKey,
        "X-Organization-Id": organizationId,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const text = await fetchRes.text();
    if (fetchRes.ok) {
      return { ok: true as const, status: fetchRes.status };
    }
    return { ok: false as const, status: fetchRes.status, error: text.slice(0, 500) };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  } finally {
    clearTimeout(timeout);
  }
}

export async function executeInjectionForSupermarket(supermarketId: string): Promise<void> {
  if (!mongoose.isValidObjectId(supermarketId)) {
    logger.warn(`Injection skipped: invalid supermarket id ${supermarketId}`);
    return;
  }

  const job = await InjectionJobModel.findOne({
    supermarketId,
    status: "connected",
  });
  if (!job) {
    return;
  }

  const sm = await SupermarketModel.findById(supermarketId);
  if (!sm) {
    logger.error(`Injection skipped: supermarket missing ${supermarketId}`);
    return;
  }

  const payload = buildInvoicePayload(sm.organization_id, "qatest@hysomer.com", job.invoicesSent);
  const result = await postToIngestion(payload, sm.api_key, sm.organization_id);

  if (result.ok) {
    await InjectionJobModel.updateOne(
      { _id: job._id },
      { $inc: { invoicesSent: 1 }, $set: { lastInvoiceAt: new Date() } }
    );
  } else {
    await InjectionJobModel.updateOne(
      { _id: job._id },
      { $inc: { invoicesFailed: 1 }, $set: { lastInvoiceAt: new Date() } }
    );
  }

  await InjectionLogModel.create({
    supermarketId,
    injectedAt: new Date(),
    invoiceId: payload.externalInvoiceId,
    success: result.ok,
    ...(result.ok
      ? {}
      : {
          error: result.error ?? (result.status != null ? `HTTP ${result.status}` : "Request failed"),
          ...(result.status != null ? { httpStatus: result.status } : {}),
        }),
    totalAmount: payload.totalAmount,
    customerName: payload.customer.name,
    itemCount: payload.items.length,
    paymentMethod: payload.paymentMethod,
    payload,
  });
}
