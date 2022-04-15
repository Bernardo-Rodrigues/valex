import { Router } from "express";
import * as controller from "../controllers/cardController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import validateApiKeyMiddleware from "../middlewares/validateApiKeyMiddleware.js";

const cardRouter = Router();
cardRouter.post("/cards", validateSchemaMiddleware, validateApiKeyMiddleware, controller.createCard)
cardRouter.post("/cards/:id/activate", validateSchemaMiddleware, controller.activateCard)
cardRouter.post("/cards/:id/recharge", validateApiKeyMiddleware, validateSchemaMiddleware, controller.rechargeCard)

export default cardRouter; 