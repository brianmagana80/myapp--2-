// Stage 2 / Stage 3: Express server
//
// This file:
//   1. Serves the frontend (HTML/CSS/JS) as static files
//   2. Mounts the API routes for rooms and bookings
//   3. Returns JSON (not an HTML error page) if something goes wrong

const express = require("express");
const path = require("path");

const roomsRouter = require("./routes/rooms");
const bookingsRouter = require("./routes/bookings");

const app = express();
const PORT = 3000;

// Allow Express to read JSON request bodies (needed for POST /api/bookings)
app.use(express.json());

// Serve the frontend folder as static files
app.use(express.static(path.join(__dirname, "..", "frontend")));

// API routes
app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);

// Unknown /api/... URLs get a JSON 404
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Catch-all error handler (bad JSON body, unreadable data file, etc.)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 400 ? "Invalid request body" : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
