sub_status ="";

$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return "<i>Not Specified.</i>";
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

function fill_table(data) {

    $("#name").append(data["name"]);
    $("#email").append(data["email"]);
    $("#date").append(data["date"]);
    $("#medium").append(data["medium"]);
    $("#title").append(data["title"]);
    $("#work").append(data["largerWork"]);
    $("#cat_num").append(data["catalogNum"]);
    $("#movement").append(data["movement"]);
    $("#duration").append(data["duration"] + " minutes");
    $("#collaborators").append(data[""]);
    $("#com_birth").append(data["composerBirthYear"]);
    $("#com_death").append(data["composerDeathYear"]);
    $("#tech_req").append(data["techReq"]);
    $("#sched_req").append(data["schedulingReq"]);

    let collaborator_names = "";

    for(let i = 0; i < data["collaborators"].length; i++) {
        collaborator_names = collaborator_names + data["collaborators"][i]["name"] + ". " + data["collaborators"][i]["medium"] +((i == data["collaborators"].length -1) ? "" : ", ");
    }

    $("#collaborators").append(collaborator_names);
    console.log(data);
}

function set_submission_status(submission_id, submission_status) {
    submission_values = {submission_id, submission_status};
    $.post("/update-submission-status", submission_values, (data, status, jqXHR) =>{
      console.log(data);
      console.log(status);
      location.reload();
    });
  }

  function delete_submission(submission_id) {
    submission_values = {submission_id};
    $.post("/delete-submission", submission_values, (data, status, jqXHR) => {
      console.log(status);
      console.log(data);
      window.location.replace("/dashboard");
    });
  }

$('#trash').click(() => {
    set_submission_status($.urlParam("id"), ((sub_status == "denied") ? "unreviewed" : "denied"));
});

$('#check').click(() => {
    set_submission_status($.urlParam("id"), ((sub_status == "approved") ? "unreviewed" : "approved"));
});

$('#deleteButton').click(() => {
    delete_submission($.urlParam("id"));
});

$(document).ready(() => {
    console.log("Ready!");
    id = $.urlParam("id");
    submission_values = {id};
    $.post(`/get-submission-by-id`, submission_values, (data, status, jqXHR) => {
        
        for(const property in data[0]) {
            if(data[0][property] == null) {

                data[0][property] = "<i>Not Specified.</i>";
            }
        }
        if(data[0]["status"] == "approved") {
            sub_status = "approved"
            $('#check').attr("fill", "green");
            $('#trash').attr("fill", "gray");

        } else if(data[0]["status"] == "denied") {
            sub_status = "denied"
            $('#check').attr("fill", "gray");
            $('#trash').attr("fill", "red");
        } else {
            sub_status = "unreviewed"
            $('#check').attr("fill", "gray");
            $('#trash').attr("fill", "gray");
        }
        fill_table(data[0]);
        console.log(data);
    });
});