import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { UserDocument } from '../user/schema/user.schema';
import { CreateUserDto } from '../user/dto/user.dto';
import { JwtPayload } from './interface/jwt.payload';
import { UserAuth } from './interface/user.auth';

@Controller('api/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: CreateUserDto): Promise<UserDocument> {
    return await this.authService.signUp(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signin')
  async signin(@Body() payload: UserAuth) {
    return this.authService.validateUser(payload);
  }

  @Post('signout')
  async signOut(@Body('token') token: string) {
    return this.authService.signOut(token);
  }

  @Post('token')
  getToken(@Body() payload: JwtPayload) {
    return this.authService.createToken(payload);
  }
}
