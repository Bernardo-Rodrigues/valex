import { Router } from "express";
import * as controller from "../controllers/purchaseController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";

const purchaseRouter = Router();

purchaseRouter.post("/purchases/cards/:id", validateSchemaMiddleware, controller.makePurchase)
purchaseRouter.post("/purchases/online-cards", validateSchemaMiddleware, controller.makeOnlinePurchase)

export default purchaseRouter; 