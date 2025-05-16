import { Injectable } from '@nestjs/common';
import { db } from '../database/db.connection';
import { users } from '../database/schema';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async findByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async findById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async create(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);
    const createdBy = data.createdBy ?? 1; // fallback to system/admin if not provided
    const updatedBy = data.updatedBy ?? 1;

    // Auto-approve if userType is admin or trainer; else false
    const isApproved = data.userType === 'admin' || data.userType === 'trainer' ? true : false;

    return db
      .insert(users)
      .values({ ...data, password: hashed, createdBy, updatedBy, isApproved })
      .returning();
  }

  async updateApprovalStatus(userId: number, isApproved: boolean) {
    const updated = await db
      .update(users)
      .set({ isApproved })
      .where(eq(users.id, userId))
      .returning();

    return updated[0];
  }
}
