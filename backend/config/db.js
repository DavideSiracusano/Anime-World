//PRISMA 7 CON MODIFICHE AL DB E ADAPTER

import "dotenv/config";
// Prisma 7: importa PrismaClient dal package principale
import { PrismaClient } from "@prisma/client";
// Driver adapter Postgres richiesto dal nuovo engine client di Prisma 7.
import { PrismaPg } from "@prisma/adapter-pg";

// Quando riapre il progetto, verifica sempre che DATABASE_URL esista nel .env.
const connectionString = process.env.DATABASE_URL;

// Fail-fast: se manca la variabile, blocca subito l'avvio con errore chiaro.
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables.");
}

//Prisma 7 (engine "client"): crea l'adapter con la connection string.
const adapter = new PrismaPg({ connectionString });

// Istanzia PrismaClient passando l'adapter.
const prisma = new PrismaClient({
  adapter,
  // Log utili in sviluppo per debug query/connessione.
  log: ["query", "info", "warn", "error"],
});

// Connessione esplicita al DB all'avvio server.
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

// Chiusura pulita della connessione quando il processo termina.
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
    process.exit(1);
  }
};

export { connectDB, disconnectDB, prisma };
