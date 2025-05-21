import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ApiKeyGuard } from './api-key.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'mySuperSecretKey123',
      signOptions: { expiresIn: '3600s' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApiKeyGuard],
  exports: [ApiKeyGuard],
})
export class AuthModule {}
