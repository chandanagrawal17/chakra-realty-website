# Chakra Realty MVP implementation plan

Engineering handoff · November 10, 2026

[Product requirements](product-requirements.md) · [Test plan](test-plan.md)

## Architecture

Use a single Next.js App Router application. Serve public pages from reviewed content in the repository, and keep staff pages, booking requests, and private booking views server-rendered. Run the app over HTTPS on Chakra-owned hosting with separate development, staging, and production environments. Use Supabase Postgres for persistence and Supabase Auth for invite-only staff access. [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) · [Supabase data access](https://supabase.com/docs/guides/database/secure-data)

| System | Integration for the pilot |
| --- | --- |
| Stessa | Use normal outbound links. Staff sends rent and maintenance invitations in Stessa and records the status in Chakra. Rent and repairs work independently of Chakra login, bookings, and marketing. [Rent payment entry point](https://resident.stessa.com/pay) · [Resident Portal](https://resident.stessa.com) |
| Stripe | Staff issues an invoice from the Stripe Dashboard after confirming the service, price, and time. Staff records the invoice ID and verified status in Chakra. Stripe emails the hosted invoice and processes payment. [Stripe Invoicing](https://docs.stripe.com/invoicing/overview) |
| Brevo | Use a hosted double opt-in form linked from Chakra. Track the form source and confirmation in Brevo. Use a separately configured transactional sender for onboarding and booking mail, with transactional sending independent of campaign preferences. [Brevo double opt-in tracking](https://help.brevo.com/hc/en-us/articles/208733449-Double-opt-in-DOI-What-it-is-and-how-to-track-user-sign-ups) |
| Analytics | Use a first-party endpoint for coarse daily counts of rent and repair clicks. Derive booking conversion from Chakra's booking records. |

## Routes and screens

| Path | Behavior |
| --- | --- |
| `/`, `/properties`, `/properties/[slug]`, `/contact` | Public branding, approved listings, and inquiry links to the monitored company inbox. Use a property name in the inquiry subject and show an empty state when no availability is confirmed. |
| `/residents`, `/residents/[propertySlug]` | Show the three primary actions, Stessa access help, contact routing, and public guide. Link rent to the Stessa payment entry point and repairs to the Stessa Resident Portal. Keep these as plain links so navigation works when analytics fails. |
| `/services`, `/services/request` | Show the active pilot service and capture a request. Validate on the server. Return a clear success or retry state. |
| `/booking/access`, `/booking/manage` | Provide the private email-link exchange, a generic resend flow, and a booking-scoped view and change or cancellation form. |
| `/staff/residents`, `/staff/bookings`, `/staff/metrics` | Provide staff sign-in, directory search, occupancy and onboarding actions, booking and change queues, and pilot counts. Include admin-only import and export under the directory. |
| `/privacy` | Explain collection, use, marketing preferences, and the company support contact. Publish owner-approved language. |

Use shared components for property contacts and links. Keep property-specific entry codes, access credentials, or other sensitive instructions out of public guides. Give the site an approved phone or email fallback wherever a task relies on a provider.

## Data model

| Entity | Core fields and rules |
| --- | --- |
| `properties`, `units` | Stable IDs, approved public property slug, property time zone, unit label unique within property. Internal unit assignments remain private. Public pages use a separately reviewed content record keyed by property slug. |
| `residents`, `occupancies` | Resident name, normalized email, optional phone, and a linked occupancy with unit, move-in and move-out dates, and status. Support multiple residents per unit. Close the occupancy when someone moves out and keep prior history. Reject ambiguous roster matches for staff review. |
| `onboarding` | Occupancy ID, separate Stessa rent and repair invitation timestamps and status, welcome email delivery state, and last staff update. Staff confirms access manually. |
| `services`, `bookings` | Enabled service and property, contact name and email, optional phone, unit for on-site work, preferred date and time window, optional notes, confirmed time, quote in integer USD cents, status, optional Stripe invoice ID, and payment status. An optional staff-verified resident reference links a booking to the directory. |
| `booking_changes` | Booking ID, request type, proposed timing or reason, creation time, and pending or resolved outcome. Keep staff-only notes separate from resident-facing messages. |
| `booking_access` | Booking ID, hashed single-use email token, expiration, use timestamp, and scoped session records. |
| `email_outbox`, `staff_audit`, `daily_counts` | Pending outbound notifications and delivery attempts, staff action metadata for sensitive updates and exports, and aggregate click counts by day and action. |

Store timestamps in UTC and display service times in the property's time zone. Use explicit local date and time windows for a preference, and a validated timestamp when staff confirms a time. Use database constraints for references, invoice ID uniqueness, and duplicate submissions. Generate an idempotency key per form submission and return the original result on retry. Normalize and validate email and phone inputs. Treat names, notes, and imported text as plain text.

## Workflow contracts

### Onboarding and roster import

1. Bootstrap an admin through a controlled setup step. Invite named staff and require MFA before granting directory or booking access. Use two roles, staff and admin. Staff manage resident and booking workflows. Admins also import, export, and manage access. Check active membership and MFA on each protected request. [Supabase MFA](https://supabase.com/docs/guides/auth/auth-mfa)
2. Provide a CSV template for verified names, emails, optional phones, property and unit, and occupancy dates. Staff can use the Stessa Excel rent roll to cross-check tenant names and units, then verify emails against lease records before preparing the CSV. [Stessa rent roll export](https://support.stessa.com/en/articles/4610851-understanding-your-rent-roll-report)
3. Preview creates, unchanged rows, conflicts, and invalid rows before applying. Match conservatively using verified normalized email and the known property and unit. Require staff to resolve ambiguous matches and moves rather than silently merging or closing records. Apply valid, reviewed changes in a transaction. Repeat imports should be safe. Escape spreadsheet formula cells on export.
4. Staff records Stessa invitation steps individually, sends the approved Chakra welcome email, and can resend it from the staff screen. Include the property guide and the Residents hub. Imports create roster records without sending invitations or adding people to campaigns.

### Service request, changes, and payment

1. Capture name, email, service, property and unit when the service requires it, and a preferred date or time window. Phone and a short note are optional. Ask users to keep payment details and entry codes out of the form. Save the request and enqueue the acknowledgement atomically.
2. Use booking states `requested`, `confirmed`, `completed`, and `cancelled`. Staff checks service eligibility and availability before confirming. Allow `requested → confirmed` only with a quote and confirmed time. Allow `confirmed → completed` after fulfillment. Allow staff to cancel a requested or confirmed booking. A guest change or cancellation request creates a separate pending item and leaves the booking as-is until staff decides. Notify the tenant when staff confirms, changes, or cancels the booking. Include the booking reference in acknowledgement and update emails so the resident can request a fresh link.
3. Keep payment status separate from booking status. Use `not_invoiced`, `invoiced`, `paid`, `void`, and `refunded`. Staff verifies the invoice in Stripe before updating Chakra and checks for an existing invoice before sending another. For cancellations with open or paid invoices, staff follows the approved void or refund policy in Stripe and records the outcome. Count a booking as a completed paid job only while it is completed and marked paid.
4. Send email through a durable outbox with a scheduled worker. Persist delivery attempts and provider references, retry with backoff, and surface exhausted retries to staff. Use a stable notification key per booking event or welcome action. A mail outage leaves accepted requests visible in the queue. An intentional resend is recorded separately.

### Booking links

- Generate an opaque high-entropy token and store its hash in the booking access table. Default expiry is 24 hours and should be configurable. If the mail worker needs to retain the same link for retry, keep the delivery payload encrypted and discard it on delivery, expiry, or terminal failure. Invalidate earlier unused links when issuing a replacement. An email link opens a page with a **View booking** button. Exchange the token on POST so automated email previews can load the landing page safely.
- Consume the token and create a booking-scoped session atomically. Use a Secure, HttpOnly, SameSite cookie with a 30-minute lifetime. Redirect to a clean URL and apply `Cache-Control: no-store` and `Referrer-Policy: no-referrer` to booking access and management pages. Disable click tracking on private-link emails. Exclude tokens and sensitive fields from request logs.
- Resolve the booking from the server-side session for every read and write. Require same-origin requests for changes. Rate-limit request submission, token exchange, and resend. Ask for email and booking reference on resend and return the same public message whether a match exists or not.

### Campaigns and measurement

- Link to the Brevo form from Residents and the service area as a separate optional action. Use a dedicated confirmed audience. Retain consent source and confirmation evidence in Brevo, and honor unsubscribes through the campaign list. Send from an approved domain and use a valid postal address and unsubscribe link. Use a test audience before any campaign goes live. [FTC email guidance](https://search.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)
- Count `rent_clicked` and `repair_clicked` only on explicit activation. Send the event without blocking the outbound link. Store only approved action, surface, and day in aggregate. Exclude emails, unit details, raw URLs, and personal identifiers from analytics. Group booking conversion by request date and show the reporting window and both counts.
- Give operations a weekly review checklist for repeated questions by topic, booking backlog, delivery failures, and service performance. Keep topic counts free of personal details.

## Security and operations

- Keep private data in server-only tables with least-privilege database roles. Restrict or disable public Data API access to private data, and use row policies for any exposed table. Enforce staff and booking scopes server-side. Disable public staff registration, log sensitive actions, and test that revoking a staff account blocks its active session from further access.
- Validate form input and limits server-side, protect state-changing requests, sanitize output, and set private responses to no-store. Keep secrets out of source control and browser code. Keep production PII out of staging, fixtures, logs, and analytics.
- Define backups and retention with the owner. Verify a restore using synthetic data. Set up alerts for failed writes or mail delivery. Keep separate configuration switches for bookings and marketing so staff can pause them while leaving rent, repair, and contact links available. Preserve already-submitted bookings when taking new requests offline.

## Build order

| Slice | Owner | Deliverable and dependency |
| --- | --- | --- |
| 1. Foundation and public site | Engineering + Operations | Set up environments, content schema, and mobile page shell. Ship Home, Properties, Contact, Residents, guide, and Stessa links to staging. Use clearly labeled fixtures while Operations supplies content. |
| 2. Staff directory | Engineering + Operations | Add migrations, invite-only staff access, directory, CSV preview and export, onboarding checklist, and welcome email. Verify with a sanitized sample. |
| 3. Paid service workflow | Engineering + Service owner | Add guest requests, private booking access, staff queues, notifications, and manual Stripe reconciliation. Run a complete test invoice lifecycle. |
| 4. Campaigns and pilot reporting | Marketing + Engineering | Configure Brevo, consent evidence, suppression, and first-party counts. Validate test audiences and the staff metrics page. |
| 5. Pilot readiness | QA + Operations | Run the test plan, rehearse support and rollback, approve content and policies, and get sign-off before inviting pilot residents. |

Engineering can start with a staging-only site and synthetic fixtures. Production activation depends on the decisions in the [product requirements](product-requirements.md#decisions-required-for-pilot-launch).
