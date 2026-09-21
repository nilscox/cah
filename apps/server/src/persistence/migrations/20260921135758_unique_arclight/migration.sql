ALTER TABLE "cah"."answers" RENAME CONSTRAINT "answers_gameId_games_id_fk" TO "answers_gameId_games_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."answers" RENAME CONSTRAINT "answers_playerId_players_id_fk" TO "answers_playerId_players_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."answers" RENAME CONSTRAINT "answers_questionId_questions_id_fk" TO "answers_questionId_questions_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."answers" RENAME CONSTRAINT "answers_turnId_turns_id_fk" TO "answers_turnId_turns_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."choices" RENAME CONSTRAINT "choices_gameId_games_id_fk" TO "choices_gameId_games_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."choices" RENAME CONSTRAINT "choices_playerId_players_id_fk" TO "choices_playerId_players_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."choices" RENAME CONSTRAINT "choices_answerId_answers_id_fk" TO "choices_answerId_answers_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."games" RENAME CONSTRAINT "games_questionMasterId_players_id_fk" TO "games_questionMasterId_players_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."games" RENAME CONSTRAINT "games_questionId_questions_id_fk" TO "games_questionId_questions_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."games" RENAME CONSTRAINT "games_selectedAnswerId_answers_id_fk" TO "games_selectedAnswerId_answers_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."players" RENAME CONSTRAINT "players_gameId_games_id_fk" TO "players_gameId_games_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."questions" RENAME CONSTRAINT "questions_gameId_games_id_fk" TO "questions_gameId_games_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."turns" RENAME CONSTRAINT "turns_gameId_games_id_fk" TO "turns_gameId_games_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."turns" RENAME CONSTRAINT "turns_questionMasterId_players_id_fk" TO "turns_questionMasterId_players_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."turns" RENAME CONSTRAINT "turns_questionId_questions_id_fk" TO "turns_questionId_questions_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."turns" RENAME CONSTRAINT "turns_selectedAnswerId_answers_id_fk" TO "turns_selectedAnswerId_answers_id_fkey";--> statement-breakpoint
ALTER TABLE "cah"."answers" DROP CONSTRAINT "answers_gameId_games_id_fkey", ADD CONSTRAINT "answers_gameId_games_id_fkey" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id");--> statement-breakpoint
ALTER TABLE "cah"."answers" DROP CONSTRAINT "answers_playerId_players_id_fkey", ADD CONSTRAINT "answers_playerId_players_id_fkey" FOREIGN KEY ("playerId") REFERENCES "cah"."players"("id");--> statement-breakpoint
ALTER TABLE "cah"."answers" DROP CONSTRAINT "answers_questionId_questions_id_fkey", ADD CONSTRAINT "answers_questionId_questions_id_fkey" FOREIGN KEY ("questionId") REFERENCES "cah"."questions"("id");--> statement-breakpoint
ALTER TABLE "cah"."answers" DROP CONSTRAINT "answers_turnId_turns_id_fkey", ADD CONSTRAINT "answers_turnId_turns_id_fkey" FOREIGN KEY ("turnId") REFERENCES "cah"."turns"("id");--> statement-breakpoint
ALTER TABLE "cah"."choices" DROP CONSTRAINT "choices_gameId_games_id_fkey", ADD CONSTRAINT "choices_gameId_games_id_fkey" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id");--> statement-breakpoint
ALTER TABLE "cah"."choices" DROP CONSTRAINT "choices_playerId_players_id_fkey", ADD CONSTRAINT "choices_playerId_players_id_fkey" FOREIGN KEY ("playerId") REFERENCES "cah"."players"("id");--> statement-breakpoint
ALTER TABLE "cah"."choices" DROP CONSTRAINT "choices_answerId_answers_id_fkey", ADD CONSTRAINT "choices_answerId_answers_id_fkey" FOREIGN KEY ("answerId") REFERENCES "cah"."answers"("id");--> statement-breakpoint
ALTER TABLE "cah"."games" DROP CONSTRAINT "games_questionMasterId_players_id_fkey", ADD CONSTRAINT "games_questionMasterId_players_id_fkey" FOREIGN KEY ("questionMasterId") REFERENCES "cah"."players"("id");--> statement-breakpoint
ALTER TABLE "cah"."games" DROP CONSTRAINT "games_questionId_questions_id_fkey", ADD CONSTRAINT "games_questionId_questions_id_fkey" FOREIGN KEY ("questionId") REFERENCES "cah"."questions"("id");--> statement-breakpoint
ALTER TABLE "cah"."games" DROP CONSTRAINT "games_selectedAnswerId_answers_id_fkey", ADD CONSTRAINT "games_selectedAnswerId_answers_id_fkey" FOREIGN KEY ("selectedAnswerId") REFERENCES "cah"."answers"("id");--> statement-breakpoint
ALTER TABLE "cah"."players" DROP CONSTRAINT "players_gameId_games_id_fkey", ADD CONSTRAINT "players_gameId_games_id_fkey" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id");--> statement-breakpoint
ALTER TABLE "cah"."questions" DROP CONSTRAINT "questions_gameId_games_id_fkey", ADD CONSTRAINT "questions_gameId_games_id_fkey" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id");--> statement-breakpoint
ALTER TABLE "cah"."turns" DROP CONSTRAINT "turns_gameId_games_id_fkey", ADD CONSTRAINT "turns_gameId_games_id_fkey" FOREIGN KEY ("gameId") REFERENCES "cah"."games"("id");--> statement-breakpoint
ALTER TABLE "cah"."turns" DROP CONSTRAINT "turns_questionMasterId_players_id_fkey", ADD CONSTRAINT "turns_questionMasterId_players_id_fkey" FOREIGN KEY ("questionMasterId") REFERENCES "cah"."players"("id");--> statement-breakpoint
ALTER TABLE "cah"."turns" DROP CONSTRAINT "turns_questionId_questions_id_fkey", ADD CONSTRAINT "turns_questionId_questions_id_fkey" FOREIGN KEY ("questionId") REFERENCES "cah"."questions"("id");--> statement-breakpoint
ALTER TABLE "cah"."turns" DROP CONSTRAINT "turns_selectedAnswerId_answers_id_fkey", ADD CONSTRAINT "turns_selectedAnswerId_answers_id_fkey" FOREIGN KEY ("selectedAnswerId") REFERENCES "cah"."answers"("id");