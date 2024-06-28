/*
  Warnings:

  - A unique constraint covering the columns `[customer_id]` on the table `__users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PAYED', 'PENDING', 'CANCELED');

-- AlterTable
ALTER TABLE "__users" ADD COLUMN     "customer_id" TEXT;

-- CreateTable
CREATE TABLE "__subscriptions" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "price_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "__subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "__subscriptions_id_key" ON "__subscriptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "__subscriptions_subscription_id_key" ON "__subscriptions"("subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "__subscriptions_user_id_key" ON "__subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "__users_customer_id_key" ON "__users"("customer_id");

-- AddForeignKey
ALTER TABLE "__subscriptions" ADD CONSTRAINT "__subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "__users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
