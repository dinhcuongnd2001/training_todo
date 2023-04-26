/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TodoStatus" AS ENUM ('CLOSE', 'TODO', 'BACKLOG');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AUTHOR', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "status" "TodoStatus" NOT NULL,
    "dueDate" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignee_Todo" (
    "userId" INTEGER NOT NULL,
    "todoId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Todo_name_key" ON "Todo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Assignee_Todo_userId_todoId_key" ON "Assignee_Todo"("userId", "todoId");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignee_Todo" ADD CONSTRAINT "Assignee_Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignee_Todo" ADD CONSTRAINT "Assignee_Todo_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
