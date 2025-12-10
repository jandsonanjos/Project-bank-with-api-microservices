import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

/**
 * GET /account
 * retorna a conta do usuário logado
 */
export async function getAccount(req, res) {
  try {
    const account = await Account.findOne({ userId: req.userId }).lean();
    if (!account) return res.status(404).json({ error: "Account not found" });
    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * POST /account/deposit
 * body: { amount }
 */
export async function deposit(req, res) {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  try {
    const acct = await Account.findOne({ userId: req.userId });
    if (!acct) throw new Error("Account not found");

    acct.balance += amount;
    await acct.save();

    await Transaction.create({
      type: "deposit",
      value: amount,
      toAccount: acct.accountNumber
    });

    res.json({ message: "Deposit successful", balance: acct.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}

/**
 * POST /account/withdraw
 * body: { amount }
 */
export async function withdraw(req, res) {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  try {
    const acct = await Account.findOne({ userId: req.userId });
    if (!acct) throw new Error("Account not found");
    if (acct.balance < amount) return res.status(400).json({ error: "Insufficient funds" });

    acct.balance -= amount;
    await acct.save();

    await Transaction.create({
      type: "withdraw",
      value: amount,
      fromAccount: acct.accountNumber
    });

    res.json({ message: "Withdraw successful", balance: acct.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}

/**
 * POST /account/transfer
 * body: { toAccountNumber, amount }
 */
export async function transfer(req, res) {
  const amount = Number(req.body.amount);
  const toAccountNumber = String(req.body.toAccountNumber);

  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
  if (!toAccountNumber) return res.status(400).json({ error: "Invalid destination account" });

  try {
    const fromAcct = await Account.findOne({ userId: req.userId });
    if (!fromAcct) throw new Error("Source account not found");

    const toAcct = await Account.findOne({ accountNumber: toAccountNumber });
    if (!toAcct) return res.status(404).json({ error: "Destination account not found" });

    if (fromAcct.accountNumber === toAcct.accountNumber) {
      return res.status(400).json({ error: "Cannot transfer to same account" });
    }

    if (fromAcct.balance < amount) return res.status(400).json({ error: "Insufficient funds" });

    fromAcct.balance -= amount;
    toAcct.balance += amount;

    await fromAcct.save();
    await toAcct.save();

    await Transaction.create({
      type: "transfer",
      value: amount,
      fromAccount: fromAcct.accountNumber,
      toAccount: toAcct.accountNumber
    });

    res.json({ message: "Transfer completed", fromBalance: fromAcct.balance, toBalance: toAcct.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}

/**
 * GET /account/transactions
 * lista transações relacionadas à conta do usuário
 */
export async function getTransactions(req, res) {
  try {
    const acct = await Account.findOne({ userId: req.userId }).lean();
    if (!acct) return res.status(404).json({ error: "Account not found" });

    const transactions = await Transaction.find({
      $or: [{ fromAccount: acct.accountNumber }, { toAccount: acct.accountNumber }]
    }).sort({ createdAt: -1 }).lean();

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
