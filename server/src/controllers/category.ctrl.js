import Category from "../models/Category.js";
import asyncHandeler from "./../utils/asyncHandeler.js";
import { ERROR, FAIL, SUCCESS } from "./../utils/statusText.js";
import appError from "../utils/appError.js";

export const createCategory = asyncHandeler(async (req, res, next) => {
  const category = await Category.create({
    user: req.user._id,
    title: req.body.title,
  });
  return res.status(201).json({
    status: SUCCESS,
    message: "Category created done",
    code: 200,
    data: category,
  });
});

export const getAllCategories = asyncHandeler(async (req, res, next) => {
  const categories = await Category.find({});
  if (!categories.length)
    return next(appError.create(404, FAIL, "Category not found"));
  return res.status(200).json({
    status: SUCCESS,
    message: "successgetting all categories",
    code: 200,
    data: categories,
  });
});

export const deleteCategory = asyncHandeler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category)
    return next(appError.create(404, FAIL, "Category not fff found"));
  await Category.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    status: SUCCESS,
    message: "category deleted done",
    code: 200,
    data: category._id,
  });
});
