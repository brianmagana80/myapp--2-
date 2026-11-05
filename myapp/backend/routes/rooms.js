// Stage 2: Rooms API
//
// Endpoints in this file:
//   GET  /api/rooms       -> return the full list of rooms
//   GET  /api/rooms/:id   -> return a single room by id (404 if not found)

const express = require("express");
const router = express.Router();
const { readData } = require("../utils/jsonStore");

// GET /api/rooms
router.get("/", (req, res) => {
  const rooms = readData("rooms.json");
  res.json(rooms);
});

// GET /api/rooms/:id
router.get("/:id", (req, res) => {
  const rooms = readData("rooms.json");
  const room = rooms.find((r) => r.id === req.params.id);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.json(room);
});

module.exports = router;
