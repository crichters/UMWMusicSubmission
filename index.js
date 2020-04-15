const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const { selectOpenRecitals, selectSubmissionDetailsFor, selectSubmissionsFor, deleteSubmission,
    selectCollaboratorsFor, selectUnarchivedRecitals, updatePassword, insertEmail, insertPassword, checkEmail, checkPassword, insertRecital, insertSubmission } = require('./queries/rsmsdb');

const app = express();

const {keys} = require('./config/config');

app.set("port", 3000);

function checkSession(req, res, next) {
    const validRoutes = ["/login", "/form", "/submit_recital_form", "/get-recitals"]
    const valid = validRoutes.includes(req.path);
    if(req.session.valid != undefined || validRoutes.includes(req.path)) {
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

app.get("/dashboard.html", (req, res) => {
    res.sendFile(directory + '/dashboard.html')
})

app.get("/dashboard-data", async (req, res) => {
    let recitals = await selectOpenRecitals();
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
    const { email_address, password } = req.body;
    let validEmail, validPW;
    try {
        validEmail = await checkEmail(email_address);
    } catch(error) {
        console.log(error);
    }
    //const validPW = await checkPassword(password);
    if(validEmail) {
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
    const email = await insertEmail("simeon.neisler@gmail.com");
    const pw = await insertPassword("Password");
});

app.get("/form", (req, res) => {
    res.sendFile(__dirname + '/content/form.html');
});

app.get("/get-recitals", async (req, res) => {
    const recitals = await selectOpenRecitals();
    res.json(recitals);
});

app.post("/submit_recital_form", async (req, res) => {
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

app.post("/change-email", (req, res) => {

});

app.post("/change-password", (req, res) => {

});

app.get("/logout", (req, res) => {
    req.session.email = null;
    res.redirect("/login");
});

app.listen(process.env.PORT || app.get("port"), process.env.IP, (req, res) => {
    console.log("Server started");
});

