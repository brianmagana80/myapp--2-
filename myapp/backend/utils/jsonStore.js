// Small helper for reading/writing our JSON "database" files.
// Stage 2 students: this file is DONE FOR YOU as a worked example.
// Study how readData/writeData work, then use them in routes/rooms.js
// and routes/bookings.js instead of writing your own fs code.

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

function readData(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeData(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = { readData, writeData };
