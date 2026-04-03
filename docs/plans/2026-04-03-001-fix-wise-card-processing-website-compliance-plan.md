---
title: "fix: Wise Card Processing Agreement Section 4.6 Website Compliance"
type: fix
status: completed
date: 2026-04-03
---

# fix: Wise Card Processing Agreement Section 4.6 Website Compliance

## Overview

Granite Marketing's Wise Business card has been blocked due to non-compliance with [Wise Card Processing Agreement Section 4.6](https://wise.com/gb/legal/wise-card-processing-agreement#chapter4) — "Obligations relating to your Website." This plan addresses every requirement in 4.6 to restore card access and prevent future blocks.

Granite Marketing is a UK-based B2B AI workflow automation agency. The website (`granitemarketing.com`) has no direct checkout or payment flow — clients book consultations via Cal.com and pay invoices through Wise. Despite no on-site transactions, Wise requires the merchant website to display specific legal and compliance information.

## Problem Statement

The website is missing most of the disclosures required by Wise 4.6(b). Currently:

| Wise 4.6 Requirement | Current Status |
|---|---|
| 1. Payment scheme brand marks (Visa/Mastercard) in full colour | **MISSING** |
| 2. Complete description of services with terms | **PARTIAL** — services described in marketing copy, no formal terms |
| 3. Refund, return, cancellation policies | **MISSING** |
| 4. Click-to-accept for refund/return policy | **BROKEN** — checkbox exists but links to nothing |
| 5. Customer service contact (email/phone) | **EXISTS** — but phone number appears incomplete (`+44 (0) 20 1234`) |
| 6. UK permanent business address | **EXISTS** — Unit 5, 42 Brick Lane, London E1 6RF |
| 7. Transaction currency in words and symbols | **MISSING** |
| 8. Export restrictions | **N/A** — UK services business |
| 9. Delivery policy | **MISSING** |
| 10. UK location confirmation during payment | **MISSING** — locale is also set to `en_US` instead of `en_GB` |
| 11. Consumer data privacy policy | **PLACEHOLDER** — page exists, no content |
| 12. Security capabilities for card details | **MISSING** |

## Proposed Solution

Create/populate 4 legal pages, update the footer and contact form, add payment scheme marks, and fix metadata. The implementation is organised into 3 phases by priority.

---

## Phase 1: Critical — Unblock the Wise Card

These items directly address the most likely reasons for the card block.

### Task 1.1: Populate the Privacy Policy page (`app/privacy/page.tsx`)

**Wise requirement:** 4.6(b)(xi) — consumer data privacy policy

Replace the placeholder content with a complete UK GDPR-compliant privacy policy covering:

- **Data controller:** Granite Marketing, Unit 5, 42 Brick Lane, London E1 6RF
- **Data collected:** First name, last name, email, phone number, inquiry type, message (from contact form); booking details (via Cal.com); browsing data (via Google Analytics `G-YE1QR36KST` and Vercel Analytics)
- **Legal basis:** Legitimate interest (responding to inquiries), consent (contact form submission, cookies)
- **Third-party processors:** Google Analytics, Vercel Analytics, Cal.com, Sanity CMS, Wise (payment processing)
- **Data retention:** Contact form submissions retained for 24 months; analytics data per provider defaults
- **Individual rights:** Access, rectification, erasure, restriction, portability, objection (UK GDPR Articles 15-21)
- **Contact for data requests:** hello@granitemarketing.co.uk
- **ICO complaint rights:** Link to ico.org.uk
- **Cookies:** Brief reference with link to full Cookie Policy at `/cookies`
- **Payment data:** Statement that card details are processed by Wise and never stored by Granite Marketing (also satisfies requirement 4.6(b)(xii))
- **Last updated date**

**File to edit:** `app/privacy/page.tsx` — replace the placeholder `<p>` with full policy content using standard HTML elements inside the existing `prose` div.

### Task 1.2: Populate the Cookie Policy page (`app/cookies/page.tsx`)

Replace placeholder with policy covering:

- **What cookies are used:**
  - Google Analytics (`_ga`, `_ga_*`) — performance/analytics, 2-year expiry
  - Vercel Analytics — performance, session-based
  - Cal.com embed — functional cookies for booking widget
- **Cookie categories:** Strictly necessary, analytics/performance, functional
- **How to manage cookies:** Browser settings instructions for Chrome, Firefox, Safari, Edge
- **Consent:** Note on how consent is obtained
- **Last updated date**

