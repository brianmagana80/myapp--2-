// my-bookings.js
//
// Renders the list of bookings on my-bookings.html and lets the
// user cancel a booking.

// Bookings contain text typed by users, so escape it before putting it
// into innerHTML (otherwise "<b>" or "<script>" in a club name would be
// treated as real HTML).
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function bookingToHtml(booking, roomNames) {
  const roomName = roomNames[booking.roomId] || booking.roomId;
  const purpose = booking.purpose
    ? `<p><strong>Purpose:</strong> ${escapeHtml(booking.purpose)}</p>`
    : "";

  return `
    <div class="booking-item">
      <div class="booking-details">
        <h3>${escapeHtml(booking.clubName)} &mdash; ${escapeHtml(roomName)}</h3>
        <p><strong>When:</strong> ${escapeHtml(booking.date)}, ${escapeHtml(booking.startTime)} - ${escapeHtml(booking.endTime)}</p>
        ${purpose}
      </div>
      <button type="button" class="cancel-btn" data-id="${escapeHtml(booking.id)}">Cancel</button>
    </div>
  `;
}

async function renderBookings() {
  const container = document.getElementById("bookings-list");

  try {
    // Load rooms too, so we can show room names instead of ids like "r1"
    const [bookings, rooms] = await Promise.all([getBookings(), getRooms()]);

    if (!bookings || bookings.length === 0) {
      container.innerHTML =
        '<p class="empty-message">No bookings yet. <a href="booking.html">Book a room</a> to get started.</p>';
      return;
    }

    const roomNames = {};
    rooms.forEach((room) => {
      roomNames[room.id] = room.name;
    });

    // Soonest first
    const sorted = [...bookings].sort((a, b) =>
      `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
    );

    container.innerHTML = sorted
      .map((booking) => bookingToHtml(booking, roomNames))
      .join("");

    container.querySelectorAll(".cancel-btn").forEach((button) => {
      button.addEventListener("click", () => {
        handleCancelClick(button.dataset.id);
      });
    });
  } catch (error) {
    container.innerHTML = `<p class="status-message error">Could not load bookings: ${escapeHtml(error.message)}</p>`;
  }
}

async function handleCancelClick(bookingId) {
  if (!confirm("Cancel this booking?")) {
    return;
  }

  try {
    await deleteBooking(bookingId);
    await renderBookings();
  } catch (error) {
    alert(`Could not cancel booking: ${error.message}`);
  }
}

document.addEventListener("DOMContentLoaded", renderBookings);
