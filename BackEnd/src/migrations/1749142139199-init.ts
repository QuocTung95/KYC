import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1749142139199 implements MigrationInterface {
    name = 'Init1749142139199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "dateOfBirth" date NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "nationality" character varying NOT NULL, "occupation" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_3825121222d5c17741373d8ad13" UNIQUE ("email"), CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_investmentexperience_enum" AS ENUM('LESS_THAN_5_YEARS', 'BETWEEN_5_AND_10_YEARS', 'MORE_THAN_10_YEARS')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_risktolerance_enum" AS ENUM('TEN_PERCENT', 'THIRTY_PERCENT', 'ALL_IN')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "kyc" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "incomes" jsonb NOT NULL, "assets" jsonb NOT NULL, "liabilities" jsonb NOT NULL, "wealthSources" jsonb NOT NULL, "investmentExperience" "public"."kyc_investmentexperience_enum" NOT NULL DEFAULT 'LESS_THAN_5_YEARS', "riskTolerance" "public"."kyc_risktolerance_enum" NOT NULL DEFAULT 'TEN_PERCENT', "netWorth" numeric(15,2) NOT NULL, "status" "public"."kyc_status_enum" NOT NULL DEFAULT 'PENDING', "reviewedAt" TIMESTAMP, "reviewedBy" uuid, "rejectReason" text, "userId" uuid, CONSTRAINT "REL_ca948073ed4a3ba22030d37b3d" UNIQUE ("userId"), CONSTRAINT "PK_84ab2e81ea9700d29dda719f3be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('USER', 'OFFICER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "kyc"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_risktolerance_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_investmentexperience_enum"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
