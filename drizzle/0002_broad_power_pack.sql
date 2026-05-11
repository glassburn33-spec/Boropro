CREATE TABLE `kiln_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`temperatures` text NOT NULL,
	`times` text NOT NULL,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kiln_log_id` PRIMARY KEY(`id`)
);
