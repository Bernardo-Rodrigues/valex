import { Request, Response } from "express"
import * as onlineCardService from "../services/onlineCardService.js"

export async function  createOnlineCard(req: Request, res: Response){
    const vinculatedCard = req.body

    const card = await onlineCardService.createOnlineCard(vinculatedCard);

    res.status(201).send(card);
}