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
const imgDiv = document.querySelector('.user-img');
const img = document.querySelector('#photo');
const file = document.querySelector("#file");
const uploadbtn = document.querySelector('#uploadbtn');


file.addEventListener(' change', function(){
    const chosedfile = this.files[0];
    if(chosedfile){
      const reader = new FileReader();

      reader.addEventListener( 'load', function() {
        img.setAttribute('src', reader.result);
      })
      reader.readAsDataURL(chosedlife);
    }
})