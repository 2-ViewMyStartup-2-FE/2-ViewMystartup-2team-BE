import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import countRoutes from "./routes/countRoutes.js";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000/", "http://localhost:3000/compare-status"], //호스트 번호 수정 가능, 나중에 FE 주소 추가 필요
};

app.use(express.json());
app.use(cors());

app.use("/api", countRoutes);

app.listen(process.env.PORT || 4000, () => console.log("server started"));
