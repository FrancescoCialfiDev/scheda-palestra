import express from "express";
import cors from "cors";
import exercisesRouter from "./routers/exercisesRouter.js";

const server = express();
const PORT = process.env.PORT ?? 3000;

/* MIDDLEWARE */
server.use(cors());
server.use(express.static("public"));
server.use(express.json());

/* ROTTE */
server.get("/", (req, res) => res.send("API ok"));
server.use("/exercises", exercisesRouter);

/* 404 FINALE (per tutti i metodi e percorsi) */
server.use((req, res) => res.status(404).send("Page not found"));

/* AVVIO */
server.listen(PORT, () => {
  console.log(`Server in ascolto: http://localhost:${PORT}`);
});
