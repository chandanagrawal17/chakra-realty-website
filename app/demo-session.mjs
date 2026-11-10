import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const sessionCookie = 'chakra_demo_session';
export const sessionSeconds = 30 * 60;

function equal(left, right) {
  const digest = value => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(left), digest(right));
}

export function demoAccountEnabled() {
  return Boolean(process.env.CHAKRA_DEMO_EMAIL?.endsWith('@example.test')
    && process.env.CHAKRA_DEMO_PASSWORD
    && process.env.CHAKRA_DEMO_SESSION_SECRET?.length >= 32);
}

export function validCredentials(email, password) {
  if (!demoAccountEnabled() || typeof email !== 'string' || typeof password !== 'string') return false;
  const emailMatches = equal(email.trim().toLowerCase(), process.env.CHAKRA_DEMO_EMAIL);
  const passwordMatches = equal(password, process.env.CHAKRA_DEMO_PASSWORD);
  return emailMatches && passwordMatches;
}

function signature(expiry) {
  return createHmac('sha256', process.env.CHAKRA_DEMO_SESSION_SECRET)
    .update('resident-demo:' + expiry).digest('base64url');
}

export function createSession() {
  const expiry = Math.floor(Date.now() / 1000) + sessionSeconds;
  return expiry + '.' + signature(expiry);
}

export function validSession(token) {
  if (!demoAccountEnabled() || !token) return false;
  const match = /^(\d{10,11})\.([\w-]{43})$/.exec(token);
  return Boolean(match && Number(match[1]) > Date.now() / 1000 && equal(match[2], signature(match[1])));
}
