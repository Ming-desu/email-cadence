import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  TEMPORAL_ADDRESS: str(),
  TEMPORAL_NAMESPACE: str(),
  TASK_QUEUE: str(),
});
