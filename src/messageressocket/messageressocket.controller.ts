import { Controller } from '@nestjs/common';
import { MessageressocketService } from './messageressocket.service';

@Controller('messageressocket')
export class MessageressocketController {
  constructor(private readonly messageressocketService: MessageressocketService) {}
}
