# PRD Plan: Fraud Redress Transparency Platform for Community Banks

## Context
Small banks (<$10B assets) lack a standardized, transparent way to communicate with fraud victims during the redress process. Consumers are left calling call centers and waiting on hold to learn the status of their case. Banks have no centralized record of consumer consent or permission grants. This product creates a single source of truth for the fraud redress lifecycle, accessible by both the bank and the affected consumer.

---

## Document Structure

### 1. Executive Summary
- Product name (placeholder: **ClearPath**)
- One-paragraph product vision
- Market opportunity: ~4,600 community/small banks in the US; Regulation E mandates investigation timelines but prescribes no consumer communication standard
- Core value prop: reduce call center load, improve consumer trust, provide defensible audit trail

### 2. Problem Statement
- Fraud victims don't know where they stand in the investigation; anxiety and repeated contact cost banks ~$12–15/call
- Banks have no standardized digital channel to gather consumer consent for data sharing (IDs, transaction history, third-party records)
- No unified record of which permissions were granted, when, and what data was accessed — creating compliance risk
- Investigators lack a shared interface to update the single case record while the consumer sees live status

### 3. Target Users
**Primary: Community/Regional Bank (B2B customer)**
- Fraud investigation team (case agents, supervisors)
- Compliance officers
- IT/API integration teams

**Secondary: Bank's Consumer (end-user of the consumer portal)**
- Account holder who filed the fraud claim
- Often non-technical; needs simple, mobile-friendly interface

### 4. Regulatory Context (US)
- **Regulation E** – Error Resolution: banks have 10 business days to investigate or issue provisional credit; 45 business days for full resolution. ACH/wire transfers are squarely within Reg E scope (v1 fraud types).
- **GLBA** – data sharing requires documented consumer notice/consent
- **CFPB** – oversight body; consumer complaint risk if process is opaque
- **SOC 2 Type II** – platform compliance requirement for enterprise bank sales

### 5. Goals & Success Metrics
| Goal | KPI |
|---|---|
| Reduce inbound status calls | 40% reduction in fraud-related call volume per case |
| Consumer permission capture | 90%+ of cases have digitally-signed permissions |
| Time-to-resolution | Baseline and track per bank (Reg E adherence) |
| Bank adoption | 20 bank customers in Year 1 |
| Consumer satisfaction | CSAT ≥ 4.2/5 on portal interaction |

### 6. Core Features

#### 6A. Consumer Portal
**Claim Intake Form**
- Consumer-initiated flow: account holder submits a fraud claim directly through the portal
- Single transaction mode (default): one set of required fields per transaction
  - Date of transaction (date picker)
  - Amount
  - Transaction type (ACH, wire, card, check, other)
  - Merchant name or counterparty
  - **Pending checkbox**: "This transaction has not yet posted / is still pending" — if checked, case is automatically flagged high priority; bank dashboard surfaces these at the top with a "PENDING" badge (time-sensitive: pending transactions may still be cancellable)
  - **Merchant contact field**: "Have you contacted the merchant about this transaction?" (Yes / No / Not applicable); if Yes, a follow-up text field appears: "What was the outcome of that communication?"
- **Bulk transaction mode**: triggered when consumer indicates more than one fraudulent transaction
  - Consumer adds transactions one-by-one via an "Add transaction" row (dynamic table)
  - Each row: date, amount, type, merchant, pending checkbox, merchant contacted (Yes/No) — per row
  - If any row is marked pending, the entire case is elevated to high priority
  - Auto-calculated aggregate total displayed at the bottom of the table; pending transactions visually distinguished (e.g., italicized or tagged)
  - Consumer can remove individual rows before submitting
  - Supports CSV upload as an alternative to manual row entry (columns: date, amount, type, merchant, is_pending, merchant_contacted)
  - Bulk mode flag is stored on the case; bank portal surfaces a transaction ledger view instead of a single-transaction summary
