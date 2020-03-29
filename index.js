const rsmsdb = require('./queries/rsmsdb');

const submission = {
	duration : 3,
	title: "March", 
	largerWork: "Star Wars", 
	email: "email@mail.umw.edu", 
	composerName: "John Williams", 
	composerBirthYear: 1932, 
	composerDeathYear: null, 
	catalogNum: "No. 1",
	schedulingReq: null, 
	techReq: "Need chair and music stand", 
	movement: null
};

const performer = {
	name: "John Smith",
	medium: "guitar"
};

const collaborators = [
	{
		name: "Yoda",
		medium: "flute"
	},
	{	
		name: "Han Solo",
		medium: "piano"
	}
];

const recital = {	
	date: "2020-04-20",
	end_time: "14:45:00",
	start_time: "12:30:00"
};


rsmsdb.selectOpenRecitals()
.then(openRecitals => {
	console.log("Open recitals:", JSON.stringify(openRecitals, null, 4));
	var recitalId = openRecitals[0].id;

	// insert submission, performer and collaborator objects into database.
	rsmsdb.insertSubmission(submission, performer, collaborators, recitalId);

	// insert recital
	rsmsdb.insertRecital(recital);
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


rsmsdb.selectSubmissionDetailsFor(5)
.then(details => {
	// do something to resulting submission details object.
	console.log("Submission details:", JSON.stringify(details[0], null, 4));
})
.catch(err => {
	console.error('Unable to find submission:', err);
});

rsmsdb.selectCollaboratorsFor(5)
.then(collaborators => {
	// do something to resulting submission collaborators list.
	console.log("Submission collaborators:", JSON.stringify(collaborators, null, 4));
})
.catch(err => {
	console.error('Unable to find collaborators:', err);
});
