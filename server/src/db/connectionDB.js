import mongoose from "mongoose";

const connectionDB = async () => {
  const uri = process.env.DB_URI_LOCAL;
  return await mongoose
    .connect(uri)
    .then((conn) => {
      console.log("======= conected to dadabase successfully ======");
    })
    .catch((err) => {
      console.log(err);
    });
};
export default connectionDB;
