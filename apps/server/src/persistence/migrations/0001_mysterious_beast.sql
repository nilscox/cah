CREATE TABLE IF NOT EXISTS "cah"."answers" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"gameId" varchar NOT NULL,
	"playerId" varchar NOT NULL,
	"questionId" text NOT NULL,
	"place" integer
);
--> statement-breakpoint
ALTER TABLE "cah"."choices" ADD COLUMN "answerId" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."choices" ADD CONSTRAINT "choices_answerId_answers_id_fk" FOREIGN KEY ("answerId") REFERENCES "cah"."answers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."answers" ADD CONSTRAINT "answers_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."answers" ADD CONSTRAINT "answers_playerId_players_id_fk" FOREIGN KEY ("playerId") REFERENCES "cah"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."answers" ADD CONSTRAINT "answers_questionId_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "cah"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
