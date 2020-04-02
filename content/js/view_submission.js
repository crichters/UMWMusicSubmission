$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return "<i>Not Specified.</i>";
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

function fill_table() {

    $("#name").append($.urlParam("name"));
    $("#email").append($.urlParam("email"));
    $("#date").append($.urlParam("date"));
    $("#medium").append($.urlParam("medium"));
    $("#title").append($.urlParam("title"));
    $("#work").append($.urlParam("work"));
    $("#cat_num").append($.urlParam("cat_num"));
    $("#movement").append($.urlParam("movement"));
    $("#duration").append($.urlParam("duration"));
    $("#collaborators").append($.urlParam("collaborators"));
    $("#com_birth").append($.urlParam("com_birth"));
    $("#com_death").append($.urlParam("com_death"));
    $("#tech_req").append($.urlParam("tech_req"));
    $("#sched_req").append($.urlParam("sched_req"));
}

$(document).ready(() => {
    console.log("Ready!");

    console.log($.urlParam("name"));
    fill_table();
});