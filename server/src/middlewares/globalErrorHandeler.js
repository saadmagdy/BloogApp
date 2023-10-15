import { FAIL } from "../utils/statusText.js";

const globalErrorHandeler = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.statusText || FAIL,
    message: err.message,
    code: err.statusCode || 500,
    data: null,
  });
};

export default globalErrorHandeler;
