// src/controllers/subscription.controller.js
import Subscription from "../models/Subscription.model.js";

export const subscribe = async (req, res) => {
  await Subscription.create({ email: req.body.email });
  res.json({ message: "Subscribed successfully ✨" });
};
