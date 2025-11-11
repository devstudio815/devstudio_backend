import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from 'src/config/database/database.module';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  exports: [JwtStrategy],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, JwtStrategy],
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') as string,
        signOptions: {
          expiresIn:
            configService.get<number>('jwt.expiresIn') || 15 * 60 * 60 * 1000,
        },
      }),
    }),
  ],
})
export class UserModule {}
