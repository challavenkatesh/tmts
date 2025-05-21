import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    // Always set userType as 'employee' during registration
    const userData = {
      ...data,
      password: hashed,
      createdBy,
      updatedBy,
      userType: 'employee', // Force userType to be employee
      isApproved: false // Always false for new registrations
    };

    return db
      .insert(users)
      .values(userData)
      .returning();
  }

  async updateApprovalStatus(userId: number, isApproved: boolean, userType?: string) {
    const updateData: any = { isApproved };
    
    // If userType is provided during approval, update it
    if (userType) {
      updateData.userType = userType;
    }

    const updated = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    return updated[0];
  }

  /**
   * Delete a user by ID
   * @param id User ID to delete
   * @returns Deleted user's name
   */
  async delete(id: number) {
    try {
      // Check if user exists
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Store user info before deletion
      const userInfo = {
        name: `${user.name} ${user.surname}`
      };

      // Delete the user
      await db
        .delete(users)
        .where(eq(users.id, id));

      return userInfo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Update a user's information
   * @param id User ID to update
   * @param data Update data
   * @param updatedBy ID of the user making the update
   * @returns Updated user data
   */
  async update(id: number, data: any, updatedBy: number) {
    try {
      // Check if user exists
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // If password is being updated, hash it
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      // Add updatedBy to the update data
      const updateData = {
        ...data,
        updatedBy,
        updatedAt: new Date()
      };

      // Update the user
      const updated = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();

      return updated[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update user');
    }
  }
}
