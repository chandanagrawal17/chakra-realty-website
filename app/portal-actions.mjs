'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSession, sessionCookie, sessionSeconds, validCredentials, validSession } from './demo-session.mjs';
import { sendLeaseCopy } from './lease-mail.mjs';

export async function signIn(form) {
  if (!validCredentials(form.get('email'), form.get('password'))) {
    redirect('/sign-in?error=credentials');
  }

  const jar = await cookies();
  jar.set(sessionCookie, createSession(), {
    httpOnly: true,
    secure: process.env.CHAKRA_DEMO_ALLOW_HTTP !== 'true',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionSeconds,
  });
  redirect('/dashboard');
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(sessionCookie);
  redirect('/sign-in');
}

export async function requestLeaseCopy(_state, form) {
  const jar = await cookies();
  if (!validSession(jar.get(sessionCookie)?.value)) {
    return 'Your session has expired. Sign in again to request a copy.';
  }

  const emailOnFile = (process.env.CHAKRA_LEASE_TEST_EMAIL || process.env.CHAKRA_DEMO_EMAIL).trim().toLowerCase();
  const submittedEmail = form.get('email');
  if (typeof submittedEmail !== 'string' || submittedEmail.trim().toLowerCase() !== emailOnFile) {
    return 'Enter the email address on file for your tenancy.';
  }

  return sendLeaseCopy(emailOnFile);
}
