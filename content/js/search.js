function add_result(submission_id, summary, status, recital_date, logged_in) {
    recital_row = `<tr>
        <td>${summary}</td>
        <td>${status}</td>
        <td>${recital_date}</td>
        <td>
        <a href="/view_submission.html?id=${submission_id}" title="View" onclick=""><i class="fa fa-eye" style="padding-right: 10px;"></i></a>
        ${(logged_in) ? '<a  href="javascript:void(0)" title="Delete" onclick=""><i class="fa fa-trash" style="color: red;"></i></a>' : ''}
        </td>
    </tr>`;
    $("#recitalTable").append(recital_row);
};

$('#search_form').submit((e) => {
   search();
    e.preventDefault();
});

function search() {
    let search_phrase = $('#search_phrase').val();
    let search_status = $('#search_status').val();
    let search_date = $('#search_date').val();

    if(search_phrase === "") {
        search_phrase = null;
    }

    if(search_date === "") {
        search_date = null;
    }

    search_status = parseInt(search_status);

    switch(search_status) {
        case 0:
            search_status = ["unreviewed", "accepted", "rejected"];
            break;
        case 1:
            search_status = ["accepted"];
            break;
        case 2:
            search_status = ["rejected"];
            break;
        case 3:
            search_status = ["unreviewed"];
            break;
    }

    submission_values = {phrase: search_phrase, status: search_status, date: search_date};

    $.post(`/search`, submission_values, (data, status, jqXHR) => {
        let search_results = data["search_results"];
        let is_logged_in = data["is_logged_in"];
        $('#recitalTable').html("");
        for(var i = 0; i < search_results.length; i++){
            let submission_id = search_results[i]["id"];
            let summary = `${search_results[i]["name"]}. ${search_results[i]["medium"]}. ${search_results[i]["title"]}`;
            let status = search_results[i]["status"];
            let recital_date = search_results[i]["date"];
            add_result(submission_id, summary, status, recital_date, is_logged_in);
        }
    });
    $('#search_phrase').val("");
    $('#search_status').val(0);
    $('#search_date').val("");
}


$(document).ready(function() {

    submission_values = {phrase: null, status: ["unreviewed", "accepted", "rejected"], date: null};

    $.post(`/search`, submission_values, (data, status, jqXHR) => {
        let search_results = data["search_results"];
        let is_logged_in = data["is_logged_in"];
        for(var i = 0; i < search_results.length; i++){
            let submission_id = search_results[i]["id"];
            let summary = `${search_results[i]["name"]}. ${search_results[i]["medium"]}. ${search_results[i]["title"]}`;
            let status = search_results[i]["status"];
            let recital_date = search_results[i]["date"];
            add_result(submission_id, summary, status, recital_date, is_logged_in);
        }
    });

});