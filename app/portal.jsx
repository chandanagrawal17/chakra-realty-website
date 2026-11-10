import { signIn, signOut } from './portal-actions.mjs';

import { rent, repair } from './content.mjs';
import RequestLeaseCopy from './request-lease-copy.jsx';

export default function Portal({ dashboard, enabled, invalidCredentials }) {
  return <section className={dashboard ? 'portal portal-1 portal-dashboard-theme' : 'portal portal-1'}>
    <header className="portal-header">
      <a href="/">Chakra Realty</a>
      {dashboard && <form action={signOut}><button className="portal-button" type="submit">Sign out</button></form>}
    </header>
    {dashboard ? <div className="portal-dashboard">
      <div><p className="portal-label">Maple Court · Unit 2B · Sample</p><h1>Welcome home, Alex.</h1></div>
      <section className="portal-highlight" aria-labelledby="portal-lease-details">
        <h2 id="portal-lease-details">Lease details</h2>
        <dl className="portal-lease-amounts">
          <div><dt>Rent amount</dt><dd>$1,650 <span>/ month</span></dd></div>
          <div><dt>Security deposit (sample)</dt><dd>$1,650</dd></div>
        </dl>
      </section>
      <section className="portal-services">
        <h2>Resident services</h2>
        <ul>
          <li><a href={rent} target="_blank" rel="noopener noreferrer">Pay Rent</a></li>
          <li><a href={repair} target="_blank" rel="noopener noreferrer">Request maintenance</a></li>
          <li><RequestLeaseCopy /></li>
        </ul>
      </section>
      <section className="portal-services">
        <h2><a href={repair} target="_blank" rel="noopener noreferrer">View on Stessa</a></h2>
        <ul>
          <li>Payment History</li>
          <li>Rent Balance</li>
          <li>Maintenance History</li>
        </ul>
      </section>
    </div> : <div className="portal-login">
      <section className="portal-card">
        <h1>Sign in</h1><p>Chakra Realty resident portal</p>
        {enabled ? <form action={signIn}>
          {invalidCredentials && <p role="alert">Email or password is incorrect.</p>}
          <label htmlFor="demo-email">Email address</label>
          <input id="demo-email" name="email" type="email" autoComplete="username" maxLength={254} required />
          <label htmlFor="demo-password">Password</label>
          <input id="demo-password" name="password" type="password" autoComplete="current-password" maxLength={128} required />
          <button className="portal-button" type="submit">Sign in</button>
          <p className="portal-label">Demo account only. The dashboard contains sample data.</p>
        </form> : <p>Demo sign-in is unavailable in this environment.</p>}
      </section>
    </div>}
  </section>;
}
