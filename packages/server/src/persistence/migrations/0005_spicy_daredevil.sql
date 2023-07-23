ALTER TABLE "cah"."turns" RENAME COLUMN "place" TO "number";--> statement-breakpoint
ALTER TABLE "cah"."questions" ALTER COLUMN "gameId" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "cah"."turns" ALTER COLUMN "gameId" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "cah"."turns" ALTER COLUMN "questionMasterId" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "cah"."turns" ALTER COLUMN "questionId" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "cah"."turns" ALTER COLUMN "selectedAnswerId" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "cah"."turns" ALTER COLUMN "number" SET NOT NULL;