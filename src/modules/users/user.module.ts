import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { DatabaseModule } from "src/config/database/database.module";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    controllers : [AuthController],
    providers  : [AuthService,UserService,JwtService],
    imports :[DatabaseModule]
})

export class UserModule {}