// src/models/Ticket.model.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  fullName: String,
  ticketNumber: String,
  email: String,
  date: Date,
  city: String
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
