import RentalInquiry, { InquiryForm } from '../rental-inquiry.jsx';
import Portal from '../portal.jsx';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { demoAccountEnabled, sessionCookie, validSession } from '../demo-session.mjs';
import { inquiry, property, rent, repair, routes } from '../content.mjs';

const guide = '/residents/' + property.slug;
const listing = '/properties/' + property.slug;
const titles = {
  rentals: 'Find a Rental', properties: 'Properties', [listing.slice(1)]: property.name,
  [guide.slice(1)]: 'Move-in guide', contact: 'Contact', services: 'Optional paid services', privacy: 'Privacy', 'sign-in': 'Sign in', dashboard: 'Dashboard preview',
};

export async function generateMetadata({ params }) {
  const path = ((await params).segments || []).join('/');
  return titles[path] ? { title: titles[path] } : {};
}

function Intro({ label, title, children }) {
  return <section className="intro"><p className="eyebrow">{label}</p><h1>{title}</h1><p className="lede">{children}</p></section>;
}
function Card({ title, children, href, label }) {
  return <article className="card"><h2>{title}</h2><p>{children}</p>{href && <a className="arrow" href={href}>{label}<span aria-hidden="true"> ↗</span></a>}</article>;
}
function ContactLink({ name }) {
  const link = inquiry(process.env.CHAKRA_CONTACT_EMAIL, name);
  return link ? <a className="button" href={link}>Email Chakra Realty</a> : <p>The company inbox is awaiting approval for this preview.</p>;
}
function Home() {
  return <div className="home">
    <section className="home-hero" aria-labelledby="home-title">
      <nav className="home-menu" aria-label="Main navigation">
        <a href="/rentals">Find a Rental</a>
        <a className="home-sign-in" href="/sign-in">Resident Portal</a>
      </nav>
      <div className="home-copy">
        <h1 id="home-title">Chakra Realty</h1>
        <p className="home-tagline">Your home. Our priority. Carefree living.</p>
        <a className="button home-rentals" href="/rentals">Explore Rentals</a>
      </div>
    </section>
    <section className="home-services" id="home-services" aria-labelledby="home-services-title">
      <h2 id="home-services-title">Our Services</h2>
      <div className="home-service-grid">
        <Card title="Tenant Management" href="/sign-in" label="Resident Portal">Sign in to view your lease details and access resident services.</Card>
        <Card title="Maintenance Support" href={repair} label="Open Stessa">Submit a repair request or check its status in the Stessa Resident Portal.</Card>
      </div>
    </section>
  </div>;
}

function Rentals() {
  const rentalName = 'Maple Court';

  return <div className="rental-page">
    <div className="rental-hero">
      <header className="rental-header">
        <a className="rental-brand" href="/">Chakra Realty</a>
        <nav aria-label="Rental navigation">
          <a href="/rentals" aria-current="page">Find a Rental</a>
          <a href="/sign-in">Resident Portal</a>
        </nav>
      </header>
      <h1>Available Listings</h1>
    </div>
    <div className="rental-results">
      <article className="rental-tile" aria-labelledby="rental-name">
        <div>
          <p className="rental-label">Sample listing</p>
          <h2 id="rental-name">{rentalName}</h2>
          <p>2 bedrooms · 1 bathroom</p>
        </div>
        <RentalInquiry />
      </article>
    </div>
  </div>;
}

