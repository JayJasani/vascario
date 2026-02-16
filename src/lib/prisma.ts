import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
    const connectionString = process.env.DATABASE_URL!;
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
}

// Lazy getter — PrismaClient is only instantiated on first access, not at import time.
// This prevents PrismaClientInitializationError during Next.js build.
export const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop: string | symbol) {
        if (!globalForPrisma.prisma) {
            globalForPrisma.prisma = createPrismaClient();
        }
        const client = globalForPrisma.prisma;
        const value = Reflect.get(client, prop, client);
        if (typeof value === "function") {
            return (value as Function).bind(client);
        }
        return value;
    },
});
