'use server';

import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

async function submitInquiry(form, rental) {
  const fields = Object.fromEntries(['name', 'phone', 'email', 'address'].map(key => {
    const value = form.get(key);
    return [key, typeof value === 'string' ? value.trim() : ''];
  }));
  const { name, phone, email, address } = fields;
  const digits = phone.replace(/\D/g, '');
  if (!name || name.length > 120 || phone.length > 30 || digits.length < 7 || digits.length > 15
      || !/^[+\d\s().-]+$/.test(phone) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || !address || address.length > 300) {
    return { message: 'Enter your name, a valid phone number and email, and your current address.', fields };
  }

  const subject = rental ? 'Maple Court rental inquiry' : 'Chakra Realty contact inquiry';
  const context = rental ? 'Listing: Maple Court (sample)' : 'Source: Contact page';
  const textContent = [context, 'Name: ' + name, 'Phone: ' + phone,
    'Email: ' + email, 'Current address: ' + address].join('\n');

  try {
    const outbox = process.env.CHAKRA_RENTAL_TEST_OUTBOX;
    if (outbox) {
      await mkdir(outbox, { recursive: true, mode: 0o700 });
      await writeFile(join(outbox, randomUUID() + '.json'), JSON.stringify({ subject, textContent }), {
        flag: 'wx', mode: 0o600,
      });
      return { accepted: true, message: 'Test inquiry saved locally.' };
    }

    const recipient = process.env.CHAKRA_CONTACT_EMAIL;
    const sender = process.env.CHAKRA_LEASE_SENDER;
    const apiKey = process.env.CHAKRA_BREVO_API_KEY;
    if (recipient && sender && apiKey) {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: { email: sender, name: 'Chakra Realty' },
          to: [{ email: recipient }],
          replyTo: { email },
          subject,
          textContent,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) {
        return { accepted: true, message: 'Inquiry sent. Someone from Chakra Realty will reach out.' };
      }
    }
  } catch {
    return { message: 'We couldn’t submit your inquiry. Please try again.', fields };
  }
  return { message: 'Inquiry delivery is unavailable right now. Please try again later.', fields };
}

export async function submitRentalInquiry(_state, form) {
  return submitInquiry(form, true);
}

export async function submitContactInquiry(_state, form) {
  return submitInquiry(form, false);
}
