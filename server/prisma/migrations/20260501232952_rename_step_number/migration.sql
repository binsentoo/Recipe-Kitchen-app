/*
  Warnings:

  - You are about to drop the column `step_number` on the `RecipeStep` table. All the data in the column will be lost.
  - Added the required column `stepNumber` to the `RecipeStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeStep" DROP COLUMN "step_number",
ADD COLUMN     "stepNumber" INTEGER NOT NULL;
