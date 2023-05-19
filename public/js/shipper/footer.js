// Toggle side bar
sidebar = body.querySelector(".hide");
sidebarToggle = body.querySelector(".bx-menu");

// Side bar toggle
let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}

