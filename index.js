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

rsmsdb.insertSubmission(submission, performer, collaborators, 2);
