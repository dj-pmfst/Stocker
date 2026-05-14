-- CreateEnum
CREATE TYPE "Uloga" AS ENUM ('ADMIN', 'KONOBAR', 'SKLADISTAR');

-- CreateEnum
CREATE TYPE "JedinicaMjere" AS ENUM ('KG', 'L', 'KOM');

-- CreateEnum
CREATE TYPE "TipUpozorenja" AS ENUM ('ZUTO', 'CRVENO');

-- CreateEnum
CREATE TYPE "Smjena" AS ENUM ('JUTARNJA', 'POPODNEVNA', 'NOCNA');

-- CreateTable
CREATE TABLE "Korisnik" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lozinka" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Korisnik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skladiste" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "adresa" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skladiste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KorisnikSkladiste" (
    "id" SERIAL NOT NULL,
    "korisnikId" INTEGER NOT NULL,
    "skladisteId" INTEGER NOT NULL,
    "uloga" "Uloga" NOT NULL DEFAULT 'KONOBAR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KorisnikSkladiste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultProizvod" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "kategorija" TEXT,
    "jedinicaMjere" "JedinicaMjere" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DefaultProizvod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proizvod" (
    "id" SERIAL NOT NULL,
    "defaultProizvodId" INTEGER NOT NULL,
    "skladisteId" INTEGER NOT NULL,
    "minimalnaKolicina" DOUBLE PRECISION,
    "customNaziv" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proizvod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lokacija" (
    "id" SERIAL NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "zona" TEXT NOT NULL,
    "polica" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lokacija_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StanjeProizvoda" (
    "id" SERIAL NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "kolicina" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StanjeProizvoda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upozorenje" (
    "id" SERIAL NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "tip" "TipUpozorenja" NOT NULL,
    "poruka" TEXT NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rijeseno" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Upozorenje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnosProdaje" (
    "id" SERIAL NOT NULL,
    "skladisteId" INTEGER NOT NULL,
    "korisnikId" INTEGER NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "smjena" "Smjena" NOT NULL,
    "napomena" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnosProdaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StavkaProdaje" (
    "id" SERIAL NOT NULL,
    "unosProdajeId" INTEGER NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "kolicina" DOUBLE PRECISION NOT NULL,
    "cijena" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StavkaProdaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnosDostave" (
    "id" SERIAL NOT NULL,
    "skladisteId" INTEGER NOT NULL,
    "korisnikId" INTEGER NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "smjena" "Smjena" NOT NULL,
    "napomena" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnosDostave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StavkaDostave" (
    "id" SERIAL NOT NULL,
    "unosDostaveId" INTEGER NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "kolicina" DOUBLE PRECISION NOT NULL,
    "cijena" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StavkaDostave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Korisnik_email_key" ON "Korisnik"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KorisnikSkladiste_korisnikId_skladisteId_key" ON "KorisnikSkladiste"("korisnikId", "skladisteId");

-- CreateIndex
CREATE UNIQUE INDEX "Proizvod_defaultProizvodId_skladisteId_key" ON "Proizvod"("defaultProizvodId", "skladisteId");

-- CreateIndex
CREATE UNIQUE INDEX "Lokacija_proizvodId_key" ON "Lokacija"("proizvodId");

-- CreateIndex
CREATE UNIQUE INDEX "StanjeProizvoda_proizvodId_key" ON "StanjeProizvoda"("proizvodId");

-- AddForeignKey
ALTER TABLE "KorisnikSkladiste" ADD CONSTRAINT "KorisnikSkladiste_korisnikId_fkey" FOREIGN KEY ("korisnikId") REFERENCES "Korisnik"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KorisnikSkladiste" ADD CONSTRAINT "KorisnikSkladiste_skladisteId_fkey" FOREIGN KEY ("skladisteId") REFERENCES "Skladiste"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proizvod" ADD CONSTRAINT "Proizvod_defaultProizvodId_fkey" FOREIGN KEY ("defaultProizvodId") REFERENCES "DefaultProizvod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proizvod" ADD CONSTRAINT "Proizvod_skladisteId_fkey" FOREIGN KEY ("skladisteId") REFERENCES "Skladiste"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lokacija" ADD CONSTRAINT "Lokacija_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StanjeProizvoda" ADD CONSTRAINT "StanjeProizvoda_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upozorenje" ADD CONSTRAINT "Upozorenje_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnosProdaje" ADD CONSTRAINT "UnosProdaje_skladisteId_fkey" FOREIGN KEY ("skladisteId") REFERENCES "Skladiste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnosProdaje" ADD CONSTRAINT "UnosProdaje_korisnikId_fkey" FOREIGN KEY ("korisnikId") REFERENCES "Korisnik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StavkaProdaje" ADD CONSTRAINT "StavkaProdaje_unosProdajeId_fkey" FOREIGN KEY ("unosProdajeId") REFERENCES "UnosProdaje"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StavkaProdaje" ADD CONSTRAINT "StavkaProdaje_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnosDostave" ADD CONSTRAINT "UnosDostave_skladisteId_fkey" FOREIGN KEY ("skladisteId") REFERENCES "Skladiste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnosDostave" ADD CONSTRAINT "UnosDostave_korisnikId_fkey" FOREIGN KEY ("korisnikId") REFERENCES "Korisnik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StavkaDostave" ADD CONSTRAINT "StavkaDostave_unosDostaveId_fkey" FOREIGN KEY ("unosDostaveId") REFERENCES "UnosDostave"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StavkaDostave" ADD CONSTRAINT "StavkaDostave_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
