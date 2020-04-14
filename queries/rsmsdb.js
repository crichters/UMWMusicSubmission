const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
var {config} = require('./config');  // database connection settings in config.js file
const db = new Sequelize(`mysql://${config.username}:${config.password}@${config.host}:3306/${config.database}`);
const saltRounds = 7;

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    console.error(config);
});

/**
 * Returns a promise to a list of active recital objects.
 * Objects contain the recital id (int), date (string), 
 * endTime (string) and startTime (string).
 */
async function selectOpenRecitals() {
    return db.query("SELECT id, " + 
                    "DATE_FORMAT(date, '%M %e, %Y') as date, " + 
                    "TIME_FORMAT(start_time, '%h:%i %p') as startTime, " +
                    "TIME_FORMAT(end_time, '%h:%i %p') as endTime " + 
            "FROM recital WHERE NOT is_closed"
    , { type: db.QueryTypes.SELECT});
};


/**
 * Returns a promise to a list of recital objects that
 * appear in the dashboard. Objects contain
 * the recital id (int), date (string), endTime (string), 
 * startTime (string) and isClosed status (boolean).
 */
async function selectUnarchivedRecitals() {
    return db.query("SELECT id, " + 
                    "DATE_FORMAT(date, '%M %e, %Y') as date, " + 
                    "TIME_FORMAT(start_time, '%h:%i %p') as startTime, " +
                    "TIME_FORMAT(end_time, '%h:%i %p') as endTime, " +
                    "is_closed as isClosed " +
            "FROM recital WHERE NOT is_archived"
    , { type: db.QueryTypes.SELECT});
};


/**
 * Returns a promise to a list of submission objects for a given
 * recital. Objects contain submission id, performer name,
 * medium, title, largerWork (null if not specified) and status.
 * @param {int} recitalId - The recital's pk. 
 */
async function selectSubmissionsFor(recitalId) {
    return db.query("SELECT sub.id, " +
                "sub.duration, "+
                "sub.title, " +
                "sub.larger_work AS largerWork, " +
                "sub.email, " +
                "sub.composer_name AS composerName, " +
                "sub.composer_birth_year AS composerBirthYear, " +
                "sub.composer_death_year AS composerDeathYear, " +
                "sub.catalog_num AS catalogNum," +
                "sub.scheduling_req AS schedulingReq, " +
                "sub.tech_req AS techReq, " +
                "sub.movement, " +
                "recital.date, "+
                "performer.name, " +
                "performer.medium " + 
            "FROM submission AS sub " +
            "NATURAL JOIN recital_submissions " +
            "INNER JOIN submission_performers AS performers " +
                "ON sub.id = performers.submission_id " +
            "INNER JOIN performer " +
                "ON performers.performer_id = performer.id " +
            "INNER JOIN recital " +
                "ON sub.recital_id = recital.id " +
            "WHERE NOT performers.is_collaborator " +
            `AND recital_id = ${recitalId}`
    , { type: db.QueryTypes.SELECT});
};


/**
 * Returns a promise to a list that contains the single
 * submission object for the submission of given
 * id. Object contains all attributes of submission,
 * including fields that were left blank.
 * @param {int} submissionId - The submission's pk.
 */
async function selectSubmissionDetailsFor(submissionId) {
    return db.query("SELECT sub.duration, " +
                    "sub.title, " +
                    "sub.larger_work AS largerWork, " +
                    "sub.email, " +
                    "sub.composer_name AS composerName, " +
                    "sub.composer_birth_year AS composerBirthYear, " +
                    "sub.composer_death_year AS composerDeathYear, " +
                    "sub.catalog_num AS catalogNum," +
                    "sub.scheduling_req AS schedulingReq, " +
                    "sub.tech_req AS techReq, " +
                    "sub.movement, " +
                    "recital.date, " +
                    "perf.name," +
                    "perf.medium " +
            "FROM submission AS sub " +
            "NATURAL JOIN submission_performers AS perfs " +
            "INNER JOIN performer AS perf " +
                "ON perfs.performer_id = perf.id " +
            "INNER JOIN recital " +
              "ON sub.recital_id = recital.id " +
            "WHERE NOT perfs.is_collaborator " +
            `AND sub.id = ${submissionId}`
    , { type: db.QueryTypes.SELECT});
};


/**
 * Returns a promise to a list of collaborator objects
 * for a given submission id, including each 
 * collaborator name and medium.
 * @param {int} submissionId - The submission's pk.
 */
