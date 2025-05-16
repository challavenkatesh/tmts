import { Controller, Get, Post, Body, UseGuards, Req, Patch, Param, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@Req() req) {
    const user = await this.usersService.findById(req.user.sub);
    return user;
  }

  // Admin or Trainer can create users directly (auto approved)
  @Post('register')
  @UseGuards(JwtGuard)
  async register(@Req() req, @Body() body: any) {
   if (req.user.userType === 'admin' || req.user.userType === 'trainer')
 {
      return this.usersService.create(body);
    }
    return { message: 'Unauthorized' };
  }
// Approve user
@Patch('approve/:id')
@UseGuards(JwtGuard)
async approveUser(@Req() req, @Param('id') id: string) {
  if (req.user.role !== 'admin' && req.user.role !== 'trainer') {
    throw new UnauthorizedException('Only admins or trainers can approve users');
  }

  const updatedUser = await this.usersService.updateApprovalStatus(+id, true);
  return { message: 'User approved successfully', user: updatedUser };
}


  // Reject user
  @Patch('reject/:id')
  @UseGuards(JwtGuard)
  async rejectUser(@Req() req, @Param('id') id: string) {
    if (req.user.role !== 'admin' && req.user.role !== 'trainer') {
      throw new UnauthorizedException('Only admins or trainers can reject users');
    }

    const updatedUser = await this.usersService.updateApprovalStatus(+id, false);
    return { message: 'User rejected', user: updatedUser };
  }
}
