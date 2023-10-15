import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserProfile,
  getUsersCount,
  imageUpload,
  logIn,
  signUp,
  updateUser,
  verifyUserEmail,
} from "../controllers/user.ctrl.js";
import Auth from "../middlewares/Auth.js";
import upload from "../services/fileUpload.js";
import Authrization from "./../middlewares/Authrization.js";

const userRouter = Router();

userRouter.route("/login").post(logIn);
userRouter.route("/:userId/verify/:token").get(verifyUserEmail);
userRouter.route("/signup").post(signUp);
userRouter.route("/update/:id").put(Auth, updateUser);
userRouter.route("/profile/:id").get( getUserProfile);
userRouter.route("/count").get(Auth, Authrization, getUsersCount);
userRouter.route("/getallusers").get(Auth, Authrization, getAllUsers);
userRouter
  .route("/uploadphoto")
  .post(Auth, upload().single("image"), imageUpload);
userRouter.route("/deleteuser/:id").delete(Auth, deleteUser);

export default userRouter;
