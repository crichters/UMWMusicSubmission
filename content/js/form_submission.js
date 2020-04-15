// form_submission.js
// Containing functions pertaining to the recital forms and their submissions
// JQuery is required to make use of this file

// Global Variable for keeping track of how many collaborators have been added.
var collaborator_index = 0;
var collaborator_list = [];

// Function for sending form data to Express Backend
// Sends POST request containing a map to /submit_recital_form
$("form").submit((event) => {

  if(!$("#g-recaptcha-response").val() === ""){

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

    // Get the recital date from the selection box and add that to the map
    submission_values["recital_date"] = $("#date option:selected").attr('id');

    submission_values["collaborators"] = get_collaborators();

    // Send Post Request
    $.post("/submit_recital_form", submission_values, function(data, status, jqXHR){
        console.log("Posted successfully");
        window.location.href = "/submitted.html";
    }); 
  }
});


// Function for adding a collaborator to the form
function add_collaborator() {
    
    // Create the row HTML for a new collaborator, increment the index of total collaborators, and append to the proper div
    var collaborator_text = `<div class="row top-buffer" id="collaborator_${collaborator_index}">
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
    <div class="col-md-3">
      <input type="text" id="collaborator_${collaborator_index}_medium" name="collaborator_${collaborator_index}_medium">
    </div>
    <div class="col-md-1">
    <a href="javascript:void(0)" onclick="remove_collaborator(${collaborator_index});" data-toggle="tooltip" title="Remove Collaborator">
    <svg class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="gray" xmlns="http://www.w3.org/2000/svg">
         <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
    </svg>
    </a>
    </div>
  </div>`;

    collaborator_list.push(collaborator_index);
    collaborator_index++;
    $("#collaborators_section").append(collaborator_text);
}

function add_recital_date(id, date, start_time, end_time){
  var option_tag = `<option id=${id}>${date} (${start_time} - ${end_time}</option>`;
  $("#date").append(option_tag);
}


function remove_collaborator(index) {

  for(var i=0; i<collaborator_list.length; i++){
    if(collaborator_list[i] == index){
      collaborator_list.splice(i, 1);
    }
  }
  console.log(collaborator_list);
  $(`#collaborator_${index}`).remove();
}

function get_collaborators() {

  return_list = [];

  collaborator_list.forEach((item, index) => {
    collaborator_name_id = `#collaborator_${item}_name`;
    collaborator_medium_id = `#collaborator_${item}_medium`;
    collaborator = {"collaborator_name": $(collaborator_name_id).val(), "collaborator_medium": $(collaborator_medium_id).val()};

    return_list.push(collaborator);
  });

  return return_list;
}

$(document).ready(() => {
  $.get("/get-recitals", (data, status) => {
    for(var i=0; i<data.length; i++){
      recital_date = data[i];
      add_recital_date(recital_date["id"], recital_date["date"], recital_date["startTime"], recital_date["endTime"]);
    }
  });

});