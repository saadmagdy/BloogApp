import { Router } from "express";
import Auth from "../middlewares/Auth.js";
import upload from "../services/fileUpload.js";
import Authrization from "../middlewares/Authrization.js";
import {
  createPost,
  deletPost,
  getPosts,
  getPostsCount,
  getSinglePost,
  toglleLiks,
  updatePost,
  updatePostImage,
} from "../controllers/post.ctrl.js";

const postRouter = Router();

postRouter
  .route("/")
  .post(Auth, upload().single("image"), createPost)
  .get(getPosts);
postRouter.route("/count").get(getPostsCount);
postRouter
  .route("/:id")
  .get(getSinglePost)
  .delete(Auth,  deletPost)
  .put(Auth,  updatePost);

postRouter
  .route("/updatepostimage/:id")
  .put(Auth, upload().single("image"), updatePostImage);

postRouter.route("/like/:id").put(Auth, toglleLiks);

export default postRouter;
