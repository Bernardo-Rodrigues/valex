import { Request, Response } from "express";
import CardService from "../services/cardService.js";

const cardService = new CardService();

export async function  createCard(req: Request, res: Response){
    const newCard = req.body;

    await cardService.createCard(newCard);

    res.sendStatus(201);
}

export async function  activateCard(req: Request, res: Response){
    const cardId = req.params.id;
    const cardInfo = req.body;

    await cardService.activateCard({...cardInfo, cardId});

    res.sendStatus(200);
}

export async function  rechargeCard(req: Request, res: Response){
    const cardId = req.params.id;
    const { amount } = req.body;

    await cardService.rechargeCard(cardId, amount);

    res.sendStatus(200);
}

export async function  getMetrics(req: Request, res: Response){
    const cardId = req.params.id;

    const metrics = await cardService.getMetrics(cardId);

    res.status(200).send(metrics);
}

export async function  unlockCard(req: Request, res: Response){
    const cardId = req.params.id;
    const { cardPassword } = req.body;

    await cardService.unlockCard({cardId, cardPassword});

    res.sendStatus(200);
}

export async function  blockCard(req: Request, res: Response){
    const cardId = req.params.id;
    const { cardPassword } = req.body;

    await cardService.blockCard({cardId, cardPassword});

    res.sendStatus(200);
}