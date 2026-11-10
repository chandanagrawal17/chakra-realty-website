# Chakra Realty MVP test plan

QA and pilot acceptance · November 10, 2026

[Product requirements](product-requirements.md) · [Implementation plan](implementation-plan.md)

## Scope and setup

Test the public site, move-in and move-out, resident directory, guest bookings, separate service invoicing, campaign consent, and pilot reporting. Use staging and synthetic records. For Stessa, verify Chakra's links and the actual invitation flow with an approved test setup. Do not submit live rent payments or real repair tickets as part of QA.

Prepare one pilot property with two units, a current household with two residents, a future move-in, a move-out, a different resident's booking, and a roster with duplicate and invalid rows. Create staff, admin, and revoked staff test users. Use test inboxes for transactional mail, a separate Brevo test audience, and a Stripe sandbox. Record the build, environment, test date, result, and evidence for each case. Redact tokens and contact details from evidence.

**P0** blocks launch. **P1** requires a fix or a documented exception from the product and operations owners. Automate stable workflows where practical and keep provider and content walkthroughs manual.

## Public website and Stessa

| Case | Requirement | Priority | Verify | Expected result |
| --- | --- | --- | --- | --- |
| PUB-01 | MVP-01 | P1 | Open Home, Properties, property details, and Contact from phone and desktop. Try an inquiry with and without a property. | Approved content and contact options are present. Inquiry reaches the monitored address, and the property subject is correct. |
| PUB-02 | MVP-01 | P1 | Open a property with no confirmed availability and one with an approved current listing. | The first shows a clear empty state. The second shows approved availability with a verification date. |
| PUB-03 | MVP-02 | P0 | In a signed-out browser, tap Pay Rent and Request a Repair. Repeat with analytics blocked and check both target destinations. | Rent opens Stessa's payment entry point and repairs opens the Resident Portal. Neither flow requires a Chakra account. Analytics failure does not block either link. |
| PUB-04 | MVP-02, MVP-03 | P0 | Ask a tester to find help for a leak after hours, then find the optional service. Review the public guide. | The tester reaches the approved urgent instructions and contact quickly. Paid services are distinct from maintenance. The guide contains the agreed move-in topics and only public information. |
| PUB-05 | MVP-02, MVP-09 | P1 | Navigate public pages and booking forms with keyboard and a screen reader. Check mobile Safari and Chrome plus a desktop browser at narrow widths and 200% zoom. | Actions have accessible names, focus is visible, errors can be read, and content and controls remain usable without sideways scrolling. |

## Onboarding and staff directory

| Case | Requirement | Priority | Verify | Expected result |
| --- | --- | --- | --- | --- |
| ONB-01 | MVP-04 | P0 | Run a new move-in. Create the occupancy, use the lease email in Stessa, track the rent and repair steps, and send the Chakra welcome email. | Staff can distinguish both invitation states. The tenant receives the correct guide and Residents links. Stessa handles account activation and access. Chakra requires no tenant registration. |
| ONB-02 | MVP-02, MVP-04 | P0 | Walk through the Residents page as an existing Stessa user with rent and maintenance already enabled. | The existing login remains usable. No new Stessa invitation or Chakra account is needed for these actions. |
| ONB-03 | MVP-04 | P0 | Preview a mixed roster with valid rows, duplicates, a conflicting unit, missing fields, and an unknown property. Apply the reviewed valid subset and repeat the import. | Preview classifies rows correctly and explains conflicts. The repeat creates no duplicates. Import sends no emails and enrolls nobody in marketing. |
| ONB-04 | MVP-04 | P1 | Move out one of two residents in a unit, then add a later occupant. Search active and past residents. | The original occupancy remains in history, the other resident stays active, and the new assignment is correct. |
| ONB-05 | MVP-04, MVP-09 | P0 | Try directory search and CSV export as staff and admin. Export a synthetic field starting with a spreadsheet formula character. | Staff can manage records. Only admins can export. Export is audited and opens as safe text without evaluating the field. |

## Guest booking and service payments

| Case | Requirement | Priority | Verify | Expected result |
| --- | --- | --- | --- | --- |
| BKG-01 | MVP-05 | P0 | Submit a valid request from a phone without an account. Review the service page, receipt screen, email, and staff queue. | Price or quote terms, eligibility, reply window, and cancellation terms are clear. One request appears in the queue, and the acknowledgement says the time is pending confirmation. |
| BKG-02 | MVP-05 | P0 | Submit missing, overlong, invalid, or unavailable inputs. Resubmit the same valid request twice and simulate a network retry. | Invalid requests get actionable messages. The same submission creates one booking and one acknowledgement job. |
| BKG-03 | MVP-06 | P0 | Confirm without a quote or time, then with both. Use a time-zone boundary case and try to mark an unconfirmed booking completed. | Invalid transitions are rejected. The correct local date, time, price, and status appear in the email, staff queue, and booking view. |
| BKG-04 | MVP-06 | P0 | Issue and pay a sandbox invoice for a confirmed booking. Verify it in Stripe, record it in Chakra, and mark the job fulfilled. | Stripe handles payment. Chakra stores the invoice ID and status, and the booking counts once as completed and paid. No card or bank fields appear in Chakra. |
| BKG-05 | MVP-06 | P1 | Request a reschedule and a cancellation from the private page. Have staff resolve each request, including an open invoice and a paid invoice. | A request alone leaves the confirmed appointment unchanged. Approved changes notify the tenant. Staff records the applicable Stripe void or refund, and voided or refunded payments are excluded from completed paid counts. |
| BKG-06 | MVP-05, MVP-06 | P0 | Disable transactional email delivery during submission, restore it, and test retry and staff resend. | The accepted request stays in the staff queue, delivery failure is visible, and retry delivers an acknowledgement without creating a second booking. |
| BKG-07 | MVP-05, MVP-06 | P1 | Pause new bookings with a pending request already in the queue. | The public service page explains availability. Existing bookings remain manageable and rent and repair links still work. |

