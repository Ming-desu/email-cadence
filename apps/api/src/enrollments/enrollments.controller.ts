import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import type { Step } from '@email-cadence/shared';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private service: EnrollmentsService) {}

  @Post()
  start(@Body() body: { cadenceId: string; contactEmail: string }) {
    return this.service.start(body.cadenceId, body.contactEmail);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.getState(id);
  }

  @Put(':id/cadence')
  update(@Param('id') id: string, @Body() body: { steps: Step[] }) {
    return this.service.updateCadence(id, body.steps);
  }
}
