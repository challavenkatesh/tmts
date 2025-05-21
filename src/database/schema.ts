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
  text,
} from 'drizzle-orm/pg-core';


// Enums
export const userTypeEnum = pgEnum('user_type', ['admin', 'trainer', 'employee']);
export const complaintTypeEnum = pgEnum('complaint_type',['complaint','suggestion'])

// register table
// export const register = pgTable('register',{
//     id:serial("register_id").primaryKey().notNull(),

//     name: varchar('name', { length: 100 }).notNull(),
//     surname: varchar('surname', { length: 100 }).notNull(),

//     username: varchar('username', { length: 50 }).notNull().unique(),
//     password: varchar('password', { length: 255 }).notNull(),

//     phone: varchar('phone', { length: 15 }).notNull(),
//     email: varchar('email', { length: 100 }).notNull().unique(),

//     createdBy: integer('created_by')
//         .notNull()
//         .references(() => users.id, { onDelete: 'cascade' }),
    
//     createdAt: timestamp('created_at').defaultNow().notNull(),

//     dateOfJoining: date('date_of_joining'),
//     gender: varchar('gender', { length: 10 }).notNull(),

//     userType: userTypeEnum('user_type').notNull(),
//     domainId: integer("domain_id").notNull().references(()=>domain.id),

// })


// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),

  name: varchar('name', { length: 100 }).notNull(),
  surname: varchar('surname', { length: 100 }).notNull(),

  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),

  phone: varchar('phone', { length: 15 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),

  // Cascade: When a user is deleted, their created/updated references are deleted
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Cascade: When a user is deleted, their created/updated references are deleted
  updatedBy: integer('updated_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  dateOfJoining: date('date_of_joining'),
  gender: varchar('gender', { length: 10 }).notNull(),

  userType: userTypeEnum('user_type').default('employee').notNull(),
  // Restrict: Cannot delete domain if users are using it
  domainId: integer("domain_id")
   
    .references(() => domain.id, { onDelete: 'restrict' }),

  // ✅ NEW FIELD
  isApproved: boolean('is_approved').default(false).notNull(), // false until trainer/admin approves
});

//Domain table
export const domain = pgTable("domain",{
    id:serial("id").primaryKey().notNull(),
    domainName:varchar("domain_name",{length:20}).notNull(),
})

// batches table
export const batches = pgTable("batches",{
    id:serial("batch_id").primaryKey().notNull(),
    // Restrict: Cannot delete domain if batches are using it
    domainId:integer("domain_id").notNull().references(()=>domain.id),
    // Cascade: When a trainer is deleted, their batches are deleted
    trainerId:integer("trainer_id").notNull().references(()=>users.id),
    batchName:varchar("batch_name",{length:255}).notNull(),
    cretedAt:date("create_at").defaultNow().notNull()
})


// batches_entry table 
export const batchesEntry = pgTable("batch_entry",{
    id:serial("entry_id").primaryKey().notNull(),
    // Cascade: When a batch is deleted, its entries are deleted
    batchId:integer("batch_id").notNull().references(()=>batches.id),
    // Cascade: When a user is deleted, their batch entries are deleted
    userId:integer("user_id").notNull().references(()=>users.id),
    joinedAt:timestamp("joined_at").defaultNow().notNull()
})

// tasks table
export const tasks = pgTable("tasks",{
    id:serial("id").primaryKey().notNull(),
    // Restrict: Cannot delete domain if tasks are using it
    domainId:integer("domain_id").notNull().references(()=>domain.id),
    // Cascade: When a batch is deleted, its tasks are deleted
    batcheId:integer("batch_id").notNull().references(()=>batches.id),
    // Cascade: When a user is deleted, their tasks are deleted
    assignedTo:integer("assigned_to").notNull().references(()=>users.id),
    task:varchar("task",{length:255}).notNull(),
    description:text("description").notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull()
})


// reports table
export const reports = pgTable("eod_reports",{
    id:serial("id").primaryKey().notNull(),
    // Cascade: When a user is deleted, their reports are deleted
    userId:integer("user_id").notNull().references(()=>users.id),
    // Cascade: When a batch is deleted, its reports are deleted
    batchId:integer("batch_id").notNull().references(()=>batches.id),
    reportText:text("report_text").notNull(),
    date:date("date").notNull(),
    // Cascade: When a reviewer is deleted, their review records are deleted
    reviewedBy:integer("reviewed_by").notNull().references(()=>users.id),
    reviewComments:text("review_comments").notNull(),
    status:boolean("status").default(true).notNull(),
    isApproved:boolean("is_approved").default(false).notNull(),
    submittedAt:timestamp("submitted_at").defaultNow().notNull()
})

// complaints/suggestions tables
export const complaintSuggestion = pgTable("complaint_suggestion",{
    id:serial("complaint_id").primaryKey().notNull(),
    // Cascade: When a user is deleted, their complaints/suggestions are deleted
    userId:integer("user_id").notNull().references(()=>users.id),
    // Cascade: When a batch is deleted, its complaints/suggestions are deleted
    batchId:integer("batch_id").notNull().references(()=>batches.id),
    type:complaintTypeEnum('complaint_type').notNull(),
    content:text("content").notNull(),
    status:boolean("status").default(false).notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull()
})

// team chat table
export const teamchat = pgTable("team_chat",{
    id:serial("id").primaryKey().notNull(),
    // Cascade: When a user is deleted, their chat messages are deleted
    senderId:integer("sender_id").notNull().references(()=>users.id),
    // Cascade: When a batch is deleted, its chat messages are deleted
    batchId:integer("batch_id").notNull().references(()=>batches.id),
    message:text('message'),
    sentAt:timestamp("sent_at").defaultNow().notNull()
})

// meeting table
export const meeting = pgTable("meeting",{
    id:serial("meeting_id").primaryKey().notNull(),
    topic:varchar("topic",{length:255}).notNull(),
    scheduledAt:timestamp("scheduled_at").defaultNow().notNull(),
    link:varchar("link",{length:255}).notNull(),
    // Cascade: When a batch is deleted, its meetings are deleted
    batchId:integer("batch_id").notNull().references(()=>batches.id),
    // Cascade: When a user is deleted, their created meetings are deleted
    createdBy:integer("created_by").notNull().references(()=>users.id),
    durationMin:integer("duration_min").notNull()
})

// meeting_attendeance table
export const meetingAttendance = pgTable("meeting_attendance",{
    id:serial("id").primaryKey().notNull(),
    // Cascade: When a user is deleted, their attendance records are deleted
    userId:integer("user_id").notNull().references(()=>users.id),
    // Cascade: When a meeting is deleted, its attendance records are deleted
    meetingId:integer("meeting_id").notNull().references(()=>meeting.id),
    attended:boolean("attended").default(false).notNull(),
    joinedAt:timestamp("joined_at").defaultNow().notNull(),
    leftAt:timestamp("left_at").defaultNow().notNull()
})