## Data protection

| Case | Requirement | Priority | Verify | Expected result |
| --- | --- | --- | --- | --- |
| SEC-01 | MVP-09 | P0 | Open a private booking email, preview the link, then activate View booking. Reuse it, let a link expire, and request a fresh link. | Preview leaves the token usable. Activation creates one booking-scoped session. Used, expired, and superseded links fail. Resend restores access only through the booking email. |
| SEC-02 | MVP-09 | P0 | Use a valid session for booking A to request or change booking B. Try a signed-out browser and a change from an unrelated origin. | Access is denied, and no booking data or state change is exposed. |
| SEC-03 | MVP-09 | P0 | Check staff routes and underlying data access signed out, without MFA, with staff or admin access, and after revoking an active account. | Unauthorized requests are denied server-side. Staff and admin permissions match the role design. Revocation blocks the next protected request. |
| SEC-04 | MVP-09 | P0 | Inspect public responses, cache behavior, client assets, logs, exports, analytics, and email tracking with synthetic PII and tokens. | Public output contains no directory details or secrets. Private pages are not cached. Tokens, private notes, unit details, and personal analytics identifiers stay out of shared output and logs. |
| SEC-05 | MVP-09 | P1 | Repeatedly submit a public form and try the booking resend flow with existing and nonexistent references. | Rate limits apply. Resend gives the same outward response for both cases and does not expose the tenant or booking. |
| SEC-06 | MVP-09 | P1 | Review the privacy page and test backup restore with synthetic records. | The published notice and contact are approved. The team can restore and inspect expected records without using production data. |

## Marketing and measurement

| Case | Requirement | Priority | Verify | Expected result |
| --- | --- | --- | --- | --- |
| MKT-01 | MVP-07 | P0 | Import a resident, submit a service request, and submit the standalone signup. Confirm one signup and leave another pending. | Import and booking do not subscribe anyone. Only the confirmed address enters the test campaign audience, with signup source and confirmation time available. |
| MKT-02 | MVP-07 | P0 | Send a test campaign, inspect its sender, mailing address, and unsubscribe link. Unsubscribe, reimport the resident, and send a separate booking update. | The recipient remains suppressed from campaigns. The booking update and normal rent and repair access still work. |
| MET-01 | MVP-08 | P1 | Click Pay Rent and Request a Repair, then load and preview the page without clicking. Review recorded event fields. | The dashboard shows separate daily counts for intentional clicks. Loading the page creates no count. The event contains no contact or unit data. |
| MET-02 | MVP-08 | P1 | Seed requests across two weeks with paid, refunded, pending, and completed-but-unpaid outcomes. Review the dashboard and run a sample recurring-question review. | The dashboard shows the selected request cohort, its denominator, and completed paid total. It labels Stessa clicks as handoffs. Operations can log recurring question topics without recording identities. |

## Automation and release checks

- **Every change** runs unit tests for validation, allowed status transitions, roster matching, access expiry, and metric calculations. Integration tests cover database constraints, retry behavior, staff and guest authorization, and import and export.
- **Each release candidate** runs browser tests for the Residents links, guest request and management, staff actions, and failed email recovery. Run the manual Stessa, Stripe, and Brevo walkthroughs when their setup changes and before the pilot.
- **Before go-live** close all P0 failures, agree any P1 exceptions, approve pilot content and operating policies, and demonstrate the complete move-in and paid-service flows. Operations confirms who checks booking requests, email failures, and campaign suppression. Engineering demonstrates how to pause bookings and marketing independently.
- **After deployment** smoke-test the Residents links and contact information on mobile and confirm staff sign-in. Use approved test addresses and test-mode payment where available. If a core route fails, restore the last good deployment. If bookings or campaigns fail independently, pause that feature and work the existing queue while resident support stays available.

| Sign-off | Approves |
| --- | --- |
| Product and Operations | Scope, resident experience, property content, and staffing |
| Engineering | Access controls, deployments, provider setup, and recovery |
| QA | Recorded results, launch blockers, and documented exceptions |
| Service and marketing owners | Fulfillment and invoicing, consent, unsubscribe, and sender setup |
