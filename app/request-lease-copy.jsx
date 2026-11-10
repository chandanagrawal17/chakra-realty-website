'use client';

import { useActionState, useRef } from 'react';
import { requestLeaseCopy } from './portal-actions.mjs';

export default function RequestLeaseCopy() {
  const dialog = useRef(null);
  const [message, action, pending] = useActionState(requestLeaseCopy, '');

  return <>
    <button className="portal-text-button" type="button" onClick={() => dialog.current.showModal()}>
      Request a Lease Copy
    </button>
    <dialog ref={dialog} className="portal-lease-dialog" aria-labelledby="request-lease-copy-title">
      <h2 id="request-lease-copy-title">Request a Lease Copy</h2>
      <p>Enter the email address on file for your tenancy. Your lease copy goes to that address.</p>
      <form action={action} className="portal-lease-request">
        <label htmlFor="lease-copy-email">Email address on file</label>
        <input id="lease-copy-email" name="email" type="email" autoComplete="email" maxLength={254} required />
        <button className="portal-button" type="submit" disabled={pending}>
          {pending ? 'Requesting…' : 'Email my lease copy'}
        </button>
        {message && <p role="status">{message}</p>}
      </form>
      <form method="dialog"><button className="portal-text-button" type="submit">Close</button></form>
    </dialog>
  </>;
}
