import { Router } from "express";
import * as controller from "../controllers/virtualCardsController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import { cardPasswordSchema } from "../schemas/index.js"

const virtualCardRouter = Router();

virtualCardRouter.post("/virtual-cards/:id", validateSchemaMiddleware(cardPasswordSchema), controller.createVirtualCard);
virtualCardRouter.delete("/virtual-cards/:id",validateSchemaMiddleware(cardPasswordSchema), controller.deleteVirtualCard);

export default virtualCardRouter; 