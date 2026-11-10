const actions = ['Request maintenance', 'Payment history', 'Lease documents'];

export default function Portal({ dashboard }) {
  return <section className="portal portal-1">
    <header className="portal-header"><a href="/">Chakra Realty</a><span>Design preview</span></header>
    {dashboard ? <div className="portal-dashboard">
      <div><p className="portal-label">Maple Court · Unit 2B · Sample</p><h1>Welcome home, Alex.</h1></div>
      <article className="portal-highlight"><p className="portal-label">Next rent payment</p><h2>$1,650</h2><p>Due December 1 · Sample balance</p></article>
      <section className="portal-services"><h2>Resident services</h2><ul>{actions.map(action => <li key={action}>{action}</li>)}</ul></section>
      <section className="portal-update"><h2>Recent update</h2><p>Your sample maintenance request is scheduled for Tuesday.</p></section>
      <a href="/sign-in">Back to sign-in preview</a>
    </div> : <div className="portal-login">
      <section className="portal-card">
        <h1>Sign in</h1><p>Chakra Realty resident portal</p>
        <label htmlFor="preview-email">Email address</label><input id="preview-email" placeholder="you@example.com" disabled />
        <label htmlFor="preview-password">Password</label><input id="preview-password" type="password" placeholder="Enter your password" disabled />
        <a className="portal-button" href="/dashboard">Preview dashboard</a>
        <p className="portal-label">Sample account. No credentials needed.</p>
      </section>
    </div>}
  </section>;
}
