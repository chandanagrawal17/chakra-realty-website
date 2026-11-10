import Portal from '../portal.jsx';
import { notFound } from 'next/navigation';
import { inquiry, property, rent, repair, routes } from '../content.mjs';

const guide = '/residents/' + property.slug;
const listing = '/properties/' + property.slug;
const titles = {
  properties: 'Properties', [listing.slice(1)]: property.name, residents: 'Residents',
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
  return <section className="home-hero" aria-labelledby="home-title">
    <nav className="home-menu" aria-label="Main navigation">
      <a href="/services">Services</a>
      <a href="/sign-in">Sign In</a>
    </nav>
    <div className="home-copy">
      <h1 id="home-title">Chakra Realty</h1>
      <p className="home-tagline">Your home. Our priority. Carefree living.</p>
      <p className="home-description">Leasing, maintenance, and resident support.</p>
      <a className="button home-contact" href="/contact">Talk to Our Team</a>
    </div>
  </section>;
}

function Residents() {
  return <>
    <Intro label="RESIDENT RESOURCES" title="Residents">Rent, repairs, and help getting settled.</Intro>
    <div className="grid">
      <Card title="Pay Rent" href={rent} label="Pay Rent in Stessa">View your balance, make a payment, or manage autopay.</Card>
      <Card title="Request a Repair" href={repair} label="Request a Repair in Stessa">Submit a maintenance request or check an existing one.</Card>
      <Card title="Urgent support" href="/contact#urgent" label="See urgent support guidance">Find out where to turn when a repair cannot wait.</Card>
    </div>
    <section className="section split"><div><p className="eyebrow">GET SETTLED</p><h2>Move-in information</h2><a href={guide}>View the sample Courtyard Apartments guide</a></div>
      <div><h2>Stessa access help</h2><p>Use your existing Stessa account. If you are new, check your lease email for an invitation. If you can sign in but do not see rent or maintenance, ask your property contact to check that access is enabled.</p></div></section>
    <section className="section"><Card title="Optional paid services" href="/services" label="Explore the proposed service">See the service under consideration for the pilot.</Card></section>
  </>;
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
  return <><Intro label="GET IN TOUCH" title="Contact Chakra Realty">Property questions, resident support, and Stessa access help.</Intro>
    <div className="split"><article className="card"><h2>General inquiries</h2><ContactLink /></article>
    <article className="card" id="urgent"><h2>Urgent and after-hours support</h2><p>Use the after-hours number supplied in your lease or move-in materials. For immediate danger, call 911.</p><p>Property-specific support numbers are pending approval.</p></article></div></>;
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
export default async function Page({ params }) {
  const path = ((await params).segments || []).join('/');
  if (path === 'sign-in' || path === 'dashboard') {
    return <Portal dashboard={path === 'dashboard'} />;
  }
  if (!routes.includes(path)) notFound();
  if (path === 'residents') return <Residents />;
  if (path === guide.slice(1)) return <Guide />;
  if (path === 'properties' || path === listing.slice(1)) return <Properties detail={path !== 'properties'} />;
  if (path === 'contact') return <Contact />;
  if (path === 'services') return <Services />;
  if (path === 'privacy') return <Privacy />;
  return <Home />;
}
