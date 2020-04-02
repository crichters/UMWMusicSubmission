function insert_recital(recital_number, recital_title) {
    var recital_table = `
    <div class="row">
    <table class="table" id="recital_${recital_number}">
        <caption>${recital_title}</caption>
        <thead>
            <tr>
                <th scope="col">Status</th>
                <th scope="col">Summary</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
    </table>
</div>`;

$("#recitals").append(recital_table);
}

function insert_recital_submission(recital_number, status, summary, link) {
    var submission_text = `
    <tr>
        <th scope="row">
            <a href="#"><svg class="bi bi-check" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="gray" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
            </svg></a>
            <a href="#">
                <svg class="bi bi-x" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="gray" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                    <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
                </svg>
            </a>
        </th>
        <td>${summary}</td>
        <td><a href="#">Delete</a> <a href="#">View</a></td>
    </tr>
    `;

    var recital_table_id = `#recital_${recital_number}`;
    $(recital_table_id).append(submission_text);

}


$(document).ready(function() {

    $.get("/dashboard-data", (data, status) => {
        for(var i=0; i<data.length; i++){
          recital_date = data[i];
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

