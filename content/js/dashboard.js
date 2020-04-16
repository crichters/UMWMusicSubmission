recitals = [];

function insert_recital(recital_number, recital_title) {
    var recital_table = `
    <div class="row">
    <table class="table" id="recital_${recital_number}">
        <caption>${recital_title}

        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-light btn-sm active">
          <input type="radio" title="Open Recitals" id="openRecital" autocomplete="off" checked> Open
          </label>
          <label class="btn btn-light btn-sm">
          <input type="radio" title="Close Recitals" id="closeRecital" autocomplete="off"> Closed
          </label>
          </div>


        </caption>
        <thead>
            <tr>
                <th scope="col">Status</th>
                <th scope="col">Summary</th>
                <th scope="col">Actions</th>
                <th scope="col"><button class="btn btn-light btn-sm" type="button" title="Edit Recitals" style="float: right;" data-toggle="modal" data-target="#editRecitalsModal">
                <svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z" clip-rule="evenodd"/>
                </svg> Edit</button></th>
            </tr>
        </thead>
    </table>

    <div class="modal fade" id="editRecitalsModal" tabindex="-1" role="dialog" aria-labelledby="editRecitalsLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="editRecitalsLabel">Edit Recitals</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form>
                <div class="modal-body">  
                  
                <div class="form-group row">
                          <label for="inputRecitalDate" class="col-sm-2 col-form-label">Recital Date</label>
                          <div class="col-sm-10">
                            <input class="form-control" id="editRecitalDate" placeholder="Recital Date" type="date">
                          </div>
                        </div>

                        <div class="form-group row">
                          <label for="inputStartTime" class="col-sm-2 col-form-label">Start Time</label>
                          <div class="col-sm-10">
                            <input class="form-control" id="editStartTime" placeholder="Start Time">
                          </div>
                        </div>

                        <div class="form-group row">
                          <label for="inputEndTime" class="col-sm-2 col-form-label">End Time</label>
                          <div class="col-sm-10">
                            <input class="form-control" id="editEndTime" placeholder="End Time">
                          </div>
                        </div>

                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" onClick="edit_recital(${recital_number})">Submit</button>
                </div>
                </form>
              </div>
            </div>
          </div>
</div>


<div class="row">
    <div class="modal fade" id="deleteRecitalModal" tabindex="-1" role="dialog" aria-labelledby="deleteRecitalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="deleteRecitalLabel">Delete Recital</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">

                  Are you sure?

                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-danger" onClick="">Confirm</button>
                </div>
              </div>
            </div>
          </div>
</div>`;

$("#recitals").append(recital_table);
}

function insert_recital_submission(recital_number, status, summary, link) {
    var submission_text = `
    <tr>
        <th scope="row">
            <a href="#" data-toggle="tooltip" title="Approve Submission">
                <svg class="bi bi-check" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="gray" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
            </svg></a>

            <a href="#" data-toggle="tooltip" title="Deny Submission">
            <svg class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="gray" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
            </svg>
            </a>
        </th>
        <td>${summary}</td>
        <td><a type="button" href="javascript:void(0)" data-toggle="modal" data-target="#deleteRecitalModal">Delete</a> <a href="${link}">View</a></td>
        <td></td>
    </tr>
    `;

    var recital_table_id = `#recital_${recital_number}`;
    $(recital_table_id).append(submission_text);

}


function make_test_recitals() {

    for(var i=0; i<3; i++) {
        insert_recital(i, `OPEN Recital: April: ${i} (xxx - xxx)`);

        for(var j = 0; j<3; j++) {
            insert_recital_submission(i, "status", "lorem ipsum", "https://google.com");
        }
    }
}

function create_recital() {
  var recital_date = $('#inputRecitalDate').val();
  var start_time = $('#inputStartTime').val();
  var end_time = $('#inputEndTime').val();

  submission_values = {
    "start_time": start_time,
    "end_time": end_time,
    "date": recital_date
  };

  if(recital_date == "" || start_time == "" || end_time == "") {
    return;
  }

  $.post("/create-recital", submission_values, (data, status, jqXHR) => {
    console.log("Post submitted");
    console.log(data);
    console.log(status);
    // location.reload();
  });
}

function edit_recital(recital_id) {
  var recital_date = $('#editRecitalDate').val();
  var start_time = $('#editStartTime').val();
  var end_time = $('#editEndTime').val();

  submission_values = {};

  submission_values["id"] = recital_id;

  if(recital_date == "" && start_time == "" && end_time == "") {
    return;
  }

  if(recital_date != "") {
    submission_values["date"] = recital_date;
  }

  if(start_time != "") {
    submission_values["start_time"] = start_time;
  }

  if(end_time != "") {
    submission_values["end_time"] = end_time;
  }

  $.post("/edit-recital", submission_values, (data, status, jqXHR) => {
    console.log("Post submitted");
    console.log(data);
    console.log(status);
    // location.reload();
  });
}

$(document).ready(function() {

    $.get("/dashboard-data", (data, status) => {
        for(var i=0; i<data.length; i++){
          recital_date = data[i];
          recitals.push(recital_date);
          insert_recital(recital_date["id"], `OPEN Recital: ${recital_date["date"]} (${recital_date["startTime"]} - ${recital_date["endTime"]})`);
          for(var j=0; j<recital_date["submissions"].length; j++){
              submission = recital_date["submissions"][j];
              var summary = `${submission["name"]}. ${submission["medium"]}. ${submission["title"]}.`;
              var link = `/view_submission.html?name=${submission["name"]}&medium=${submission["medium"]}&title=${submission["title"]}&work=${submission["largerWork"]}`;
              insert_recital_submission(recital_date["id"], "Status", summary, link);
          }
        }
      });

});
