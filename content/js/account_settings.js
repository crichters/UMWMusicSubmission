var emails = [];


// Function to Add Email
$('#email_form').submit((e) => {
    e.preventDefault();
    
    var request = {
        "email_address":$('#new_email').val()
    };
    
    $.post("/email", request, (data, success) => {
        console.log(data);
        console.log(success);
        //location.reload();
    });
    
});

function clear_passwords() {
    $('#old_password').val('');
    $('#new_password').val('');
    $('#new_password2').val('');
}

$('#password_form').submit((e) => {
    e.preventDefault();

    var current_password = $('#old_password').val();
    var new_password = $('#new_password').val();
    var new_password2 = $('#new_password2').val();

    if (new_password === new_password2){
        change_request = {
            "current_password": current_password,
            "new_password": new_password
        };
        
        $.post("/change-password", change_request, (data, success) => {
            clear_passwords();
            if(data === true) {
                $('#response').html(`<span style="color:green;">Password changed successfully</span>`);
            } else {
                $('#response').html(`<span style="color:red;">Error changing password</span>`);
            }
        });
    } else {
        $('#response').html(`<span style="color:red;">Error: New Passwords do not match</span>`);
    }
});

function test_emails() {
    for(var i = 0; i < 5; i++) {
        append_email(i);
    }
}

function append_email(email_address, email_id) {
    var table_row = `
    <tr>
      <td>${email_address}</td>
      <td><a href="#" onclick="delete_email(${email_id})">Delete</a></td>
    </tr>`;

    $('#email_table').append(table_row);
}

function delete_email(email_id) {

    var request = {
      'email_id': email_id
    };
    console.log(request);


    $.post("/delete_email", request, (data, status) => {
        console.log(data);
        console.log(success);
        location.reload();
    });
}


$(document).ready(function() {

    $.get("/emails", (data, status) => {
        for(var i=0; i<data.length; i++){
          console.log(data[i]);
          append_email(data[i]["email"], data[i]["id"]);
        }
      });
    });