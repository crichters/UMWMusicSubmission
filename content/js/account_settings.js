// Function to Add Email
$('#email_form').submit((e) => {
    e.preventDefault();
    
    var email_address = $('#new_email').val();

    
    
})





$(document).ready(function() {

    $.get("/emails", (data, status) => {
        for(var i=0; i<data.length; i++){
          console.log(data[i]);
        }
      });
    });