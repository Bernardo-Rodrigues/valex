import Payment from "../interfaces/Payment";

type PaymentWithBusinessName = Payment & { businessName: string };

export default PaymentWithBusinessName