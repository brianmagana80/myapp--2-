// api.js
//
// This file is the ONLY place that talks to the backend.
// rooms.js / booking.js / my-bookings.js call the functions below -
// they never use fetch() directly.
//
// Every function talks to the Express server at the same origin
// (http://localhost:3000, started with "npm start").

// Small helper: run fetch, parse the JSON, and throw an Error with the
// server's message if the response wasn't successful (status 400, 404, 409...).
async function request(url, options) {
  const response = await fetch(url, options);

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // response had no JSON body; leave data as null
  }

  if (!response.ok) {
    const message = (data && data.error) || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

// ---------- Rooms ----------

async function getRooms() {
  return request("/api/rooms");
}

async function getRoomById(id) {
  return request(`/api/rooms/${encodeURIComponent(id)}`);
}

// ---------- Bookings ----------

async function getBookings() {
  return request("/api/bookings");
}

async function createBooking(bookingData) {
  // bookingData looks like:
  // { roomId, clubName, date, startTime, endTime, purpose }
  return request("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
}

async function deleteBooking(id) {
  return request(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
