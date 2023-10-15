import dotenv from "dotenv";
dotenv.config();
import xss from "xss-clean";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import express from "express";
import cors from "cors";
const app = express();
import connectionDB from "../db/connectionDB.js";
import allRoutes from "../routes/index.routes.js";
import globalErrorHandeler from "../middlewares/globalErrorHandeler.js";
import { FAIL } from "./statusText.js";

// ===========================================================\\

const initiateApp = () => {
  app.use(express.json());
  app.use(xss());
  app.use(helmet());
  app.use(hpp());
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
  });

  app.use(limiter);
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
  app.use(allRoutes);
  app.all("*", (req, res, next) => {
    res
      .status(404)
      .json({ status: FAIL, message: " 404 Not Found", data: null, code: 404 });
  });
  connectionDB();
  app.use(globalErrorHandeler);
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server runnig on port ${port}`);
  });
};

export default initiateApp;
