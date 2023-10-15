import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers/comment.ctrl.js";
import Auth from "../middlewares/Auth.js";
import Authrization from "../middlewares/Authrization.js";
const router = Router();

router
  .route("/:id")
  .post(Auth, createComment)
  .put(Auth, updateComment)
  .delete(Auth, deleteComment);
router.route("/").get(Auth, Authrization, getAllComments);

export default router;
