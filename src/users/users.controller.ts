import { Controller, Get, Post, Body, UseGuards, Req, Patch, Param, Delete, UnauthorizedException, NotFoundException, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Get the profile of the authenticated user
   * @param req Request object containing user information from JWT
   * @returns User profile data
   */
  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@Req() req) {
    const user = await this.usersService.findById(req.user.sub);
    return user;
  }

  /**
   * Register a new user (admin/trainer only)
   * Creates a new user with automatic approval
   * @param req Request object containing user information from JWT
   * @param body User data for registration
   * @returns Created user data or unauthorized message
   */
  @Post('register')
  @UseGuards(ApiKeyGuard, JwtGuard)
  async register(@Req() req, @Body() body: any) {
    if (req.user.userType === 'admin' || req.user.userType === 'trainer') {
      return this.usersService.create(body);
    }
    throw new UnauthorizedException('Only admins or trainers can register new users');
  }

  /**
   * Approve a pending user registration
   * Sets isApproved status to true for the specified user and optionally updates user type
   * @param req Request object containing user information from JWT
   * @param id ID of the user to approve
   * @param body Optional body containing userType to update
   * @returns Updated user data with approval message
   */
  @Patch('approve/:id')
  @UseGuards(ApiKeyGuard, JwtGuard)
  async approveUser(@Req() req, @Param('id') id: string, @Body() body?: { userType?: string }) {
    if (req.user.userType !== 'admin' && req.user.userType !== 'trainer') {
      throw new UnauthorizedException('Only admins or trainers can approve users');
    }

    const updatedUser = await this.usersService.updateApprovalStatus(+id, true, body?.userType);
    return { 
      message: 'User approved successfully', 
      user: updatedUser 
    };
  }

  /**
   * Reject a user registration
   * Sets isApproved status to false for the specified user
   * @param req Request object containing user information from JWT
   * @param id ID of the user to reject
   * @returns Updated user data with rejection message
   */
  @Patch('reject/:id')
  @UseGuards(ApiKeyGuard, JwtGuard)
  async rejectUser(@Req() req, @Param('id') id: string) {
    if (req.user.userType !== 'admin' && req.user.userType !== 'trainer') {
      throw new UnauthorizedException('Only admins or trainers can reject users');
    }

    const updatedUser = await this.usersService.updateApprovalStatus(+id, false);
    return { 
      message: 'User rejected', 
      user: updatedUser 
    };
  }

  /**
   * Delete a user (admin only)
   * @param req Request object containing user information from JWT
   * @param id ID of the user to delete
   * @returns Deleted user's name and admin who deleted them
   */
  @Delete(':id')
  @UseGuards(ApiKeyGuard, JwtGuard)
  async deleteUser(@Req() req, @Param('id') id: string) {
    try {
      if (req.user.userType !== 'admin') {
        throw new UnauthorizedException('Only admins can delete users');
      }

      // Delete the user and get the result
      const deletedUser = await this.usersService.delete(+id);

      return {
        message: 'User deleted successfully',
        deletedUser: deletedUser.name
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Update a user's information
   * Users can only update their own profile unless they are an admin
   * @param req Request object containing user information from JWT
   * @param id ID of the user to update
   * @param body Update data
   * @returns Updated user data
   */
  @Patch(':id')
  @UseGuards(ApiKeyGuard, JwtGuard)
  async updateUser(@Req() req, @Param('id') id: string, @Body() body: any) {
    try {
      // Check if user is trying to update their own profile or is an admin
      if (req.user.sub !== +id && req.user.userType !== 'admin') {
        throw new UnauthorizedException('You can only update your own profile');
      }

      // If not admin, remove sensitive fields from update data
      if (req.user.userType !== 'admin') {
        delete body.userType;
        delete body.isApproved;
        delete body.domainId;
      }

      const updatedUser = await this.usersService.update(+id, body, req.user.sub);
      
      return {
        message: 'User updated successfully',
        user: updatedUser
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error('Failed to update user');
    }
  }
}
