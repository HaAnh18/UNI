exports.popupfunction = function(error) {
  if (error == 'invalid') {
    console.log('this is an invalid respond')
  } else if(error == 'success') {
      console.log('Logged in success')
    }
};