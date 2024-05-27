import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUser {
    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @IsString()
    @MinLength(1)
    fullname:string;
}