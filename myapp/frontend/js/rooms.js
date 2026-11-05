// rooms.js
//
// Renders the list of rooms on index.html.
// This file is DONE FOR YOU as a worked example - study how it
// builds HTML from data and reads DOM elements before you write
// booking.js and my-bookings.js yourself.

async function renderRooms() {
  const container = document.getElementById("room-list");
  const rooms = await getRooms();

  if (!rooms || rooms.length === 0) {
    container.innerHTML = "<p>No rooms available.</p>";
    return;
  }

  container.innerHTML = rooms.map(roomToCardHtml).join("");
}

function roomToCardHtml(room) {
  const equipmentList = room.equipment
    .map((item) => `<li>${item}</li>`)
    .join("");

  const foodBadge = room.foodAllowed
    ? `<span class="badge food-yes">Food Allowed</span>`
    : `<span class="badge food-no">No Food</span>`;

  return `
    <div class="room-card">
      <h3>${room.name}</h3>
      <p><strong>Capacity:</strong> ${room.capacity} people</p>
      <p><strong>Equipment:</strong></p>
      <ul>${equipmentList}</ul>
      ${foodBadge}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", renderRooms);
