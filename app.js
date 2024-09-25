import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
//수정해서 사용
import exampleRoutes from "./routes/exampleRoutes.js";

const app = express();
app.use(express.json());

//수정해서 사용
app.use("/example", exampleRoutes);

app.listen(process.env.PORT || 3000, () => console.log("server started"));
