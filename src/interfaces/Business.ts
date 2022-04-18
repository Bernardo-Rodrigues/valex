import TransactionTypes from "../types/TransactionTypes";

export default interface Business {
    id: number;
    name: string;
    type: TransactionTypes;
}