/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Vu Loc
ID: S3891483
Acknowledgement: https://www.codingnepalweb.com/login-registration-form-html-css-javascript/
*/
const form = document.querySelector("form");
const usernameField = form.querySelector(".username-field");
const usernameInput = usernameField.querySelector(".username");
const passField = form.querySelector(".create-password");
const passInput = passField.querySelector(".password");

// Hide and show password
const eyeIcons = document.querySelectorAll(".showHidePw");

eyeIcons.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    const pInput = eyeIcon.parentElement.querySelector("input");
    if (pInput.type === "password") {
      eyeIcon.classList.replace("bi-eye-slash", "bi-eye-fill");
      pInput.type = "text";
    } else {
      eyeIcon.classList.replace("bi-eye-fill", "bi-eye-slash");
      pInput.type = "password";
    }
  });
});

// Upload and preview Profile Image
let uploadFile = document.getElementById("upload-file");
let profileImage = document.getElementById("profile-image");

uploadFile.onchange = function () {
  profileImage.src = URL.createObjectURL(uploadFile.files[0]);
};
function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document
        .getElementById("profile-image")
        .setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}


// Username Validation
// function checkUsername() {
//   const usernamePattern = /^[a-zA-Z0-9]{8,15}$/;
//   if (!usernamePattern.test(usernameInput.value)) {
//     usernameField.classList.add("invalid");
//   } else {
//     usernameField.classList.remove("invalid");
//   }
// }
// Password Validation
// function createPass() {
//   const passPattern =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
//   if (!passPattern.test(passInput.value)) {
//     passField.classList.add("invalid");
//   } else {
//     passField.classList.remove("invalid");
//   }
// }

// Form Submission
form.addEventListener("submit", (e) => {
  // e.preventDefault();
  // checkUsername();
  // createPass();

  // usernameInput.addEventListener("keyup", checkUsername);
  // passInput.addEventListener("keyup", createPass);

  if (
    !usernameField.classList.contains("invalid") &&
    !passField.classList.contains("invalid")
  ) {
    location.href = form.getAttribute("action");
  }
});
