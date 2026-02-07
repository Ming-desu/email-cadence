import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { CadencesModule } from 'src/cadences/cadences.module';
import { TemporalModule } from 'src/temporal/temporal.module';

@Module({
  imports: [CadencesModule, TemporalModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
