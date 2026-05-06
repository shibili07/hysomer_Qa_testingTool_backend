import mongoose from "mongoose";

const InvoiceItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  unit: { type: String },
  externalProductId: { type: String },
  taxAmount: { type: Number },
  discountAmount: { type: Number },
});

const InvoiceSchema = new mongoose.Schema(
  {
    externalInvoiceId: { type: String, required: true, unique: true },
    invoiceDate: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    customerId: { type: String },
    externalCustomerId: { type: String },
    subtotalAmount: { type: Number },
    discountAmount: { type: Number },
    totalTax: { type: Number },
    status: {
      type: String,
      enum: ["PAID", "PENDING", "CANCELLED", "REFUNDED"],
      default: "PAID",
    },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String },
    invoiceUrl: { type: String },
    cashierName: { type: String },
    notes: { type: String },
    externalTerminalId: { type: String },
    organizationId: { type: String },
    customer: { type: Object },
    items: [InvoiceItemSchema],
  },
  { timestamps: true }
);

export const InvoiceModel = mongoose.model("Invoice", InvoiceSchema);
