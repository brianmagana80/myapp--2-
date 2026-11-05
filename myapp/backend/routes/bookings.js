// Stage 2: Bookings API
//
// Endpoints in this file:
//   GET    /api/bookings       -> return the full list of bookings
//   POST   /api/bookings       -> create a new booking, save it to bookings.json
//   DELETE /api/bookings/:id   -> remove a booking by id
//
// A booking object looks like this:
// {
//   "id": "1735689600000",
//   "roomId": "r1",
//   "clubName": "Chess Club",
//   "date": "2026-10-01",
//   "startTime": "14:00",
//   "endTime": "15:00",
//   "purpose": "Weekly meeting"
// }

const express = require("express");
const router = express.Router();
const { readData, writeData } = require("../utils/jsonStore");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// "14:30" -> 870 (minutes since midnight), so times can be compared as numbers
function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// GET /api/bookings
router.get("/", (req, res) => {
  const bookings = readData("bookings.json");
  res.json(bookings);
});

// POST /api/bookings
router.post("/", (req, res) => {
  const { roomId, clubName, date, startTime, endTime, purpose } = req.body || {};

  // 1. Required fields must be present (and be non-empty strings)
  const required = { roomId, clubName, date, startTime, endTime };
  for (const [field, value] of Object.entries(required)) {
    if (typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // 2. Formats
  if (!DATE_PATTERN.test(date)) {
    return res.status(400).json({ error: "date must look like YYYY-MM-DD" });
  }
  if (!TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime)) {
    return res.status(400).json({ error: "times must look like HH:MM (24-hour)" });
  }
  if (toMinutes(endTime) <= toMinutes(startTime)) {
    return res.status(400).json({ error: "End time must be after start time" });
  }

  // 3. The room has to exist
  const rooms = readData("rooms.json");
  if (!rooms.some((room) => room.id === roomId)) {
    return res.status(400).json({ error: "Unknown roomId" });
  }

  // 4. No double-booking: same room, same date, overlapping times
  const bookings = readData("bookings.json");
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const conflict = bookings.find(
    (b) =>
      b.roomId === roomId &&
      b.date === date &&
      start < toMinutes(b.endTime) &&
      end > toMinutes(b.startTime)
  );
  if (conflict) {
    return res.status(409).json({
      error: `That room is already booked ${conflict.startTime}-${conflict.endTime} on ${date}`,
    });
  }

  // 5. Build the new booking with a unique id
  let id = Date.now().toString();
  while (bookings.some((b) => b.id === id)) {
    id = (Number(id) + 1).toString();
  }

  const newBooking = {
    id,
    roomId,
    clubName: clubName.trim(),
    date,
    startTime,
    endTime,
    purpose: typeof purpose === "string" ? purpose.trim() : "",
  };

  bookings.push(newBooking);
  writeData("bookings.json", bookings);

  res.status(201).json(newBooking);
});

// DELETE /api/bookings/:id
router.delete("/:id", (req, res) => {
  const bookings = readData("bookings.json");
  const remaining = bookings.filter((b) => b.id !== req.params.id);

  if (remaining.length === bookings.length) {
    return res.status(404).json({ error: "Booking not found" });
  }

  writeData("bookings.json", remaining);
  res.status(200).json({ message: "Booking canceled" });
});

module.exports = router;
