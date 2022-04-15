import { Router } from "express";
import * as controller from "../controllers/onlineCardsController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";

const onlineCardRouter = Router();

onlineCardRouter.post("/online-cards", validateSchemaMiddleware, controller.createOnlineCard)

export default onlineCardRouter; 