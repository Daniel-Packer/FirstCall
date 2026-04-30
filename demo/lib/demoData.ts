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
