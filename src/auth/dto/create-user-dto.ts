import { UserAuth } from '../interface/user.auth';

export class UserCreateDto {
  firstName: UserAuth['firstName'];
  lastName: UserAuth['lastName'];
  email: UserAuth['email'];
  password: UserAuth['password'];
}
