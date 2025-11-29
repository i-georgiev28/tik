import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';

export const robots = sqliteTable('robots', {
  id: text('id').primaryKey(), // 6 symbols, alphanumerical, lowercase only
  battery: integer('battery').notNull().default(0), // 0 to 100
});

export const alarms = sqliteTable('alarms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  robotId: text('robot_id').notNull().references(() => robots.id, { onDelete: 'cascade' }),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  time: text('time').notNull(), // Stored as "HH:MM"
  tag: text('tag').notNull(),
  days: blob('days', { mode: 'json' }).notNull(), // Stored as JSON
});

export const reminders = sqliteTable('reminders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  robotId: text('robot_id').notNull().references(() => robots.id, { onDelete: 'cascade' }),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  time: text('time').notNull(), // Stored as "HH:MM"
  tag: text('tag').notNull(),
  days: blob('days', { mode: 'json' }).notNull(), // Stored as JSON
});