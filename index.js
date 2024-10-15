import express from "express";
import Dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./dbUtils/connectDB.js";

//Create express app
const app = express();

//Middlewares
app.use(cors());
Dotenv.config();
app.use(express.json());

//Home Page Route
app.get("/", (req, res) => {
  res.send("Notes APP Backend API");
});

//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log("Server started on port " + PORT);
  console.log("http://localhost:" + PORT);
});
