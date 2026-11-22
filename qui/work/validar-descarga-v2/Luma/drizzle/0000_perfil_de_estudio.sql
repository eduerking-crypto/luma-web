CREATE TABLE `learner_values` (
	`profile` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	PRIMARY KEY(`profile`, `key`)
);
