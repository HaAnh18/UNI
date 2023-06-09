/* // RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Tom's Prodigies V2
// ID: 
// Nguyen Tran Ha Anh: s3938490
// Dang Kim Quang Minh: s3938024
// Nguyen Gia Bao: s3938143
// Hoang Tuan Minh: s3924716
// Vu Loc: s3891483
// Acknowledgement: 
Acknowledgement: https://www.codingnepalweb.com/login-registration-form-html-css-javascript/
*/
const form = document.querySelector("form");
const usernameField = form.querySelector(".username-field");
const usernameInput = usernameField.querySelector(".username");
const passField = form.querySelector(".create-password");
const passInput = passField.querySelector(".password");
const button = form.querySelector(".submitBtn");

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
function checkUsername() {
  const usernamePattern = /^[a-zA-Z0-9]{8,15}$/;
  if (!usernamePattern.test(usernameInput.value)) {
    usernameField.classList.add("invalid");
    passField.classList.remove("valid");
  } else {
    usernameField.classList.remove("invalid");
    usernameField.classList.add("valid");
  }
  if (
    usernameField.classList.contains("valid") &&
    passField.classList.contains("valid")
  ) {
  button.classList.remove("deny");
  } else {
  button.classList.add("deny");
  }
}

// Password Validation
function checkPass() {
  const passPattern =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
  if (!passPattern.test(passInput.value)) {
    passField.classList.add("invalid");
    passField.classList.remove("valid");
  } else {
    passField.classList.remove("invalid");
    passField.classList.add("valid")
  }
  if (
    usernameField.classList.contains("valid") &&
    passField.classList.contains("valid")
  ) {
  button.classList.remove("deny");
  } else {
  button.classList.add("deny");
  }
}


