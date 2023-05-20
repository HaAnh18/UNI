/*
// RMIT University Vietnam
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
https://getbootstrap.com/docs/5.3/getting-started/javascript/
Create your own Admin Dashboard Template with Angular 15 Html CSS:https://www.youtube.com/watch?v=zQf7AcKw5mU
https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js*/
$(document).ready(function() {
	
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
   
    $(".file-upload").on('change', function(){
        readURL(this);
    });
    
    $(".upload-button").on('click', function() {
       $(".file-upload").click();
    });
});