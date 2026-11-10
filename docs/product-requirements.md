# Chakra Realty website MVP

Product requirements · Draft for team kickoff · November 10, 2026

[Implementation plan](implementation-plan.md) · [Test plan](test-plan.md)

## Product goal

Make chakra-realty.com the place residents go to find help, get settled, and book optional services. Give Chakra Realty an exportable resident directory and a permission-based marketing list. Keep rent collection and maintenance requests in Stessa.

Pilot at one property with one paid service. Apartment cleaning is a candidate for the pilot. Operations will choose the property and service before launch.

## What each person sees

| Person | What they can see and do |
| --- | --- |
| Resident or visitor | Browse Home, Properties, Contact, and Residents. Find public property guides and support contacts. Open Stessa for rent or repairs. Request an optional service and sign up for offers. |
| Resident with a verified booking email | Open a private page for that booking. See the service, dates, quoted price when available, booking and payment status, and request a change or cancellation. |
| Authorized Chakra staff | Search resident and occupancy records, run move-in and move-out workflows, send welcome emails, manage service requests and internal notes, and record service invoice status. Authorized admins can import and export directory data. |
| Resident in Stessa | Use their existing Stessa account to see rent balances, payment history and autopay, and submit or track maintenance requests once access is enabled. |

## Resident journeys

1. **New move-in.** After the lease is signed, staff creates the resident and occupancy records. Staff enables rent and maintenance access in Stessa using the lease email and sends a Chakra welcome email with a link to the property guide and instructions to look for the Stessa invitation or invitations. Stessa is the only account the resident sets up at move-in. [Stessa rent setup](https://support.stessa.com/en/articles/6202921-stessa-rent-collection-for-tenants) · [Stessa maintenance setup](https://support.stessa.com/en/articles/11739024-stessa-maintenance)
2. **Existing resident.** Open or bookmark the new Residents page and continue using the existing Stessa login. Staff can seed Chakra's directory from verified records without asking residents to register again.
3. **Get help.** Tap **Pay Rent**, **Request a Repair**, or the property’s urgent support number. The page explains when to use each route and where to go for Stessa access help.
4. **Book a service.** Choose a service and provide contact details and a preferred time. Get an email acknowledging the request. Staff confirms availability and price, then sends a separate Stripe invoice. Use the private link in the booking email to see status or request a change. [Stripe Invoicing](https://docs.stripe.com/invoicing/overview)
5. **Hear about offers.** Opt in through a separate email signup and confirm the address. Unsubscribe from campaigns while continuing to receive booking updates and normal rental communications. [Brevo signup forms](https://help.brevo.com/hc/en-us/articles/208771869-Create-a-sign-up-form-in-Brevo)

## MVP requirements

| ID | Feature | Acceptance criteria |
| --- | --- | --- |
| MVP-01 | Public company website | Mobile-friendly Home, Properties, and Contact pages show approved branding, public property details, and a way to inquire about a property. Availability appears only when verified and dated. Contact details are easy to find. |
| MVP-02 | Residents hub | The first screen presents clearly labeled rent and repair links to Stessa, with urgent support easy to find. Rent and repair links work without a Chakra sign-in. Optional Paid Services has a distinct section. |
| MVP-03 | Property guide and move-in checklist | One approved pilot guide covers utilities, trash and recycling, parking, packages, move-in tasks, and regular and after-hours contacts. Staff can share a direct link. Only information appropriate for a public page is published. |
| MVP-04 | Resident directory and onboarding | Authorized staff can find and update residents and property and unit assignments, preserve occupancy history, record Stessa invitation status, and send a welcome email. Admins can preview a roster import and export the directory as CSV. Existing Stessa users keep their login. |
| MVP-05 | Service request and acknowledgement | The site displays the service scope, price or quote process, eligibility, expected response time, and cancellation terms. A short form captures the request and preferred time without an account. The page and acknowledgement email both distinguish a received request from a confirmed appointment. |
| MVP-06 | Booking management and service payments | Staff can quote, confirm a time, manage changes and cancellations, and record fulfillment and Stripe invoice status. The tenant can use a private email link to see just that booking and submit a change or cancellation request. Payment goes through the Stripe invoice for the optional service. |
| MVP-07 | Permission-based email campaigns | The signup is optional and separate from the directory and booking form. Only confirmed subscribers enter the campaign audience. Chakra can verify signup source and confirmation time, send a test campaign, and honor unsubscribes. Reimporting the tenant directory preserves opt-outs. |
| MVP-08 | Pilot measurement | Staff can review counts of clicks to rent and repairs, submitted bookings, and completed paid bookings. Operations logs recurring resident questions by topic to improve guides. Stessa clicks measure handoffs. Actual rent payments and repair outcomes are tracked in Stessa. |
| MVP-09 | Privacy and accessibility | Staff access requires sign-in and a second factor. Residents can access only the booking tied to their verified email link. Public pages and forms work on mobile and with keyboard navigation. The site explains what contact information is collected and how to get support. |

## Data boundaries

| System | Information it owns |
| --- | --- |
| Chakra directory | Name, email, phone when needed, property and unit, occupancy dates and status, and onboarding progress. Staff maintain move-in and move-out records. |
| Chakra bookings | Service, contact details, requested and confirmed time, quote, request history, internal notes, and service invoice reference and status. |
| Stessa | Lease and rent operations, rent payment details, resident portal access, and maintenance history. |
| Brevo | Confirmed marketing email subscribers, signup and confirmation evidence, unsubscribe status, and campaign history. |
| Stripe | Hosted service invoices and payment information. |

## Pilot success

Review weekly for the first four weeks. Prioritize whether residents can complete a task and whether the service is operationally worthwhile.

- Walk through rent, repairs, move-in information, and service requests with a small group of pilot residents or staff acting as residents. Record where people get stuck.
- Review rent and repair button clicks separately. Track how many submitted requests are fulfilled and paid, using submissions from the same period. Show counts alongside the rate and allow time for bookings to finish.
- Compare repeated support questions by topic and use them to improve the property guide. Agree on the pilot targets before inviting residents. Daily visits are secondary for a site people use as needs arise.

## Later releases

A private resident account can add booking history, resident-only offers, the tenant’s own contact details and property or unit, and email preferences. Use a one-time email code when that feature ships. Consider live appointment scheduling and upfront service checkout after the pilot shows demand.

## Decisions required for pilot launch

| Owner | Decision or input |
| --- | --- |
| Operations | Pilot property, approved guide and phone numbers, urgent escalation instructions, available listings, and the staff member who owns move-ins and booking follow-up. |
| Service owner | Pilot service, eligibility, scope, price or quote policy, reply window, scheduling, and cancellation and refund terms. |
| Business owner | Chakra-owned hosting, sender email and business mailing address, Stripe and Brevo accounts, privacy notice, and retention periods. |
| Product and QA | Pilot cohort, success targets, and go-live sign-off. |
