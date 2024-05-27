import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class LogingUser {

    @IsString()
    @IsEmail()
    email:string;

    @MinLength(6)
    @MaxLength(50)
    @IsString()
    password:string;

}