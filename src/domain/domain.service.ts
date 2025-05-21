import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../database/db.connection';
import { domain } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DomainService {
  /**
   * Create a new domain
   * @param data Domain data containing domainName
   * @returns Created domain data
   */
  async create(data: { domainName: string }) {
    // Check if domain name already exists
    const existingDomain = await db
      .select()
      .from(domain)
      .where(eq(domain.domainName, data.domainName));

    if (existingDomain.length > 0) {
      throw new BadRequestException('Domain name already exists');
    }

    const result = await db
      .insert(domain)
      .values(data)
      .returning();

    return result[0];
  }

  /**
   * Get all domains
   * @returns Array of all domains
   */
  async findAll() {
    return db.select().from(domain);
  }

  /**
   * Get a domain by ID
   * @param id Domain ID
   * @returns Domain data
   */
  async findById(id: number) {
    const result = await db
      .select()
      .from(domain)
      .where(eq(domain.id, id));

    if (result.length === 0) {
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    return result[0];
  }

  /**
   * Update a domain
   * @param id Domain ID
   * @param data Domain data to update
   * @returns Updated domain data
   */
  async update(id: number, data: { domainName: string }) {
    // Check if domain exists
    await this.findById(id);

    // Check if new domain name already exists
    const existingDomain = await db
      .select()
      .from(domain)
      .where(eq(domain.domainName, data.domainName));

    if (existingDomain.length > 0 && existingDomain[0].id !== id) {
      throw new BadRequestException('Domain name already exists');
    }

    const result = await db
      .update(domain)
      .set(data)
      .where(eq(domain.id, id))
      .returning();

    return result[0];
  }

  /**
   * Delete a domain
   * @param id Domain ID
   * @returns Deleted domain data
   */
  async delete(id: number) {
    // Check if domain exists
    await this.findById(id);

    const result = await db
      .delete(domain)
      .where(eq(domain.id, id))
      .returning();

    return result[0];
  }
} 