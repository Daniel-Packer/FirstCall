export type NodeStatus = "complete" | "in-progress" | "pending" | "blocked";

export interface ProcessNode {
  id: string;
  label: string;
  optional: boolean;
  optionalReason?: string;
  estimatedDays: string;
  automationType: "automated" | "manual";
}

export interface NodeState {
  status: NodeStatus;
  completedAt?: string;
  startedAt?: string;
  consumerMessage?: string;
  fundRecovery?: string;
}

export interface Permission {
  id: string;
  label: string;
  description: string;
  status: "granted" | "denied" | "pending";
  grantedAt?: string;
}

export interface DemoCase {
  id: string;
  consumer: { name: string; accountEnding: string; email: string; phone: string };
  filed: string;
  amount: string;
  transactionType: string;
  merchant: string;
  description: string;
  policeReport: string;
  regEDeadline: string;
  assignedAgent: string;
}

export interface NotificationEntry {
  date: string;
  channel: string;
  message: string;
}

export interface AccessLogEntry {
  permissionId: string;
  accessedAt: string;
  accessor: string;
  scope: string;
}

export interface ProtectiveAction {
  id: string;
  label: string;
  description: string;
  status: "active" | "available";
  helperText?: string;
}

export interface FinancialImpactItem {
  label: string;
  detail: string;
  amount?: string;
  status: "good" | "watch" | "neutral";
}

export interface GlossaryTerm {
  term: string;
  short: string;
  long: string;
}

export type Language = "en" | "es";
export type TextSize = "normal" | "large";

export const PROCESS_NODES: ProcessNode[] = [
  { id: "N0", label: "Claim Submitted", optional: false, estimatedDays: "Same day", automationType: "automated" },
  { id: "N1", label: "Claim Received", optional: false, estimatedDays: "1–2 business days", automationType: "automated" },
  { id: "N2", label: "Identity Verified", optional: false, estimatedDays: "1–2 business days", automationType: "automated" },
  { id: "N3", label: "Permissions Requested", optional: false, estimatedDays: "Same day", automationType: "automated" },
  { id: "N4", label: "Permissions Received", optional: false, estimatedDays: "Depends on your response", automationType: "automated" },
  { id: "N5", label: "Transaction Analysis", optional: false, estimatedDays: "2–5 business days", automationType: "manual" },
  {
    id: "N6",
    label: "Merchant / Network Inquiry",
    optional: true,
    optionalReason: "Only performed when funds may be recoverable from the recipient institution",
    estimatedDays: "3–7 business days",
    automationType: "manual",
  },
  { id: "N7", label: "Decision Reached", optional: false, estimatedDays: "1–2 business days", automationType: "manual" },
  {
    id: "N8",
    label: "Provisional Credit Issued",
    optional: true,
    optionalReason: "Issued at the bank's discretion while the final decision is pending",
    estimatedDays: "Same day as decision",
    automationType: "automated",
  },
  { id: "N9", label: "Final Resolution", optional: false, estimatedDays: "1–2 business days", automationType: "automated" },
];

export const DEMO_CASE: DemoCase = {
  id: "FCB-2026-0847",
  consumer: {
    name: "Jane Smith",
    accountEnding: "4521",
    email: "j.smith@email.com",
    phone: "(555) 234-5678",
  },
  filed: "April 10, 2026",
  amount: "$2,847.50",
  transactionType: "Wire Transfer",
  merchant: "Unknown Recipient",
  description:
    "I did not authorize this wire transfer. I received a call from someone claiming to be from my bank's fraud department and was asked to verify my account. I noticed the transfer the following day.",
  policeReport: "RPT-2026-44892",
  regEDeadline: "April 28, 2026",
  assignedAgent: "M. Rodriguez",
};