- Optional/additional information fields (shared across all transactions):
  - Free-text description of what happened
  - Whether a police report has been filed (and report number if yes)
  - File attachment for any supporting evidence at intake
- **Two entry paths**:
  - *Bank-initiated*: bank agent creates the case in the portal (or via API); consumer sees it when they next log into online banking and navigate to the fraud section
  - *Consumer self-initiated*: consumer logs into online banking, navigates to the fraud claim section (mybank.com/fraud-claim), and opens a new case — already authenticated via their existing session
- On submission: case is created in the system, case ID is issued, and an acknowledgment (email/SMS) is sent to the consumer with a link to their portal
- Bank receives an alert and the case appears in their Case Dashboard
- Intake data is pre-populated into the case record and visible to bank investigators; bulk cases show the full transaction ledger

**Permission/Consent Module**
- Structured consent flow: bank requests access to specific data types (transaction records, account statements, ID documents, third-party data)
- Consumer sees plain-language description of each permission, grants or denies per item
- Consent timestamped, immutable, downloadable as PDF
- Revocation flow with audit log

**Process Map (the visualization)**
- Node-and-edge graph of the fraud investigation lifecycle
- Fixed 9-node template (N0–N9); banks can rename consumer-facing node labels and toggle optional nodes (N6, N8) on/off — cannot add new nodes or restructure edges
- Each node: title, description, status (pending / in-progress / complete / blocked), estimated timeframe
- Edges show dependencies; nodes unlock progressively as bank marks stages complete
- Consumer sees "filled in" version — completed nodes turn solid/colored, future nodes remain dim
- No internal bank notes visible to consumer; only consumer-facing status messages
- Push notification (email/SMS) when a node status changes

**Resolution Dispute**
- When N9 (Final Resolution) is marked complete, the consumer sees the outcome and two options:
  - "Accept resolution" — closes the case on the consumer's side
  - "Dispute this decision" — opens a short form: reason for dispute (dropdown: incorrect amount, fraud not acknowledged, missing transactions, other) + free-text explanation + optional file attachment
- On submission, the dispute is logged, the case is flagged as "Disputed" in the bank dashboard, the bank agent is notified, and N9 reverts to in-progress on the map until the bank responds
- The bank can then either update the resolution (reopening relevant upstream nodes) or uphold the original decision with an explanation
- Consumer receives a notification either way

**Contact Support**
- A bank-provided fraud department phone number is displayed persistently on the consumer portal (configured per bank tenant in their white-label settings)
- Shown prominently at two moments: (1) always in the portal footer/sidebar, and (2) in a highlighted callout on the resolution screen alongside the dispute button
- Rationale: some consumers will prefer to call regardless; surfacing the number reduces friction and gives them a clear escalation path beyond the portal

**Document Upload**
- Consumer can upload supporting docs (e.g., police report, identity docs) directly tied to a permission grant
- File size limits, virus scanning, encrypted at rest

#### 6B. Bank Portal
The bank portal is a full graphical web application (desktop-first). It is distinct from the consumer portal — bank users log in separately and see a different interface with input controls the consumer never sees. The bank's view of the process map is interactive: bank agents click nodes to update them, enter internal notes, and compose the consumer-facing message. All of this is done through the GUI; the API (6C) is a parallel integration channel for banks that want programmatic updates instead.

**Case Dashboard**
- List of open/closed fraud cases with status summary
- Bulk cases flagged with transaction count and aggregate amount
- High-priority cases (any pending transaction) pinned to the top with a "PENDING" badge
- Filter by stage, age, amount, consumer name, single vs. bulk, priority (high / normal)
- Reg E countdown timer per case (days remaining to resolve)
- "New Case" button for bank-initiated case creation (opens a form: consumer name, account number, brief description; consumer then receives a link to complete intake)

**Case Detail View — Process Map (Interactive)**
- Same node-and-edge map as the consumer sees, rendered side-by-side with an input panel
- Bank agent clicks any active node to open a side drawer containing:
  - Status selector (pending / in-progress / complete / blocked) — dropdown
  - Internal notes field (never shown to consumer)
  - Consumer-facing status message field (plain-language update the consumer will see)
  - Assigned investigator selector
  - "Save & Notify Consumer" button — saves the node update and pushes a notification to the consumer
