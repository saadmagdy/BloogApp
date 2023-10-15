import Comment from "../models/Comment.js";
import User from "./../models/User.js";
import asyncHandeler from "./../utils/asyncHandeler.js";
import { ERROR, FAIL, SUCCESS } from "./../utils/statusText.js";
import appError from "../utils/appError.js";

export const createComment = asyncHandeler(async (req, res, next) => {
  const profile = await User.findById(req.user._id);
  if (!profile)
    return next(appError.create(404, FAIL, "user Not Found Please Login"));
  const comment = new Comment({
    postId: req.params.id,
    user: profile._id,
    text: req.body.text,
    userName: profile.userName,
  });
  await comment.save();
  return res.status(201).json({
    status: SUCCESS,
    message: "comment created success",
    code: 201,
    data: comment,
  });
});
export const getAllComments = asyncHandeler(async (req, res, next) => {
  const allComments = await Comment.find({}).populate("user", "-password");
  if (!allComments.length)
    return next(appError.create(404, FAIL, "No Comments To show"));
  return res.status(200).json({
    status: SUCCESS,
    message: " get all Comments",
    code: 200,
    data: allComments,
  });
});
export const deleteComment = asyncHandeler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(appError.create(404, FAIL, "No Comment To Delete"));
  if (req.user.isAdmin || req.user._id.toString() === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: SUCCESS,
      message: "Comment deleted success",
      code: 200,
      data: comment._id,
    });
  } else {
    return next(
      appError.create(
        404,
        FAIL,
        "You are not authorized to perform this action"
      )
    );
  }
});
export const updateComment = asyncHandeler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(appError.create(404, FAIL, "comment not found"));
  if (req.user._id.toString() !== comment.user.toString())
    return next(
      appError.create(
        401,
        FAIL,
        "You are not authorized to perform this action"
      )
    );
  await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.text,
      },
    },
    { new: true }
  );
  return res.status(200).json({
    status: SUCCESS,
    message: "Comment update success",
    code: 200,
    data: comment,
  });
});
// ****************************************************************************

//     class CommentCtrl {
//     async createComment (req, res, next){}
//     }
// export default new CommentCtrl();
// const commentCtrl = {
//   create: asyncHandeler(async (req, res, next) => {}),
// };
// export default commentCtrl;
// commentCtrl.create;
