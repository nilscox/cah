ALTER TABLE "cah"."games" ADD COLUMN "selectedAnswerId" varchar(16);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cah"."games" ADD CONSTRAINT "games_selectedAnswerId_answers_id_fk" FOREIGN KEY ("selectedAnswerId") REFERENCES "cah"."answers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
