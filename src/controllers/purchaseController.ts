import { Request, Response } from "express"
import PurchaseService from "../services/purchaseService.js";

const purchaseService = new PurchaseService();

export async function  makePOSPurchase(req: Request, res: Response){
    const cardId = req.params.id;
    const paymentInfo = req.body;

    await purchaseService.makePOSPurchase({...paymentInfo, cardId});

    res.sendStatus(200);
}

export async function  makeOnlinePurchase(req: Request, res: Response){
    const purchaseInfo = req.body;

    await purchaseService.makeOnlinePurchase(purchaseInfo);

    res.sendStatus(200);
}