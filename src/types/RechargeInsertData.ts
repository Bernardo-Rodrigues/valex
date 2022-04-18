import Recharge from "../interfaces/Recharge";

type RechargeInsertData = Omit<Recharge, "id" | "timestamp">;

export default RechargeInsertData