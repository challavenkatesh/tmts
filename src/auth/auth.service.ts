import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { users, userTypeEnum } from '../database/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class AuthService {
  private db;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const pool = new Pool({
      connectionString: 'postgres://postgres:1234@localhost:5432/TMA', // Update with your config
    });

    this.db = drizzle(pool, { schema: { users } });
  }

  async register(userData: any) {
  const { username, password, email, userType = 'employee', ...rest } = userData;

  // Check if username exists
  const existingUser = await this.db.select().from(users).where(eq(users.username, username));
  if (existingUser.length > 0) {
    throw new BadRequestException('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Auto-approve admins and trainers
  const isApproved = userType === 'admin' || userType === 'trainer';

  const newUser = await this.db
    .insert(users)
    .values({
      username,
      password: hashedPassword,
      email,
      userType,   // <-- use the actual string here
      isApproved, // <-- set correct approval status
      ...rest,
    })
    .returning();

  return {
    message: isApproved
      ? 'User registered and approved successfully'
      : 'User registered successfully and pending approval',
    user: { ...newUser[0], password: undefined },
  };
}

  async validateUser(username: string, pass: string) {
    const user = await this.db.select().from(users).where(eq(users.username, username));
    if (!user || user.length === 0) {
      return null;
    }

    if (!user[0].isApproved) {
      throw new UnauthorizedException('User registration is pending approval');
    }

    const isPasswordValid = await bcrypt.compare(pass, user[0].password);
    if (!isPasswordValid) return null;

    const { password, ...result } = user[0];
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
       role: user.userType,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET') || 'sai',
    });

    return {
      access_token: token,
    };
  }
}
