import { Request, Response } from "express";
import VirtualCardService from "../services/virtualCardService.js";

const virtualCardService = new VirtualCardService();

export async function  createVirtualCard(req: Request, res: Response){
    const cardId = parseInt(req.params.id);
    const { cardPassword } = req.body;

    await virtualCardService.createVirtualCard({vinculatedId: cardId, cardPassword});

    res.sendStatus(201);
}

export async function  deleteVirtualCard(req: Request, res: Response){
    const cardId = parseInt(req.params.id);
    const { cardPassword } = req.body;

    await virtualCardService.deleteVirtualCard({cardId, cardPassword});

    res.sendStatus(200);
}