import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import appError from "../utils/appError.js";
import asyncHandeler from "../utils/asyncHandeler.js";
import cloudinary from "../utils/cloudinary.js";
import { SUCCESS, FAIL, ERROR } from "./../utils/statusText.js";

export const createPost = asyncHandeler(async (req, res, next) => {
  const { title, desc, category } = req.body;
  if (!req.file) {
    return next(appError.create(400, FAIL, "please upload an image"));
  }
  const photo = await cloudinary.uploader.upload(req.file.path, {
    folder: `images/${req.user.userName}/Posts`,
  });
  if (!photo) {
    return next(appError.create(400, ERROR, "error uploading your image"));
  }
  const post = new Post({
    title,
    desc,
    category,
    image: {
      url: photo.secure_url,
      publicId: photo.public_id,
    },
    user: req.user._id,
  });
  if (!post) {
    return next(appError.create(400, FAIL, "Failed creating new post"));
  }
  await post.save();
  return res.status(200).json({
    status: SUCCESS,
    message: "created post success",
    code: 200,
    data: post,
  });
});

export const getPosts = asyncHandeler(async (req, res, next) => {
  const postPerPage = 3;
  const { page, category } = req.query;
  let posts;
  if (page) {
    posts = await Post.find()
      .skip((page - 1) * postPerPage)
      .limit(postPerPage)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  if (!posts.length) {
    return next(appError.create(500, "fail", "no posts found"));
  }
  return res.status(200).json({
    status: SUCCESS,
    message: "success getting all the posts",
    code: 200,
    data: posts,
  });
});

export const getSinglePost = asyncHandeler(async (req, res, next) => {
  const id = req.params?.id;
  const post = await Post.findById(id)
    .populate("user", ["-password"])
    .populate("comments");
  if (!post) {
    return next(appError.create(404, FAIL, "No such a post"));
  }
  return res.status(200).json({
    status: SUCCESS,
    message: "Success getting single post",
    code: 200,
    data: post,
  });
});

export const getPostsCount = asyncHandeler(async (req, res, next) => {
  const count = await Post.count();
  return res.status(200).json({
    status: SUCCESS,
    message: "Success getting posts count",
    code: 200,
    data: count,
  });
});

export const deletPost = asyncHandeler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(appError.create(404, FAIL, "no Post with this id"));
  if (post.user.toString() === req.user._id.toString()) {
    await cloudinary.uploader.destroy(post.image.publicId);
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: post._id });
    return res.status(200).json({
      Status: SUCCESS,
      message: "Success deleting",
      code: 200,
      data: post._id,
    });
  } else {
    return next(appError.create(401, FAIL, "unauthorized access"));
  }
});

export const updatePost = asyncHandeler(async (req, res, next) => {
  const { title, desc, category } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return next(appError.create(401, FAIL, "Post Not Found"));
  if (post.user.toString() === req.user._id.toString()) {
    await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { title, desc, category } },
      { new: true }
    );
    return res.status(200).json({
      ststus: SUCCESS,
      message: "Post Updated Success",
      code: 200,
      data: null,
    });
  } else {
    return next(appError.create(401, FAIL, "unauthorized access"));
  }
});

export const updatePostImage = asyncHandeler(async (req, res, next) => {
  if (!req.file) {
    return next(appError.create(400, FAIL, "please upload an image"));
  }
  const post = await Post.findById(req.params.id);
  if (!post) return next(appError.create(401, FAIL, "Post Not Found"));

  if (post.user.toString() !== req.user._id.toString())
    return next(appError.create(401, FAIL, "unauthorized access"));

  await cloudinary.uploader.destroy(post.image.publicId);
  const newImage = await cloudinary.uploader.upload(req.file.path, {
    folder: `images/${req.user.userName}/Posts`,
  });
  await Post.findById(
    req.params.id,
    {
      $set: {
        image: {
          url: newImage.secure_url,
          publicId: newImage.public_id,
        },
      },
    },
    { new: true }
  );
  return res.status(200).json({
    status: SUCCESS,
    message: "Post Image Updated Success",
    code: 200,
    data: null,
  });
});

export const toglleLiks = asyncHandeler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(appError.create(401, FAIL, "Post Not Found"));
  const isPostAllreadyLiked = post.likes.includes(req.user._id);
  if (isPostAllreadyLiked) {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          likes: req.user._id,
        },
      },
      { new: true }
    );
  } else {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          likes: req.user._id,
        },
      },
      { new: true }
    );
  }
  return res.status(200).json({
    status: SUCCESS,
    message: " liked or unliked successfully",
    code: 200,
    data: null,
  });
});
