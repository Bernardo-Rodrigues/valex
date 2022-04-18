import { connection } from "../database.js";
import { mapObjectToUpdateQuery } from "../utils/sqlUtils.js";
import Card from "../interfaces/Card.js";
import { CardInsertData, CardUpdateData, TransactionTypes} from "../types/index.js"

export default class CardRepository{
  async find() {
    const result = await connection.query<Card>("SELECT * FROM cards");
    return result.rows;
  }
  
  async findById(id: number) {
    const result = await connection.query<Card, [number]>(
      "SELECT * FROM cards WHERE id=$1",
      [id]
    );
  
    return result.rows[0];
  }
  
  async getTotalOfTransactions(id: number) {
    const result = await connection.query(
      ` SELECT SUM(recharges.amount) as value 
        FROM cards 
        JOIN recharges ON recharges."cardId" = cards.id 
        WHERE cards.id = $1
        UNION ALL
        SELECT SUM(payments.amount) as value 
        FROM cards 
        JOIN payments ON payments."cardId" = cards.id 
        WHERE cards.id = $1`,
      [id]
    );
  
    return result.rows;
  }
  
  async findByTypeAndEmployeeId(
    type: TransactionTypes,
    employeeId: number
  ) {
    const result = await connection.query<Card, [TransactionTypes, number]>(
      `SELECT * FROM cards WHERE type=$1 AND "employeeId"=$2`,
      [type, employeeId]
    );
  
    return result.rows[0];
  }
  
  async findByCardDetails(
    number: string,
    cardholderName: string,
    expirationDate: string
  ) {
    const result = await connection.query<Card, [string, string, string]>(
      ` SELECT 
          * 
        FROM cards 
        WHERE number=$1 AND "cardholderName"=$2 AND "expirationDate"=$3`,
      [number, cardholderName, expirationDate]
    );
  
    return result.rows[0];
  }
  
  async insert(cardData: CardInsertData) {
    const {
      employeeId,
      number,
      cardholderName,
      securityCode,
      expirationDate,
      password,
      isVirtual,
      originalCardId,
      isBlocked,
      type,
    } = cardData;
  
    const { rows: [card]} = await connection.query(
      `
      INSERT INTO cards ("employeeId", number, "cardholderName", "securityCode",
        "expirationDate", password, "isVirtual", "originalCardId", "isBlocked", type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `,
      [
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password,
        isVirtual,
        originalCardId,
        isBlocked,
        type,
      ]
    );
  
    return card.id;
  }
  
  async update(id: number, cardData: CardUpdateData) {
    const { objectColumns: cardColumns, objectValues: cardValues } =
      mapObjectToUpdateQuery({
        object: cardData,
        offset: 2,
      }
    );
    
    connection.query(
      `
      UPDATE cards
        SET ${cardColumns}
      WHERE $1=id
    `,
      [id, ...cardValues]
    );
  }
  
  async remove(id: number) {
    connection.query<any, [number]>("DELETE FROM cards WHERE id=$1", [id]);
  }
}