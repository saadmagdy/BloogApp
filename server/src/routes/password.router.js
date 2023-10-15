import { Router } from "express";
import {
  sendRestPasswordLink,
  getResetPasswordLink,
  resetPassword,
} from "../controllers/password.ctrl.js";
const passwordRouter = Router();
passwordRouter.route("/reset-password-link").post(sendRestPasswordLink);
passwordRouter
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordLink)
  .post(resetPassword);

export default passwordRouter;
