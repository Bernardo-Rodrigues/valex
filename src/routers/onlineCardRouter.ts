import { Router } from "express";
import * as controller from "../controllers/onlineCardsController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import { cardPasswordSchema } from "../schemas/index.js"

const onlineCardRouter = Router();

onlineCardRouter.post("/online-cards/:id", validateSchemaMiddleware(cardPasswordSchema), controller.createOnlineCard);
onlineCardRouter.delete("/online-cards/:id",validateSchemaMiddleware(cardPasswordSchema), controller.deleteOnlineCard);

export default onlineCardRouter; 