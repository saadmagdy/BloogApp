import asyncHandeler from "./../utils/asyncHandeler.js";
import { ERROR, FAIL, SUCCESS } from "./../utils/statusText.js";
import appError from "../utils/appError.js";
import User from "./../models/User.js";
import VerificationToken from "./../models/VerificationToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";

export const sendRestPasswordLink = asyncHandeler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(appError.create(404, FAIL, "user not found"));
  }

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

  const link = `http://localhost:3000/reset-password/${user._id}/${verifiedToken.token}`;
  const htmlTemplate = `
   <div>
      <p>Click on the link to rese your password</p>
      <a href="${link}">Reset password</a>
   </div>
  `;
  await sendEmail(user.email, "Reset password", htmlTemplate);
  return res.status(200).json({
    status: SUCCESS,
    message: "password reset link sent to your email please check your inbox",
    code: 200,
    data: null,
  });
});

export const getResetPasswordLink = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(appError.create(404, FAIL, "invalid link"));
  }
  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return next(appError.create(404, FAIL, "invalid link"));
  }
  return res.status(200).json({
    status: SUCCESS,
    message: "Vaild url",
    code: 200,
    data: null,
  });
});

export const resetPassword = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(appError.create(404, FAIL, "invaild link"));
  }
  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return next(appError.create(404, FAIL, "invalid link"));
  }
  if (!user.isAccountVerified) {
    user.isAccountVerified = true;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;
  await user.save();
  await verificationToken.remove();

  return res
    .status(200)
    .send({
      status: SUCCESS,
      message: "password reset successfully",
      code: 200,
      data: null,
    });
});
