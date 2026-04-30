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
    label: "Transaction Records",
    description:
      "Access to the last 90 days of your transaction history to identify and verify the fraudulent activity.",
    status: "granted",
    grantedAt: "April 11, 2026 at 2:43 PM",
  },
  {
    id: "account_statements",
    label: "Account Statements",
    description: "Access to your monthly account statements for the past 3 months.",
    status: "granted",
    grantedAt: "April 11, 2026 at 2:43 PM",
  },
  {
    id: "identity_documents",
    label: "Identity Documents",
    description:
      "Access to your government-issued ID to verify your identity as the account holder.",
    status: "granted",
    grantedAt: "April 11, 2026 at 2:44 PM",
  },
  {
    id: "third_party_data",
    label: "Third-party Data Sharing",
    description:
      "Permission to share your case information with card networks and correspondent banks to assist in fund recovery.",
    status: "denied",
  },
];

// Each stage key = which node index is currently "in-progress"
// Nodes before it are complete; nodes after are pending.
export const NODE_STATES_BY_STAGE: Record<number, NodeState[]> = {
  5: [
    { status: "complete", completedAt: "Apr 10, 2:14 PM", consumerMessage: "Your fraud claim has been received. Case #FCB-2026-0847 has been opened." },
    { status: "complete", completedAt: "Apr 10, 3:30 PM", consumerMessage: "Our fraud team has reviewed your claim and is proceeding with your case." },
    { status: "complete", completedAt: "Apr 11, 10:15 AM", consumerMessage: "Your identity has been successfully verified. We are moving forward with the investigation." },
    { status: "complete", completedAt: "Apr 11, 11:00 AM", consumerMessage: "We have sent a request for your consent to access information needed to complete the investigation." },
    { status: "complete", completedAt: "Apr 11, 2:45 PM", consumerMessage: "Thank you for granting access. We have everything we need to proceed." },
    { status: "in-progress", startedAt: "Apr 12", consumerMessage: "Our fraud investigators are actively reviewing the transaction details of your case. We will notify you as soon as this stage is complete." },
    { status: "pending" },
    { status: "pending" },
    { status: "pending" },
    { status: "pending" },
  ],
  6: [
    { status: "complete", completedAt: "Apr 10, 2:14 PM", consumerMessage: "Your fraud claim has been received. Case #FCB-2026-0847 has been opened." },
    { status: "complete", completedAt: "Apr 10, 3:30 PM", consumerMessage: "Our fraud team has reviewed your claim and is proceeding with your case." },
    { status: "complete", completedAt: "Apr 11, 10:15 AM", consumerMessage: "Your identity has been successfully verified. We are moving forward with the investigation." },
    { status: "complete", completedAt: "Apr 11, 11:00 AM", consumerMessage: "We have sent a request for your consent to access information needed to complete the investigation." },
    { status: "complete", completedAt: "Apr 11, 2:45 PM", consumerMessage: "Thank you for granting access. We have everything we need to proceed." },
    { status: "complete", completedAt: "Apr 14, 4:20 PM", consumerMessage: "Our initial transaction analysis is complete. We have identified patterns consistent with unauthorized activity." },
    { status: "in-progress", startedAt: "Apr 15", consumerMessage: "We have contacted the recipient bank and wire network to gather additional evidence and attempt recovery of the transferred funds." },
    { status: "pending" },
    { status: "pending" },
    { status: "pending" },
  ],
  7: [
    { status: "complete", completedAt: "Apr 10, 2:14 PM", consumerMessage: "Your fraud claim has been received. Case #FCB-2026-0847 has been opened." },
    { status: "complete", completedAt: "Apr 10, 3:30 PM", consumerMessage: "Our fraud team has reviewed your claim and is proceeding with your case." },
    { status: "complete", completedAt: "Apr 11, 10:15 AM", consumerMessage: "Your identity has been successfully verified. We are moving forward with the investigation." },
    { status: "complete", completedAt: "Apr 11, 11:00 AM", consumerMessage: "We have sent a request for your consent to access information needed to complete the investigation." },
    { status: "complete", completedAt: "Apr 11, 2:45 PM", consumerMessage: "Thank you for granting access. We have everything we need to proceed." },
    { status: "complete", completedAt: "Apr 14, 4:20 PM", consumerMessage: "Our initial transaction analysis is complete. We have identified patterns consistent with unauthorized activity." },
    { status: "complete", completedAt: "Apr 16, 11:30 AM", consumerMessage: "We have completed our inquiry with the recipient institution. We are now preparing our final determination." },
    { status: "in-progress", startedAt: "Apr 17", consumerMessage: "Our team is finalizing the decision on your fraud claim. You will be notified as soon as a determination has been reached." },
    { status: "pending" },
    { status: "pending" },
  ],
  8: [
    { status: "complete", completedAt: "Apr 10, 2:14 PM", consumerMessage: "Your fraud claim has been received. Case #FCB-2026-0847 has been opened." },
    { status: "complete", completedAt: "Apr 10, 3:30 PM", consumerMessage: "Our fraud team has reviewed your claim and is proceeding with your case." },
    { status: "complete", completedAt: "Apr 11, 10:15 AM", consumerMessage: "Your identity has been successfully verified. We are moving forward with the investigation." },
    { status: "complete", completedAt: "Apr 11, 11:00 AM", consumerMessage: "We have sent a request for your consent to access information needed to complete the investigation." },
    { status: "complete", completedAt: "Apr 11, 2:45 PM", consumerMessage: "Thank you for granting access. We have everything we need to proceed." },
    { status: "complete", completedAt: "Apr 14, 4:20 PM", consumerMessage: "Our initial transaction analysis is complete. We have identified patterns consistent with unauthorized activity." },
    { status: "complete", completedAt: "Apr 16, 11:30 AM", consumerMessage: "We have completed our inquiry with the recipient institution. We are now preparing our final determination." },
    { status: "complete", completedAt: "Apr 18, 9:00 AM", consumerMessage: "Our investigation has determined that this transaction was unauthorized. A full credit of $2,847.50 will be applied to your account." },
    { status: "complete", completedAt: "Apr 18, 9:05 AM", consumerMessage: "A provisional credit of $2,847.50 has been applied to your account ending in 4521 while we complete the final resolution process." },
    {
      status: "complete",
      completedAt: "Apr 18, 9:10 AM",
      consumerMessage: "Your case has been fully resolved. The fraudulent wire transfer of $2,847.50 has been reversed and permanently credited to your account. Thank you for your patience.",
      fundRecovery: "Partial recovery in progress — $847.50 recovered from recipient bank. Remaining $2,000.00 credited by First Community Bank.",
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
    reg_e_by: "Reg E by",
    right_now_title: "Right now: protect your account",
    right_now_subtitle: "Three quick actions you can take to stay safe.",
    talk_to_human: "Talk to a person",
    case_status: "Case Status",
    permissions: "Permissions",
    finances: "Your Money",
    resolution: "Resolution",
    investigation_progress: "Investigation Progress",
    information_access: "Information Access",
    revoke: "Revoke",
    revoked: "Revoked",
    expires: "Expires",
    access_log_title: "How your data has been used",
    financial_impact_title: "Financial impact of this case",
    questions_about_case: "Questions about your case?",
    youre_protected_title: "You're protected.",
    youre_protected_body: "We've opened an investigation. Federal law requires us to finish within 45 business days, and you won't pay for any fraud we confirm.",
    text_size: "Text size",
    text_size_normal: "Normal",
    text_size_large: "Large",
    language: "Language",
  },
  es: {
    portal_label: "Portal de Reclamo de Fraude",
    case: "Caso",
    reg_e_by: "Reg E para",
    right_now_title: "Ahora mismo: protege tu cuenta",
    right_now_subtitle: "Tres acciones rápidas para mantenerte a salvo.",
    talk_to_human: "Hablar con una persona",
    case_status: "Estado del Caso",
    permissions: "Permisos",
    finances: "Tu Dinero",
    resolution: "Resolución",
    investigation_progress: "Progreso de la investigación",
    information_access: "Acceso a la información",
    revoke: "Revocar",
    revoked: "Revocado",
    expires: "Expira",
    access_log_title: "Cómo se ha usado tu información",
    financial_impact_title: "Impacto financiero del caso",
    questions_about_case: "¿Tienes preguntas sobre tu caso?",
    youre_protected_title: "Estás protegida.",
    youre_protected_body: "Hemos abierto una investigación. La ley federal requiere que terminemos en 45 días hábiles y no pagarás por ningún fraude que confirmemos.",
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
  5: "N5: Transaction Analysis — In Progress",
  6: "N6: Merchant / Network Inquiry — In Progress",
  7: "N7: Decision Reached — In Progress",
  8: "N8–N9: Fully Resolved — Favorable",
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