- Completed nodes shown in solid color; future nodes dimmed (same as consumer view)
- Timeline/audit log below the map: every node change, who made it, and when

**Case Detail View — Transaction Ledger (Bulk Cases)**
- Table of all consumer-submitted transactions with columns: date, amount, type, merchant, pending flag, merchant contacted, resolution status
- Each row has an inline resolution dropdown (Confirmed Fraud / Not Fraud / Pending Review) — bank agent sets this per transaction
- "Resolve All" button to bulk-set all unresolved rows at once
- Aggregate totals (total disputed, total confirmed fraud, total cleared) auto-update as rows are resolved

**Dispute Handling**
- Disputed cases surface with a "DISPUTED" badge in the Case Dashboard, sorted above non-disputed open cases
- In the Case Detail View, a dispute panel shows the consumer's reason, free-text explanation, and any attached file
- Bank agent chooses one of two actions:
  - *Update resolution*: reopens relevant upstream nodes for re-investigation; consumer is notified the case has been reopened
  - *Uphold decision*: bank enters a written explanation; N9 is re-completed with the explanation appended to the consumer-facing message; case is marked closed

**Permission Management Panel**
- Visual list of each permission (granted / denied / not yet requested) with grant timestamp
- "Request Permission" button per data type — triggers an in-portal notification to the consumer
- Audit log showing which bank user accessed each granted permission and when

#### 6C. Bank API
RESTful API, API-key authenticated (OAuth 2.0 client-credentials for enterprise banks)

Key endpoints:
```
POST   /v1/cases                          — Create new fraud case (bank-initiated), returns case_id
POST   /v1/cases/intake                   — Consumer-initiated intake; body accepts transactions[] array (date, amount, type, merchant, is_pending, merchant_contacted, merchant_contact_outcome per item) + shared description fields; single-item array = single mode, multi-item = bulk; any is_pending=true sets case priority=high
GET    /v1/cases/{case_id}/transactions   — List all transactions on a bulk case with per-transaction status
PUT    /v1/cases/{case_id}/transactions/{txn_id} — Update resolution status on a single transaction within a bulk case
PUT    /v1/cases/{case_id}/stages/{stage_id}  — Update a stage status + consumer message
GET    /v1/cases/{case_id}/permissions    — Retrieve consumer-granted permissions
GET    /v1/cases/{case_id}               — Full case status snapshot
POST   /v1/cases/{case_id}/permission-request — Request new permission from consumer
GET    /v1/cases/{case_id}/documents     — List uploaded consumer documents (with access URLs)
GET    /v1/cases/{case_id}/dispute       — Retrieve consumer dispute details (reason, explanation, attachment) if a dispute exists
```

Webhooks: bank can register a URL to receive events when consumer grants/revokes a permission or submits a dispute.

Rate limits: 1,000 req/min per bank tenant.

### 7. Process Map — Template Detail
Default node set (banks can add/remove nodes):

| Node | Consumer-facing Label | Internal Notes |
|---|---|---|
| N0 | Claim Submitted | Consumer-entered: transaction count, dates, amounts, description; triggers case creation |
| N1 | Claim Received | Internal: case number, intake agent, intake data review |
| N2 | Identity Verified | Internal: which ID was accepted |
| N3 | Permissions Requested | Triggers consumer portal action |
| N4 | Permissions Received | Unlocked after consumer grants |
| N5 | Transaction Analysis | Internal: analyst notes |
| N6 | Merchant/Network Inquiry | Internal: dispute reference numbers |
| N7 | Decision Reached | Internal: decision rationale |
| N8 | Provisional Credit Issued | Amount, date |
| N9 | Final Resolution | Outcome letter generated |

Edges: N0→N1→N2→N3→N4→N5→N6→N7→{N8 or skip}→N9