**File to edit:** `app/cookies/page.tsx`

### Task 1.3: Create Terms of Service page (`app/terms/page.tsx`)

**Wise requirements:** 4.6(b)(ii), (vii), (x)

New static page following the exact pattern of `app/privacy/page.tsx`. Content to include:

- **Services description:** AI workflow automation consulting, including workflow optimisation, automation builds, integration support, technical consultation, AI agent development, and educational content creation (mirrors capabilities from `components/capabilities.tsx`)
- **Service terms:** Engagement begins upon mutual agreement; scope defined per project; changes to scope require written agreement
- **Currency:** "All fees are quoted and invoiced in British Pounds Sterling (GBP, £)" — satisfies 4.6(b)(vii)
- **UK location:** "Granite Marketing is registered and operates in the United Kingdom" — satisfies 4.6(b)(x)
- **Payment terms:** Invoices payable within 14 days; payments processed via Wise
- **Intellectual property:** Client owns deliverables upon full payment; Granite retains right to use anonymised case studies
- **Limitation of liability:** Standard B2B limitation clause
- **Governing law:** England and Wales
- **Last updated date**

### Task 1.4: Create Refund & Cancellation Policy page (`app/refund-policy/page.tsx`)

**Wise requirements:** 4.6(b)(iii), (iv)

New static page. Content to include:

- **Cooling-off period:** 14-day cooling-off from engagement start for new clients (Consumer Contracts Regulations 2013 — even for B2B, good practice)
- **Refunds on completed work:** No refunds for work already delivered and approved
- **Refunds on undelivered work:** Pro-rata refund for prepaid retainer portions not yet delivered
- **Cancellation by client:** 30-day written notice required; work completed up to cancellation date will be invoiced
- **Cancellation by Granite Marketing:** 30-day written notice; any prepaid undelivered fees refunded in full
- **Dispute resolution:** Contact hello@granitemarketing.co.uk; aim to resolve within 14 business days
- **How to request a refund:** Email hello@granitemarketing.co.uk with project reference
- **Last updated date**

### Task 1.5: Create Delivery Policy page (`app/delivery-policy/page.tsx`)

**Wise requirement:** 4.6(b)(ix)

New static page. Content to include:

- **Service delivery model:** Project-based engagements with defined milestones
- **Typical timelines:** Scoping (1-2 days), build (1-4 weeks depending on complexity), testing and handover (2-3 days)
- **Deliverables:** Working automations deployed to client's platform (n8n, Make, etc.), documentation, training session where applicable
- **Communication:** Progress updates at each milestone; primary contact via email
- **Acceptance:** Deliverables considered accepted 7 days after handover unless client raises issues
- **Delays:** Client notified within 2 business days of any anticipated delay; revised timeline agreed mutually
- **Last updated date**

---

## Phase 2: Important — Complete Compliance

### Task 2.1: Add Visa/Mastercard brand marks to the footer

**Wise requirement:** 4.6(b)(i) — payment scheme brand marks in full colour

- Download official Visa and Mastercard full-colour logos from their brand portals (SVG preferred for quality)
- Save to `public/images/logos/visa.svg` and `public/images/logos/mastercard.svg`
- Add to `components/footer-client.tsx` in the copyright bar section (between the copyright text and legal links)
- Display at a reasonable size (~32px height) with appropriate alt text

**File to edit:** `components/footer-client.tsx` (lines 95-113)

### Task 2.2: Fix the contact form terms checkbox

**Wise requirement:** 4.6(b)(iv) — click-to-accept for return/refund policy

Update the terms checkbox in `components/contact-form.tsx` (lines 238-246):

- Change label from "I agree to the terms" to "I agree to the [Terms of Service](/terms) and [Refund Policy](/refund-policy)"
- Make "Terms of Service" and "Refund Policy" clickable links (open in new tab)
- Ensure checkbox must be checked before form submission (add validation)

### Task 2.3: Verify and fix the phone number

**Wise requirement:** 4.6(b)(v) — customer service contact

The phone number `+44 (0) 20 1234` in `components/contact-form.tsx:72` appears incomplete (London numbers should be 11 digits). **Action required from the user:** Confirm the correct business phone number. If this is a placeholder, replace with the real number.

### Task 2.4: Update footer with new legal page links

Add links to all new legal pages in `components/footer-client.tsx` (lines 99-112):

```
Privacy | Cookies | Terms | Refund Policy | Delivery Policy
```

