import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUser, LogingUser } from './dto';
import { JwtPayload } from './interfaces/jwr-paylod.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  
  private readonly logger = new Logger('ProductService');
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}
  
  async create(createUser: CreateUser) {
    try {

      const { password, ...userData } = createUser;
      const newUser = this.userRepository.create({...userData, password: bcrypt.hashSync(password, parseInt(process.env.ROUND_HASH) )});
      await this.userRepository.save(newUser)
      delete newUser.password;
      delete newUser.isActive;
      return {...newUser, 
        token: this.getJwtToken({email: newUser.email})
      };
      
    } catch (error) {
      this.handlerException(error)
    }

  }

  async login(loginUser: LogingUser){
    try {
      const {email, password} = loginUser;

      const user = await this.userRepository.findOne({
        where: {
          email
        },
        select: {
          email: true, 
          password: true
        }
      });
      
      if(!user) 
        throw new UnauthorizedException('El usuario no esta autorizado')
      if(!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('El usuario no esta autorizado')
      return {...user, token: this.getJwtToken({ email: user.email})};

    } catch (error) {
      this.handlerException(error);
    }

  }

    private getJwtToken(payload: JwtPayload){
      return this.jwtService.sign(payload)
    }


  private handlerException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Hey algo salio mal, revisa los logs');
  }

}
