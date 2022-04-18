import Payment from "../interfaces/Payment";

type PaymentInsertData = Omit<Payment, "id" | "timestamp">;

export default PaymentInsertData;