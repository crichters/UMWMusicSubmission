function insert_recital(recital_number, recital_title) {
    var recital_table = `
    <div class="row">
    <table class="table" id="recital_${recital_number}">
        <caption>${recital_title}
        </caption>
        <thead>
            <tr>
                <th scope="col">Status</th>
                <th scope="col">Summary</th>
                <th scope="col">Actions</th>
                <th scope="col">
                <a style="float: right; data-toggle="tooltip" data-placement="top" title="Delete Recital" onclick="delete_recital(${recital_number})">
                <svg class="bi bi-trash-fill" width="1.25em" height="1.25em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
                </svg>
                </a>
                </th>
            </tr>
        </thead>
    </table>
</div>`;

    $("#recitals").append(recital_table);
}

function insert_recital_submission(recital_number, status, summary, link, id) {
    console.log(status);
    var submission_text = `
    <tr>
        <th scope="row">
            <a href="#" data-toggle="tooltip" title="Approve Submission" onclick="${"set_submission_status(" + id + ", " + ((status == "approved") ? "'unreviewed'" : "'approved'")});">
                <svg class="bi bi-check" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="${((status == "approved") ? "green" : "gray")}" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
            </svg></a>

            <a href="#" data-toggle="tooltip" title="Deny Submission" onclick="${"set_submission_status(" + id + ", " + ((status == "denied") ? "'unreviewed'" : "'denied'")});">
            <svg class="bi bi-x" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="${((status == "denied") ? "red" : "gray")}" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
            </svg>
            </a>
        </th>
        <td>${summary}</td>
        <td><a type="button" href="javascript:void(0)" data-toggle="modal" data-target="#deleteRecitalModal" onclick="delete_submission(${id});">Delete</a> <a href="${link}">View</a></td>
        <td></td>
    </tr>
    `;

    var recital_table_id = `#recital_${recital_number}`;
    $(recital_table_id).append(submission_text);

}

function delete_recital(recital_id) {
    console.log(recital_id);
    submission_values = {recital_id: recital_id};
    $.post("/delete-recital", submission_values, (data, success) => {
        location.reload();
    });
}

function set_submission_status(submission_id, submission_status) {
    submission_values = {submission_id, submission_status};
    $.post("/update-submission-status", submission_values, (data, status, jqXHR) =>{
        console.log(data);
        console.log(status);
        location.reload();
    });
}

function delete_recitals_before(date) {
    console.log(date);
}

$('#delete_before_date_button').click( () => {
    let selected_date = $('#selectYear').val();
    if(selected_date === ""){
        return;
    } else {
        delete_recitals_before(selected_date);
    }
});

$(document).ready(function() {

    $.get("/get-archived", (data, status) => {

        data = data.sort((a, b) => (Date.parse(a["date"]) > Date.parse(b["date"])) ? 1: -1);
        for(let i = 0; i < data.length; i++) {
            let current_recital = data[i];
            let recital_id = current_recital["id"];
            recital_name = `${(current_recital["isClosed"] === 0) ? "OPEN" : "CLOSED"} Recital: ${current_recital["date"]} (${current_recital["startTime"]} - ${current_recital["endTime"]})`;
            insert_recital(recital_id, recital_name);
            current_recital["submissions"].forEach((submission) => {
                let summary = `${submission["name"]}. ${submission["medium"]}. ${submission["title"]}.`;
                let link = `/view_submission.html?id=${submission["id"]}`;
               insert_recital_submission(recital_id, submission["status"], summary, link, submission["id"]);
            });
        }
    });
});