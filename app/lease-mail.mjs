import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { sampleLease } from './sample-lease.mjs';

const subject = 'Your Chakra Realty sample lease';
const message = 'The requested sample lease for Maple Court, Unit 2B is attached.';
let nextRequestAt = 0;

export async function sendLeaseCopy(recipient) {
  if (Date.now() < nextRequestAt) {
    return 'Please wait a minute before requesting another copy.';
  }

  const attachment = { name: sampleLease.name, content: Buffer.from(sampleLease.content).toString('base64') };
  const apiKey = process.env.CHAKRA_BREVO_API_KEY;
  const sender = process.env.CHAKRA_LEASE_SENDER;
  const outbox = process.env.CHAKRA_LEASE_TEST_OUTBOX;
  if (!outbox && (!apiKey || !sender || recipient.endsWith('@example.test'))) {
    return 'Lease email delivery is unavailable right now.';
  }

  nextRequestAt = Date.now() + 60_000;
  try {
    if (outbox) {
      await mkdir(outbox, { recursive: true, mode: 0o700 });
      const email = { to: recipient, subject, textContent: message, attachment: [attachment] };
      await writeFile(join(outbox, randomUUID() + '.json'), JSON.stringify(email, null, 2), { flag: 'wx', mode: 0o600 });
      return 'Sample lease email saved to the local test outbox.';
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { email: sender, name: 'Chakra Realty' },
        to: [{ email: recipient }],
        subject,
        textContent: message,
        attachment: [attachment],
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error('Lease email rejected');
    return 'Your sample lease was submitted for delivery to the email on file.';
  } catch {
    nextRequestAt = 0;
    return 'We could not process your lease email. Please try again.';
  }
}
