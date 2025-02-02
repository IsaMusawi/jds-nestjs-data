import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../utils/jwt.strategy';
import { createAuthController } from './auth.controller';
import { UtilsMiddleware } from 'src/utils/utils.middleware';
// import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt_secret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [createAuthController(new ConfigService())],
  exports: [AuthService],
})
// export class AuthModule {}
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UtilsMiddleware)
      .forRoutes(createAuthController(new ConfigService()));
  }
}
