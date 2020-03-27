const rsmsdb = require('./queries/rsmsdb');

const submission = {
	"duration": 3,
	"title": "March", 
	"larger_work": "Star Wars", 
	"email": "email@mail.umw.edu", 
	"composer_name": "John Williams", 
	"composer_birth_year": 1932, 
	"composer_death_year": null, 
	"catalog_num": "No. 1",
	"scheduling_req": null, 
	"tech_req": "Need chair and music stand", 
	"movement": null
};

const performer ={
	"name": "John Smith",
	"medium": "guitar"
};

const collaborators =[
	{
		"name": "Yoda",
		"medium": "flute"
	},
	{	
		"name": "Han Solo",
		"medium": "piano"
	}
];

var recitalId;
rsmsdb.selectOpenRecitals()
.then(openRecitals => {
	console.log("Open recitals:", JSON.stringify(openRecitals, null, 4));
	recitalId = openRecitals[0].id;
})
.catch(err => {
	console.error('Unable to find open recitals:', err);
});


rsmsdb.selectUnarchivedRecitals()
.then(openRecitals => {
	console.log("Recitals in dashboard:", JSON.stringify(openRecitals, null, 4));
})
.catch(err => {
	console.error('Unable to find unarchived recitals:', err);
});

// insert submission, performer and collaborator objects into database.
// rsmsdb.insertSubmission(submission, performer, collaborators, recitalId);

rsmsdb.selectSubmissionDetailsFor(5)
.then(details => {
	// do something resulting submission details object.
	console.log("Submission details:", JSON.stringify(details[0], null, 4));
})
.catch(err => {
	console.error('Unable to find submission:', err);
});

rsmsdb.selectCollaboratorsFor(5)
.then(collaborators => {
	// do something resulting submission collaborators list.
	console.log("Submission collaborators:", JSON.stringify(collaborators, null, 4));
})
.catch(err => {
	console.error('Unable to find collaborators:', err);
});