export const INITIAL_PERMISSIONS: Permission[] = [
  {
    id: "transaction_records",
    label: "Look at my recent transactions",
    description:
      "Your last 90 days of activity. We use this to compare what happened on Apr 8 to your normal pattern — and to spot anything else suspicious.",
    status: "granted",
    grantedAt: "April 11, 2026 at 2:43 PM",
  },
  {
    id: "account_statements",
    label: "Pull my recent statements",
    description: "Your last 3 monthly statements. Sometimes the fraud started before you noticed, and statements help us check.",
    status: "granted",
    grantedAt: "April 11, 2026 at 2:43 PM",
  },
  {
    id: "identity_documents",
    label: "Verify my ID",
    description:
      "A one-time check against your driver's license to confirm we're talking to you. We don't keep a copy.",
    status: "granted",
    grantedAt: "April 11, 2026 at 2:44 PM",
  },
  {
    id: "third_party_data",
    label: "Talk to the recipient bank and card networks",
    description:
      "So we can ask them to claw back the wire and share what they know. This is often how stolen money actually comes back.",
    status: "denied",
  },
];

// Each stage key = which node index is currently "in-progress"
// Nodes before it are complete; nodes after are pending.
export const NODE_STATES_BY_STAGE: Record<number, NodeState[]> = {
  5: [
    { status: "complete", completedAt: "Apr 10, 2:14 PM", consumerMessage: "We got your claim and opened case #FCB-2026-0847. You'll get an email and text confirmation." },
    { status: "complete", completedAt: "Apr 10, 3:30 PM", consumerMessage: "A fraud specialist has read your claim and started the investigation. Nothing else to do on your end right now." },
    { status: "complete", completedAt: "Apr 11, 10:15 AM", consumerMessage: "We confirmed it's really you. No copy of your ID was kept." },
    { status: "complete", completedAt: "Apr 11, 11:00 AM", consumerMessage: "We asked you to allow access to the data we need. Pick what you're comfortable with — we can only investigate what you let us see." },
    { status: "complete", completedAt: "Apr 11, 2:45 PM", consumerMessage: "Thanks. We have what we need to dig into the transactions." },
    { status: "in-progress", startedAt: "Apr 12", consumerMessage: "An investigator is going through the wire and your recent activity. We'll text you when this step is done — usually 2 to 5 business days." },
    { status: "pending" },
    { status: "pending" },
    { status: "pending" },
    { status: "pending" },
  ],
  6: [
    { status: "complete", completedAt: "Apr 10, 2:14 PM", consumerMessage: "We got your claim and opened case #FCB-2026-0847. You'll get an email and text confirmation." },
    { status: "complete", completedAt: "Apr 10, 3:30 PM", consumerMessage: "A fraud specialist has read your claim and started the investigation. Nothing else to do on your end right now." },
    { status: "complete", completedAt: "Apr 11, 10:15 AM", consumerMessage: "We confirmed it's really you. No copy of your ID was kept." },
    { status: "complete", completedAt: "Apr 11, 11:00 AM", consumerMessage: "We asked you to allow access to the data we need. Pick what you're comfortable with — we can only investigate what you let us see." },
    { status: "complete", completedAt: "Apr 11, 2:45 PM", consumerMessage: "Thanks. We have what we need to dig into the transactions." },
    { status: "complete", completedAt: "Apr 14, 4:20 PM", consumerMessage: "We finished reviewing the transactions. The pattern matches what we see in fraud cases — that's a strong signal in your favor." },
    { status: "in-progress", startedAt: "Apr 15", consumerMessage: "We've reached out to the bank that received the wire and the wire network itself. We're asking them to claw back what they can — this is how stolen money often comes back." },
    { status: "pending" },
    { status: "pending" },
    { status: "pending" },
  ],
  7: [
    { status: "complete", completedAt: "Apr 10, 2:14 PM", consumerMessage: "We got your claim and opened case #FCB-2026-0847. You'll get an email and text confirmation." },
    { status: "complete", completedAt: "Apr 10, 3:30 PM", consumerMessage: "A fraud specialist has read your claim and started the investigation. Nothing else to do on your end right now." },
    { status: "complete", completedAt: "Apr 11, 10:15 AM", consumerMessage: "We confirmed it's really you. No copy of your ID was kept." },
    { status: "complete", completedAt: "Apr 11, 11:00 AM", consumerMessage: "We asked you to allow access to the data we need. Pick what you're comfortable with — we can only investigate what you let us see." },
    { status: "complete", completedAt: "Apr 11, 2:45 PM", consumerMessage: "Thanks. We have what we need to dig into the transactions." },
    { status: "complete", completedAt: "Apr 14, 4:20 PM", consumerMessage: "We finished reviewing the transactions. The pattern matches what we see in fraud cases — that's a strong signal in your favor." },
    { status: "complete", completedAt: "Apr 16, 11:30 AM", consumerMessage: "We heard back from the recipient bank and wire network. Now we're writing up the final decision on your case." },
    { status: "in-progress", startedAt: "Apr 17", consumerMessage: "We're finalizing the decision on your claim. You'll get a text and email the moment it's set — usually within 1–2 business days." },
    { status: "pending" },
    { status: "pending" },
  ],
  8: [
    { status: "complete", completedAt: "Apr 10, 2:14 PM", consumerMessage: "We got your claim and opened case #FCB-2026-0847. You'll get an email and text confirmation." },
    { status: "complete", completedAt: "Apr 10, 3:30 PM", consumerMessage: "A fraud specialist has read your claim and started the investigation. Nothing else to do on your end right now." },
    { status: "complete", completedAt: "Apr 11, 10:15 AM", consumerMessage: "We confirmed it's really you. No copy of your ID was kept." },
    { status: "complete", completedAt: "Apr 11, 11:00 AM", consumerMessage: "We asked you to allow access to the data we need. Pick what you're comfortable with — we can only investigate what you let us see." },
    { status: "complete", completedAt: "Apr 11, 2:45 PM", consumerMessage: "Thanks. We have what we need to dig into the transactions." },
    { status: "complete", completedAt: "Apr 14, 4:20 PM", consumerMessage: "We finished reviewing the transactions. The pattern matches what we see in fraud cases — that's a strong signal in your favor." },
    { status: "complete", completedAt: "Apr 16, 11:30 AM", consumerMessage: "We heard back from the recipient bank and wire network. Now we're writing up the final decision on your case." },
    { status: "complete", completedAt: "Apr 18, 9:00 AM", consumerMessage: "Decision: this was fraud, and you'll get the full $2,847.50 back. The credit is being processed now." },
    { status: "complete", completedAt: "Apr 18, 9:05 AM", consumerMessage: "We put $2,847.50 into your account ending in 4521 right away. It's yours to use today — even though we're still finalizing paperwork on our end." },
    {
      status: "complete",
      completedAt: "Apr 18, 9:10 AM",
      consumerMessage: "Done. The $2,847.50 wire has been reversed and the money is permanently back in your account. Thanks for sticking with us.",
      fundRecovery: "We recovered $847.50 from the recipient bank. First Community Bank is covering the remaining $2,000.00 so you're whole today.",
    },
  ],
};

