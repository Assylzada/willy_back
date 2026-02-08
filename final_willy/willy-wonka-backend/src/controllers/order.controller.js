import Order from "../models/order.model.js";

export const createOrder = async (req, res, next) => {
  try {
    const { name, email, product, quantity, address } = req.body;

    if (!name || !email || !product || !quantity || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = await Order.create({
      name,
      email,
      product,
      quantity,
      address,
    });

    res.status(201).json({
      message: "Order saved successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};
