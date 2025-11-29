import { db } from './db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { robots, alarms } from './schema';

// This will run migrations on startup
migrate(db, { migrationsFolder: 'drizzle' });

console.log('Migrations completed!');