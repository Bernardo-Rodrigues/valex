import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware.js";
import router from "./routers/index.js";

const app = express();
app.use(json());
app.use(cors());
app.use(router);
app.use(errorHandlingMiddleware);

export default app; 