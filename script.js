let nav = 0;
let clicked = null;

//Local storage ternary operator
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const addEvent = document.getElementById("addEvent");
const deleteEventDay = document.getElementById("deleteEventDay");
const backDrop = document.getElementById("modalBackDrop");
const eventName = document.getElementById("eventName");
const week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function openModal(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventDay.style.display = "block";
  } else {
    addEvent.style.display = "block";
  }
  backDrop.style.display = "block";
}

function load() {
  const dte = new Date();

  if (nav !== 0) {
    dte.setMonth(new Date().getMonth() + nav);
  }

  const day = dte.getDate();
  const month = dte.getMonth();
  const year = dte.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = week.indexOf(dateString.split(", ")[0]);

  document.getElementById("monthShow").innerText = `${dte.toLocaleDateString(
    "en-GB",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysMonth; i++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      dayBox.innerText = i - paddingDays;
      const eventForDay = events.find((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        dayBox.id = "currentDay";
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        dayBox.appendChild(eventDiv);
      }

      dayBox.addEventListener("click", () => openModal(dayString));
    } else {
      dayBox.classList.add("padding");
    }

    calendar.appendChild(dayBox);
  }
}

function closeModal() {
  eventName.classList.remove("error");
  addEvent.style.display = "none";
  deleteEventDay.style.display = "none";
  backDrop.style.display = "none";
  eventName.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventName.value) {
    eventName.classList.remove("error");
    events.push({
      date: clicked,
      title: eventName.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventName.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

//Calendar navigation
function navButtons() {
  document.getElementById("nextBtn").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("saveBtn").addEventListener("click", saveEvent);
  document.getElementById("cancelBtn").addEventListener("click", closeModal);
  document.getElementById("deleteBtn").addEventListener("click", deleteEvent);
  document.getElementById("closeBtn").addEventListener("click", closeModal);
}

navButtons();
load();
