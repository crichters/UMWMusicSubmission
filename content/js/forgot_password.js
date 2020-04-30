$('#password_reset_form').submit((e) => {
    let email_address = $('#email_address').val();
    let submission_values = {email: email_address};

    $.post("/forgot-password", submission_values, (data, success) => {
        if(data["status"] === "success") {
            $('#sent_response').html(`Password reset email sent to ${email_address}`);
            $('#email_address').val("");
        } else {
            // ERR Handle
            $('#sent_response').html("Error, unable to send reset email");
        }
    });

    e.preventDefault();
});