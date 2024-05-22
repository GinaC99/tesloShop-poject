import { IsArray, IsNumber, IsOptional, 
    IsPositive, IsString, 
    Min, MinLength } from "class-validator";
import { IsIn } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Min(1)
    price?: number;

    @IsString()
    @MinLength(1)
    @IsOptional()
    description?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    slug?: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Min(1)
    stock?: number;

    @IsString(
        {
            each: true
        })
    @IsArray()
    sizes: string[];

    @IsIn(['men','women','kid','unisex'])
    gender: string;
    
    @IsString()
    @MinLength(1)
    @IsOptional()
    tags:string[];
}
