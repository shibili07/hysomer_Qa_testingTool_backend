import mongoose from "mongoose";

const InjectionJobSchema = new mongoose.Schema(
  {
    supermarketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supermarket",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["disconnected", "connected", "stopped"],
      default: "disconnected",
    },
    invoicesSent: { type: Number, default: 0 },
    invoicesFailed: { type: Number, default: 0 },
    connectedAt: { type: Date, default: null },
    lastInvoiceAt: { type: Date, default: null },
    intervalMs: { type: Number, default: 60_000 },
  },
  { timestamps: true }
);

InjectionJobSchema.index({ status: 1 });

export const InjectionJobModel = mongoose.model("InjectionJob", InjectionJobSchema);
