import Card from "../interfaces/Card";

type CardInsertData = Omit<Card, "id">;

export default CardInsertData;