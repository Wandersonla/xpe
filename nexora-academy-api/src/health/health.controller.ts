import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../shared/auth/decorators/public.decorator';

class HealthResponseDto {
  status!: string;
  service!: string;
  timestamp!: string;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check da aplicação' })
  @ApiOkResponse({ type: HealthResponseDto })
  getHealth() {
    return {
      status: 'ok',
      service: 'nexora-academy-api',
      timestamp: new Date().toISOString(),
    };
  }
}
