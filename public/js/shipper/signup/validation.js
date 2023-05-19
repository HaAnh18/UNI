/*
RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Hoang Tuan Minh
ID: s3924716
Acknowledgement: 
https://getbootstrap.com/docs/5.3/getting-started/javascript/
Create your own Admin Dashboard Template with Angular 15 Html CSS:https://www.youtube.com/watch?v=zQf7AcKw5mU
https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js*/
const form = document.querySelector("form");

const usernameField = form.querySelector(".username-field");
const usernameInput = usernameField.querySelector(".username");
const userError = form.querySelector(".username-error");

const passField = form.querySelector(".password-field");
const passInput = passField.querySelector(".password");
const passError = form.querySelector(".password-error");

const button = form.querySelector(".submitBtn");

// Username Validation
function checkUsername() {
  const usernamePattern = /^[a-zA-Z0-9]{8,15}$/;
  if (!usernamePattern.test(usernameInput.value)) {
    userError.classList.add("invalid");
    passError.classList.remove("valid");
  } else {
    userError.classList.remove("invalid");
    userError.classList.add("valid");
  }
  if (
    userError.classList.contains("valid") &&
    passError.classList.contains("valid")
  ) {
  button.classList.remove("deny");
  } else {
  button.classList.add("deny");
  }
}

// Password Validation
function checkPass() {
  const passPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
  if (!passPattern.test(passInput.value)) {
    passError.classList.add("invalid");
    passError.classList.remove("valid");
  } else {
    passError.classList.remove("invalid");
    passError.classList.add("valid")
  }
  if (
    userError.classList.contains("valid") &&
    passError.classList.contains("valid")
  ) {
  button.classList.remove("deny");
  } else {
  button.classList.add("deny");
  }
}





 