USE umwrecit_rsms;

CREATE TABLE faculty_member (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	password CHAR(60) BINARY NOT NULL
);

CREATE TABLE faculty_emails (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE recital (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	date DATE NOT NULL,
	end_time TIME NOT NULL,
	is_closed BOOLEAN NOT NULL DEFAULT FALSE,
	is_archived BOOLEAN NOT NULL DEFAULT FALSE,
	start_time TIME NOT null,
	CONSTRAINT time_unique
		UNIQUE(date, start_time, end_time)
);

CREATE TABLE submission (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	recital_id INT NOT NULL,
	CONSTRAINT sub_recital_id_fk
		FOREIGN KEY (recital_id)
		REFERENCES recital (id),
	duration INT NOT NULL,
	title VARCHAR(50) NOT NULL,
	larger_work VARCHAR(50),
	email VARCHAR(50) NOT NULL,
	composer_name VARCHAR(50),
	composer_birth_year SMALLINT, -- YEAR cannot hold years before 1901
	composer_death_year SMALLINT,
	catalog_num VARCHAR(10),
	movement VARCHAR(50),
	scheduling_req TEXT,
	tech_req TEXT,
	status VARCHAR(15) NOT NULL default 'unreviewed'
);

CREATE TABLE recital_submissions (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	recital_id INT NOT NULL,
	submission_id INT NOT NULL,
	CONSTRAINT re_sub_recital_id_fk
		FOREIGN KEY (recital_id)
		REFERENCES recital (id),
	CONSTRAINT re_sub_submission_id_fk
		FOREIGN KEY (submission_id)
		REFERENCES submission (id)
);

CREATE TABLE performer (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	medium VARCHAR(50) NOT NULL,
	name VARCHAR(50) NOT NULL,
	CONSTRAINT medium_name
		UNIQUE(name, medium)
);

CREATE TABLE submission_performers (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	performer_id INT NOT NULL,
	submission_id INT NOT NULL,
	is_collaborator BOOLEAN NOT NULL default false,
	CONSTRAINT perf_sub_performer_id_fk
		FOREIGN KEY (performer_id)
		REFERENCES performer (id),
	CONSTRAINT perf_sub_submission_id_fk
		FOREIGN KEY (submission_id)
		REFERENCES submission (id)
);