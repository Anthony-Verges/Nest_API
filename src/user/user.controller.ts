import { Controller, Get, Post, Delete, Req, Body } from '@nestjs/common';
import { UserService } from './user.service';


export class UserId {
    id : number;
}
export class User {
    id : number;
    firstname : string;
    lastname : string;
    age : number;
    email : string;
    password : string
}

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    
    @Get()
    getUsers() {
        return this.userService.getUsers()
    }

    @Post()
    getUserById(@Body() userId: UserId) {
        const id = userId.id
        return this.userService.getUserById(id);   
    }

    @Post("create")
    createUser(@Body() User :any) {
        //Suypprime la key hobbies du Body
        let { hobbies, ...UserData} = User;

        return this.userService.createUser(UserData, User.hobbies)
    }

    @Delete("delete")
    deleteUserWithHobbies(@Body() userId: UserId) {
       return this.userService.deleteUserById(userId.id) 
    }

    @Post("register")
    registerUser(@Body() Credentials :any){
        const email = Credentials.email;
        const password = Credentials.password
        const confirm_password = Credentials.confirm_password

        return this.userService.registerUser(email, password, confirm_password)
    }

}
