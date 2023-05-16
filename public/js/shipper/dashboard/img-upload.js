// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Vu Loc
// ID: S3891483
// Acknowledgement: 
//     https://openai.com/blog/chatgpt


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