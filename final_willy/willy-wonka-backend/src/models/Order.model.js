import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    product: { type: String, required: true }, // Сюда запишем список товаров через запятую
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "orders");
export default Order;