export const ACCESS_LOG_DEMO: AccessLogEntry[] = [
  {
    permissionId: "transaction_records",
    accessedAt: "Apr 12, 9:14 AM",
    accessor: "Fraud analyst (M. Rodriguez)",
    scope: "Last 90 days, wire transfers only",
  },
  {
    permissionId: "transaction_records",
    accessedAt: "Apr 14, 4:18 PM",
    accessor: "Automated fraud rules",
    scope: "Apr 1 – Apr 12",
  },
  {
    permissionId: "account_statements",
    accessedAt: "Apr 12, 9:21 AM",
    accessor: "Fraud analyst (M. Rodriguez)",
    scope: "March 2026 statement",
  },
  {
    permissionId: "identity_documents",
    accessedAt: "Apr 11, 10:15 AM",
    accessor: "Identity verification system",
    scope: "Driver's license — verification only, no copy retained",
  },
];

export const FINANCIAL_IMPACT_DEMO: FinancialImpactItem[] = [
  {
    label: "Provisional credit",
    detail: "Issued same day as decision (Apr 18). Hits your account within 1 business day.",
    amount: "+$2,847.50",
    status: "good",
  },
  {
    label: "Overdraft fees waived",
    detail: "Two overdraft fees triggered while funds were missing have been refunded.",
    amount: "+$70.00",
    status: "good",
  },
  {
    label: "Returned autopay (Verizon)",
    detail: "Bill failed Apr 11 due to missing funds. We've flagged it and notified Verizon. No late fee will apply.",
    status: "watch",
  },
  {
    label: "Recurring charges paused",
    detail: "We've paused 3 autopays until your provisional credit clears. Resumes Apr 19.",
    status: "neutral",
  },
  {
    label: "Credit score impact",
    detail: "No reporting to credit bureaus. Your score is not affected by this case.",
    status: "good",
  },
  {
    label: "Emergency advance available",
    detail: "If you need cash before the credit clears, you can request a fee-free advance up to $500.",
    amount: "Up to $500",
    status: "neutral",
  },
];

