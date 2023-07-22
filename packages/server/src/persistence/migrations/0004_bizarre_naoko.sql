CREATE TABLE IF NOT EXISTS "cah"."turns" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"gameId" varchar NOT NULL,
	"questionMasterId" text NOT NULL,
	"questionId" text NOT NULL,
	"selectedAnswerId" text NOT NULL,
	"place" integer
);
--> statement-breakpoint
ALTER TABLE "cah"."answers" ALTER COLUMN "gameId" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "cah"."answers" ALTER COLUMN "playerId" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "cah"."answers" ALTER COLUMN "questionId" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "cah"."answers" ADD COLUMN "turnId" varchar(16);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."answers" ADD CONSTRAINT "answers_turnId_turns_id_fk" FOREIGN KEY ("turnId") REFERENCES "cah"."turns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."turns" ADD CONSTRAINT "turns_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."turns" ADD CONSTRAINT "turns_questionMasterId_players_id_fk" FOREIGN KEY ("questionMasterId") REFERENCES "cah"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."turns" ADD CONSTRAINT "turns_questionId_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "cah"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."turns" ADD CONSTRAINT "turns_selectedAnswerId_answers_id_fk" FOREIGN KEY ("selectedAnswerId") REFERENCES "cah"."answers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
