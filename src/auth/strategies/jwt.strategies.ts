import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwr-paylod.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         })
    }

    async valiate(payload: JwtPayload): Promise<User> {
        const { email } = payload;
        const user = await this.userRepository.findOneBy({email})
        if(!user) throw new UnauthorizedException('Token no valido')
        if(!user.isActive) throw new UnauthorizedException('Token no valido')

        return user;

    }
}