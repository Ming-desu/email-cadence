import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CadencesModule } from './cadences/cadences.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { TemporalModule } from './temporal/temporal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CadencesModule,
    EnrollmentsModule,
    TemporalModule,
  ],
})
export class AppModule {}
