import { Router } from "express";
import * as controller from "../controllers/cardController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import validateApiKeyMiddleware from "../middlewares/validateApiKeyMiddleware.js";

const cardRouter = Router();

cardRouter.get("/cards/:id", controller.getMetrics)
cardRouter.post("/cards", validateSchemaMiddleware, validateApiKeyMiddleware, controller.createCard)
cardRouter.post("/cards/:id/activate", validateSchemaMiddleware, controller.activateCard)
cardRouter.post("/cards/:id/recharge", validateApiKeyMiddleware, validateSchemaMiddleware, controller.rechargeCard)
cardRouter.post("/cards/:id/payment", validateSchemaMiddleware, controller.makePayment)
cardRouter.post("/cards/:id/payment", validateSchemaMiddleware, controller.makePayment)
cardRouter.post("/cards/:id/block", validateSchemaMiddleware, controller.blockCard)
cardRouter.post("/cards/:id/unlock", validateSchemaMiddleware, controller.unlockCard)

export default cardRouter; 