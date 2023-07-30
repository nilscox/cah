CREATE SCHEMA "cah";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "game_state" AS ENUM('idle', 'started', 'finished');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cah"."choices" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"gameId" varchar NOT NULL,
	"playerId" varchar,
	"text" text NOT NULL,
	"caseSensitive" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cah"."games" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"code" varchar(4) NOT NULL,
	"state" "game_state" NOT NULL,
	"questionMasterId" varchar(16),
	"questionId" varchar(16)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cah"."players" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"nick" text NOT NULL,
	"gameId" varchar(16)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cah"."questions" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"gameId" varchar NOT NULL,
	"text" text NOT NULL,
	"blanks" integer[] NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."choices" ADD CONSTRAINT "choices_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."choices" ADD CONSTRAINT "choices_playerId_players_id_fk" FOREIGN KEY ("playerId") REFERENCES "cah"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."games" ADD CONSTRAINT "games_questionMasterId_players_id_fk" FOREIGN KEY ("questionMasterId") REFERENCES "cah"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."games" ADD CONSTRAINT "games_questionId_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "cah"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."players" ADD CONSTRAINT "players_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."questions" ADD CONSTRAINT "questions_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
