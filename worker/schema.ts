import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  telegramId: text('telegram_id').notNull().unique(),
  firstName: text('first_name'),
  username: text('username'),
  createdAt: integer('created_at').default(Date.now()),
});
