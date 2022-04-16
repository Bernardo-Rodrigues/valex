import { Request, Response } from "express"
import * as purchaseService from "../services/purchaseService.js"

export async function  makePurchase(req: Request, res: Response){
    const cardId = req.params.id
    const paymentInfo = req.body

    await purchaseService.makePurchase({...paymentInfo, cardId});

    res.sendStatus(200)
}

export async function  makeOnlinePurchase(req: Request, res: Response){
    const purchaseInfo = req.body

    await purchaseService.makeOnlinePurchase(purchaseInfo);

    res.sendStatus(200)
}