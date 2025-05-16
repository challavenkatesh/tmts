// src/database/db.connection.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: 'postgresql://postgres:1234@localhost:5432/TMA',
});

// Try to connect and log result
pool.connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Optional: Stop the app if DB is critical
  });

export const db = drizzle(pool, { schema });
