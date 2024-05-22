import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    
    @IsInt()
    @IsOptional()
    @IsPositive()
    @Min(1)
    @Type(()=> Number)
    limit?: number;

    @IsPositive()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(()=> Number)
    offset?:number;
}