// lib/prisma.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');

// Force clean environment to prevent fallback conflicts
['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGPORT'].forEach(v => delete process.env[v]);

const rawUrl = process.env.DATABASE_URL || process.env.DB_URL || '';
// Aggressive cleaning: Remove and replace problematic characters
const cleanUrl = rawUrl.replace(/['"]+/g, '').replace(/\r/g, '').replace(/\n/g, '').trim();

if (!cleanUrl) {
    console.error("❌ CRITICAL: DATABASE_URL is empty after cleaning!");
}

// Re-inject the clean URL into the environment for the Prisma engine
process.env.DATABASE_URL = cleanUrl;
console.log(`🔗 Database: Ready (Clean URL Length: ${process.env.DATABASE_URL.length})`);

const globalForPrisma = globalThis;

/** @type {PrismaClient} */
let prisma;

if (globalForPrisma.prisma) {
    prisma = globalForPrisma.prisma;
} else {
    prisma = new PrismaClient({
        log: ['error', 'warn'],
    });

    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prisma;
    }
}

// Verification - test the native connection
prisma.$executeRawUnsafe('SELECT NOW()')
    .then(() => console.log("✅ Database: Native Prisma Connection Successful!"))
    .catch(err => {
        console.error("❌ Database: Native Connection FAILED!");
        console.error(`   Error details: ${err.message}`);
    });

module.exports = prisma;
