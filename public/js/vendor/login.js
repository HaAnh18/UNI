/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Vu Loc
ID: S3891483
Acknowledgement: https://www.codingnepalweb.com/login-registration-form-html-css-javascript/
*/

const container = document.querySelector(".container"),
  pwShowHide = document.querySelectorAll(".showHidePw"),
  pwFields = document.querySelectorAll(".password"),
  next = document.querySelector(".next"),
  back = document.querySelector(".back");
//   js code to show/hide password and change icon
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach((pwField) => {
      if (pwField.type === "password") {
        pwField.type = "text";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye-slash", "uil-eye");
        });
      } else {
        pwField.type = "password";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye", "uil-eye-slash");
        });
      }
    });
  });
});

// sign up form
// js code to change Vendor registration
next.addEventListener("click", () => {
  container.classList.add("change");
});
back.addEventListener("click", () => {
  container.classList.remove("change");
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
