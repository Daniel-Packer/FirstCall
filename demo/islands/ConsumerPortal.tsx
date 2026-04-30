import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  ACCESS_LOG_DEMO,
  addQuestion,
  DEMO_CASE,
  DEMO_STAGE_DEFAULT,
  FINANCIAL_IMPACT_DEMO,
  type FinancialImpactItem,
  formatDecidedAt,
  GLOSSARY,
  INITIAL_PERMISSIONS,
  type Language,
  loadActiveProtections,
  loadLanguage,
  loadPermissionDecisions,
  loadQuestions,
  loadRevokedPermissions,
  loadTextSize,
  LOCALSTORAGE_KEY,
  NODE_STATES_BY_STAGE,
  type NodeQuestion,
  type NodeState,
  PERMISSIONS_CHANGE_EVENT,
  type Permission,
  PREFS_CHANGE_EVENT,
  PROCESS_NODES,
  PROTECTIVE_ACTIONS,
  PROTECTIVE_ACTIONS_EVENT,
  QUESTIONS_CHANGE_EVENT,
  REASSURANCE_COPY,
  revokePermission,
  REVOKED_PERMISSIONS_EVENT,
  savePermissionDecisions,
  saveLanguage,
  saveTextSize,
  STAGE_CHANGE_EVENT,
  t,
  type TextSize,
  toggleProtection,
} from "../lib/demoData.ts";

type Tab = "status" | "permissions" | "finances" | "resolution";

