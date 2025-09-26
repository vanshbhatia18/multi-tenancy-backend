import express from "express"
import authRouter from "./routes/auth.routes.js"
import noteRouter from "./routes/notes.routes.js"
import cors from "cors";
import dotenv from "dotenv"
dotenv.config()
 const app =express();

 app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An internal server error occurred" });
});
app.use("/api/v1/users", authRouter);
app.use("/api/v1/notes",noteRouter)
export {app}

