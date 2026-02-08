// src/models/Subscription.model.js
import mongoose from "mongoose";

const subSchema = new mongoose.Schema({
  email: { type: String, unique: true }
}, { timestamps: true });

export default mongoose.model("Subscription", subSchema);
