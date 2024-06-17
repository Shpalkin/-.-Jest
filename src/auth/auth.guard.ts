import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  public handleRequest(err: Error, user: any) {
    if (err) {
      throw new HttpException(err.message, 500);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
