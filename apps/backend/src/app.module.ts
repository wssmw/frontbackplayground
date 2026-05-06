import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './modules/auth/auth.controller';
import { BasicController } from './modules/basic/basic.controller';
import { UploadController } from './modules/upload/upload.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'front-back-playground-secret',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [BasicController, AuthController, UploadController],
})
export class AppModule {}
