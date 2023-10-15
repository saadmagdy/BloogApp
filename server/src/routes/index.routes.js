import express from "express";
import userRouter from "./user.router.js";
import postRouter from "./post.router.js";
import commentRouter from "./comment.router.js";
import categoryRouter from "./category.router.js";
import passwordRouter from "./password.router.js";
const app = express();
// const baseUrl = process.env.BASE_URL;

app.use(`/users`, userRouter);
app.use(`/posts`, postRouter);
app.use(`/comments`, commentRouter);
app.use(`/category`, categoryRouter);
app.use(`/password`, passwordRouter);

export default app;
