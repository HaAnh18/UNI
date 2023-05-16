/*main function for the whole signin & signup pages*/ 	
  	function show_login()
  	{
  		document.querySelector(".js-signup-form").classList.add("hide");
  		document.querySelector(".js-login-form").classList.remove("hide");

  		document.querySelector(".login-button").classList.add("button-selected");
  		document.querySelector(".signup-button").classList.remove("button-selected");
  		
  	}

  	function show_signup()
  	{
  		document.querySelector(".js-login-form").classList.add("hide");
  		document.querySelector(".js-signup-form").classList.remove("hide");

  		document.querySelector(".signup-button").classList.add("button-selected");
  		document.querySelector(".login-button").classList.remove("button-selected");
  	}

/*-----------------------------------validate (original)----------------------------------------------*/

/*set pointer*/

//Full name
var nameError = document.getElementById('name-error');
//login username
var lUsernameError = document.getElementById('l-username-error');
//signup username
var sUsernameError = document.getElementById('s-username-error');
//login password
var lPasswordError = document.getElementById('l-password-error');
//signup password
var sPasswordError = document.getElementById('s-password-error');
//phone number
/*var phoneError = document.getElementById('phone-error');*/
//signup address
var sAddressError = document.getElementById('s-address-error');

/*validator*/

//name
function validateName(){
    //take value from user input to full name
    var name = document.getElementById('contact-name').value;
    //condition 
    //if the slot is empty will display error message
    if(name.length == 0){
        nameError.innerHTML = 'full name is required';
        return false;
    }
    //first character must be uppercase letter
    if(!name.match(/^[A-Za-z]*\s{1}[A-Za-z]*$/)){
        nameError.innerHTML = 'first letter must be uppercase';
        return false;
    }

    nameError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}

/*//phone number
function validatePhone(){
    //take value from user input to phone number
    var phone = document.getElementById('contact-phone').value;
    //condition 
    //if the slot is empty will display error message
    if(phone.length == 0){
        phoneError.innerHTML = 'phone number is required';
        return false;
    }
    //phone number must be 10 digits
    if(phone.length !== 10){
        phoneError.innerHTML = 'phone number should be 10 digits';
        return false;
    }
    //check for number from 0-9 for each digits and total must be 10 digits
    if(!phone.match(/^[0-9]{10}$/)){
        phoneError.innerHTML = 'only number';
        return false;
    }

    phoneError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}*/

//signup username
function validateSUsername(){
    //take value from user input to email
    var sEmail = document.getElementById('contact-s-username').value;
    //condition 
    //if the slot is empty will display error message
    if(sEmail.length == 0){
        sUsernameError.innerHTML = 'username is required';
        return false;
    }
    //rules
    if(sEmail.match(/^[A-Za-z]\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        sUsernameError.innerHTML = 'Email Invalid';
        return false;
    }

    sUsernameError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}

//login username
function validateLUsername(){
    //take value from user input to email
    var lEmail = document.getElementById('contact-l-username').value;
    //condition 
    //if the slot is empty will display error message
    if(lEmail.length == 0){
        lUsernameError.innerHTML = 'Username is required';
        return false;
    }
    //rules
    if(lEmail.match(/^[A-Za-z]\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        lUsernameError.innerHTML = 'Username Invalid';
        return false;
    }

    lUsernameError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}

//signup password
function validateSPassword(){
    //take value from user input to password
    // var sPassword = document.getElementById('contact-s-password').value;
    //condition 
    //if the slot is empty will display error message
    var p = document.getElementById('contact-s-password').value,
        errors = [];
    if (p.length < 8) {
        errors.push("Your password must be at least 8 characters"); 
    }
    else if (p.search(/[a-z]/i) < 0) {
        errors.push("Your password must contain at least one letter.");
    }
    else if (p.search(/[0-9]/) < 0) {
        errors.push("Your password must contain at least one digit."); 
    }
    else {
        alert(errors.join("\n"));
        return false;
    }
    return true;
    // if(sPassword.length == 0){
    //     sPasswordError.innerHTML = 'Password is required';
    //     return false;
    // }
    // //if the slot is bellow 8 character
    // // if(sPassword.length < 8){
    // //     sPasswordError.innerHTML = 'Password length must be at least 8 characters';
    // //     return false;
    // // }

    // var pattern = new RegExp(
    //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"        
    // );

    // if (pattern.test(sPassword)) {
    //     return true;
    //   } else {
    //     sPasswordError.innerHTML = 'Required 1 number, 1 uppercse, 1 lowercase, 1 special symbol';
    //     return false;
    //   }

    // //rules
    // if(!sPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/)){
    //     sPasswordError.innerHTML = 'Required 1 number, 1 uppercse, 1 lowercase, 1 special symbol';
    //     return false;
    // }

    sPasswordError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}

//login password
function validateLPassword(){
    //take value from user input to password
    var lPassword = document.getElementById('contact-l-password').value;
    //condition 
    //if the slot is empty will display error message
    if(lPassword.length == 0){
        lPasswordError.innerHTML = 'Password is required';
        return false;
    }
    //if the slot is bellow 8 character
    if(lPassword.length < 8){
        lPasswordError.innerHTML = 'Password length must be atleast 8 characters';
        return false;
    }
    //rules
    if(lPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)){
        lPasswordError.innerHTML = 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character';
        return false;
    }

    lPasswordError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}

/*Signup Form validator*/
function validateSForm(){
    if(!validateName() || !validateSUsername() || !validateSPassword()){
        submitError.style.display = 'block';
        submitError.innerHTML = "Please fill in all of the empty box";
        setTimeout(function(){submitError.style.display = 'none';}, 3000);
        return false;
    }
}

/*Signin Form validator*/
function validateLForm(){
    if(!validateLUsername() || !validateLPassword()){
        submitError.style.display = 'block';
        submitError.innerHTML = "Please fill in all of the empty box";
        setTimeout(function(){submitError.style.display = 'none';}, 3000);
        return false;
    }
}

