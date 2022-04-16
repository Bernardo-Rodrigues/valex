import { Request, Response } from "express"
import { findByCardId } from "../repositories/rechargeRepository.js";
import * as onlineCardService from "../services/onlineCardService.js"

export async function  createOnlineCard(req: Request, res: Response){
    const vinculatedCard = req.body

    const card = await onlineCardService.createOnlineCard(vinculatedCard);

    res.status(201).send(card);
}

export async function  deleteOnlineCard(req: Request, res: Response){
    const { id } = req.params
    const { cardPassword } = req.body 

    await onlineCardService.deleteOnlineCard({cardId: id, cardPassword});

    res.sendStatus(200);
}