CREATE TABLE FITBIT_USER (
	id				serial PRIMARY KEY,
	fitbit_user_id	varchar(64),
	name			varchar(64),
	dob				date,
	hieght 			int,
	hieght_unit		varchar(10),
	access_token	varchar(512),
	refresh_token	varchar(512),
	created_at		timestamp default current_timestamp
);