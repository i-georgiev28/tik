CREATE TABLE `alarms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`robot_id` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`time` text NOT NULL,
	`tag` text NOT NULL,
	`days` blob NOT NULL,
	FOREIGN KEY (`robot_id`) REFERENCES `robots`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `robots` (
	`id` text PRIMARY KEY NOT NULL,
	`battery` integer DEFAULT 0 NOT NULL
);
