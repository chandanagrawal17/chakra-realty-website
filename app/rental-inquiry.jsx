'use client';

import { useActionState, useId, useRef } from 'react';
import { submitContactInquiry, submitRentalInquiry } from './rental-inquiry-action.mjs';

export default function RentalInquiry() {
  const dialog = useRef(null);

  return <>
    <button type="button" className="button rental-interest" onClick={() => dialog.current.showModal()}>
      I’m Interested <span aria-hidden="true">→</span>
    </button>
    <dialog ref={dialog} className="rental-inquiry" aria-labelledby="rental-inquiry-title">
      <h2 id="rental-inquiry-title">Interested in Maple Court?</h2>
      <InquiryForm />
      <form method="dialog"><button className="rental-close" type="submit">Close</button></form>
    </dialog>
  </>;
}

export function InquiryForm({ contact = false }) {
  const id = useId();
  const [state, action, pending] = useActionState(contact ? submitContactInquiry : submitRentalInquiry, {});

  return state.accepted ? <p role="status">{state.message}</p> : <form className="inquiry-form" action={action} aria-describedby={id + '-follow-up'}>
        <label htmlFor={id + '-name-input'}>Full name</label>
        <input id={id + '-name-input'} name="name" autoComplete="name" maxLength={120} defaultValue={state.fields?.name} required />
        <label htmlFor={id + '-phone'}>Phone number</label>
        <input id={id + '-phone'} name="phone" type="tel" autoComplete="tel" maxLength={30} defaultValue={state.fields?.phone} required />
        <label htmlFor={id + '-email'}>Email address</label>
        <input id={id + '-email'} name="email" type="email" autoComplete="email" maxLength={254} defaultValue={state.fields?.email} required />
        <label htmlFor={id + '-address'}>Current address</label>
        <textarea id={id + '-address'} name="address" autoComplete="street-address" maxLength={300} rows={2} defaultValue={state.fields?.address} required />
        <button className="button" type="submit" disabled={pending}>{pending ? 'Submitting…' : contact ? 'Send message' : 'Send inquiry'}</button>
        <p id={id + '-follow-up'}>Someone from Chakra Realty will reach out after you submit this form.</p>
        {state.message && <p role="alert">{state.message}</p>}
      </form>;
}
