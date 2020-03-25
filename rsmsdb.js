const Sequelize = require('sequelize');
var config = require('./config');
const db = new Sequelize(`mysql://${config.username}:${config.password}@localhost:3306/${config.database}`);

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

insertRecital({date:"2020-08-01", start_time:"14:00:00", end_time:"15:00:00"});

/**
 * Returns a list of active recital objects.
 * Objects contain the recital id (int), date (string), 
 * endTime (string) and startTime (string).
 */
function selectOpenRecitals() {
    db.query("SELECT id, " + 
                    "DATE_FORMAT(date, '%M %e, %Y') as date, " + 
                    "TIME_FORMAT(start_time, '%h:%i %p') as startTime, " +
                    "TIME_FORMAT(end_time, '%h:%i %p') as endTime " + 
            "FROM recital WHERE NOT is_closed"
    , { type: db.QueryTypes.SELECT})
  .then(recitals => {
      console.log("Open recitals:", JSON.stringify(recitals, null, 4))
   });
};

/**
 * Returns a list of recital objects that
 * appear in the dashboard. Objects contain
 * the recital id (int), date (string), endTime (string), 
 * startTime (string) and isClosed status (boolean).
 */
function selectUnarchivedRecitals() {
    db.query("SELECT id, " + 
                    "DATE_FORMAT(date, '%M %e, %Y') as date, " + 
                    "TIME_FORMAT(start_time, '%h:%i %p') as startTime, " +
                    "TIME_FORMAT(end_time, '%h:%i %p') as endTime, " +
                    "is_closed as isClosed " +
            "FROM recital WHERE NOT is_archived"
    , { type: db.QueryTypes.SELECT})
  .then(recitals => {
    console.log("Dashboard recitals:", JSON.stringify(recitals, null, 4))
  });
};

/**
 * Returns list of submission objects for a given
 * recital. Objects contain submission id, performer name,
 * medium, title, largerWork (null if not specified) and status.
 * @param {int} recitalId - The recital's pk. 
 */
function selectSubmissionsFor(recitalId) {
    db.query("SELECT sub.id, " +
                "sub.larger_work AS largerWork, " +
                "sub.title, " +
                "performer.name, " +
                "performer.medium " + 
            "FROM submission AS sub " +
            "NATURAL JOIN recital_submissions " +
            "INNER JOIN submission_performers AS performers " +
                "ON sub.id = performers.submission_id " +
            "INNER JOIN performer " +
                "ON performers.performer_id = performer.id " +
            "WHERE NOT performers.is_collaborator " +
            `AND recital_id = ${recitalId}`
    , { type: db.QueryTypes.SELECT})
  .then(submissions => {
    console.log("Submissions:", JSON.stringify(submissions, null, 4));
  });
}

/**
 * Returns submission object for submission of given
 * id. Object contains all attributes of submission,
 * including fields that were left blank.
 * @param {int} submissionId - The submission's pk.
 */
function selectSubmissionDetailsFor(submissionId) {
    db.query("SELECT sub.duration, " +
                    "sub.title, " +
                    "sub.larger_work, " +
                    "sub.email, " +
                    "sub.composer_name, " +
                    "sub.composer_birth_year, " +
                    "sub.composer_death_year, " +
                    "sub.catalog_num," +
                    "sub.scheduling_req, " +
                    "sub.tech_req, " +
                    "sub.movement, " +
                    "recital.date, " +
                    "perf.name," +
                    "perf.medium " +
            "FROM submission AS sub " +
            "NATURAL JOIN recital " +
            "NATURAL JOIN submission_performers AS perfs " +
            "INNER JOIN performer AS perf " +
                "ON perfs.performer_id = perf.id " +
            "WHERE NOT perfs.is_collaborator " +
            `AND sub.id = ${submissionId}`
    , { type: db.QueryTypes.SELECT})

  .then(submissions => {
    submissions.map(submission => {
        db.query("SELECT perf.name, perf.medium FROM submission_performers AS perfs " + 
                 "INNER JOIN performer AS perf " +
                    "ON perfs.performer_id = perf.id " +
                `WHERE perfs.submission_id = ${submissionId} ` +
                "AND perfs.is_collaborator", {type: db.QueryTypes.SELECT})
        .then(collaborators => {
            submission.collaborators = collaborators;
            console.log("Submissions:", JSON.stringify(submissions, null, 4));
        });
    });
  });
}

/**
 * Insert submission into rsms db for a given recital.
 * @param {Object} submission - The submission details. 
 * @param {Object[]} collaborators - A list of collaborator objects.
 * @param {int} recitalId - The recital's pk.
 */
function insertSubmission(submission, collaborators, recitalId) {
};

/*
* Insert passed recital object into rsms db. Recital
* objected should contain date (YYYY-MM-DD), end_time
* (HH:mm:ss) and start_time (HH:mm:ss).
*/
function insertRecital(recital) {
};

module.exports = {selectOpenRecitals, selectSubmissionDetailsFor, selectSubmissionsFor,
        selectUnarchivedRecitals, insertRecital, insertSubmission};