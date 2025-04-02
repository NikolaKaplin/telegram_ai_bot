CREATE TABLE `chats` (
	`id` varchar(256) NOT NULL,
	`user_id` varchar(256),
	CONSTRAINT `chats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(256) NOT NULL,
	`role` varchar(16) NOT NULL,
	`chat_id` varchar(256),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(256) NOT NULL,
	`tg_id` varchar(128) NOT NULL,
	`first_name` varchar(48) NOT NULL,
	`last_name` varchar(48) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`chat_id` varchar(256),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_chat_id_chats_id_fk` FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_chat_id_chats_id_fk` FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE cascade ON UPDATE no action;