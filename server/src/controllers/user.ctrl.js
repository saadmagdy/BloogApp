import asyncHandeler from "../utils/asyncHandeler.js";
import Comment from "../models/Comment.js";
import Post from "./../models/Post.js";
import User from "./../models/User.js";
import appError from "../utils/appError.js";
import { FAIL, SUCCESS } from "../utils/statusText.js";
import cloudinary from "../utils/cloudinary.js";
import VerificationToken from "../models/VerificationToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const signUp = asyncHandeler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists)
    return next(appError.create(400, FAIL, "user is Allready Exist"));
  const user = new User({ userName, email, password });
  await user.save();

  const verifiedToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verifiedToken.save();
  const link = `http://localhost:3000/users/${user._id}/verify/${verifiedToken.token}`;
  const htmlTemplate = `
   <div>
      <p>Click on the link to verify your account</p>
      <a href="${link}">Verify</a>
   </div>
  `;
  await sendEmail(user.email, "Email Verification", htmlTemplate);
  return res.status(201).json({
    status: SUCCESS,
    message:
      "account created successfully, Please check mail box to verify your email address ",
    code: 201,
    data: null,
  });
});

export const updateUser = asyncHandeler(async (req, res, next) => {
  if (!req.user) {
    return next(appError.create(403, FAIL, "please login first"));
  }
  const { _id } = req.user;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { ...req.body },
    { new: true }
  ).populate("posts");

  if (!updatedUser) return next(appError.create(404, FAIL, "user not found"));
  return res.status(201).json({
    status: SUCCESS,
    message: "updated Done",
    code: 201,
    data: {
      userName: updateUser.userName,
      bio: updateUser.bio,
      password: updateUser.password,
    },
  });
});

export const logIn = asyncHandeler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.match(password))) {
    return next(appError.create(404, FAIL, "Email or password are incorrect"));
  }
  if (!user.isAccountVerified) {
    let verifiedToken = await VerificationToken.findOne({
      userId: user._id,
    });
    if (!verifiedToken) {
      verifiedToken = new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await verifiedToken.save();
    }
    const link = `http://localhost:3000/users/${user._id}/verify/${verifiedToken.token}`;
    const htmlTemplate = `
   <div>
      <p>Click on the link to verify your account</p>
      <a href="${link}">Verify</a>
   </div>
  `;
    await sendEmail(user.email, "Email Verification", htmlTemplate);
    return res.status(400).json({
      status: SUCCESS,
      message: "Please check mail box to verify your email address",
      code: 400,
      data: null,
    });
  }
  const token = user.generateToken();
  return res.status(200).json({
    status: SUCCESS,
    message: "loged in success",
    code: 200,
    data: {
      token,
      _id: user._id,
      isAdmin: user.isAdmin,
      profilePhoto: user.profilePhoto,
      userName: user.userName,
    },
  });
});

export const verifyUserEmail = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(appError.create(400, FAIL, "invalid link"));
  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken)
    return next(appError.create(400, FAIL, "invalid link"));

  user.isAccountVerified = true;
  await user.save();
  await verificationToken.remove();
  return res.status(200).json({
    status: SUCCESS,
    message: "your account verified",
    code: 200,
    data: null,
  });
});

export const imageUpload = asyncHandeler(async (req, res, next) => {
  if (!req.file) {
    return next(appError.create(404, FAIL, "please uploade an image"));
  }
  const image = await cloudinary.uploader.upload(req.file.path, {
    folder: `images/${req.user.userName}/profile`,
  });
  if (req.user.profilePhoto.publicId !== null) {
    await cloudinary.uploader.destroy(req.user.profilePhoto.publicId);
  }
  const user = await User.findById(req.user._id);

  // const newImage = user.profilePhoto{url: image.secure_url,
  //     publicId: image.public_id,}

  await User.findByIdAndUpdate(req.user._id, {
    profilePhoto: {
      url: image.secure_url,
      publicId: image.public_id,
    },
  });
  return res.status(200).json({
    status: SUCCESS,
    message: "image uploaded done",
    code: 200,
    data: { url: image.secure_url, publicId: image.public_id },
  });
});

export const deleteUser = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(appError.create(404, FAIL, "user not found"));
  }
  const posts = await Post.find({ user: user._id });
  const publicIds = posts?.map((post) => {
    post.image.publicId;
  });

  if (publicIds?.length > 0) {
    await cloudinary.api.delete_resources(publicIds);
  }
  if (user.profilePhoto.publicId !== null) {
    await cloudinary.uploader.destroy(user.profilePhoto.publicId);
  }
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });
  await User.findByIdAndDelete(user._id);

  return res.status(200).json({
    status: SUCCESS,
    message: "account deleted successfully",
    code: 200,
    data: null,
  });
});
export const getUserProfile = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
  if (!user) return next(appError.create(FAIL, 404, "user not found"));
  return res
    .status(200)
    .json({ status: SUCCESS, message: "user Found", code: 200, data: user });
});

export const getAllUsers = asyncHandeler(async (req, res, next) => {
  const users = await User.find().select("-password").populate("posts");
  if (!users.length) return next(appError.create(FAIL, 404, "users not found"));
  return res
    .status(200)
    .json({ status: SUCCESS, message: "users Found", code: 200, data: users });
});

export const getUsersCount = asyncHandeler(async (req, res, next) => {
  const count = await User.count();
  if (!count) return next(appError.create(FAIL, 404, "no users"));
  return res.status(200).json({
    status: SUCCESS,
    message: "found users count successfully",
    code: 200,
    data: count,
  });
});
