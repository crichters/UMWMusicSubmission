$('#login_form').submit((e) => {
    let email_address = $('#email_address').val();
    let password = $('#password').val()
    console.log(email_address, password);
    let submission_values = {email_address: email_address, password: password};
    $.post("/login", submission_values, (data, success) => {
        if(data["status"] === "success") {
            window.location.href = "/dashboard";
        } else {
            // ERR Handle
            $('#login_response').html("Error, incorrect username or password");
            $('#password').val("")
        }
    });

    e.preventDefault();
});