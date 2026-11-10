import './site.css';

export const metadata = {
  title: { default: 'Chakra Realty', template: '%s | Chakra Realty' },
  description: 'Find a home, move-in information, and resident support from Chakra Realty.',
  robots: { index: false, follow: false },
};
const links = [['/', 'Home'], ['/properties', 'Properties'], ['/sign-in', 'Resident Portal'], ['/services', 'Services'], ['/contact', 'Contact']];

export default function Layout({ children }) {
  return <html lang="en"><body>
    <a className="skip" href="#main">Skip to content</a>
    <div className="preview">Local preview <span>·</span> Sample property and draft content</div>
    <header><div className="wrap bar">
      <a className="brand" href="/"><span aria-hidden="true" className="mark">◈</span> Chakra Realty</a>
      <nav aria-label="Main navigation">{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
    </div></header>
    <main id="main" className="wrap">{children}</main>
    <footer><div className="wrap bar"><span>Chakra Realty <span className="muted">/ Resident resources</span></span><nav aria-label="Footer"><a href="/contact">Contact</a><a href="/privacy">Privacy</a></nav></div></footer>
  </body></html>;
}
