import { randomUUID } from 'node:crypto';

export async function sendEmailActivity(input: {
  to: string;
  subject: string;
  body: string;
}) {
  console.log('Mock email sent:', input);

  return {
    success: true,
    messageId: randomUUID(),
    timestamp: Date.now(),
  }
}
