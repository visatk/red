import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  telegramId: text('telegram_id').notNull().unique(),
  firstName: text('first_name'),
  username: text('username'),
  referredBy: text('referred_by'), // Stores telegramId of referrer
  points: integer('points').default(0),
  createdAt: integer('created_at').default(Date.now()),
});

export const referrals = sqliteTable('referrals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  referrerId: text('referrer_id').notNull(),
  referredId: text('referred_id').notNull().unique(),
  pointsAwarded: integer('points_awarded').default(100),
  createdAt: integer('created_at').default(Date.now()),
});
