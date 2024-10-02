import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import countRoutes from "./routes/countRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import compareRoutes from "./routes/compareRoutes.js";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "https://viewmystartup.netlify.app"
  ] //호스트 번호 수정 가능, 나중에 FE 주소 추가 필요
};

app.use(express.json());
app.use(cors());

app.use("/api", countRoutes);
app.use("/api", companyRoutes);
app.use("/api", investmentRoutes);
app.use("/api", compareRoutes);

app.listen(process.env.PORT || 3000, () => console.log("server started"));
