// src/database/schema.ts

import {
  pgTable,
  serial,
  varchar,
  timestamp,
  date,
  pgEnum,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

// Enums
export const userTypeEnum = pgEnum('user_type', ['admin', 'trainer', 'employee']);
export const departmentEnum = pgEnum('department', ['Java', 'Devops']);

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 100 }).notNull(),
  surname: varchar('surname', { length: 100 }).notNull(),

  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),

  phone: varchar('phone', { length: 15 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),

  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  updatedBy: integer('updated_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  dateOfJoining: date('date_of_joining'),
  gender: varchar('gender', { length: 10 }).notNull(),

  userType: userTypeEnum('user_type').notNull(),
  department: departmentEnum('department').notNull(),

  // ✅ NEW FIELD
  isApproved: boolean('is_approved').default(false).notNull(), // false until trainer/admin approves
});
