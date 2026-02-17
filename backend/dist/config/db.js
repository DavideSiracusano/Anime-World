import "dotenv/config";
import { createRequire } from "module";
import { PrismaPg } from "@prisma/adapter-pg";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment variables.");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
});
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully!");
        return prisma;
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
};
const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
    }
    catch (error) {
        console.error("Error disconnecting from the database:", error);
        process.exit(1);
    }
};
export { connectDB, disconnectDB, prisma };
