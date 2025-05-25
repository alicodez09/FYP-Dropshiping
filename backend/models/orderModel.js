import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    shippingAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    expectedPrice: { type: String, required: true },
    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: { type: String, default: 'pending' }, // optional: 'pending', 'confirmed', 'delivered', etc.
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
