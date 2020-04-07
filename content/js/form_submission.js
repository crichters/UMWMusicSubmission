// form_submission.js
// Containing functions pertaining to the recital forms and their submissions
// JQuery is required to make use of this file

// Global Variable for keeping track of how many collaborators have been added.
var collaborator_index = 0;

// Function for sending form data to Express Backend
// Sends POST request containing a map to /submit_recital_form
$("form").submit((event) => {
  var recaptcha = $("#g-recaptcha-response").val();
  if(!recaptcha === ""){
    alert("Please verify that you're not a bot with the reCaptcha");
    return false;
  } else {
    var recital_form = document.forms["recital_form"];
    var submission_values = {};

    input_values = recital_form.getElementsByTagName("input");
    
    // Loop through every value that isn't a collaborator and add it to the map
    for(var i = 0; i < input_values.length; i++) {
        input_id = input_values[i].id;
        input_value = input_values[i].value;

        if(!input_id.includes("collaborator")){
            console.log(input_values[i].value);
            submission_values[input_values[i].id] = input_values[i].value;
        }
    }

    // Create a list of collaborators and add that list to the submission map
    collaborator_list = [];
    for (var i=0; i < collaborator_index; i++) {
        collaborator_name_id = `#collaborator_${i}_name`;
        collaborator_medium_id = `#collaborator_${i}_medium`;
        collaborator_list[i] = {"collaborator_name" : $(collaborator_name_id).val(), "collaborator_medium": $(collaborator_medium_id).val()};
    }
    submission_values["collaborators"] = collaborator_list;
    
    // Get the recital date from the selection box and add that to the map
    submission_values["recital_date"] = $("#date option:selected").attr('id');

    // Logging, unless there's a reason to remove it
    console.log(submission_values);

    // Send Post Request
    $.post("/submit_recital_form", submission_values, function(data, status, jqXHR){
        console.log("Posted successfully");
        window.location.href = "/submitted.html";
    }); 
  }
});

// function send_form_data() {
//   var recaptcha = $("#g-recaptcha-response").val();
//   if(recaptcha === ""){
//     alert("Please verify that you're not a bot with the reCaptcha");
//   } else {
//     var recital_form = document.forms["recital_form"];
//     var submission_values = {};

//     input_values = recital_form.getElementsByTagName("input");
    
//     // Loop through every value that isn't a collaborator and add it to the map
//     for(var i = 0; i < input_values.length; i++) {
//         input_id = input_values[i].id;
//         input_value = input_values[i].value;

//         if(!input_id.includes("collaborator")){
//             submission_values[input_values[i].id] = input_values[i].value;
//         }
//     }

//     // Create a list of collaborators and add that list to the submission map
//     collaborator_list = [];
//     for (var i=0; i < collaborator_index; i++) {
//         collaborator_name_id = `#collaborator_${i}_name`;
//         collaborator_medium_id = `#collaborator_${i}_medium`;
//         collaborator_list[i] = {"collaborator_name" : $(collaborator_name_id).val(), "collaborator_medium": $(collaborator_medium_id).val()};
//     }
//     submission_values["collaborators"] = collaborator_list;
    
//     // Get the recital date from the selection box and add that to the map
//     submission_values["recital_date"] = $("#date option:selected").attr('id');

//     // Logging, unless there's a reason to remove it
//     console.log(submission_values);

//     // Send Post Request
//     $.post("/submit_recital_form", submission_values, function(data, status, jqXHR){
//         console.log("Posted successfully");
//         window.location.href = "/submitted.html";
//     }); 
//   }
// }

// Function for adding a collaborator to the form
function add_collaborator() {
    
    // Create the row HTML for a new collaborator, increment the index of total collaborators, and append to the proper div
    var collaborator_text = `<div class="row top-buffer">
    <div class="col-md-2">
      <label for="">
        <b>Collaborator Name:</b>
      </label>
    </div>
    <div class="col-md-4">
      <input type="text" id="collaborator_${collaborator_index}_name" name="collaborator_${collaborator_index}_name">
    </div>

    <div class="col-md-2">
      <label for="">
        <b>Collaborator Medium:</b>
      </label>
    </div>
    <div class="col-md-4">
      <input type="text" id="collaborator_${collaborator_index}_medium" name="collaborator_${collaborator_index}_medium">
    </div>
  </div>`;


    collaborator_index++;

    $("#collaborators_section").append(collaborator_text);
}

function add_recital_date(id, date, start_time, end_time){
  var option_tag = `<option id=${id}>${date} (${start_time} - ${end_time}</option>`;
  $("#date").append(option_tag);
}


$(document).ready(() => {
  $.get("/get-recitals", (data, status) => {
    for(var i=0; i<data.length; i++){
      recital_date = data[i];
      add_recital_date(recital_date["id"], recital_date["date"], recital_date["startTime"], recital_date["endTime"]);
    }
  });
});