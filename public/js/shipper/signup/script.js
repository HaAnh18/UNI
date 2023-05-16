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