import { Step } from '@email-cadence/shared';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CadencesService } from 'src/cadences/cadences.service';
import { TemporalService } from 'src/temporal/temporal.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    private temporal: TemporalService,
    private cadences: CadencesService,
  ) {}

  async start(cadenceId: string, contactEmail: string) {
    const cadence = this.cadences.get(cadenceId);

    if (cadence) {
      const workflowId = `enrollment-${randomUUID()}`;

      await this.temporal.client?.workflow.start('cadenceWorkflow', {
        taskQueue: process.env.TASK_QUEUE ?? '',
        workflowId,
        args: [
          {
            steps: cadence.steps,
            contactEmail,
          },
        ],
      });

      return { id: workflowId };
    }

    return { id: null };
  }

  async getState(id: string) {
    const handle = this.temporal.client?.workflow.getHandle(id);
    return handle?.query('getState');
  }

  async updateCadence(id: string, steps: Step[]) {
    const handle = this.temporal.client?.workflow.getHandle(id);
    await handle?.signal('updateCadence', steps);
  }
}
