import express from "express";
import auth from "../middleware/auth.js";
import {
  getAccount,
  deposit,
  withdraw,
  transfer,
  getTransactions
} from "../controllers/accountController.js";

const router = express.Router();

router.use(auth); // todas as rotas abaixo precisam de token

router.get("/", getAccount); // GET /account
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.post("/transfer", transfer);
router.get("/transactions", getTransactions);

export default router;
