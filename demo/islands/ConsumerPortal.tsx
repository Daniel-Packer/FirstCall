import { useEffect, useState } from "preact/hooks";
import {
  addQuestion,
  DEMO_CASE,
  DEMO_STAGE_DEFAULT,
  formatDecidedAt,
  INITIAL_PERMISSIONS,
  loadPermissionDecisions,
  loadQuestions,
  LOCALSTORAGE_KEY,
  NODE_STATES_BY_STAGE,
  type NodeQuestion,
  type NodeState,
  PERMISSIONS_CHANGE_EVENT,
  type Permission,
  PROCESS_NODES,
  QUESTIONS_CHANGE_EVENT,
  savePermissionDecisions,
  STAGE_CHANGE_EVENT,
} from "../lib/demoData.ts";

type Tab = "status" | "permissions" | "resolution";

export default function ConsumerPortal() {
  const [stage, setStage] = useState(DEMO_STAGE_DEFAULT);
  const [activeTab, setActiveTab] = useState<Tab>("status");
  const [accepted, setAccepted] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const nodeStates = NODE_STATES_BY_STAGE[stage] ?? NODE_STATES_BY_STAGE[DEMO_STAGE_DEFAULT];
  const isResolved = stage >= 8;
  const resolutionMessage = nodeStates[9]?.consumerMessage ?? "";

  useEffect(() => {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      const n = parseInt(saved);
      if (!isNaN(n)) setStage(n);
    }

    const handler = (e: Event) => {
      const next = (e as CustomEvent<number>).detail;
      setStage(next);
      if (next >= 8) setActiveTab("resolution");
    };
    globalThis.addEventListener(STAGE_CHANGE_EVENT, handler);
    return () => globalThis.removeEventListener(STAGE_CHANGE_EVENT, handler);
  }, []);

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: "status", label: "Case Status" },
    { id: "permissions", label: "Permissions" },
    ...(isResolved
      ? [
          {
            id: "resolution" as Tab,
            label: "Resolution",
            badge: !accepted && !disputeSubmitted ? "Action needed" : undefined,
          },
        ]
      : []),
  ];

  return (
    <div class="min-h-screen bg-brand-slate pb-20">
      {/* Bank header */}
      <header class="bg-brand-navy text-white px-4 py-4 border-b-2 border-brand-blue/40">
        <div class="max-w-2xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white rounded-lg p-1.5">
              <img src="/firstcall-logo.png" alt="FirstCall" class="h-6 w-auto" />
            </div>
            <div>
              <div class="font-semibold text-sm leading-tight">First Community Bank</div>
              <div class="text-slate-300 text-[11px]">Fraud Claim Portal · ClearPath</div>
            </div>
          </div>
          <div class="text-right text-sm">
            <div class="font-medium">{DEMO_CASE.consumer.name}</div>
            <div class="text-slate-400 text-xs">Account ••••{DEMO_CASE.consumer.accountEnding}</div>
          </div>
        </div>
      </header>

      {/* Case banner */}
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-2xl mx-auto px-4 py-4 flex justify-between items-start gap-4">
          <div>
            <div class="text-xs text-gray-400 uppercase tracking-wide font-semibold">Case Number</div>
            <div class="text-2xl font-bold text-brand-navy tracking-tight">#{DEMO_CASE.id}</div>
            <div class="text-xs text-gray-500 mt-1">
              Filed {DEMO_CASE.filed} · {DEMO_CASE.transactionType} · {DEMO_CASE.amount}
            </div>
          </div>
          {!isResolved && (
            <div class="text-right flex-shrink-0">
              <div class="text-xs text-gray-400">Reg E Deadline</div>
              <div class="text-sm font-semibold text-amber-700">{DEMO_CASE.regEDeadline}</div>
            </div>
          )}
          {isResolved && (
            <span class="flex-shrink-0 inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Resolved
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-2xl mx-auto px-4">
          <div class="flex">
            {tabs.map(({ id, label, badge }) => (
              <button
                key={id}
                class={`py-3 px-1 mr-6 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === id
                    ? "border-brand-blue text-brand-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(id)}
              >
                {label}
                {badge && (
                  <span class="bg-brand-blue text-white text-xs leading-none rounded-full px-1.5 py-0.5">
                    !
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div class="max-w-2xl mx-auto px-4 py-6">
        {activeTab === "status" && (
          <StatusTab nodeStates={nodeStates} stage={stage} />
        )}
        {activeTab === "permissions" && <PermissionsTab />}
        {activeTab === "resolution" && isResolved && (
          <ResolutionTab
            accepted={accepted}
            setAccepted={setAccepted}
            disputeSubmitted={disputeSubmitted}
            setDisputeSubmitted={setDisputeSubmitted}
            resolutionMessage={resolutionMessage}
          />
        )}
      </div>

      {/* Support footer */}
      <div class="max-w-2xl mx-auto px-4 pb-4">
        <div class="bg-white border border-gray-200 rounded-lg p-3 text-center text-xs text-gray-500">
          Questions about your case?{" "}
          <a href="tel:18005551234" class="font-semibold text-brand-blue">
            (800) 555-1234
          </a>
          <span class="mx-1.5 text-gray-300">|</span>
          Mon–Fri 8am–6pm ET
        </div>
      </div>
    </div>
  );
}

function StatusTab({ nodeStates, stage }: { nodeStates: NodeState[]; stage: number }) {
  const [questions, setQuestions] = useState<NodeQuestion[]>([]);
  const [expandedAsk, setExpandedAsk] = useState<number | null>(null);

  useEffect(() => {
    setQuestions(loadQuestions());
    const handler = () => setQuestions(loadQuestions());
    globalThis.addEventListener(QUESTIONS_CHANGE_EVENT, handler);
    return () => globalThis.removeEventListener(QUESTIONS_CHANGE_EVENT, handler);
  }, []);

  return (
    <div>
      <h2 class="text-base font-semibold text-brand-navy mb-4">Investigation Progress</h2>

      {stage < 8 && (
        <div class="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
          <svg
            class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-xs text-amber-800">
            <strong>Regulation E Deadline: {DEMO_CASE.regEDeadline}.</strong> Your bank is required
            by federal law to resolve this case within 45 business days of your claim.
          </p>
        </div>
      )}

      <div class="space-y-0">
        {PROCESS_NODES.map((node, i) => {
          const state = nodeStates[i];
          const isComplete = state.status === "complete";
          const isActive = state.status === "in-progress";
          const isLast = i === PROCESS_NODES.length - 1;

          return (
            <div key={node.id} class="flex gap-3">
              {/* Connector column */}
              <div class="flex flex-col items-center">
                <div
                  class={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    isComplete
                      ? "bg-green-500"
                      : isActive
                      ? "bg-brand-blue ring-4 ring-brand-blue/20"
                      : "bg-gray-200"
                  }`}
                >
                  {isComplete && (
                    <svg
                      class="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {isActive && (
                    <span class="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                  )}
                  {!isComplete && !isActive && (
                    <span class="text-xs font-medium text-gray-400">{i + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    class={`w-0.5 my-1 ${isComplete ? "bg-green-300" : "bg-gray-200"}`}
                    style="flex: 1; min-height: 16px;"
                  />
                )}
              </div>

              {/* Content */}
              <div class={`pb-5 flex-1 ${isLast ? "pb-0" : ""}`}>
                <div class="flex items-center justify-between gap-2 mt-1">
                  <span
                    class={`text-sm font-semibold leading-none ${
                      isComplete
                        ? "text-brand-navy"
                        : isActive
                        ? "text-brand-blue"
                        : "text-gray-400"
                    }`}
                  >
                    {node.label}
                    {node.optional && (
                      <span class="ml-1 text-xs font-normal opacity-50">(optional)</span>
                    )}
                  </span>
                  {isComplete && state.completedAt && (
                    <span class="text-xs text-gray-400 flex-shrink-0">{state.completedAt}</span>
                  )}
                  {isActive && (
                    <span class="text-xs text-brand-blue font-semibold flex-shrink-0">
                      In Progress
                    </span>
                  )}
                </div>
                {(isComplete || isActive) && state.consumerMessage && (
                  <p class={`mt-1.5 text-xs leading-relaxed ${isActive ? "text-brand-blue" : "text-gray-500"}`}>
                    {state.consumerMessage}
                  </p>
                )}

                <NodeQA
                  nodeIndex={i}
                  questions={questions.filter((q) => q.nodeIndex === i)}
                  expanded={expandedAsk === i}
                  onToggle={() => setExpandedAsk((cur) => (cur === i ? null : i))}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NodeQA({
  nodeIndex,
  questions,
  expanded,
  onToggle,
}: {
  nodeIndex: number;
  questions: NodeQuestion[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const [draft, setDraft] = useState("");
  const hasQuestions = questions.length > 0;
  const pendingCount = questions.filter((q) => !q.answer).length;

  const submit = (e: Event) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    addQuestion(nodeIndex, text);
    setDraft("");
  };

  return (
    <div class="mt-2">
      {hasQuestions && (
        <ul class="mt-2 space-y-2">
          {questions.map((q) => (
            <li
              key={q.id}
              class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs leading-relaxed"
            >
              <div class="flex items-start gap-2">
                <span class="mt-0.5 inline-flex w-5 h-5 rounded-full bg-brand-blue-soft text-brand-blue items-center justify-center text-[10px] font-bold flex-shrink-0">
                  Q
                </span>
                <div class="min-w-0">
                  <p class="text-brand-navy">{q.question}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">You · {q.askedAt}</p>
                </div>
              </div>
              {q.answer ? (
                <div class="flex items-start gap-2 mt-2 pt-2 border-t border-gray-100">
                  <span class="mt-0.5 inline-flex w-5 h-5 rounded-full bg-brand-blue text-white items-center justify-center text-[10px] font-bold flex-shrink-0">
                    A
                  </span>
                  <div class="min-w-0">
                    <p class="text-gray-700">{q.answer}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">
                      {q.answeredBy ?? "Investigator"} · {q.answeredAt}
                    </p>
                  </div>
                </div>
              ) : (
                <div class="mt-1.5 ml-7 inline-flex items-center gap-1.5 text-[10px] text-amber-700">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Awaiting investigator response
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        class="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {expanded
          ? "Cancel"
          : hasQuestions
          ? `Ask another question${pendingCount ? ` · ${pendingCount} awaiting reply` : ""}`
          : "Ask a question about this stage"}
      </button>

      {expanded && (
        <form
          onSubmit={submit}
          class="mt-2 rounded-lg border border-brand-blue/30 bg-brand-blue-soft/40 p-2.5"
        >
          <textarea
            class="w-full text-xs bg-white border border-gray-200 rounded-md px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
            rows={2}
            placeholder="What would you like to know?"
            value={draft}
            onInput={(e) => setDraft((e.target as HTMLTextAreaElement).value)}
          />
          <div class="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              class="text-[11px] text-gray-500 hover:text-gray-700 px-2 py-1"
              onClick={() => {
                setDraft("");
                onToggle();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              class="text-[11px] font-semibold bg-brand-blue hover:bg-brand-blue-hover disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-md transition-colors"
            >
              Send to investigator
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function PermissionsTab() {
  const [permissions, setPermissions] = useState<Permission[]>(INITIAL_PERMISSIONS);

  useEffect(() => {
    const apply = () => {
      const records = loadPermissionDecisions();
      if (!records || records.length === 0) {
        setPermissions(INITIAL_PERMISSIONS);
        return;
      }
      const recordMap = Object.fromEntries(records.map((r) => [r.id, r]));
      setPermissions(
        INITIAL_PERMISSIONS.map((p): Permission => {
          const r = recordMap[p.id];
          if (!r) {
            return { ...p, status: "pending", grantedAt: undefined };
          }
          return {
            ...p,
            status: r.status,
            grantedAt: r.status === "granted" ? r.decidedAt : undefined,
          };
        }),
      );
    };
    apply();
    globalThis.addEventListener(PERMISSIONS_CHANGE_EVENT, apply);
    return () => globalThis.removeEventListener(PERMISSIONS_CHANGE_EVENT, apply);
  }, []);

  const decide = (id: string, status: "granted" | "denied") => {
    const existing = loadPermissionDecisions() ?? [];
    const others = existing.filter((r) => r.id !== id);
    const next = [
      ...others,
      { id, status, decidedAt: formatDecidedAt() },
    ];
    savePermissionDecisions(next);
  };

  return (
    <div>
      <h2 class="text-base font-semibold text-brand-navy mb-1">Information Access Permissions</h2>
      <p class="text-xs text-gray-500 mb-5 leading-relaxed">
        A record of each permission your bank requested. Pending items are awaiting your decision;
        granted and denied consents are timestamped.
      </p>

      <div class="space-y-2.5">
        {permissions.map((perm) => (
          <div
            key={perm.id}
            class={`rounded-xl border p-4 ${
              perm.status === "granted"
                ? "bg-green-50 border-green-200"
                : perm.status === "denied"
                ? "bg-gray-50 border-gray-200"
                : "bg-brand-blue-soft border-brand-blue/30"
            }`}
          >
            <div class="flex items-start gap-3">
              {perm.status === "granted" && (
                <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {perm.status === "denied" && (
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {perm.status === "pending" && (
                <svg class="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-semibold text-brand-navy">{perm.label}</span>
                  <span
                    class={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      perm.status === "granted"
                        ? "bg-green-100 text-green-700"
                        : perm.status === "denied"
                        ? "bg-gray-200 text-gray-500"
                        : "bg-white text-brand-blue border border-brand-blue/30"
                    }`}
                  >
                    {perm.status === "granted"
                      ? "Granted"
                      : perm.status === "denied"
                      ? "Denied"
                      : "Awaiting your decision"}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">{perm.description}</p>
                {perm.status === "granted" && perm.grantedAt && (
                  <p class="text-xs text-green-600 mt-1">Granted: {perm.grantedAt}</p>
                )}
                {perm.status === "denied" && (
                  <p class="text-xs text-gray-400 mt-1">Not granted by you</p>
                )}
                {perm.status === "pending" && (
                  <div class="flex gap-2 mt-2">
                    <button
                      class="text-xs font-semibold py-1.5 px-3 rounded-md bg-brand-blue hover:bg-brand-blue-hover text-white transition-colors"
                      onClick={() => decide(perm.id, "granted")}
                    >
                      Grant
                    </button>
                    <button
                      class="text-xs font-semibold py-1.5 px-3 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 transition-colors"
                      onClick={() => decide(perm.id, "denied")}
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p class="mt-4 text-xs text-gray-400 text-center">
        To revoke a permission, call{" "}
        <a href="tel:18005551234" class="text-brand-blue font-semibold">
          (800) 555-1234
        </a>
      </p>
    </div>
  );
}

function ResolutionTab({
  accepted,
  setAccepted,
  disputeSubmitted,
  setDisputeSubmitted,
  resolutionMessage,
}: {
  accepted: boolean;
  setAccepted: (v: boolean) => void;
  disputeSubmitted: boolean;
  setDisputeSubmitted: (v: boolean) => void;
  resolutionMessage: string;
}) {
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeText, setDisputeText] = useState("");

  if (accepted) {
    return (
      <div class="text-center py-10">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            class="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-brand-navy mb-2 tracking-tight">Resolution Accepted</h2>
        <p class="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          Thank you for confirming. Case #{DEMO_CASE.id} is now closed. The credit of{" "}
          {DEMO_CASE.amount} will appear in your account within 1–2 business days.
        </p>
      </div>
    );
  }

  if (disputeSubmitted) {
    return (
      <div class="text-center py-10">
        <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            class="w-8 h-8 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-brand-navy mb-2 tracking-tight">Dispute Submitted</h2>
        <p class="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed mb-5">
          A fraud specialist will review your dispute and respond within 5 business days.
        </p>
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-left max-w-sm mx-auto">
          <div class="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">
            Dispute Reason
          </div>
          <div class="text-amber-800">{disputeReason}</div>
          {disputeText && (
            <div class="mt-2 text-xs text-gray-600 leading-relaxed">{disputeText}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 class="text-base font-semibold text-brand-navy mb-1">Your Case Has Been Resolved</h2>

      <div class="bg-green-50 border border-green-200 rounded-xl p-5 my-4">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              class="w-5 h-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <div class="font-semibold text-green-900 text-sm mb-1">
              Fraud Confirmed — Full Credit of {DEMO_CASE.amount} Issued
            </div>
            <p class="text-xs text-green-800 leading-relaxed">{resolutionMessage}</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5 text-xs text-gray-600">
        <svg
          class="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        <span>
          Have questions?{" "}
          <strong>
            <a href="tel:18005551234" class="text-brand-blue">
              (800) 555-1234
            </a>
          </strong>
        </span>
      </div>

      {!showDisputeForm ? (
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            class="flex-1 bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold py-3 px-5 rounded-xl transition-all text-sm shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5"
            onClick={() => setAccepted(true)}
          >
            Accept Resolution
          </button>
          <button
            class="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-5 rounded-xl border border-gray-300 transition-colors text-sm"
            onClick={() => setShowDisputeForm(true)}
          >
            Dispute This Decision
          </button>
        </div>
      ) : (
        <div class="bg-white border border-gray-200 rounded-xl p-5 brand-card-shadow">
          <h3 class="font-semibold text-brand-navy mb-4 text-sm">Submit a Dispute</h3>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Reason for Dispute
            </label>
            <select
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              value={disputeReason}
              onChange={(e) => setDisputeReason((e.target as HTMLSelectElement).value)}
            >
              <option value="">Select a reason...</option>
              <option value="Incorrect amount credited">Incorrect amount credited</option>
              <option value="Fraud not fully acknowledged">Fraud not fully acknowledged</option>
              <option value="Missing transactions not addressed">
                Missing transactions not addressed
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="mb-5">
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Additional Details
            </label>
            <textarea
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              rows={4}
              placeholder="Explain why you are disputing this resolution..."
              value={disputeText}
              onInput={(e) => setDisputeText((e.target as HTMLTextAreaElement).value)}
            />
          </div>

          <div class="flex gap-3 items-center">
            <button
              class="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
              disabled={!disputeReason}
              onClick={() => setDisputeSubmitted(true)}
            >
              Submit Dispute
            </button>
            <button
              class="text-sm text-gray-400 hover:text-gray-600 px-2 transition-colors"
              onClick={() => setShowDisputeForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
