-- Rinomina authorId a userId e aggiungi likes
ALTER TABLE "Topic" 
ADD COLUMN "userId" INTEGER;

UPDATE "Topic" SET "userId" = "authorId";

ALTER TABLE "Topic" 
ALTER COLUMN "userId" SET NOT NULL,
ADD COLUMN "likes" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Topic" DROP CONSTRAINT "Topic_authorId_fkey";
ALTER TABLE "Topic" DROP COLUMN "authorId";

ALTER TABLE "Topic" 
ADD CONSTRAINT "Topic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable Comment
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey Comment
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
