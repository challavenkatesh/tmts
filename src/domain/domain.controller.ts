import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { DomainService } from './domain.service';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('domains')
@UseGuards(ApiKeyGuard, JwtGuard)
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  /**
   * Create a new domain (admin only)
   * @param req Request object containing user information from JWT
   * @param data Domain data
   * @returns Created domain data
   */
  @Post()
  async create(@Req() req, @Body() data: { domainName: string }) {
    if (req.user.userType !== 'admin') {
      throw new UnauthorizedException('Only admins can create domains');
    }
    return this.domainService.create(data);
  }

  /**
   * Get all domains
   * @returns Array of all domains
   */
  @Get()
  async findAll() {
    return this.domainService.findAll();
  }

  /**
   * Get a domain by ID
   * @param id Domain ID
   * @returns Domain data
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.domainService.findById(+id);
  }

  /**
   * Update a domain (admin only)
   * @param req Request object containing user information from JWT
   * @param id Domain ID
   * @param data Domain data to update
   * @returns Updated domain data
   */
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() data: { domainName: string },
  ) {
    if (req.user.userType !== 'admin') {
      throw new UnauthorizedException('Only admins can update domains');
    }
    return this.domainService.update(+id, data);
  }

  /**
   * Delete a domain (admin only)
   * @param req Request object containing user information from JWT
   * @param id Domain ID
   * @returns Deleted domain data
   */
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    if (req.user.userType !== 'admin') {
      throw new UnauthorizedException('Only admins can delete domains');
    }
    return this.domainService.delete(+id);
  }
} 