async function selectCollaboratorsFor(submissionId) {
    return db.query("SELECT perf.name, perf.medium FROM submission_performers AS perfs " + 
             "INNER JOIN performer AS perf " +
                "ON perfs.performer_id = perf.id " +
            `WHERE perfs.submission_id = ${submissionId} ` +
            "AND perfs.is_collaborator", {type: db.QueryTypes.SELECT});
};


/**
 * Insert performers into the performer table. If the performer in the list is not a collaborator
 * (they are the main performer), set isCollaborator to 0.
 * @param {Object[]} collaborators - a list of performer objects, each containing name and medium.
 * @param {boolean} isCollaborator - whether performer list contains only collaborators. 1 for true.
 */
function insertCollaborators(collaborators, isCollaborator) {

  // add all colaborators into performer table.
	for (var x = 0; x < collaborators.length; x++)
	{
		db.query(`INSERT INTO performer (name, medium)`+
		` values("${collaborators[x].name}", "${collaborators[x].medium}");`);
    insertSubmissionPerformers(collaborators[x].name, collaborators[x].medium, isCollaborator);
	}

};


/**
 * Insert Submission_Performer into the submission performer table
 * @param {String} name - The name of the performer.
 * @param {String} medium - The medium of the performer.
 * @param {boolean} isCollaborator - 1 if collaborator, 0 if not.
 */
function insertSubmissionPerformers(name, medium, isCollaborator){

  db.query("INSERT INTO submission_performers (" +
                      "performer_id, " + 
                      "submission_id, " +
                      "is_collaborator" +
                  ") " +
            "VALUES(" +
                      `(SELECT id FROM performer WHERE name = "${name}" AND medium = "${medium}"),`+ 			
                      "(SELECT id FROM submission ORDER BY id DESC LIMIT 1)," +
                      `${isCollaborator}` +
                  ");"
          );

};


/**
 * Insert submission into rsms db for a given recital.
 * @param {Object} submission - The submission details.
 * @param {Object} - The performer object, including their name and medium.
 * @param {Object[]} collaborators - A list of collaborator objects.
 * @param {int} recitalId - The recital's pk.
 */
function insertSubmission(submission, performer, collaborators, recitalId) {

	const { duration,
		      title, 
	        largerWork, 
          email, 
          composerName, 
          composerBirthYear, 
          composerDeathYear, 
          catalogNum, 
          schedulingReq, 
          techReq, 
          movement } = submission;

  db.query("INSERT INTO submission (" + 
                        "duration, " +
                        `title, `+
                        `larger_work, `+
                        `email, `+
                        `composer_name, `+
                        `composer_birth_year, `+
                        `composer_death_year, `+
                        `catalog_num, `+
                        `scheduling_req, `+
                        `tech_req, `+
                        `movement, `+
                        `recital_id) `+
            "VALUES (" +
                        `${duration}, ` +
                        `"${title}", ` +
                        `"${largerWork}", ` +
                        `"${email}", ` +
                        `${composerName ? '"' + composerName + '"' : null}, ` +
                        `${composerBirthYear}, ` +
                        `${composerDeathYear}, ` + 
                        `${catalogNum ? '"' + catalogNum + '"' : null}, ` + 
                        `${schedulingReq ? '"' + schedulingReq + '"' : null}, ` +
                        `${techReq ? '"' + techReq + '"' : null}, ` + 
                        `${movement ? '"' + movement + '"' : null}, ` + 
                        `${recitalId}` +
                    ");"
          )
  .then(() => {
    db.query("INSERT INTO recital_submissions (" + 
                          "submission_id, " + 
                          "recital_id" +
                      ") " +
              "VALUES(" +
                        "(SELECT id FROM submission ORDER BY id DESC LIMIT 1)," +
                        `${recitalId}` +
                    ");"
            );

    insertCollaborators([performer], 0);
    insertCollaborators(collaborators, 1);

  });

};


/*
* Insert passed recital object into rsms db. Recital
* object should contain date (YYYY-MM-DD), end_time
* (HH:mm:ss) and start_time (HH:mm:ss).
*/
function insertRecital(recital) {
	const { date, end_time, start_time } = recital;
	db.query(`INSERT INTO recital (date, end_time, start_time) `+
		`VALUES("${date}","${end_time}","${start_time}");`);

};


/**
 * Update recital of the given id.
 * @param {int} recitalId - the pk for the recital. 
 * @param {Object} recital - the recital object with updated information. 
 */
