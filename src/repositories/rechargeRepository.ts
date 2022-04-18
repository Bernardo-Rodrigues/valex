import { connection } from "../database.js";
import Recharge from "../interfaces/Recharge.js";
import { RechargeInsertData } from "../types/index.js"

export default class RechargeRepository{
  async findByCardId(cardId: number) {
    const result = await connection.query<Recharge, [number]>(
      `SELECT * FROM recharges WHERE "cardId"=$1`,
      [cardId]
    );

    return result.rows;
  }

  async insert(rechargeData: RechargeInsertData) {
    const { cardId, amount } = rechargeData;

    connection.query<any, [number, number]>(
      `INSERT INTO recharges ("cardId", amount) VALUES ($1, $2)`,
      [cardId, amount]
    );
  }
}