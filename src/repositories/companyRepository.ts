import { connection } from "../database.js";
import Company from "../interfaces/Company.js";

export default class CompanyRepository{
  async findByApiKey(apiKey: string) {
    const result = await connection.query<Company, [string]>(
      `SELECT * FROM companies WHERE "apiKey"=$1`,
      [apiKey]
    );

    return result.rows[0];
  }
}
