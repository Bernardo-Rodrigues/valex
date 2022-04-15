import { Request, Response } from "express"
import * as cardService from "../services/cardService.js"

export async function  createCard(req: Request, res: Response){
    const newCard = req.body

    const card = await cardService.createCard(newCard);

    res.status(201).send(card);
}

export async function  activateCard(req: Request, res: Response){
    const cardId = req.params.id
    const cardInfo = req.body

    await cardService.activateCard({...cardInfo, cardId});

    res.sendStatus(200)
}

export async function  rechargeCard(req: Request, res: Response){
    const cardId = req.params.id
    const { amount } = req.body

    await cardService.rechargeCard(cardId, amount);

    res.sendStatus(200)
}