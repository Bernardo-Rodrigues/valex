import { Router } from "express";
import cardRouter from "./cardRouter.js";
import purchaseRouter from "./purchaseRouter.js";
import virtualCardRouter from "./virtualCardRouter.js";

const router = Router();

router.use(cardRouter);
router.use(virtualCardRouter);
router.use(purchaseRouter);

export default router; 