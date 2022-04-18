import { PaymentWithBusinessName } from "../types";
import Recharge from "./Recharge";

export default interface CardMetrics {
    balance: number,
    transactions: PaymentWithBusinessName[],
    recharges: Recharge[]
};