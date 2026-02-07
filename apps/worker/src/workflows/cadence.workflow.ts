import {
  sleep,
  proxyActivities,
  defineSignal,
  defineQuery,
  setHandler
} from '@temporalio/workflow';

import type { Step, WorkflowState } from '@email-cadence/shared';

const { sendEmailActivity } = proxyActivities<
  typeof import('../activities/email.activity')
>({
  startToCloseTimeout: '1 minute'
});

export const updateCadenceSignal = defineSignal<[Step[]]>('updateCadence');
export const getStateQuery = defineQuery<WorkflowState>('getState');

export async function cadenceWorkflow({
  steps,
  contactEmail
}: {
  steps: Step[];
  contactEmail: string;
}) {
  let currentStepIndex = 0;
  let stepsVersion = 1;
  let status: WorkflowState['status'] = 'RUNNING';

  setHandler(getStateQuery, () => ({
    currentStepIndex,
    stepsVersion,
    status,
  }));

  setHandler(updateCadenceSignal, (newSteps) => {
    steps = newSteps;
    stepsVersion++;

    if (steps.length <= currentStepIndex) {
      status = 'COMPLETED';
    }
  })

  while (currentStepIndex < steps.length) {
    const step = steps[currentStepIndex];

    if (step.type === 'WAIT') {
      await sleep(step.seconds * 1000);
    }

    if (step.type === 'SEND_EMAIL') {
      await sendEmailActivity({
        to: contactEmail,
        subject: step.subject,
        body: step.body,
      });
    }

    currentStepIndex++;
  }

  status = 'COMPLETED';
}
