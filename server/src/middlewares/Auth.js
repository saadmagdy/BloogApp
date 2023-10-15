import jwt from "jsonwebtoken";
import appError from "../utils/appError.js";
import { FAIL } from "../utils/statusText.js";
import User from "../models/User.js";
import asyncHandeler from "../utils/asyncHandeler.js";

const Auth = asyncHandeler(async (req, res, next) => {
  let token = req.headers.auth;
  if (!token) {
    return next(appError.create(404, FAIL, "token is not provided"));
  }
  token = token.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_STRING);
  if (!decode) {
    return next(appError.create(503, FAIL, "invalid Token"));
  }
  const user = await User.findById(decode.id);
  if (!user) {
    return next(appError.create(503, FAIL, "invalid Token"));
  }
  req.user = user;
  next();
});

export default Auth;