### Task 2.5: Fix locale from `en_US` to `en_GB`

**File:** `lib/seo/config.ts` line 7 — change `locale: "en_US"` to `locale: "en_GB"`. This is a UK business and the metadata should reflect that. Also supports Wise requirement 4.6(b)(x) about UK location confirmation.

---

## Phase 3: Nice-to-Have — Polish

### Task 3.1: Add SEO metadata entries for new pages

Add entries to the `pageMetadata` object in `lib/seo/config.ts` for: `terms`, `refundPolicy`, `deliveryPolicy`.

### Task 3.2: Consider a shared legal layout

Optionally create `app/(legal)/layout.tsx` route group to share Navigation/Footer/container across all legal pages, reducing duplication. This does NOT affect URL paths.

### Task 3.3: Add security capabilities statement

**Wise requirement:** 4.6(b)(xii)

Add a brief statement to the Terms of Service page (or footer): "All card payments are processed securely by Wise Business. Granite Marketing never stores, processes, or has access to your card details. Wise is authorised by the FCA as an Electronic Money Institution."

This can be included in Task 1.3 (Terms of Service) rather than as a separate task.

---

## Files to Create/Edit Summary

| File | Action | Phase |
|---|---|---|
| `app/privacy/page.tsx` | Edit — replace placeholder with full privacy policy | 1 |
| `app/cookies/page.tsx` | Edit — replace placeholder with full cookie policy | 1 |
| `app/terms/page.tsx` | **Create** — new Terms of Service page | 1 |
| `app/refund-policy/page.tsx` | **Create** — new Refund & Cancellation Policy page | 1 |
| `app/delivery-policy/page.tsx` | **Create** — new Delivery Policy page | 1 |
| `components/footer-client.tsx` | Edit — add legal links + payment brand marks | 2 |
| `components/contact-form.tsx` | Edit — fix terms checkbox with real links | 2 |
| `public/images/logos/visa.svg` | **Create** — Visa brand mark | 2 |
| `public/images/logos/mastercard.svg` | **Create** — Mastercard brand mark | 2 |
| `lib/seo/config.ts` | Edit — fix locale, add page metadata entries | 2-3 |

## Acceptance Criteria

- [ ] Privacy policy page has complete UK GDPR-compliant content listing all data collected, processors, and rights
- [ ] Cookie policy page lists all cookies used (Google Analytics, Vercel Analytics, Cal.com)
- [ ] Terms of Service page includes service descriptions, currency (GBP/£), UK location confirmation, payment terms, and security statement
- [ ] Refund & Cancellation policy page has clear refund terms, cancellation process, and cooling-off period
- [ ] Delivery policy page describes service delivery model, timelines, and acceptance process
- [ ] Visa and Mastercard full-colour brand marks visible in the footer
- [ ] Contact form "terms" checkbox links to actual Terms of Service and Refund Policy pages
- [ ] Footer includes links to all 5 legal pages (Privacy, Cookies, Terms, Refund Policy, Delivery Policy)
- [ ] Locale corrected from `en_US` to `en_GB` in SEO config
- [ ] Phone number on contact page is verified as correct/complete
- [ ] All new pages follow existing static page pattern (`force-static`, Navigation/Footer, prose styling)

## Dependencies & Risks

- **Phone number verification:** Task 2.3 requires the user to confirm the real business phone number. If `+44 (0) 20 1234` is a placeholder, Wise compliance remains incomplete until fixed.
- **Business policy decisions:** The refund, cancellation, and delivery policies in this plan use reasonable defaults for a B2B services business. The user should review these carefully and adjust terms to match their actual business practices before deploying.
- **Payment scheme brand guidelines:** Visa and Mastercard have specific brand usage guidelines. The logos must be official, full-colour, and meet minimum size requirements. Download from official brand portals only.
- **Legal review:** While these templates provide solid coverage, they are boilerplate. For maximum protection, have a solicitor review before deploying to production.

## Sources & References

- [Wise Card Processing Agreement — Section 4.6](https://wise.com/gb/legal/wise-card-processing-agreement#chapter4)
- Existing page patterns: `app/privacy/page.tsx`, `app/cookies/page.tsx`
- Footer component: `components/footer-client.tsx`
- Contact form: `components/contact-form.tsx`
- SEO config: `lib/seo/config.ts`
- Analytics: Google Analytics `G-YE1QR36KST`, Vercel Analytics
- Third-party embeds: Cal.com (`calLink="sanindo/30min"`)
