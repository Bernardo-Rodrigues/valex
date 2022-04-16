import { Request, Response } from "express"
import * as onlineCardService from "../services/onlineCardService.js"

export async function  createOnlineCard(req: Request, res: Response){
    const { id } = req.params
    const { cardPassword } = req.body

    await onlineCardService.createOnlineCard({vinculatedId: id, cardPassword});

    res.sendStatus(201)
}

export async function  deleteOnlineCard(req: Request, res: Response){
    const { id } = req.params
    const { cardPassword } = req.body 

    await onlineCardService.deleteOnlineCard({cardId: id, cardPassword});

    res.sendStatus(200);
}