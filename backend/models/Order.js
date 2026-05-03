import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  customer: {
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, default: "" },
    type:    { type: String, enum: ["dine-in","takeaway","delivery"], default: "dine-in" },
  },
  items: [{
    name:    String,
    variant: String,
    price:   Number,
    qty:     Number,
  }],
  totalAmount:  { type: Number, required: true },
  status: {
    type: String,
    enum: ["new","confirmed","preparing","ready","delivered","cancelled"],
    default: "new",
  },
  paymentStatus: { type: String, enum: ["pending","paid","failed","upi_pending"], default: "pending" },
  paymentId:     { type: String, default: "" },
  cfOrderId:     { type: String, default: "" },
  upiTxnId:      { type: String, default: "" },
  notes:         { type: String, default: "" },
}, { timestamps: true });

orderSchema.pre("save", async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = "ZNG-" + String(count + 1).padStart(4, "0");
  }
  next();
});

export default mongoose.model("Order", orderSchema);