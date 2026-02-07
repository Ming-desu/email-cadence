export type WaitStep = {
  id: string;
  type: 'WAIT';
  seconds: number;
};

export type SendEmailStep = {
  id: string;
  type: 'SEND_EMAIL';
  subject: string;
  body: string;
};

export type Step = WaitStep | SendEmailStep;

export type Cadence = {
  id: string;
  name: string;
  steps: Step[];
};

export type WorkflowStatus =
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED';

export type WorkflowState = {
  currentStepIndex: number;
  stepsVersion: number;
  status: WorkflowStatus;
};
