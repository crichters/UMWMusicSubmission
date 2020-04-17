const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');

const { selectOpenRecitals, selectSubmissionDetailsFor, selectSubmissionsFor, deleteSubmission, updateRecital,
    selectCollaboratorsFor, selectUnarchivedRecitals, 
    updateRecitalStatus, updateSubmissionStatus, updatePassword, deleteEmail, selectEmails, insertEmail, insertPassword, checkEmail, checkPassword, insertRecital, insertSubmission } = require('./queries/rsmsdb');

const app = express();

const {keys} = require('./config/config');

app.set("port", 3000);

function checkSession(req, res, next) {
    const validRoutes = ["/login", "/form", "/submit_recital_form", "/get-recitals", "/credentials"]
    const valid = validRoutes.includes(req.path);
    if(req.session.valid || validRoutes.includes(req.path)) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.use(express.static('content'));
app.use(bodyParser.json({type: "application/json"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "secret"}));
app.all("*", checkSession);

const directory = __dirname + '/content';

app.get("/", (req, res) => {
    res.sendFile(directory + '/dashboard.html')
});

//This is a get request that simply returns the login page
app.get("/login", (req, res) => {
    res.sendFile(directory + '/login_page.html');
});

app.get("/dashboard", (req, res) => {

    res.sendFile(directory + '/dashboard.html')
});

app.get("/account-settings", (req, res) => {
    res.sendFile(directory + '/account_settings.html');
});

app.get("/dashboard-data", async (req, res) => {
    let recitals = await selectUnarchivedRecitals();
    let promises = [];
    recitals.forEach((recital) => {
        promises.push(selectSubmissionsFor(recital.id));
    });
    let submissions = await Promise.all(promises);
    let i = -1;
    recitals = recitals.map((recital) => {
        i++;
        return {
            ...recital,
            submissions: submissions[i]
        }
    });
    res.json(recitals);
});

/*app.delete("/recital", async (req, res) => {
    const {id} = req.body;
    const deleted = await 
});*/

//This get request is used to actually sign the user in.
app.post("/login", async (req, res) => {
    console.log(req.body)
    const { email_address, password } = req.body;
    let validEmail, validPW;
    try {
        validEmail = await checkEmail(email_address);
    } catch(error) {
        console.log(error);
    }
    try {
        validPW = await checkPassword(password);
    } catch (err) {
        console.log(err);
    }
    if(validEmail && validPW) {
        req.session.valid = true;
        res.redirect("/dashboard");
    } else {
        req.session.valid = false;
        res.send({
            status: "error",
            message: "Invalid email/password combination"
        });
    }
});

app.get("/credentials", async (req, res) => {
    const pw = await insertPassword("Password");
});

app.get("/form", (req, res) => {
    res.sendFile(__dirname + '/content/form.html');
});

app.get("/get-recitals", async (req, res) => {
    const recitals = await selectOpenRecitals();
    res.json(recitals);
});

app.post("/get-submission-by-id", async (req, res) => {
    var submissionId = req.body["id"];
    console.log(req.body);
    results = await selectSubmissionDetailsFor(submissionId);
    res.send(results);
})

app.post("/submit_recital_form", async (req, res) => {
    console.log(req.body);
    console.log(req.params)
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
    {
        return res.json({"responseError" : "Please select captcha first"});
    }
  
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + keys.captchaPrivate + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  
    request(verificationURL, (error,response,body) => {
      body = JSON.parse(body);
  
      if(body.success !== undefined && !body.success) {
        return res.json({"responseError" : "Failed captcha verification"});
      }
    });
    let {name, medium, duration, selection_title, selection_work, catalog_number, movement, email, composer_name, composer_birth, composer_death, schedule_requirements, technical_requirements, collaborators, recital_date} = req.body;
    if(collaborators) {
        collaborators = collaborators.map((c) => {
            return {
                name: c.collaborator_name,
                medium: c.collaborator_medium
            }
        });
    } else {
        collaborators = []
    }
    const performer = {
        name,
        medium
    }
    const submission = {
        duration: duration,
        title: selection_title,
        largerWork: selection_work,
        email, 
        composerName: composer_name,
        composerBirthYear: composer_birth, 
        composerDeathYear: composer_death,
        catalogNum: catalog_number,
        schedulingReq: schedule_requirements,
        techReq: technical_requirements,
        movement
    };
    for (property in submission) {
        if(submission[property] == '' || submission[property == ""]) {
            submission[property] = null;
        }
    }
    const response = await insertSubmission(submission, performer, collaborators, recital_date);
    res.sendFile(directory +'/submitted.html');
});

app.post("/delete-submission", async (req, res) => {
    submission_id = req.body["submission_id"];
    console.log("Deleting:" + submission_id);
    var deleted = await deleteSubmission(submission_id);
    res.send(deleted);
});

app.delete("/submission", async (req, res) => {
    const { submission_id } = req.body;
    let deleted;
    try {
        deleted = await deleteSubmission(submission_id);
    } catch(err) {
        res.send(err);
    }
});


app.post("/create-recital", async (req, res) => {
    let {date, start_time, end_time} = req.body;
    const recital = {
        date,
        start_time,
        end_time
    };
    let inserted;
    try {
        inserted = await insertRecital(recital);
        res.redirect("/dashboard");
    } catch (err) {
        res.send(err);
    }
});

app.post("/edit-recital", async (req, res) => {
    let {id, date, start_time, end_time} = req.body;
    const recitals = await selectOpenRecitals();
    const newRecital = {date, start_time, end_time};
    for(let i = 0; i < recitals.length; i++) {
        recital = recitals[i]
        if(recital.id == id) {
            if(date == null || date == undefined) {
                date = new Date(recital.date);
                date = date.toISOString().split('T')[0];
                newRecital.date = date;
            }
            if(start_time == null || start_time == undefined) {
                newRecital.start_time = recital.startTime.split(" ")[0]
            }
            if(end_time == null || end_time == undefined) {
                newRecital.end_time = recital.endTime.split(" ")[0]
            }
            break;
        }
    }
    const updated = updateRecital(id, newRecital);
    res.send(updated);
});

app.post("/update-recital-status", async (req, res) => {
    var recitalId = req.body["recital_id"];
    var closed = req.body["open"];
    const isclosed = await updateRecitalStatus(recitalId, closed == "false");
    res.send(isclosed);
});

app.post("/update-submission-status", async (req, res) => {

    var submission_id = req.body["submission_id"];
    var status = req.body["submission_status"];
    const ischanged = await updateSubmissionStatus(submission_id, status);
    res.send(ischanged);
});

app.get("/emails", async (req, res) => {
    const emails = await selectEmails();
    res.json(emails);
});

app.post("/email", async (req, res) => {
    const {email} = req.body;
    const inserted = await insertEmail(email);
})

app.delete("/email", async (req, res) => {
    const {email_id} = req.body;
    const emails = await selectEmails();
    if(emails.length > 1) {
        const deleted = await deleteEmail(email_id);
    } else {
        res.json({status: "error", message: "Need more than one email before deleting an email"});
    }
});

app.post("/change-password", async (req, res) => {
    const {old_password, new_password} = req.body;
    if(checkPassword(old_password)) {
        try {
            const updated = await updatePassword(new_password);
            res.send(true);
        } catch {
            res.send(false);
        }
    } else {
        res.send(false);
    }
});

app.get("/logout", (req, res) => {
    req.session.valid = false;
    res.redirect("/login");
});

app.listen(process.env.PORT || app.get("port"), process.env.IP, (req, res) => {
    console.log("Server started");
});

