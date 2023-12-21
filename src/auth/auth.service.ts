import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

    async login(email : string, password : string) {
        console.log("Email => ",email);

        console.log("Password => ",password)

        const existingUser = await this.userService.findOneUserByEmail(email)

        console.log("existingUser => ", existingUser)

        if (existingUser?.password !== password) {
            throw new UnauthorizedException();
        }

        const payload = { id: existingUser.id, email : existingUser.email };
        
        const token = await this.jwtService.signAsync(payload)

        return {
            access_token : token
        }

    }



}
