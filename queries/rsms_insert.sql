use alexshta_rsms;

insert into recital (date, start_time, end_time) values ("2020-04-06", "19:30:00", "20:30:00");
insert into recital (date, start_time, end_time) values ("2020-04-23", "16:00:00", "17:00:00");

insert into submission (
	duration, 
	title, 
	larger_work, 
	email, 
	composer_name, 
	composer_birth_year, 
	composer_death_year, 
	catalog_num, 
	scheduling_req, 
	tech_req,
	movement,
	recital_id
)
values (
	8,
	"Adagio and Allegro",
	"Sonata",
	"jcook@umw.edu",
	"G.F. Handel",
	1685,
	1759,
	"No. 1",
	null,
	"Need a music stand",
	null,
	1 -- id is the id associated with form's date drop-down menu item
);

insert into recital_submissions (
	recital_id,
	submission_id
)
values (
	1,
	(select last_insert_id())  -- get the id of the submission we just inserted
);

insert into performer (name, medium) values ("Jordan Cooke", "saxophone");
insert into performer (name, medium) values ("Cathy Hopkins", "piano");

insert into submission_performers (
	submission_id,
	performer_id
)
values (
	(select id from submission order by id desc limit 1),
	(select id from performer where name = "Jordan Cooke" and medium = "saxophone")
);

insert into submission_performers (
	submission_id,
	performer_id,
	is_collaborator
)
values (
	(select id from submission order by id desc limit 1),
	(select id from performer where name = "Cathy Hopkins" and medium = "piano"),
	true
);

insert into submission (
	duration, 
	title, 
	larger_work, 
	email, 
	composer_name, 
	composer_birth_year, 
	composer_death_year, 
	catalog_num, 
	scheduling_req, 
	tech_req,
	movement,
	recital_id
)
values (
	3,
	"Here Comes the Sun",
	null,
	"clyman@umw.edu",
	"George Harrison",
	1943,
	2001,
	null,
	"I can't perform after 4:00 because I have soccer.",
	null,
	null,
	1 -- id is the id associated with form's date drop-down menu item
);

insert into recital_submissions (
	recital_id,
	submission_id
)
values (
	1,
	(select last_insert_id())  -- get the id of the submission we just inserted
);

insert into performer (name, medium) values ("Christian Lyman", "guitar");

insert into submission_performers (
	submission_id,
	performer_id
)
values (
	(select id from submission order by id desc limit 1),
	(select id from performer where name = "Christian Lyman" and medium = "guitar")
);

insert into submission (
	duration, 
	title, 
	larger_work, 
	email, 
	composer_name, 
	composer_birth_year, 
	composer_death_year, 
	catalog_num, 
	scheduling_req, 
	tech_req,
	movement,
	recital_id
)
values (
	1,
	"March",
	"Notebook for Anna Magdalena Bach",
	"jshin2@umw.edu",
	"Johann Sebastian Bach",
	1685,
	1750,
	null,
	null,
	null,
	null,
	2 -- id is the id associated with form's date drop-down menu item
);

insert into recital_submissions (
	recital_id,
	submission_id
)
values (
	2,
	(select last_insert_id())  -- get the id of the submission we just inserted
);

insert into performer (name, medium) values ("Julie Shin", "piano");

insert into submission_performers (
	submission_id,
	performer_id
)
values (
	(select id from submission order by id desc limit 1),
	(select id from performer where name = "Julie Shin" and medium = "piano")
);
