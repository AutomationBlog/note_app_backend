import express from "express";
import Dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./dbUtils/connectDB.js";
import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";

//Create express app
const app = express();

//Middlewares
app.use(cors({ origin: "*" }));
Dotenv.config();
app.use(express.json());

//Home Page Route
app.get("/", (req, res) => {
  res.json({ message: "Notes APP Backend API" });
});

//Routes
app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);

//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log("Server started on port " + PORT);
  console.log("http://localhost:" + PORT);
});
