import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  unitNumber: text('unit_number'),
  address: text('address'),
  condoName: text('condo_name'),
  lobbyTower: text('lobby_tower'),
  role: text('role').notNull().default('user'),
  amcStatus: text('amc_status').notNull().default('inactive'),
  lastServiceDate: text('last_service_date'),
  nextServiceDate: text('next_service_date'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  datetime: text('datetime').notNull(),
  status: text('status').notNull().default('scheduled'),
  type: text('type').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});