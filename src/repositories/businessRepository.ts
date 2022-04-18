import { connection } from "../database.js";
import Business from "../interfaces/Business.js";

export default class BusinessRepository{
  async findById(id: number) {
    const result = await connection.query<Business, [number]>(
      "SELECT * FROM businesses WHERE id=$1",
      [id]
    );

    return result.rows[0];
  }
}
