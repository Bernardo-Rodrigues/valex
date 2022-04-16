import { Router } from "express";
import * as controller from "../controllers/cardController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import validateApiKeyMiddleware from "../middlewares/validateApiKeyMiddleware.js";

const cardRouter = Router();

cardRouter.post("/cards", validateSchemaMiddleware, validateApiKeyMiddleware, controller.createCard)
cardRouter.get("/cards/:id", controller.getMetrics)
cardRouter.put("/cards/:id/activate", validateSchemaMiddleware, controller.activateCard)
cardRouter.put("/cards/:id/recharge", validateApiKeyMiddleware, validateSchemaMiddleware, controller.rechargeCard)
cardRouter.put("/cards/:id/block", validateSchemaMiddleware, controller.blockCard)
cardRouter.put("/cards/:id/unlock", validateSchemaMiddleware, controller.unlockCard)

export default cardRouter; 