import config from "./config";
import pg from "pg";

const { Pool } = pg;

export const connection = new Pool({
  connectionString: config.connectionString,
});
