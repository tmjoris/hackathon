import "dotenv/config";
import express from "express";
import cors from "cors";

import { ticketsRouter } from "./routes/tickets.js";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

app.use("/api/tickets", ticketsRouter);

const port = Number(process.env.BACKEND_PORT ?? 4000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Fieldwork backend listening on port ${port}`);
});

