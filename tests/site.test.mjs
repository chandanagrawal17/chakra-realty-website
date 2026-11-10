import test from 'node:test';
import assert from 'node:assert/strict';
import { inquiry, property, rent, repair, routes } from '../app/content.mjs';

test('Stessa links are separate plain HTTPS destinations', () => {
  assert.equal(rent, 'https://resident.stessa.com/pay');
  assert.equal(repair, 'https://resident.stessa.com');
});
test('sample property has no unverified availability', () => {
  assert.equal(property.availability, null);
});
test('property and guide URLs use the same public slug', () => {
  assert.ok(routes.includes('properties/' + property.slug));
  assert.ok(routes.includes('residents/' + property.slug));
});
test('inquiry uses an encoded property subject', () => {
  const url = new URL(inquiry('contact@example.test', 'Courtyard & Garden'));
  assert.equal(url.pathname, 'contact@example.test');
  assert.equal(url.searchParams.get('subject'), 'Property inquiry — Courtyard & Garden');
});
test('inquiries default to a general subject when no property is selected', () => {
  assert.equal(new URL(inquiry('contact@example.test')).searchParams.get('subject'), 'Chakra Realty inquiry');
});
test('no fake contact link is rendered when the inbox is unconfigured', () => {
  assert.equal(inquiry(undefined), null);
});
