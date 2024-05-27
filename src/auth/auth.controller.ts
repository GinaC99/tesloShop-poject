import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser, LogingUser } from './dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Get()
  @UseGuards(AuthGuard())
  testingPrivateRoute(){
    return 'hey'
  }
}
