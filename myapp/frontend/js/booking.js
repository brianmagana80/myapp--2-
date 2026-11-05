// booking.js
//
// Handles the "Book a Room" form on booking.html.

async function populateRoomSelect() {
  const select = document.getElementById("room-select");
  const statusEl = document.getElementById("form-status");

  try {
    const rooms = await getRooms();

    rooms.forEach((room) => {
      const option = document.createElement("option");
      option.value = room.id;
      option.textContent = `${room.name} (up to ${room.capacity} people)`;
      select.appendChild(option);
    });
  } catch (error) {
    statusEl.textContent = `Could not load rooms: ${error.message}`;
    statusEl.className = "status-message error";
  }
}

async function handleBookingSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const statusEl = document.getElementById("form-status");

  // 1. Read the form values
  const bookingData = {
    roomId: document.getElementById("room-select").value,
    clubName: document.getElementById("club-name").value.trim(),
    date: document.getElementById("date").value,
    startTime: document.getElementById("start-time").value,
    endTime: document.getElementById("end-time").value,
    purpose: document.getElementById("purpose").value.trim(),
  };

  // Simple client-side validation (the server checks again)
  if (bookingData.endTime <= bookingData.startTime) {
    statusEl.textContent = "End time must be after start time.";
    statusEl.className = "status-message error";
    return;
  }

  // 2. Send it to the backend
  try {
    await createBooking(bookingData);
    statusEl.textContent = "Booking saved! You can see it on the My Bookings page.";
    statusEl.className = "status-message success";
    form.reset();
  } catch (error) {
    statusEl.textContent = `Could not save booking: ${error.message}`;
    statusEl.className = "status-message error";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateRoomSelect();
  document
    .getElementById("booking-form")
    .addEventListener("submit", handleBookingSubmit);
});