export const PROTECTIVE_ACTIONS: ProtectiveAction[] = [
  {
    id: "card_locked",
    label: "Lock your debit card",
    description: "Stop new purchases instantly. You can unlock anytime.",
    status: "available",
    helperText: "Recommended after any fraud event.",
  },
  {
    id: "password_reset",
    label: "Reset online banking password",
    description: "Sign out everywhere and choose a new password.",
    status: "available",
    helperText: "Especially important if you shared codes with the caller.",
  },
  {
    id: "alerts_on",
    label: "Turn on transaction alerts",
    description: "Get a text or email for every purchase over $100.",
    status: "available",
  },
  {
    id: "freeze_account",
    label: "Freeze new account openings",
    description: "Block credit pulls so a scammer can't open accounts in your name.",
    status: "available",
  },
];

export const GLOSSARY: Record<string, GlossaryTerm> = {
  reg_e: {
    term: "Regulation E",
    short: "Federal rule that protects you from unauthorized electronic transactions.",
    long:
      "Regulation E is a U.S. consumer-protection law. It requires your bank to investigate any electronic transaction you say you didn't authorize and resolve the case within 10 business days (or up to 45 days with provisional credit). You are not liable for fraud you report promptly.",
  },
  provisional_credit: {
    term: "Provisional credit",
    short: "Temporary refund into your account while we investigate.",
    long:
      "A provisional credit is money put back in your account before the investigation is complete. It's yours to use right away. If we confirm the fraud, the credit becomes permanent — that's what happened in your case.",
  },
  ach: {
    term: "ACH Transfer",
    short: "Electronic transfer between US bank accounts (slow but cheap).",
    long:
      "ACH stands for Automated Clearing House. It's the network used for direct deposits, bill pay, and most online bank-to-bank transfers. ACH transfers usually take 1–3 business days.",
  },
  wire: {
    term: "Wire Transfer",
    short: "Same-day bank-to-bank transfer that's hard to reverse.",
    long:
      "Wire transfers move money directly between banks, often within hours. Once a wire is sent, it's much harder to recover than other transfer types — this is why scammers often try to trick people into sending wires.",
  },
};

export const REASSURANCE_COPY = {
  shortlines: [
    "You will not pay for fraud you didn't authorize.",
    "Your account is being watched closely while we investigate.",
    "You can ask us a question on any step below.",
  ],
};

