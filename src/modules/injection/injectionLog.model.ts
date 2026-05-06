import mongoose from "mongoose";

const InjectionLogSchema = new mongoose.Schema(
  {
    supermarketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supermarket",
      required: true,
      index: true,
    },
    injectedAt: { type: Date, default: Date.now, index: true },
    invoiceId: { type: String, required: true },
    success: { type: Boolean, required: true },
    error: { type: String },
    /** Ingestion HTTP status when success is false */
    httpStatus: { type: Number },
    totalAmount: { type: Number, required: true },
    customerName: { type: String, required: true },
    itemCount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: false }
);

InjectionLogSchema.index({ supermarketId: 1, injectedAt: -1 });

export const InjectionLogModel = mongoose.model("InjectionLog", InjectionLogSchema);
