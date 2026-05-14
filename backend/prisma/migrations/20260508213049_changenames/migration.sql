/*
  Warnings:

  - You are about to drop the `DefaultProizvod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Korisnik` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KorisnikSkladiste` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lokacija` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proizvod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skladiste` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StanjeProizvoda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StavkaDostave` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StavkaProdaje` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnosDostave` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnosProdaje` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Upozorenje` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'WAITER', 'WAREHOUSE_MANAGER');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('KG', 'L', 'PCS');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('YELLOW', 'RED');

-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('MORNING', 'AFTERNOON', 'NIGHT');

-- DropForeignKey
ALTER TABLE "KorisnikSkladiste" DROP CONSTRAINT "KorisnikSkladiste_korisnikId_fkey";

-- DropForeignKey
ALTER TABLE "KorisnikSkladiste" DROP CONSTRAINT "KorisnikSkladiste_skladisteId_fkey";

-- DropForeignKey
ALTER TABLE "Lokacija" DROP CONSTRAINT "Lokacija_proizvodId_fkey";

-- DropForeignKey
ALTER TABLE "Proizvod" DROP CONSTRAINT "Proizvod_defaultProizvodId_fkey";

-- DropForeignKey
ALTER TABLE "Proizvod" DROP CONSTRAINT "Proizvod_skladisteId_fkey";

-- DropForeignKey
ALTER TABLE "StanjeProizvoda" DROP CONSTRAINT "StanjeProizvoda_proizvodId_fkey";

-- DropForeignKey
ALTER TABLE "StavkaDostave" DROP CONSTRAINT "StavkaDostave_proizvodId_fkey";

-- DropForeignKey
ALTER TABLE "StavkaDostave" DROP CONSTRAINT "StavkaDostave_unosDostaveId_fkey";

-- DropForeignKey
ALTER TABLE "StavkaProdaje" DROP CONSTRAINT "StavkaProdaje_proizvodId_fkey";

-- DropForeignKey
ALTER TABLE "StavkaProdaje" DROP CONSTRAINT "StavkaProdaje_unosProdajeId_fkey";

-- DropForeignKey
ALTER TABLE "UnosDostave" DROP CONSTRAINT "UnosDostave_korisnikId_fkey";

-- DropForeignKey
ALTER TABLE "UnosDostave" DROP CONSTRAINT "UnosDostave_skladisteId_fkey";

-- DropForeignKey
ALTER TABLE "UnosProdaje" DROP CONSTRAINT "UnosProdaje_korisnikId_fkey";

-- DropForeignKey
ALTER TABLE "UnosProdaje" DROP CONSTRAINT "UnosProdaje_skladisteId_fkey";

-- DropForeignKey
ALTER TABLE "Upozorenje" DROP CONSTRAINT "Upozorenje_proizvodId_fkey";

-- DropTable
DROP TABLE "DefaultProizvod";

-- DropTable
DROP TABLE "Korisnik";

-- DropTable
DROP TABLE "KorisnikSkladiste";

-- DropTable
DROP TABLE "Lokacija";

-- DropTable
DROP TABLE "Proizvod";

-- DropTable
DROP TABLE "Skladiste";

-- DropTable
DROP TABLE "StanjeProizvoda";

-- DropTable
DROP TABLE "StavkaDostave";

-- DropTable
DROP TABLE "StavkaProdaje";

-- DropTable
DROP TABLE "UnosDostave";

-- DropTable
DROP TABLE "UnosProdaje";

-- DropTable
DROP TABLE "Upozorenje";

-- DropEnum
DROP TYPE "JedinicaMjere";

-- DropEnum
DROP TYPE "Smjena";

-- DropEnum
DROP TYPE "TipUpozorenja";

-- DropEnum
DROP TYPE "Uloga";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWarehouse" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'WAITER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWarehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultProduct" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "unitOfMeasure" "UnitOfMeasure" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DefaultProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "defaultProductId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "minimumQuantity" DOUBLE PRECISION,
    "customName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "zone" TEXT NOT NULL,
    "shelf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductStock" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "type" "AlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleEntry" (
    "id" SERIAL NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shift" "Shift" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" SERIAL NOT NULL,
    "saleEntryId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryEntry" (
    "id" SERIAL NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shift" "Shift" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryItem" (
    "id" SERIAL NOT NULL,
    "deliveryEntryId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserWarehouse_userId_warehouseId_key" ON "UserWarehouse"("userId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_defaultProductId_warehouseId_key" ON "Product"("defaultProductId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_productId_key" ON "Location"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductStock_productId_key" ON "ProductStock"("productId");

-- AddForeignKey
ALTER TABLE "UserWarehouse" ADD CONSTRAINT "UserWarehouse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWarehouse" ADD CONSTRAINT "UserWarehouse_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_defaultProductId_fkey" FOREIGN KEY ("defaultProductId") REFERENCES "DefaultProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStock" ADD CONSTRAINT "ProductStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleEntry" ADD CONSTRAINT "SaleEntry_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleEntry" ADD CONSTRAINT "SaleEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleEntryId_fkey" FOREIGN KEY ("saleEntryId") REFERENCES "SaleEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryEntry" ADD CONSTRAINT "DeliveryEntry_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryEntry" ADD CONSTRAINT "DeliveryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryItem" ADD CONSTRAINT "DeliveryItem_deliveryEntryId_fkey" FOREIGN KEY ("deliveryEntryId") REFERENCES "DeliveryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryItem" ADD CONSTRAINT "DeliveryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