export const UI_STRINGS: Record<Language, Record<string, string>> = {
  en: {
    portal_label: "Fraud Claim Portal",
    case: "Case",
    reg_e_by: "Decision due by",
    right_now_title: "First, protect your account",
    right_now_subtitle: "Three things you can do in the next minute to stop more damage.",
    talk_to_human: "Call a person",
    case_status: "Where things stand",
    permissions: "What we can see",
    finances: "Your money",
    resolution: "How it ended",
    investigation_progress: "Where your case is right now",
    information_access: "What we can look at",
    revoke: "Revoke",
    revoked: "Revoked",
    expires: "Expires",
    access_log_title: "Every time we used your data",
    financial_impact_title: "What this case is doing to your money",
    questions_about_case: "Questions about your case?",
    youre_protected_title: "You won't pay for this fraud.",
    youre_protected_body: "We've opened an investigation. Federal law gives us up to 45 business days to finish, and you can ask a question on any stage below. Anything we confirm as fraud is reversed at no cost to you.",
    text_size: "Text size",
    text_size_normal: "Normal",
    text_size_large: "Large",
    language: "Language",
  },
  es: {
    portal_label: "Portal de Reclamo de Fraude",
    case: "Caso",
    reg_e_by: "Decisión antes del",
    right_now_title: "Primero, protege tu cuenta",
    right_now_subtitle: "Tres cosas que puedes hacer en el próximo minuto para frenar más daño.",
    talk_to_human: "Llama a una persona",
    case_status: "Cómo va el caso",
    permissions: "Qué podemos ver",
    finances: "Tu dinero",
    resolution: "Cómo terminó",
    investigation_progress: "En qué punto está tu caso ahora",
    information_access: "Qué podemos consultar",
    revoke: "Revocar",
    revoked: "Revocado",
    expires: "Expira",
    access_log_title: "Cada vez que usamos tus datos",
    financial_impact_title: "Lo que este caso está haciendo a tu dinero",
    questions_about_case: "¿Tienes preguntas sobre tu caso?",
    youre_protected_title: "No pagarás por este fraude.",
    youre_protected_body: "Hemos abierto una investigación. La ley federal nos da hasta 45 días hábiles para terminarla, y puedes hacer preguntas en cada etapa abajo. Todo lo que confirmemos como fraude se revierte sin costo para ti.",
    text_size: "Tamaño del texto",
    text_size_normal: "Normal",
    text_size_large: "Grande",
    language: "Idioma",
  },
};

export const NOTIFICATION_HISTORY: NotificationEntry[] = [
  { date: "Apr 10, 2:14 PM", channel: "Email", message: "Fraud claim received — Case #FCB-2026-0847 has been opened." },
  { date: "Apr 10, 3:30 PM", channel: "SMS", message: "Your fraud claim is being reviewed by our fraud team." },
  { date: "Apr 11, 10:15 AM", channel: "Email", message: "Identity verification complete. Investigation proceeding." },
  { date: "Apr 11, 2:45 PM", channel: "Email", message: "Permissions received. Investigation actively underway." },
  { date: "Apr 12, 9:00 AM", channel: "Email", message: "Transaction analysis in progress. We will notify you when complete." },
];

export const STAGE_LABELS: Record<number, string> = {
  5: "Stage 5 of 9 · Investigators are reviewing the transactions",
  6: "Stage 6 of 9 · We're contacting the wire network and recipient bank",
  7: "Stage 7 of 9 · The decision is being finalized",
  8: "Resolved · Full credit issued; consumer's view shows the outcome",
};

export const DEMO_STAGE_MIN = 5;
export const DEMO_STAGE_MAX = 8;
export const DEMO_STAGE_DEFAULT = 5;
export const LOCALSTORAGE_KEY = "clearpath_demo_stage";
export const STAGE_CHANGE_EVENT = "demoStageChange";

export const PERMISSIONS_STORAGE_KEY = "clearpath_demo_permissions";
export const PERMISSIONS_CHANGE_EVENT = "demoPermissionsChange";

export const QUESTIONS_STORAGE_KEY = "clearpath_demo_questions";
export const QUESTIONS_CHANGE_EVENT = "demoQuestionsChange";

export const PROTECTIVE_ACTIONS_KEY = "clearpath_demo_protections";
export const PROTECTIVE_ACTIONS_EVENT = "demoProtectionsChange";

export const REVOKED_PERMISSIONS_KEY = "clearpath_demo_revoked";
export const REVOKED_PERMISSIONS_EVENT = "demoRevokedChange";

export const LANGUAGE_KEY = "clearpath_demo_language";
export const TEXT_SIZE_KEY = "clearpath_demo_text_size";
export const PREFS_CHANGE_EVENT = "demoPrefsChange";

export interface PermissionDecisionRecord {
  id: string;
  status: "granted" | "denied";
  decidedAt: string;
}

export interface NodeQuestion {
  id: string;
  nodeIndex: number;
  question: string;
  askedAt: string;
  answer?: string;
  answeredAt?: string;
  answeredBy?: string;
}

