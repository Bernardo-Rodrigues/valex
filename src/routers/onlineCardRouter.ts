import { Router } from "express";
import * as controller from "../controllers/onlineCardsController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";

const onlineCardRouter = Router();

onlineCardRouter.post("/online-cards/:id", validateSchemaMiddleware, controller.createOnlineCard)
onlineCardRouter.delete("/online-cards/:id",validateSchemaMiddleware, controller.deleteOnlineCard)

export default onlineCardRouter; 