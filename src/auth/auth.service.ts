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
      connectionString: 'postgres://postgres:1234@localhost:5432/TMA', // Update your config
    });

    this.db = drizzle(pool, { schema: { users } });
  }

  /**
   * Register a new user in the system
   * Creates a new user with hashed password and sets approval status based on user type
   * @param userData User registration data
   * @returns Message and created user data (without password)
   */
  async register(userData: any) {
    const { username, password, email, userType = 'employee', ...rest } = userData;

    // Validate required fields
    if (!username || !password || !email) {
      throw new BadRequestException('Username, email, and password are required');
    }

    // Check for existing username
    const existingUsername = await this.db.select().from(users).where(eq(users.username, username));
    if (existingUsername.length > 0) {
      throw new BadRequestException('Username already exists');
    }

    // Check for existing email
    const existingEmail = await this.db.select().from(users).where(eq(users.email, email));
    if (existingEmail.length > 0) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password and set approval status
    const hashedPassword = await bcrypt.hash(password, 10);
    const isApproved = userType === 'admin' || userType === 'trainer';

    // Create the new user
    const newUser = await this.db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        email,
        userType,
        isApproved,
        ...rest,
      })
      .returning();

    return {
      message: isApproved
        ? 'User registered and approved successfully.'
        : 'User registered successfully and pending approval.',
      user: { ...newUser[0], password: undefined },
    };
  }

  /**
   * Validate user credentials
   * Checks if username exists, user is approved, and password is correct
   * @param username Username to validate
   * @param pass Password to validate
   * @returns User data without password if valid, null otherwise
   */
  async validateUser(username: string, pass: string) {
    // Find user by username
    const user = await this.db.select().from(users).where(eq(users.username, username));
    if (!user || user.length === 0) return null;

    // Check if user is approved
    if (!user[0].isApproved) {
      throw new UnauthorizedException('User registration is pending approval');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(pass, user[0].password);
    if (!isPasswordValid) return null;

    // Return user data without password
    const { password, ...result } = user[0];
    return result;
  }

  /**
   * Login a user and generate JWT token
   * @param user Validated user data
   * @returns JWT access token
   */
  async login(user: any) {
    // Create JWT payload
    const payload = {
      sub: user.id,
      username: user.username,
      userType: user.userType,
    };

    // Generate JWT token
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET') || 'sai',
    });

    return { 
      message: 'Login successful',
      access_token: token 
    };
  }
}
