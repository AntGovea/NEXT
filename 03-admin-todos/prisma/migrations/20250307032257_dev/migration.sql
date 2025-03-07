-- CreateTable
CREATE TABLE "TODO" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TODO_pkey" PRIMARY KEY ("id")
);