### 8. Technical Architecture (High-Level)
- **Multi-tenant SaaS** — each bank is an isolated tenant; consumer data is tenant-scoped
- **Frontend**: React web app (responsive/mobile-friendly for consumers); bank portal is desktop-first
- **Backend**: Node.js or Python API, PostgreSQL for relational case/permission data
- **Real-time**: WebSocket or Server-Sent Events for live map updates
- **Auth**: Bank agents — SSO/SAML via the bank's existing identity provider; Consumers — no separate ClearPath login. ClearPath is served on the bank's domain and receives the consumer's existing authenticated session token from the bank's online banking platform. ClearPath trusts that token to identify the consumer — no magic links, no independent verification.
- **Embedding**: ClearPath is delivered as a white-labeled application hosted on the bank's own domain (e.g., mybank.com/fraud-claim). The bank's web platform passes the authenticated session token to ClearPath at load time via a standard handoff (e.g., signed JWT). From the consumer's perspective it is a seamless part of their online banking experience.
- **Storage**: S3-compatible encrypted object storage for documents
- **Audit log**: Append-only event store (every state change is an event)
- **Infra**: Cloud-hosted (AWS preferred for FedRAMP alignment); SOC 2 controls in scope

### 9. Security & Compliance
- Data encrypted in transit (TLS 1.3) and at rest (AES-256)
- Consent records are immutable (append-only); cannot be altered post-grant
- Role-based access control within bank tenant (admin, agent, read-only)
- PII fields masked in logs
- Annual penetration testing; SOC 2 Type II audit
- Data retention policy: configurable per bank (default 7 years for Reg E records)

### 10. Non-Goals (v1)
- Native mobile app (responsive web covers v1)
- AI/ML fraud detection (this is a communication/transparency layer, not detection)
- Core banking system deep integration (API is the integration point)
- Multi-currency / international banks

### 11. Decisions Resolved
1. **Node graph customization** — Fixed template with light edits: banks can rename node labels and toggle optional nodes on/off, but cannot add new nodes or restructure edges.
2. **Fraud types in scope (v1)** — ACH and wire transfer only. Card, check, and account takeover deferred to future releases.
3. **Supervisor approval** — Any agent can mark a node complete; no approval step required. Consumer is notified immediately.
4. **White-labeling** — In v1. Each bank tenant configures their logo and brand colors; consumers see the bank's brand on the portal, not ClearPath's.
5. **Identity verification (N2)** — Handled externally by the bank (phone, branch, existing KYC). Bank agent simply marks N2 complete in the portal when done. No in-portal ID upload or third-party verification service needed.
6. **Case origin** — Both paths supported: bank can create a case and send the consumer a magic link, and consumers can also self-initiate from a public portal URL (they verify their identity via account number + date of birth or similar before intake begins).
7. **ClearPath's role** — Sits alongside existing bank fraud management systems, not a replacement. The bank portal is the consumer-facing transparency and permissions layer. The API is how banks sync status from their existing tools into ClearPath.

### 12. Remaining Open Questions
1. What does the bank's token handoff look like in practice? ClearPath needs a spec for the signed JWT payload (at minimum: consumer ID, account number, bank tenant ID) to implement the session trust model. This will need to be defined jointly with each bank's engineering team during onboarding.

### 12. Rollout Phases
**Phase 1 (MVP — 4 months)**: Consumer portal (permission module + read-only map), bank portal (case creation, stage updates, permission view), core API (case CRUD + stage updates)
**Phase 2 (Month 5–8)**: Document upload, webhooks, SSO integration
**Phase 3 (Month 9–12)**: Analytics dashboard, Reg E reporting, customizable node templates

---

## Verification
The PRD will be considered complete when:
- All 11 sections are drafted with stakeholder sign-off
- Open questions (Section 11) are answered and incorporated
- Legal/compliance review is complete
- Engineering has reviewed architecture for feasibility
- A design mockup of the process map node graph exists
