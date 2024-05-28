import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser, LogingUser } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
import { Auth, RawHeaders, RoleProtected, GetUser } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createUser: CreateUser) {
    return this.authService.create(createUser);
  }
  @Post('/login')
  loginUser(@Body() loginUser: LogingUser) {
    return this.authService.login(loginUser);
  }

  @Get('check-token')
  @Auth()
  checkAuthStatus(
    @Req() request: Express.Request,
    @GetUser() user:User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get()
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail:string,
    @RawHeaders() rawHeaders: string[]
  ){
    return {...user, userEmail, rawHeaders};
  }

  @Get('private2')
  @RoleProtected(ValidRoles.user) // !Esto sustituye lo de abajo
  // @SetMetadata('roles',['admin', 'super-user'] ) // !! esto es obligatorio, para poder tener el contexto de los usuarios y todo
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute(
    @GetUser() user: User,
  ){
    return {user};
  }


  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user: User,
  ){
    return {user};
  }
}
