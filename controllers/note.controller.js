import { Note as noteModel } from "../models/note.model.js";

export const addNote = async (req, res) => {
  const { title, content, tags } = req.body;
  const user = req.user;
  try {
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title required" });
    }
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content are required" });
    }
    const newNote = new noteModel({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await newNote.save();
    res.status(201).json({
      success: true,
      data: newNote,
      message: "Note added successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editNote = async (req, res) => {
  const { title, content, tags, isPinned } = req.body;
  const { noteId } = req.params;
  const user = req.user;
  try {
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title required" });
    }
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content are required" });
    }
    const note = await noteModel.findById(noteId);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    if (note.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    note.title = title;
    note.content = content;
    note.tags = tags;
    note.isPinned = isPinned;
    await note.save();
    res.status(200).json({
      success: true,
      data: note,
      message: "Note updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotes = async (req, res) => {
  const { id } = req.user;
  try {
    const notes = await noteModel.find({ userId: id }.sort({ isPinned: -1 }));
    res.status(200).json({
      success: true,
      notes,
      message: "All notes fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const user = req.user;
  try {
    const note = await noteModel.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    if (note.user.toString() !== user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    await note.deleteOne({ _id: noteId, userId: user._id });
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const pinNote = async (req, res) => {
  const { noteId } = req.params;
  const user = req.user;

  try {
    const note = await noteModel.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    if (note.user.toString() !== user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    note.isPinned = !note.isPinned;
    await note.save();
    res.status(200).json({
      success: true,
      message: "Note pinned successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
