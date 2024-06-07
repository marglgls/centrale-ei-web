import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717744716800 {
    name = ' $npmConfigName1717744716800'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "backdrop_path" varchar,
                "description" varchar NOT NULL,
                "popularity" float NOT NULL,
                "runtime" varchar
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "title",
                    "release_date",
                    "poster_path",
                    "backdrop_path",
                    "description",
                    "popularity"
                )
            SELECT "id",
                "title",
                "release_date",
                "poster_path",
                "backdrop_path",
                "description",
                "popularity"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "backdrop_path" varchar,
                "description" varchar NOT NULL,
                "popularity" float NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "title",
                    "release_date",
                    "poster_path",
                    "backdrop_path",
                    "description",
                    "popularity"
                )
            SELECT "id",
                "title",
                "release_date",
                "poster_path",
                "backdrop_path",
                "description",
                "popularity"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
