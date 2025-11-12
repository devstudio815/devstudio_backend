import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config/config';
import { DatabaseModule } from 'src/config/database/database.module';
import jwtConfig from 'src/config/jwt.config';
import { KelasModule } from 'src/modules/kelas/kelas.module';
import { MataPelajaranModule } from 'src/modules/mata_pelajaran/mata-pelajaran.module';
import { UserModule } from 'src/modules/users/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      load: [config, jwtConfig],
    }),
    DatabaseModule,
    UserModule,
    MataPelajaranModule,
    KelasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
