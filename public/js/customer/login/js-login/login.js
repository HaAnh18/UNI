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
//signup address
var AddressError = document.getElementById('s-address-error');
//signup address
var submitError = document.getElementById('s-submit-error');

/*validator*/

//name
function validateName(){
    //take value from user input
    var name = document.getElementById('contact-name').value;
    //condition 
    //if the slot is empty will display error message
    if(name.length < 5 || name.length < 6){
        nameError.innerHTML = 'please enter full name';
        return false;
    }
    nameError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}

//address
function validateAddress(){
    //take value from user input
    var address = document.getElementById('contact-s-address').value;
    //condition 
    //if the slot is empty will display error message
    if(AddressError.length < 8 || address.length < 15){
        AddressError.innerHTML = 'must be between 8 - 15 characters';
        return false;
    }
    AddressError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}

//signup username
function validateSUsername(){
    //take value from user input to email
    var sUsername = document.getElementById('contact-s-username').value;
    //condition 
    //if the slot is empty will display error message
    if(sUsername.length == 0){
        sUsernameError.innerHTML = 'username is required';
        return false;
    }
    if(sUsername.length < 8 || sUsername.length >15){
        sUsernameError.innerHTML = 'must be between 8 - 15 characters';
        return false;
    }
    //rules
    if(sUsername.match(/^[A-Za-z]\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        sUsernameError.innerHTML = 'Email Invalid';
        return false;
    }

    sUsernameError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}

//signup password
function validateSPassword(){
    //take value from user input to password
    var sPassword = document.getElementById('contact-s-password').value;
    //condition 
    //if the slot is empty will display error message
    if(sPassword.length == 0){
        sPasswordError.innerHTML = 'Password is required';
        return false;
    }
    
    //if the slot is bellow 8 character
    if(sPassword.length < 8){
        sPasswordError.innerHTML = 'Password length must be at least 8 characters';
        return false;
    }

    //rules
    if(!sPassword.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)){
        sPasswordError.innerHTML = 'invalid format';
        return false;
    }

    sPasswordError.innerHTML = '<i class="fa-solid fa-check"></i>';
    return true;
}

/*submit validate*/

/*Signup Form validator*/
function validateSForm(){
    if(!validateSUsername() || !validateSPassword()  || !validateName() || !validateAddress()){
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

