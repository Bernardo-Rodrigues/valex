import { Router } from "express";
import cardRouter from "./cardRouter.js";
import onlineCardRouter from "./onlineCardRouter.js";
import purchaseRouter from "./purchaseRouter.js";

const router = Router();

router.use(cardRouter);
router.use(onlineCardRouter);
router.use(purchaseRouter);

export default router; 