import { User, UserDocument } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserAuth } from './interface/user.auth';
import { JwtPayload } from './interface/jwt.payload';

@Injectable()
export class AuthService {
  private readonly invalidatedTokens: string[] = [];
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(payload: UserAuth) {
    return this.jwtService.sign(payload);
  }

  async signUp(@Body() user: CreateUserDto): Promise<UserDocument> {
    return this.userService.createUser(user);
  }

  async signOut(token: string) {
    this.invalidatedTokens.push(token);
  }

  async validateUser(payload: UserAuth): Promise<User | null> {
    if (this.invalidatedTokens.includes(payload.token)) {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.userService.findOne(payload.email);
    if (user) {
      return user;
    }
    return null;
  }

  async createToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