function Guide() {
  return <><Intro label="SAMPLE PROPERTY GUIDE" title={property.name}>Illustrative move-in information. Confirm property instructions with your management team.</Intro>
    <div className="grid guide">{property.guide.map(([title, text]) => <Card key={title} title={title}>{text}</Card>)}</div>
    <section className="section"><h2>Move-in checklist</h2><ol><li>Confirm move-in timing with your property contact.</li><li>Verify utilities and parking arrangements.</li><li>Look for your Stessa invitation in your lease inbox.</li><li>Save your regular and after-hours contacts from your lease materials.</li></ol>
    <a href="/contact#urgent">Regular and after-hours support</a></section></>;
}
function Properties({ detail }) {
  return detail ? <><Intro label="ILLUSTRATIVE LISTING" title={property.name}>{property.location} · Sample property for local review</Intro>
    <div className="split"><img className="property-art" src="/courtyard.svg" alt="Illustration of the sample apartment building" />
    <div className="card"><h2>Availability</h2><p>No confirmed availability at this time.</p><ContactLink name={property.name} /><a href={guide}>View sample move-in guide</a></div></div></> :
    <><Intro label="FIND A HOME" title="Properties">Browse the sample property for this preview.</Intro>
    <article className="listing card"><img className="property-art" src="/courtyard.svg" alt="" /><div><p className="eyebrow">SAMPLE PROPERTY</p><h2>{property.name}</h2><p>{property.location}</p><p>No confirmed availability.</p><a className="arrow" href={listing}>View property details →</a></div></article></>;
}
function Contact() {
  return <div className="rental-page">
    <div className="rental-hero">
      <header className="rental-header">
        <a className="rental-brand" href="/">Chakra Realty</a>
        <nav aria-label="Contact navigation">
          <a href="/rentals">Find a Rental</a>
          <a href="/sign-in">Resident Portal</a>
        </nav>
      </header>
      <h1>Contact Chakra Realty</h1>
    </div>
    <div className="rental-results contact-content">
      <section className="contact-panel" aria-labelledby="contact-form-title">
        <h2 id="contact-form-title">Send us a message</h2>
        <p>For property questions, resident support, or help with Stessa.</p>
        <InquiryForm contact />
      </section>
      <aside className="contact-panel" id="urgent">
        <h2>Urgent and after-hours support</h2>
        <p>Use the after-hours number supplied in your lease or move-in materials. For immediate danger, call 911.</p>
        <p>Property-specific support numbers are pending approval.</p>
      </aside>
    </div>
  </div>;
}
function Services() {
  return <><Intro label="OPTIONAL PAID SERVICES" title="Services for your home">A separate place to explore optional services.</Intro>
    <Card title="Apartment cleaning · Proposed pilot">Service scope, eligibility, quotes, response times, and cancellation terms are pending approval. Requests are currently closed.</Card>
    <p>For maintenance, <a href={repair}>open the Stessa Resident Portal</a>.</p></>;
}
function Privacy() {
  return <><Intro label="DRAFT FOR REVIEW" title="Privacy">This preview contains sample property information.</Intro>
    <div className="card"><h2>Contact information and preferences</h2><p>The preview has no resident registration or booking form. Rent and maintenance links take you to Stessa, which handles those requests. Marketing signup is currently unavailable.</p><a href="/contact">Contact information</a></div></>;
}
export default async function Page({ params, searchParams }) {
  const path = ((await params).segments || []).join('/');
  if (path === '' || path === 'sign-in' || path === 'dashboard') {
    const dashboard = path === 'dashboard';
    const session = (await cookies()).get(sessionCookie)?.value;
    const signedIn = validSession(session);
    if (dashboard && !signedIn) redirect('/sign-in');
    if (!dashboard && signedIn) redirect('/dashboard');
    if (path === '') return <Home />;

    const invalidCredentials = (await searchParams).error === 'credentials';
    return <Portal dashboard={dashboard} enabled={demoAccountEnabled()} invalidCredentials={invalidCredentials} />;
  }
  if (!routes.includes(path)) notFound();
  if (path === 'rentals') return <Rentals />;
  if (path === guide.slice(1)) return <Guide />;
  if (path === 'properties' || path === listing.slice(1)) return <Properties detail={path !== 'properties'} />;
  if (path === 'contact') return <Contact />;
  if (path === 'services') return <Services />;
  if (path === 'privacy') return <Privacy />;
  notFound();
}
