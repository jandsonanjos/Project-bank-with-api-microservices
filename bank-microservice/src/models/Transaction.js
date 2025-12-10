import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["deposit", "withdraw", "transfer"], required: true },
  value: { type: Number, required: true },
  fromAccount: { type: String, default: null },
  toAccount: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
