import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CadencesService } from './cadences.service';
import type { Cadence } from '@email-cadence/shared';

@Controller('cadences')
export class CadencesController {
  constructor(private service: CadencesService) {}

  @Post()
  create(@Body() body: Cadence) {
    return this.service.create(body);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Cadence) {
    return this.service.update(id, body);
  }
}
