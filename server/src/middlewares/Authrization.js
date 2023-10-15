import appError from "../utils/appError.js";
import asyncHandeler from "../utils/asyncHandeler.js";
import { FAIL } from "../utils/statusText.js";

const Authrization = asyncHandeler(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(appError.create(401, FAIL, "Access For Admins Onlyy"));
  }
  return next();
});

export default Authrization;
