import { Router } from "express";
import * as controller from "../controllers/cardController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import validateApiKeyMiddleware from "../middlewares/validateApiKeyMiddleware.js";
import { cardSchema, activateCardSchema, cardPasswordSchema, cardRechargeSchema } from "../schemas/index.js"

const cardRouter = Router();

cardRouter.post("/cards", validateSchemaMiddleware(cardSchema), validateApiKeyMiddleware, controller.createCard);
cardRouter.get("/cards/:id", controller.getMetrics);
cardRouter.put("/cards/:id/activate", validateSchemaMiddleware(activateCardSchema), controller.activateCard);
cardRouter.post("/cards/:id/recharge", validateApiKeyMiddleware, validateSchemaMiddleware(cardRechargeSchema), controller.rechargeCard);
cardRouter.put("/cards/:id/block", validateSchemaMiddleware(cardPasswordSchema), controller.blockCard);
cardRouter.put("/cards/:id/unlock", validateSchemaMiddleware(cardPasswordSchema), controller.unlockCard);

export default cardRouter;