export default function ConsumerPortal() {
  const [stage, setStage] = useState(DEMO_STAGE_DEFAULT);
  const [activeTab, setActiveTab] = useState<Tab>("status");
  const [accepted, setAccepted] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [textSize, setTextSize] = useState<TextSize>("normal");

  const nodeStates = NODE_STATES_BY_STAGE[stage] ?? NODE_STATES_BY_STAGE[DEMO_STAGE_DEFAULT];
  const isResolved = stage >= 8;
  const resolutionMessage = nodeStates[9]?.consumerMessage ?? "";

  useEffect(() => {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      const n = parseInt(saved);
      if (!isNaN(n)) setStage(n);
    }

    setLanguage(loadLanguage());
    setTextSize(loadTextSize());

    const handler = (e: Event) => {
      const next = (e as CustomEvent<number>).detail;
      setStage(next);
      if (next >= 8) setActiveTab("resolution");
    };
    const prefsHandler = () => {
      setLanguage(loadLanguage());
      setTextSize(loadTextSize());
    };
    globalThis.addEventListener(STAGE_CHANGE_EVENT, handler);
    globalThis.addEventListener(PREFS_CHANGE_EVENT, prefsHandler);
    return () => {
      globalThis.removeEventListener(STAGE_CHANGE_EVENT, handler);
      globalThis.removeEventListener(PREFS_CHANGE_EVENT, prefsHandler);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.textSize = textSize;
    document.documentElement.lang = language;
  }, [textSize, language]);

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: "status", label: t(language, "case_status") },
    { id: "permissions", label: t(language, "permissions") },
    { id: "finances", label: t(language, "finances") },
    ...(isResolved
      ? [
          {
            id: "resolution" as Tab,
            label: t(language, "resolution"),
            badge: !accepted && !disputeSubmitted ? "Action needed" : undefined,
          },
        ]
      : []),
  ];

  return (
    <div class="min-h-screen bg-brand-slate pb-16">
      {/* Bank header */}
      <header class="bg-brand-navy text-white px-4 py-2.5 border-b-2 border-brand-blue/40">
        <div class="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="bg-white rounded-md p-1">
              <img src="/firstcall-logo.png" alt="FirstCall" class="h-5 w-auto" />
            </div>
            <div>
              <div class="font-semibold text-xs leading-tight">First Community Bank</div>
              <div class="text-slate-300 text-[11px]">{t(language, "portal_label")} · ClearPath</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <AccessibilityControls
              language={language}
              textSize={textSize}
              onLanguage={(l) => {
                saveLanguage(l);
                setLanguage(l);
              }}
              onTextSize={(s) => {
                saveTextSize(s);
                setTextSize(s);
              }}
            />
            <div class="text-right text-xs">
              <div class="font-medium">{DEMO_CASE.consumer.name}</div>
              <div class="text-slate-400 text-[11px]">••••{DEMO_CASE.consumer.accountEnding}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Case banner */}
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-2xl mx-auto px-4 py-2.5 flex justify-between items-center gap-4">
          <div class="flex items-baseline gap-3">
            <div>
              <div class="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Case</div>
              <div class="text-base font-bold text-brand-navy tracking-tight">#{DEMO_CASE.id}</div>
            </div>
            <div class="text-[11px] text-gray-500">
              Filed {DEMO_CASE.filed} · {DEMO_CASE.transactionType} · {DEMO_CASE.amount}
            </div>
          </div>
          {!isResolved && (
            <div class="text-right flex-shrink-0">
              <div class="text-[10px] text-gray-400 uppercase tracking-wide">Reg E by</div>
              <div class="text-xs font-semibold text-amber-700">{DEMO_CASE.regEDeadline}</div>
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

      {/* Reassurance + Right Now (only when case is open) */}
      {!isResolved && (
        <div class="max-w-2xl mx-auto px-4 pt-3">
          <ReassuranceBanner language={language} />
          <RightNowPanel language={language} />
        </div>
      )}

      {/* Tabs */}
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-2xl mx-auto px-4">
          <div class="flex">
            {tabs.map(({ id, label, badge }) => (
              <button
                key={id}
                class={`py-2 px-1 mr-6 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === id
                    ? "border-brand-blue text-brand-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(id)}
              >
                {label}
                {badge && (
                  <span class="bg-brand-blue text-white text-[10px] leading-none rounded-full px-1.5 py-0.5">
                    !
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div class="max-w-2xl mx-auto px-4 py-3">
        {activeTab === "status" && (
          <StatusTab nodeStates={nodeStates} stage={stage} language={language} />
        )}
        {activeTab === "permissions" && <PermissionsTab language={language} />}
        {activeTab === "finances" && <FinancialImpactTab language={language} />}
        {activeTab === "resolution" && isResolved && (
          <ResolutionTab
            accepted={accepted}
            setAccepted={setAccepted}
            disputeSubmitted={disputeSubmitted}
            setDisputeSubmitted={setDisputeSubmitted}
            resolutionMessage={resolutionMessage}
            language={language}
          />
        )}
      </div>

      {/* Support footer */}
      <div class="max-w-2xl mx-auto px-4 pb-2">
        <div class="text-center text-[11px] text-gray-500">
          {t(language, "questions_about_case")}{" "}
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

function StatusTab({
  nodeStates,
  stage,
  language,
}: {
  nodeStates: NodeState[];
  stage: number;
  language: Language;
}) {
  const [questions, setQuestions] = useState<NodeQuestion[]>([]);
  const [expandedNode, setExpandedNode] = useState<number | null>(null);
  const [askingNode, setAskingNode] = useState<number | null>(null);

  useEffect(() => {
    setQuestions(loadQuestions());
    const handler = () => setQuestions(loadQuestions());
    globalThis.addEventListener(QUESTIONS_CHANGE_EVENT, handler);
    return () => globalThis.removeEventListener(QUESTIONS_CHANGE_EVENT, handler);
  }, []);

  const activeIdx = nodeStates.findIndex((n) => n.status === "in-progress");
  const effectiveExpanded = expandedNode ?? (activeIdx >= 0 ? activeIdx : null);

  return (
    <div>
      <h2 class="text-[11px] font-bold text-brand-navy uppercase tracking-wider mb-2">
        {t(language, "investigation_progress")}
      </h2>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
        {PROCESS_NODES.map((node, i) => {
          const state = nodeStates[i];
          const isComplete = state.status === "complete";
          const isActive = state.status === "in-progress";
          const nodeQuestions = questions.filter((q) => q.nodeIndex === i);
          const pendingQ = nodeQuestions.filter((q) => !q.answer).length;
          const isExpanded = i === effectiveExpanded;

          const toggle = () => setExpandedNode(isExpanded ? -1 : i);

          return (
            <div key={node.id}>
              <button
                type="button"
                class={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                  isExpanded ? "bg-brand-blue-soft/40" : "hover:bg-gray-50"
                }`}
                onClick={toggle}
                aria-expanded={isExpanded}
              >
                <span
                  class={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isComplete
                      ? "bg-green-500"
                      : isActive
                      ? "bg-brand-blue ring-2 ring-brand-blue/20"
                      : "bg-gray-200"
                  }`}
                >
                  {isComplete && (
                    <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isActive && <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                  {!isComplete && !isActive && (
                    <span class="text-[10px] font-bold text-gray-400">{i}</span>
                  )}
                </span>

                <span
                  class={`text-xs font-semibold flex-1 truncate ${
                    isComplete ? "text-brand-navy" : isActive ? "text-brand-blue" : "text-gray-400"
                  }`}
                >
                  {node.label}
                  {node.optional && <span class="ml-1 font-normal opacity-50">(optional)</span>}
                </span>

                {pendingQ > 0 && (
                  <span class="text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {pendingQ} Q
                  </span>
                )}
                {nodeQuestions.length > 0 && pendingQ === 0 && (
                  <span class="text-[10px] font-semibold bg-brand-blue-soft text-brand-blue border border-brand-blue/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {nodeQuestions.length} Q
                  </span>
                )}
                {isActive && (
                  <span class="text-[10px] text-brand-blue font-semibold flex-shrink-0 uppercase tracking-wide">
                    Active
                  </span>
                )}
                {isComplete && state.completedAt && (
                  <span class="text-[10px] text-gray-400 flex-shrink-0">{state.completedAt}</span>
                )}

                <svg
                  class={`w-3 h-3 text-gray-300 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div class="px-3 pb-3 pt-1 bg-brand-blue-soft/20">
                  {(isComplete || isActive) && state.consumerMessage ? (
                    <p class={`text-xs leading-relaxed ${isActive ? "text-brand-blue" : "text-gray-600"}`}>
                      {state.consumerMessage}
                    </p>
                  ) : (
                    <p class="text-xs italic text-gray-400">
                      We haven't started this step yet. Usually takes {node.estimatedDays} once it begins.
                    </p>
                  )}

                  <NodeQA
                    nodeIndex={i}
                    questions={nodeQuestions}
                    expanded={askingNode === i}
                    onToggle={() => setAskingNode((cur) => (cur === i ? null : i))}
                  />
                </div>
              )}
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
                  Waiting on a reply — usually within 1 business day
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
          ? "Never mind"
          : hasQuestions
          ? `Ask another question${pendingCount ? ` · ${pendingCount} waiting for a reply` : ""}`
          : "Ask the investigator about this step"}
      </button>

      {expanded && (
        <form
          onSubmit={submit}
          class="mt-2 rounded-lg border border-brand-blue/30 bg-brand-blue-soft/40 p-2.5"
        >
          <textarea
            class="w-full text-xs bg-white border border-gray-200 rounded-md px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
            rows={2}
            placeholder="What's confusing? What's worrying you? Plain language is fine."
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
              Send my question
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function PermissionsTab({ language }: { language: Language }) {
  const [permissions, setPermissions] = useState<Permission[]>(INITIAL_PERMISSIONS);
  const [revoked, setRevoked] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    setRevoked(loadRevokedPermissions());
    const handler = () => setRevoked(loadRevokedPermissions());
    globalThis.addEventListener(REVOKED_PERMISSIONS_EVENT, handler);
    return () => globalThis.removeEventListener(REVOKED_PERMISSIONS_EVENT, handler);
  }, []);

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
      <h2 class="text-sm font-bold text-brand-navy uppercase tracking-wider mb-1">
        {t(language, "information_access")}
      </h2>
      <p class="text-xs text-gray-500 mb-3 leading-relaxed">
        These are the only things we'll look at while we work your case — nothing else.
        You can take any of them back right now (no phone call required), and everything
        you've allowed expires automatically 60 days after the case closes.
      </p>

      <div class="space-y-2">
        {permissions.map((perm) => {
          const isRevoked = revoked.includes(perm.id);
          const effectiveStatus = isRevoked ? "denied" : perm.status;
          return (
            <div
              key={perm.id}
              class={`rounded-xl border p-3 ${
                isRevoked
                  ? "bg-gray-50 border-gray-200 opacity-80"
                  : effectiveStatus === "granted"
                  ? "bg-green-50 border-green-200"
                  : effectiveStatus === "denied"
                  ? "bg-gray-50 border-gray-200"
                  : "bg-brand-blue-soft border-brand-blue/30"
              }`}
            >
              <div class="flex items-start gap-3">
                {effectiveStatus === "granted" && !isRevoked && (
                  <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {(effectiveStatus === "denied" || isRevoked) && (
                  <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {effectiveStatus === "pending" && (
                  <svg class="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-sm font-semibold text-brand-navy">{perm.label}</span>
                    <span
                      class={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        isRevoked
                          ? "bg-gray-200 text-gray-600"
                          : effectiveStatus === "granted"
                          ? "bg-green-100 text-green-700"
                          : effectiveStatus === "denied"
                          ? "bg-gray-200 text-gray-500"
                          : "bg-white text-brand-blue border border-brand-blue/30"
                      }`}
                    >
                      {isRevoked
                        ? t(language, "revoked")
                        : effectiveStatus === "granted"
                        ? "You allowed this"
                        : effectiveStatus === "denied"
                        ? "You said no"
                        : "Waiting on you"}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 leading-relaxed">{perm.description}</p>
                  {effectiveStatus === "granted" && !isRevoked && perm.grantedAt && (
                    <div class="flex items-center justify-between gap-2 mt-1.5 text-[11px]">
                      <span class="text-green-700">Allowed {perm.grantedAt}</span>
                      <span class="text-gray-400">
                        {t(language, "expires")} 60 days after the case closes
                      </span>
                    </div>
                  )}
                  {isRevoked && (
                    <p class="text-[11px] text-gray-500 mt-1">
                      You took this back. We can't use it anymore.
                    </p>
                  )}
                  {effectiveStatus === "denied" && !isRevoked && (
                    <p class="text-[11px] text-gray-400 mt-1">You said no to this one</p>
                  )}
                  {effectiveStatus === "pending" && (
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
                  {effectiveStatus === "granted" && !isRevoked && (
                    <div class="mt-2">
                      <button
                        type="button"
                        class="text-[11px] font-semibold text-red-600 hover:text-red-700 transition-colors"
                        onClick={() => {
                          if (
                            confirm(
                              "Take this back? We'll stop using this data right away. That may slow the investigation, but your case will keep going with whatever else you've allowed.",
                            )
                          ) {
                            revokePermission(perm.id);
                          }
                        }}
                      >
                        Take this back
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        class="mt-3 w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        onClick={() => setShowLog((v) => !v)}
        aria-expanded={showLog}
      >
        <div>
          <div class="text-xs font-bold text-brand-navy uppercase tracking-wider">
            {t(language, "access_log_title")}
          </div>
          <div class="text-[11px] text-gray-500">
            {ACCESS_LOG_DEMO.length} times so far — see who, when, and exactly what
          </div>
        </div>
        <svg
          class={`w-4 h-4 text-gray-400 transition-transform ${showLog ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showLog && (
        <div class="mt-2 bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
          {ACCESS_LOG_DEMO.map((entry, idx) => {
            const perm = INITIAL_PERMISSIONS.find((p) => p.id === entry.permissionId);
            return (
              <div key={idx} class="px-4 py-2.5">
                <div class="flex items-center justify-between gap-3">
                  <div class="text-xs font-semibold text-brand-navy">
                    {perm?.label ?? entry.permissionId}
                  </div>
                  <div class="text-[11px] text-gray-400">{entry.accessedAt}</div>
                </div>
                <div class="text-[11px] text-gray-500 mt-0.5">
                  {entry.accessor} · {entry.scope}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResolutionTab({
  accepted,
  setAccepted,
  disputeSubmitted,
  setDisputeSubmitted,
  resolutionMessage,
  language,
}: {
  accepted: boolean;
  setAccepted: (v: boolean) => void;
  disputeSubmitted: boolean;
  setDisputeSubmitted: (v: boolean) => void;
  resolutionMessage: string;
  language: Language;
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
        <h2 class="text-xl font-bold text-brand-navy mb-2 tracking-tight">All set.</h2>
        <p class="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed mb-5">
          Case #{DEMO_CASE.id} is closed. Your {DEMO_CASE.amount} is back, and we'll
          mail a written summary within 5 business days. Below are a few things to
          do so this doesn't happen again.
        </p>
        <div class="max-w-md mx-auto text-left">
          <PostResolutionProtection language={language} />
        </div>
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
        <h2 class="text-xl font-bold text-brand-navy mb-2 tracking-tight">We hear you.</h2>
        <p class="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed mb-5">
          A fraud specialist will look at your dispute and reply within 5 business
          days. Your case stays open in the meantime — nothing has been finalized.
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
      <h2 class="text-base font-semibold text-brand-navy mb-1">We're done. Your money is back.</h2>

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
              We confirmed it was fraud · {DEMO_CASE.amount} credited
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
            Looks right — close my case
          </button>
          <button
            class="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-5 rounded-xl border border-gray-300 transition-colors text-sm"
            onClick={() => setShowDisputeForm(true)}
          >
            Something's off — reopen
          </button>
        </div>
      ) : (
        <div class="bg-white border border-gray-200 rounded-xl p-5 brand-card-shadow">
          <h3 class="font-semibold text-brand-navy mb-4 text-sm">Tell us what's off</h3>

          <div class="mb-4">
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              What's the issue?
            </label>
            <select
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              value={disputeReason}
              onChange={(e) => setDisputeReason((e.target as HTMLSelectElement).value)}
            >
              <option value="">Pick the closest one...</option>
              <option value="Credit amount is wrong">The credited amount is wrong</option>
              <option value="Decision missed part of the fraud">The decision missed part of the fraud</option>
              <option value="Other transactions weren't addressed">
                Other transactions I reported weren't addressed
              </option>
              <option value="Other">Something else</option>
            </select>
          </div>

          <div class="mb-5">
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              More detail (optional but helpful)
            </label>
            <textarea
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              rows={4}
              placeholder="What did we get wrong, and what would make it right?"
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
              Reopen my case
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

function GlossaryTooltip({ termKey, children }: { termKey: keyof typeof GLOSSARY; children: ComponentChildren }) {
  const term = GLOSSARY[termKey];
  if (!term) return <>{children}</>;
  return (
    <span class="glossary-term" tabIndex={0} role="button" aria-label={`What is ${term.term}?`}>
      {children}
      <span class="glossary-popover" role="tooltip">
        <span class="glossary-term-name">{term.term}</span>
        {term.long}
      </span>
    </span>
  );
}

function ReassuranceBanner({ language }: { language: Language }) {
  return (
    <div class="bg-gradient-to-r from-brand-blue to-brand-blue-hover text-white rounded-xl px-4 py-3 mb-3 shadow-lg shadow-brand-blue/20">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div class="min-w-0">
          <div class="text-sm font-bold">{t(language, "youre_protected_title")}</div>
          <p class="text-[12px] leading-relaxed text-white/90 mt-0.5">
            {t(language, "youre_protected_body")}{" "}
            <GlossaryTooltip termKey="reg_e">
              <span class="font-semibold underline-offset-2">Regulation E</span>
            </GlossaryTooltip>
          </p>
        </div>
      </div>
    </div>
  );
}

function RightNowPanel({ language }: { language: Language }) {
  const [active, setActive] = useState<string[]>([]);

  useEffect(() => {
    setActive(loadActiveProtections());
    const handler = () => setActive(loadActiveProtections());
    globalThis.addEventListener(PROTECTIVE_ACTIONS_EVENT, handler);
    return () => globalThis.removeEventListener(PROTECTIVE_ACTIONS_EVENT, handler);
  }, []);

  const top = PROTECTIVE_ACTIONS.slice(0, 3);
  const allCount = PROTECTIVE_ACTIONS.length;
  const activeCount = active.length;

  return (
    <div class="bg-white border border-amber-200 rounded-xl p-3 mb-3">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          <div>
            <div class="text-xs font-bold text-brand-navy">{t(language, "right_now_title")}</div>
            <div class="text-[11px] text-gray-500">{t(language, "right_now_subtitle")}</div>
          </div>
        </div>
        <a
          href="tel:18005551234"
          class="text-[11px] font-semibold text-brand-blue hover:text-brand-blue-hover whitespace-nowrap inline-flex items-center gap-1"
        >
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {t(language, "talk_to_human")}
        </a>
      </div>

      <div class="grid grid-cols-3 gap-2">
        {top.map((action) => {
          const isOn = active.includes(action.id);
          return (
            <button
              type="button"
              key={action.id}
              onClick={() => toggleProtection(action.id)}
              class={`text-left rounded-lg border px-2.5 py-2 transition-colors ${
                isOn
                  ? "bg-green-50 border-green-300"
                  : "bg-gray-50 border-gray-200 hover:border-brand-blue/40 hover:bg-brand-blue-soft/40"
              }`}
              aria-pressed={isOn}
            >
              <div class="flex items-center gap-1.5 mb-1">
                {isOn ? (
                  <svg class="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span class="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span class={`text-[11px] font-semibold leading-tight ${isOn ? "text-green-800" : "text-brand-navy"}`}>
                  {action.label}
                </span>
              </div>
              <div class="text-[10px] text-gray-500 leading-snug">{action.description}</div>
            </button>
          );
        })}
      </div>
      {allCount > 3 && (
        <div class="text-[11px] text-gray-400 mt-2 text-center">
          {activeCount} of {allCount} protections active ·{" "}
          <a href="#" class="text-brand-blue font-semibold">See all</a>
        </div>
      )}
    </div>
  );
}

function FinancialImpactTab({ language }: { language: Language }) {
  return (
    <div>
      <h2 class="text-sm font-bold text-brand-navy uppercase tracking-wider mb-1">
        {t(language, "financial_impact_title")}
      </h2>
      <p class="text-xs text-gray-500 mb-3 leading-relaxed">
        $2,847 leaving your account doesn't just affect your balance. Here's what we're
        doing about the rest of it — fees, autopays, your credit score — so you don't
        have to chase any of it down.
      </p>

      <div class="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
        {FINANCIAL_IMPACT_DEMO.map((item, idx) => (
          <FinancialRow key={idx} item={item} />
        ))}
      </div>

      <div class="mt-3 bg-brand-blue-soft border border-brand-blue/20 rounded-xl p-3 flex items-start gap-3">
        <svg class="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-xs text-brand-navy leading-relaxed">
          <strong>You don't have to wait for the credit.</strong> If rent or a bill is
          due before this clears, you can request a fee-free{" "}
          <span class="font-semibold text-brand-blue">emergency advance up to $500</span>{" "}
          right now and we'll deduct it from the credit when it lands.
        </div>
      </div>
    </div>
  );
}

function FinancialRow({ item }: { item: FinancialImpactItem }) {
  const swatch = item.status === "good"
    ? "bg-green-500"
    : item.status === "watch"
    ? "bg-amber-500"
    : "bg-gray-300";
  return (
    <div class="px-4 py-2.5 flex items-start gap-3">
      <span class={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${swatch}`} />
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between gap-2">
          <span class="text-sm font-semibold text-brand-navy">{item.label}</span>
          {item.amount && (
            <span
              class={`text-sm font-bold tabular-nums flex-shrink-0 ${
                item.status === "good" ? "text-green-700" : "text-brand-navy"
              }`}
            >
              {item.amount}
            </span>
          )}
        </div>
        <p class="text-xs text-gray-500 leading-relaxed mt-0.5">{item.detail}</p>
      </div>
    </div>
  );
}

function PostResolutionProtection({ language: _language }: { language: Language }) {
  const [active, setActive] = useState<string[]>([]);

  useEffect(() => {
    setActive(loadActiveProtections());
    const handler = () => setActive(loadActiveProtections());
    globalThis.addEventListener(PROTECTIVE_ACTIONS_EVENT, handler);
    return () => globalThis.removeEventListener(PROTECTIVE_ACTIONS_EVENT, handler);
  }, []);

  return (
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <h3 class="text-sm font-bold text-brand-navy mb-1">Make sure this doesn't happen again</h3>
      <p class="text-xs text-gray-500 mb-3 leading-relaxed">
        The same scammers come back to roughly 1 in 4 victims within 30 days. A
        couple of clicks here makes that a lot harder.
      </p>
      <div class="space-y-1.5">
        {PROTECTIVE_ACTIONS.map((action) => {
          const isOn = active.includes(action.id);
          return (
            <button
              type="button"
              key={action.id}
              onClick={() => toggleProtection(action.id)}
              class={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-colors ${
                isOn
                  ? "bg-green-50 border-green-300"
                  : "bg-gray-50 border-gray-200 hover:border-brand-blue/40"
              }`}
              aria-pressed={isOn}
            >
              {isOn ? (
                <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <span class="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
              <div class="flex-1 min-w-0">
                <div class={`text-xs font-semibold ${isOn ? "text-green-800" : "text-brand-navy"}`}>
                  {action.label}
                </div>
                <div class="text-[11px] text-gray-500">{action.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AccessibilityControls({
  language,
  textSize,
  onLanguage,
  onTextSize,
}: {
  language: Language;
  textSize: TextSize;
  onLanguage: (l: Language) => void;
  onTextSize: (s: TextSize) => void;
}) {
  return (
    <div class="flex items-center gap-1 text-[11px]">
      <div class="flex items-center bg-white/10 rounded-md overflow-hidden" role="group" aria-label="Language">
        <button
          type="button"
          class={`px-1.5 py-1 font-semibold transition-colors ${
            language === "en" ? "bg-white text-brand-navy" : "text-slate-200 hover:bg-white/10"
          }`}
          onClick={() => onLanguage("en")}
          aria-pressed={language === "en"}
        >
          EN
        </button>
        <button
          type="button"
          class={`px-1.5 py-1 font-semibold transition-colors ${
            language === "es" ? "bg-white text-brand-navy" : "text-slate-200 hover:bg-white/10"
          }`}
          onClick={() => onLanguage("es")}
          aria-pressed={language === "es"}
        >
          ES
        </button>
      </div>
      <div class="flex items-center bg-white/10 rounded-md overflow-hidden" role="group" aria-label="Text size">
        <button
          type="button"
          class={`px-1.5 py-1 font-semibold transition-colors ${
            textSize === "normal" ? "bg-white text-brand-navy" : "text-slate-200 hover:bg-white/10"
          }`}
          onClick={() => onTextSize("normal")}
          aria-pressed={textSize === "normal"}
          title="Normal text size"
        >
          A
        </button>
        <button
          type="button"
          class={`px-1.5 py-1 font-bold text-sm transition-colors ${
            textSize === "large" ? "bg-white text-brand-navy" : "text-slate-200 hover:bg-white/10"
          }`}
          onClick={() => onTextSize("large")}
          aria-pressed={textSize === "large"}
          title="Larger text size"
        >
          A
        </button>
      </div>
    </div>
  );
}
