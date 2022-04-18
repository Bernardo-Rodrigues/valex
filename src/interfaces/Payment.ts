export default interface Payment {
    id: number;
    cardId: number;
    businessId: number;
    timestamp: Date;
    amount: number;
  }