import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import countRoutes from "./routes/countRoutes.js";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: ["http://127.0.0.1:3000"], //호스트 번호 수정 가능, 나중에 FE 주소 추가 필요
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", countRoutes);

app.listen(process.env.PORT || 3000, () => console.log("server started"));
