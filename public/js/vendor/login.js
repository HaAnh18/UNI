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
// Validation
// const passwordInput = document.querySelector(".pass-field input");
// const eyeIcon = document.querySelector(".pass-field i");
// const requirementList = document.querySelectorAll(".requirement-list li");
// // An array of password requirements with corresponding
// // regular expressions and index of the requirement list item
// const requirements = [
//   { regex: /.{8,}/, index: 0 }, // Minimum of 8 characters
//   { regex: /[0-9]/, index: 1 }, // At least one number
//   { regex: /[a-z]/, index: 2 }, // At least one lowercase letter
//   { regex: /[^A-Za-z0-9]/, index: 3 }, // At least one special character
//   { regex: /[A-Z]/, index: 4 }, // At least one uppercase letter
// ];
// passwordInput.addEventListener("keyup", (e) => {
//   requirements.forEach((item) => {
//     // Check if the password matches the requirement regex
//     const isValid = item.regex.test(e.target.value);
//     const requirementItem = requirementList[item.index];
//     // Updating class and icon of requirement item if requirement matched or not
//     if (isValid) {
//       requirementItem.classList.add("valid");
//       requirementItem.firstElementChild.className = "fa-solid fa-check";
//     } else {
//       requirementItem.classList.remove("valid");
//       requirementItem.firstElementChild.className = "fa-solid fa-circle";
//     }
//   });
// });

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