function updateRecital(recitalId, recital) {
  const { date, end_time, start_time } = recital;
  db.query(`UPDATE recital SET date = "${date}", 
                              end_time = "${end_time}", 
                              start_time = "${start_time}" 
            WHERE id = ${recitalId};`);
};


/**
 * Helper function to add new password.
 * @param {String} password - the plain-text password to add.
 */
function insertPassword(password) {
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      console.error("Cannot insert password: " + err);
    }
    db.query(`INSERT INTO faculty_member (password) VALUES("${hash}");`);
  });
};


/**
 * Update the current password with the given password.
 * @param {String} password - the plain-text password. 
 */
function updatePassword(password) {
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      console.error("Cannot update password: " + err);
    }
    db.query(`UPDATE faculty_member SET password="${hash}" WHERE id=1;`);
  });
};


/**
 * Returns a promise to a boolean that stores whether or 
 * not the given password is valid.
 * @param {String} password - the password entered. 
 */
async function checkPassword(password) {
  return new Promise((resolve, error) => {
    db.query(`SELECT password FROM faculty_member WHERE id=1`, {type: db.QueryTypes.SELECT}).then(currPassword => {
      bcrypt.compare(password, currPassword[0]["password"], function(err, result) {
        if (err) {
          return error(err);
        }
        resolve(result);
      });
    });
  });
};


/**
 * Inserts the email into the faculty_email database
 * @param {String} email - the email entered
 */
function insertEmail(email)
{
  db.query(`INSERT INTO faculty_emails (email) VALUES('${email}');`);
};


/**
 * Returns a promise to a boolean that stores whether
 * or not the provided email is valid.
 * @param {String} email - the faculty email.
 */
async function checkEmail(email) {
  return new Promise((resolve, error) => {
    db.query(`SELECT EXISTS(SELECT * FROM faculty_emails WHERE email="${email}") AS isValid;`)
    .then(email => {
      resolve(email[0][0].isValid);  // extracts boolean from resulting query object.
    })
    .catch(err => {
      error(err);
    });
  });
};


/**
 * Returns a promise to a list of all 
 * faculty emails in the database. Each element
 * is an object with id and email.
 */
async function selectEmails() {
  return db.query(`SELECT * FROM faculty_emails`,
    {type: db.QueryTypes.SELECT});
}


/**
 * Returns a promise to a boolean indicating 
 * if the email with the given id has been successfully
 * deleted. If false, the email cannot be deleted because
 * at least one email must exist in the database.
 * @param {int} emailId - the email's pk. 
 */
async function deleteEmail(emailId) {
  return new Promise((resolve, error) => {
    db.query("SELECT COUNT(email) AS total FROM faculty_emails;")
    .then(emails => {
      // if total emails greater than 1
      if (emails[0][0].total > 1) {
        db.query(`DELETE FROM faculty_emails WHERE id=${emailId};`);
        resolve(true);
      }
      resolve(false);
    })
    .catch(err => error(err))
  });
}


/**
 * Deletes a submission based on the given submission id from the database
 * @param {Int} submission_id - id of the submission to be deleted
 */
function deleteSubmission(submission_id)
{
  db.query(`DELETE FROM submission WHERE id=${submission_id};`);
  db.query(`DELETE FROM submission_performers WHERE submission_id=${submission_id};`);
  db.query(`DELETE FROM recital_submissions WHERE submission_id=${submission_id};`);

};


/**
 * Given the recital id, it updates the status of if the recital is open or not
 * @param {Int} recital_id - id of the recital to update
 * @param {Boolean} isClosed - boolean value of if the recital is closed or not
 */
function updateRecitalStatus(recital_id, isClosed)
{
  db.query(`UPDATE recital SET is_closed=${isClosed} WHERE id=${recital_id};`);
};


/**
 * Updates the status to be either approved or denied given an id
 * @param {Int} submission_id - id of the submission to update
 * @param {String} status - either approved or denied
 */
function updateSubmissionStatus(submission_id, status)
{
  db.query(`UPDATE submission SET status="${status}" WHERE id=${submission_id};`);
};


module.exports = {selectOpenRecitals, selectSubmissionDetailsFor, selectSubmissionsFor,
        selectCollaboratorsFor, selectUnarchivedRecitals, insertRecital, insertSubmission,
        updateRecital, updatePassword, checkPassword, insertEmail, deleteSubmission,
        updateRecitalStatus, updateSubmissionStatus, checkEmail, selectEmails, deleteEmail};
