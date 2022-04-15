import { Router } from "express";
import cardRouter from "./cardRouter.js";
import onlineCardRouter from "./onlineCardRouter.js";

const router = Router();

router.use(cardRouter);
router.use(onlineCardRouter);

export default router; 