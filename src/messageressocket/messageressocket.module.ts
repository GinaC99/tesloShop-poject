import { Module } from '@nestjs/common';
import { MessageressocketService } from './messageressocket.service';
import { MessageressocketController } from './messageressocket.controller';

@Module({
  controllers: [MessageressocketController],
  providers: [MessageressocketService],
})
export class MessageressocketModule {}
