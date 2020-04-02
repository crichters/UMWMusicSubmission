const express = require('express');
const bodyParser = require('body-parser');
const { selectOpenRecitals, selectSubmissionDetailsFor, selectSubmissionsFor,
    selectCollaboratorsFor, selectUnarchivedRecitals, insertRecital, insertSubmission } = require('./queries/rsmsdb');

const app = express();

const {keys} = require('./config/config');

app.set("port", 3000);

app.use(express.static('content'));
app.use(bodyParser.json({type: "application/json"}));
app.use(bodyParser.urlencoded({extended: true}));

const directory = __dirname + '/content';

app.get("/", (req, res) => {
    res.sendFile(directory + '/template.html');
});

//This is a get request that simply returns the login page
app.get("/login-page", (req, res) => {
    res.sendFile(directory + '/login_page.html');
});

app.get("/dashboard", (req, res) => {
    res.sendFile(directory + '/dashboard.html')
});

app.get("/dashboard-data", async (req, res) => {
    let recitals = await selectOpenRecitals();
    let promises = [];
    recitals.forEach((recital) => {
        promises.push(selectSubmissionsFor(recital.id));
    });
    let submissions = await Promise.all(promises);
    let i = -1;
    console.log(submissions);
    recitals = recitals.map((recital) => {
        i++;
        return {
            ...recital,
            submissions: submissions[i]
        }
    });
    console.log(recitals);
    res.json(recitals);
});

//This get request is used to actually sign the user in.
app.get("/login", (req, res) => {

});

app.get("/form", (req, res) => {
    res.sendFile(__dirname + '/content/form.html');
});

app.get("/get-recitals", async (req, res) => {
    const recitals = await selectOpenRecitals();
    res.json(recitals);

});

app.post("/submit_recital_form", async (req, res) => {
    /*if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
    {
      return res.json({"responseError" : "Please select captcha first"});
    }
  
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + keys.captchaPrivate + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  
    request(verificationURL, (error,response,body) => {
      body = JSON.parse(body);
  
      if(body.success !== undefined && !body.success) {
        return res.json({"responseError" : "Failed captcha verification"});
      }
    });*/
    let {name, medium, duration, selection_title, selection_work, catalog_number, movement, email, composer_name, composer_birth, composer_death, schedule_requirements, technical_requirements, collaborators, recital_date} = req.body;
    console.log(req.body);
    collaborators = collaborators.map((c) => {
        return {
            name: c.collaborator_name,
            medium: c.collaborator_medium
        }
    });
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
    const response = await insertSubmission(submission, performer, collaborators, recital_date);
    res.sendFile(directory +'/submitted.html');
});

app.get("/create-recital", (req, res) => {

});

app.get("/get-submissions", async (req, res) => {

});

app.post("/create-recital", (req, res) => {

});

app.post("/change-email", (req, res) => {

});

app.post("/change-password", (req, res) => {

});

app.get("/logout", (req, res) => {

});

app.listen(process.env.PORT || app.get("port"), process.env.IP, (req, res) => {
    console.log("Server started");
});

