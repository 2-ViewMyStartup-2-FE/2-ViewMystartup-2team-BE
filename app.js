import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import countRoutes from "./routes/countRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import compareRoutes from "./routes/compareRoutes.js";
import companyDetailRoutes from "./routes/companyDetailRoutes.js";
import cors from "cors";
import { initializeVirtualInvestment } from "./middleware/initializeVirtualInvestment.js";

const app = express();
const corsOptions = {
  origin: ["https://viewmystartup-teamtwo.netlify.app/"] //호스트 번호 수정 가능, 나중에 FE 주소 추가 필요
};

app.use(express.json());
app.use(cors(corsOptions));

initializeVirtualInvestment()
  .then(() => {
    console.log("Virtual investment initialized successfully");
  })
  .catch((err) => {
    console.error("Failed to initialize virtual investment", err);
  });

app.use("/api", countRoutes);
app.use("/api", companyRoutes);
app.use("/api", investmentRoutes);
app.use("/api", compareRoutes);
app.use("/api", companyDetailRoutes);

app.listen(process.env.PORT || 3000, () => console.log("server started"));
