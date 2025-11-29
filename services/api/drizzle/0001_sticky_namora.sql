CREATE TABLE `reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`robot_id` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`time` text NOT NULL,
	`tag` text NOT NULL,
	`days` blob NOT NULL,
	FOREIGN KEY (`robot_id`) REFERENCES `robots`(`id`) ON UPDATE no action ON DELETE cascade
);
