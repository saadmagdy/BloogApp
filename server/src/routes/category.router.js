import { Router } from "express";
import Auth from "../middlewares/Auth.js";
import Authrization from "../middlewares/Authrization.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/category.ctrl.js";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .post(Auth, Authrization, createCategory)
  .get(getAllCategories);
categoryRouter.route("/:id").delete(Auth, Authrization, deleteCategory);

export default categoryRouter;