export function formatDecidedAt(d: Date = new Date()): string {
  const date = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} at ${time}`;
}

export function loadPermissionDecisions(): PermissionDecisionRecord[] | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as PermissionDecisionRecord[] : null;
  } catch {
    return null;
  }
}

export function savePermissionDecisions(records: PermissionDecisionRecord[]) {
  localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(records));
  globalThis.dispatchEvent(
    new CustomEvent(PERMISSIONS_CHANGE_EVENT, { detail: records }),
  );
}

export function clearPermissionDecisions() {
  localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
  globalThis.dispatchEvent(
    new CustomEvent(PERMISSIONS_CHANGE_EVENT, { detail: null }),
  );
}

export function loadQuestions(): NodeQuestion[] {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as NodeQuestion[] : [];
  } catch {
    return [];
  }
}

export function saveQuestions(questions: NodeQuestion[]) {
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  globalThis.dispatchEvent(
    new CustomEvent(QUESTIONS_CHANGE_EVENT, { detail: questions }),
  );
}

export function addQuestion(nodeIndex: number, question: string): NodeQuestion {
  const entry: NodeQuestion = {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    nodeIndex,
    question: question.trim(),
    askedAt: formatDecidedAt(),
  };
  const next = [...loadQuestions(), entry];
  saveQuestions(next);
  return entry;
}

export function answerQuestion(id: string, answer: string, agent = DEMO_CASE.assignedAgent) {
  const next = loadQuestions().map((q) =>
    q.id === id
      ? { ...q, answer: answer.trim(), answeredAt: formatDecidedAt(), answeredBy: agent }
      : q
  );
  saveQuestions(next);
}

export function clearQuestions() {
  localStorage.removeItem(QUESTIONS_STORAGE_KEY);
  globalThis.dispatchEvent(
    new CustomEvent(QUESTIONS_CHANGE_EVENT, { detail: [] }),
  );
}

export function loadActiveProtections(): string[] {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(PROTECTIVE_ACTIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as string[] : [];
  } catch {
    return [];
  }
}

export function toggleProtection(id: string) {
  const current = loadActiveProtections();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  localStorage.setItem(PROTECTIVE_ACTIONS_KEY, JSON.stringify(next));
  globalThis.dispatchEvent(
    new CustomEvent(PROTECTIVE_ACTIONS_EVENT, { detail: next }),
  );
}

export function clearProtections() {
  localStorage.removeItem(PROTECTIVE_ACTIONS_KEY);
  globalThis.dispatchEvent(
    new CustomEvent(PROTECTIVE_ACTIONS_EVENT, { detail: [] }),
  );
}

export function loadRevokedPermissions(): string[] {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(REVOKED_PERMISSIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as string[] : [];
  } catch {
    return [];
  }
}

export function revokePermission(id: string) {
  const current = loadRevokedPermissions();
  if (current.includes(id)) return;
  const next = [...current, id];
  localStorage.setItem(REVOKED_PERMISSIONS_KEY, JSON.stringify(next));
  globalThis.dispatchEvent(
    new CustomEvent(REVOKED_PERMISSIONS_EVENT, { detail: next }),
  );
}

export function clearRevocations() {
  localStorage.removeItem(REVOKED_PERMISSIONS_KEY);
  globalThis.dispatchEvent(
    new CustomEvent(REVOKED_PERMISSIONS_EVENT, { detail: [] }),
  );
}

export function loadLanguage(): Language {
  if (typeof localStorage === "undefined") return "en";
  const raw = localStorage.getItem(LANGUAGE_KEY);
  return raw === "es" ? "es" : "en";
}

export function saveLanguage(lang: Language) {
  localStorage.setItem(LANGUAGE_KEY, lang);
  globalThis.dispatchEvent(new CustomEvent(PREFS_CHANGE_EVENT));
}

export function loadTextSize(): TextSize {
  if (typeof localStorage === "undefined") return "normal";
  const raw = localStorage.getItem(TEXT_SIZE_KEY);
  return raw === "large" ? "large" : "normal";
}

export function saveTextSize(size: TextSize) {
  localStorage.setItem(TEXT_SIZE_KEY, size);
  globalThis.dispatchEvent(new CustomEvent(PREFS_CHANGE_EVENT));
}

export function t(lang: Language, key: string, fallback?: string): string {
  return UI_STRINGS[lang]?.[key] ?? UI_STRINGS.en[key] ?? fallback ?? key;
}
