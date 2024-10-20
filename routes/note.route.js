import express from "express";
import { authenticateToken } from "../utils/verifyAuthenticateToken.js";
import {
  addNote,
  editNote,
  getNotes,
  deleteNote,
  pinNote,
} from "../controllers/note.controller.js";

const noteRouter = express.Router();

noteRouter.post("/add-note", authenticateToken, addNote);
noteRouter.put("/edit-note/:noteId", authenticateToken, editNote);
noteRouter.get("/notes", authenticateToken, getNotes);
noteRouter.delete("/delete-note/:noteId", authenticateToken, deleteNote);
noteRouter.put("/pin-note/:noteId", authenticateToken, pinNote);

export default noteRouter;
