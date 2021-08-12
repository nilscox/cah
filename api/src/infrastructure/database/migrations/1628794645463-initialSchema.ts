import {MigrationInterface, QueryRunner} from "typeorm";

export class initialSchema1628794645463 implements MigrationInterface {
    name = 'initialSchema1628794645463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "player" ("id" varchar PRIMARY KEY NOT NULL, "nick" varchar NOT NULL, "has_flushed" boolean NOT NULL, "game_id" varchar)`);
        await queryRunner.query(`CREATE TABLE "question" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "blanks" text NOT NULL, "game_id" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "turn" ("id" varchar PRIMARY KEY NOT NULL, "game_id" varchar NOT NULL, "question_master_id" varchar NOT NULL, "question_id" varchar NOT NULL, "winner_id" varchar NOT NULL, CONSTRAINT "REL_c1837731c8485200bd82932d58" UNIQUE ("question_id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar NOT NULL, "state" varchar CHECK( state IN ('idle','started','finished') ) NOT NULL, "play_state" varchar CHECK( play_state IN ('playersAnswer','questionMasterSelection','endOfTurn') ), "created_by_id" varchar NOT NULL, "question_master_id" varchar, "question_id" varchar, "winner_id" varchar, CONSTRAINT "UQ_f66209e3c441170db9824c9e891" UNIQUE ("code"), CONSTRAINT "REL_568d2fc593ebd8804973f5fcb5" UNIQUE ("question_master_id"), CONSTRAINT "REL_08867ba249fa9d179d5449d27d" UNIQUE ("question_id"), CONSTRAINT "REL_298112532dfebf0f4bb788b327" UNIQUE ("winner_id"))`);
        await queryRunner.query(`CREATE TABLE "choice" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "case_sensitive" boolean NOT NULL, "position" integer, "available" boolean NOT NULL DEFAULT (1), "game_id" varchar NOT NULL, "answer_id" varchar, "player_id" varchar)`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" varchar PRIMARY KEY NOT NULL, "position" integer NOT NULL, "player_id" varchar NOT NULL, "question_id" varchar NOT NULL, "current_of_game_id" varchar, "current_of_turn_id" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_player" ("id" varchar PRIMARY KEY NOT NULL, "nick" varchar NOT NULL, "has_flushed" boolean NOT NULL, "game_id" varchar, CONSTRAINT "FK_433f544c592c2b6cbdfd2edbec3" FOREIGN KEY ("game_id") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "temporary_player"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "choice"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "turn"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "player"`);
    }

}
