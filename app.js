import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import countRoutes from "./routes/countRoutes.js";

const app = express();
app.use(express.json());

app.use("/api", countRoutes);

app.listen(process.env.PORT || 3000, () => console.log("server started"));
