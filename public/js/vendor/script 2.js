/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Vu Loc
ID: S3891483
Acknowledgement: https://www.codingnepalweb.com/admin-dashboard-panel-html-css-javascript/ 
*/
// Toggle dark mode
const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle");
// Toggle side bar
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

// Dark mode toggle
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

// Side bar toggle
let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}

// Declare dark mode
modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

// Close menu when sidebar is closed
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      let dropdownParent = dropdown.closest(".dropdown");
      let subMenu = dropdownParent.querySelector(".sub-menu");
      dropdownParent.classList.remove("showMenu");
      subMenu.classList.remove("showMenu");
    });
  } else {
    localStorage.setItem("status", "open");
  }
});

// Select all dropdown elements within the menu structure
document.querySelectorAll(".dropdown").forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    const dropdownParent = e.target.closest(".dropdown");
    const subMenu = dropdownParent.querySelector(".sub-menu");
    dropdownParent.classList.toggle("showMenu");
    subMenu.classList.toggle("showMenu");
  });
});
