import TransactionTypes from "../types/TransactionTypes";

export default interface NewCard {
    employeeId: number;
    cardType: TransactionTypes;
};