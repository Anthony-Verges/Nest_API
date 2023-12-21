import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    try {
        const users = await this.prisma.user.findMany({});
        return users;
    } catch (err) {
        return {
            error: err,
            status: 'ERREUR',
          };
    }   
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        include : {
            hobbies : true
        }
      });
      return user;
    } catch (err) {
      return {
        error: err,
        status: 'ERREUR',
        type_error : "Missing Parameter"
      };
    }
  }

  //création d'un User avec ses hobbies
  async createUser(data :any , hobbies : []) {
     try {
        const newUser = await this.prisma.user.create({
           data : {
            ...data, 
            hobbies : {
                create : hobbies
            },
           }    
        })
        return {
            status : "User bien crée en base de donnée",
            data : newUser
         }
    } catch(err){
        return {
            error: err,
            status: 'ERREUR',
            type_error : "Erreur durant la création de votre User, veuillez recommencer ultérieurement"
          };
    }
  }

  //Registration with password
  async registerUser(email: string, password : string, confirm_password : string) {
     try  {
      const doesExistUser = await this.prisma.user.findUnique({
        where : {
          email : email
        }
      })
      if (doesExistUser) {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error : "Utilisateur déjà existant",
        }, HttpStatus.FORBIDDEN, {
          cause: "Error"
        })
      }
      if (confirm_password !== password) {
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error : "Veuillez entrer un mot de passe de confirmation identique",
        }, HttpStatus.FORBIDDEN, {
          cause: "Error"
        })
      }

      const newUserRegistered = await this.prisma.user.create({
        data : {
          email: email,
          password: password,
        },
      })

      return newUserRegistered
      



    } catch (err) {
      return {
        error : err,
        status : "Erreur durant l'enregistrement de votre compte"
      }
    }
  }



  //Pour l'Authentification
  async findOneUserByEmail(email : string) {
    console.log("findOneUserByEmail => ",email)
    return await this.prisma.user.findUnique(
        {
            where: {
            email: email,
          },
          select: {
            id: true,
            email: true,
            password: true,
          },
        }
    );
  }

  //Delete User
  async deleteUserById(id : number) {

    try {
      const deleteHobbies = this.prisma.hobby.deleteMany({
        where: {
          userId: id,
        },
      })
      
      const deleteUser = this.prisma.user.delete({
        where: {
          id: id,
        },
      })
      
      const transaction = await this.prisma.$transaction([deleteHobbies, deleteUser])

      return {
        data : "user numéro "+ id +" supprimé avec succès"
      }
    } catch (err) {
     return {
        error: err,
        status: 'ERREUR',
        type_error : "Erreur durant la suppression de votre user"
      };
    }
    
  }
}
