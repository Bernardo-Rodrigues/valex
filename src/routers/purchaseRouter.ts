import { Router } from "express";
import * as controller from "../controllers/purchaseController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import { purchaseSchema, onlinePurchaseSchema } from "../schemas/index.js";

const purchaseRouter = Router();

purchaseRouter.post("/purchases/pos/cards/:id", validateSchemaMiddleware(purchaseSchema), controller.makePOSPurchase);
purchaseRouter.post("/purchases/online", validateSchemaMiddleware(onlinePurchaseSchema), controller.makeOnlinePurchase);

export default purchaseRouter; 