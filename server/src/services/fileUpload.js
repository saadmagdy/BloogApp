import multer from "multer";
import { nanoid } from "nanoid";
import appError from "../utils/appError.js";
import { FAIL } from "../utils/statusText.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
// const __dirName = path.dirname(fileURLToPath(import.meta.url));

// const fileUpload = (location) => {
//   const fullPath = path.join(__dirName, `../uploads/${location}`);
//   if (!fs.existsSync(fullPath)) {
//     fs.mkdirSync(fullPath, { recursive: true });
//   }
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, fullPath);
//     },
//     filename: (req, file, cb) => {
//       cb(null, nanoid() + "__" + file.originalname);
//     },
//   });
//   const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image")) {
//       return cb(null, true);
//     } else {
//       return cb(new appError.create(400, FAIL, "upload images only"), false);
//     }
//   };

//   const upload = multer({ fileFilter, storage });
//   return upload;
// };
// export default fileUpload;

const upload = () => {
  const storage = multer.diskStorage({});
  const uploading = multer({ storage });
  return uploading;
};
export default upload;
