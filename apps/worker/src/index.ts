import { Worker } from "@temporalio/worker";
import path from 'node:path';
import { env } from "./config/env";

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows/cadence.workflow'),
    activities: require('./activities/email.activity'),
    taskQueue: env.TASK_QUEUE,
  });

  console.log('Worker started on queue:', env.TASK_QUEUE);

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
