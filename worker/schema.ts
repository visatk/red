import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  telegramId: text('telegram_id').notNull().unique(),
  firstName: text('first_name'),
  username: text('username'),
  referredBy: text('referred_by'),
  points: integer('points').default(0),
  
  // Daily Check-in Streak Mechanics
  loginStreak: integer('login_streak').default(0),
  lastLoginAt: integer('last_login_at').default(0), // Unix timestamp
  
  createdAt: integer('created_at').default(Date.now()),
});

export const referrals = sqliteTable('referrals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  referrerId: text('referrer_id').notNull(),
  referredId: text('referred_id').notNull().unique(),
  pointsAwarded: integer('points_awarded').default(250),
  createdAt: integer('created_at').default(Date.now()),
});

// Social Farming Tasks
export const userTasks = sqliteTable('user_tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  telegramId: text('telegram_id').notNull(),
  taskId: text('task_id').notNull(), // e.g., 'join_channel', 'follow_twitter'
  completedAt: integer('completed_at').default(Date.now()),
});
