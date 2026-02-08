// src/controllers/ticket.controller.js
import Ticket from "../models/Ticket.model.js";

export const createTicket = async (req, res) => {
  await Ticket.create(req.body);
  res.status(201).json({ message: "Golden Ticket registered" });
};
