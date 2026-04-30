import { useEffect, useState } from "preact/hooks";
import {
  DEMO_CASE,
  DEMO_STAGE_DEFAULT,
  DEMO_STAGE_MAX,
  LOCALSTORAGE_KEY,
  NODE_STATES_BY_STAGE,
  PROCESS_NODES,
  STAGE_CHANGE_EVENT,
  type NodeState,
} from "../lib/demoData.ts";

type View = "dashboard" | "case";

const OTHER_CASES = [
  {
    id: "FCB-2026-0831",
    consumer: "Marcus Lee",
    amount: "$12,400.00",
    stage: "Claim Received",
    regEDays: 2,
    priority: "HIGH",
    closed: false,
  },
  {
    id: "FCB-2026-0819",
    consumer: "Ana Torres",
    amount: "$550.00",
    stage: "Final Resolution",
    regEDays: 0,
    priority: "NORMAL",
    closed: true,
  },
];

export default function BankPortal() {
  const [view, setView] = useState<View>("dashboard");
  const [stage, setStage] = useState(DEMO_STAGE_DEFAULT);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("complete");
  const [internalNotes, setInternalNotes] = useState("");
  const [consumerMsg, setConsumerMsg] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const nodeStates: NodeState[] = NODE_STATES_BY_STAGE[stage] ?? NODE_STATES_BY_STAGE[DEMO_STAGE_DEFAULT];
  const activeIdx = nodeStates.findIndex((n) => n.status === "in-progress");

  useEffect(() => {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      const n = parseInt(saved);
      if (!isNaN(n)) setStage(n);
    }

    const handler = (e: Event) => setStage((e as CustomEvent<number>).detail);
    globalThis.addEventListener(STAGE_CHANGE_EVENT, handler);
    return () => globalThis.removeEventListener(STAGE_CHANGE_EVENT, handler);
  }, []);

  const openNode = (i: number) => {
    const state = nodeStates[i];
    if (state.status === "pending" && i !== activeIdx + 1) return;
    setSelectedNode(i);
    setEditStatus(state.status === "in-progress" ? "complete" : state.status);
    setConsumerMsg(state.consumerMessage ?? "");
    setInternalNotes("");
    setSaveSuccess(false);
  };

  const saveNode = () => {
    if (selectedNode === null) return;
    if (editStatus === "complete" && selectedNode === activeIdx) {
      const next = Math.min(stage + 1, DEMO_STAGE_MAX);
      setStage(next);
      localStorage.setItem(LOCALSTORAGE_KEY, String(next));
      globalThis.dispatchEvent(new CustomEvent(STAGE_CHANGE_EVENT, { detail: next }));
    }
    setSaveSuccess(true);
    setSelectedNode(null);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div class="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <header class="bg-blue-900 text-white px-4 py-4">
        <div class="max-w-5xl mx-auto flex items-center gap-4">
          {view === "case" && (
            <button
              class="text-blue-300 hover:text-white text-sm transition-colors flex-shrink-0"
              onClick={() => { setView("dashboard"); setSelectedNode(null); }}
            >
              ← Cases
            </button>
          )}
          <div>
            <div class="font-bold text-base">First Community Bank</div>
            <div class="text-blue-200 text-xs">
              {view === "dashboard" ? "Fraud Investigation Portal" : `Case #${DEMO_CASE.id}`}
            </div>
          </div>
          {view === "case" && (
            <div class="ml-auto text-right text-sm flex-shrink-0">
              <div class="text-blue-200 text-xs">Reg E Deadline</div>
              <div class="font-semibold">{DEMO_CASE.regEDeadline}</div>
            </div>
          )}
          {view === "dashboard" && (
            <div class="ml-auto text-xs text-blue-300">M. Rodriguez · Fraud Analyst</div>
          )}
        </div>
      </header>

      {view === "dashboard" ? (
        <Dashboard onOpenCase={() => setView("case")} />
      ) : (
        <CaseDetail
          nodeStates={nodeStates}
          activeIdx={activeIdx}
          selectedNode={selectedNode}
          editStatus={editStatus}
          setEditStatus={setEditStatus}
          internalNotes={internalNotes}
          setInternalNotes={setInternalNotes}
          consumerMsg={consumerMsg}
          setConsumerMsg={setConsumerMsg}
          saveSuccess={saveSuccess}
          onNodeClick={openNode}
          onSave={saveNode}
          onCancelEdit={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}

function Dashboard({ onOpenCase }: { onOpenCase: () => void }) {
  return (
    <div class="max-w-5xl mx-auto px-4 py-6">
      {/* Stats */}
      <div class="grid grid-cols-3 gap-4 mb-6">
        {[
          { value: "3", label: "Open Cases", color: "text-gray-900" },
          { value: "1", label: "High Priority", color: "text-red-600" },
          { value: "1", label: "Resolved This Week", color: "text-green-600" },
        ].map(({ value, label, color }) => (
          <div
            key={label}
            class="bg-white rounded-xl border border-gray-200 px-4 py-4 text-center"
          >
            <div class={`text-2xl font-bold ${color}`}>{value}</div>
            <div class="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Cases table */}
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Active Cases</h2>
        <button class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
          + New Case
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Case ID", "Consumer", "Amount", "Stage", "Reg E", "Priority", ""].map(
                (h) => (
                  <th
                    key={h}
                    class="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            {/* Live demo case */}
            <tr
              class="hover:bg-blue-50 cursor-pointer transition-colors"
              onClick={onOpenCase}
            >
              <td class="px-4 py-3 font-mono text-blue-600 font-semibold text-xs">
                {DEMO_CASE.id}
              </td>
              <td class="px-4 py-3 font-medium">{DEMO_CASE.consumer.name}</td>
              <td class="px-4 py-3 font-medium text-red-600">{DEMO_CASE.amount}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 text-xs">
                  <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  In Progress
                </span>
              </td>
              <td class="px-4 py-3 text-amber-700 font-medium text-xs">7 days</td>
              <td class="px-4 py-3">
                <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  NORMAL
                </span>
              </td>
              <td class="px-4 py-3 text-blue-500 text-xs font-medium">Open →</td>
            </tr>

            {OTHER_CASES.map((c) => (
              <tr key={c.id} class="opacity-50 cursor-default">
                <td class="px-4 py-3 font-mono text-gray-500 text-xs">{c.id}</td>
                <td class="px-4 py-3">{c.consumer}</td>
                <td class="px-4 py-3 font-medium">{c.amount}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">{c.stage}</td>
                <td class="px-4 py-3 text-xs">
                  {c.closed ? (
                    <span class="text-gray-400">Closed</span>
                  ) : (
                    <span class="text-red-600 font-semibold">{c.regEDays} days</span>
                  )}
                </td>
                <td class="px-4 py-3">
                  <span
                    class={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      c.priority === "HIGH"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.priority}
                  </span>
                </td>
                <td class="px-4 py-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CaseDetail({
  nodeStates,
  activeIdx,
  selectedNode,
  editStatus,
  setEditStatus,
  internalNotes,
  setInternalNotes,
  consumerMsg,
  setConsumerMsg,
  saveSuccess,
  onNodeClick,
  onSave,
  onCancelEdit,
}: {
  nodeStates: NodeState[];
  activeIdx: number;
  selectedNode: number | null;
  editStatus: string;
  setEditStatus: (v: string) => void;
  internalNotes: string;
  setInternalNotes: (v: string) => void;
  consumerMsg: string;
  setConsumerMsg: (v: string) => void;
  saveSuccess: boolean;
  onNodeClick: (i: number) => void;
  onSave: () => void;
  onCancelEdit: () => void;
}) {
  return (
    <div class="max-w-5xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Process map */}
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-gray-900 text-sm">Investigation Stages</h2>
            {saveSuccess && (
              <span class="text-xs text-green-600 font-semibold flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Saved — consumer notified
              </span>
            )}
          </div>

          <div class="space-y-0.5">
            {PROCESS_NODES.map((node, i) => {
              const state = nodeStates[i];
              const isActive = state.status === "in-progress";
              const isComplete = state.status === "complete";
              const isClickable = isComplete || isActive;
              const isSelected = selectedNode === i;

              return (
                <div
                  key={node.id}
                  class={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isClickable
                      ? "cursor-pointer hover:bg-gray-50"
                      : "opacity-35 cursor-default"
                  } ${isSelected ? "bg-blue-50 ring-1 ring-blue-200" : ""}`}
                  onClick={() => isClickable && onNodeClick(i)}
                >
                  <div
                    class={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isComplete
                        ? "bg-green-100 text-green-700"
                        : isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isComplete ? "✓" : i}
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800 leading-tight">
                      {node.label}
                      {node.optional && (
                        <span class="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
                      )}
                    </div>
                    {isComplete && state.completedAt && (
                      <div class="text-xs text-gray-400">{state.completedAt}</div>
                    )}
                    {isActive && (
                      <div class="text-xs text-blue-500">In progress — click to update</div>
                    )}
                  </div>

                  {isActive && (
                    <span class="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">
                      <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                      Active
                    </span>
                  )}
                  {isComplete && (
                    <span class="text-xs text-gray-300 flex-shrink-0">Edit</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side column */}
        <div class="space-y-4">
          {selectedNode !== null ? (
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-gray-900 text-sm">
                    {PROCESS_NODES[selectedNode].label}
                  </h3>
                  <p class="text-xs text-gray-400">{PROCESS_NODES[selectedNode].id}</p>
                </div>
                <button
                  class="text-gray-300 hover:text-gray-500 text-lg leading-none transition-colors"
                  onClick={onCancelEdit}
                >
                  ×
                </button>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Status
                  </label>
                  <select
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                    value={editStatus}
                    onChange={(e) => setEditStatus((e.target as HTMLSelectElement).value)}
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="complete">Complete</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Internal Notes
                    <span class="ml-1 font-normal normal-case text-gray-300">
                      (not visible to consumer)
                    </span>
                  </label>
                  <textarea
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                    rows={2}
                    placeholder="Notes for your team..."
                    value={internalNotes}
                    onInput={(e) =>
                      setInternalNotes((e.target as HTMLTextAreaElement).value)
                    }
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Consumer-facing Message
                  </label>
                  <textarea
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                    rows={3}
                    placeholder="What the consumer will see in their portal..."
                    value={consumerMsg}
                    onInput={(e) =>
                      setConsumerMsg((e.target as HTMLTextAreaElement).value)
                    }
                  />
                </div>

                <button
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                  onClick={onSave}
                >
                  Save &amp; Notify Consumer
                </button>
              </div>
            </div>
          ) : (
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
              Click an <strong>active</strong> or <strong>completed</strong> stage to view
              details and update its status. Changes will be reflected in the consumer portal
              immediately.
            </div>
          )}

          {/* Case summary */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Case Summary
            </h3>
            <dl class="space-y-2 text-sm">
              {[
                ["Consumer", DEMO_CASE.consumer.name],
                ["Account", `••••${DEMO_CASE.consumer.accountEnding}`],
                ["Amount", DEMO_CASE.amount],
                ["Type", DEMO_CASE.transactionType],
                ["Filed", DEMO_CASE.filed],
                ["Assigned", DEMO_CASE.assignedAgent],
                ["Police Report", DEMO_CASE.policeReport],
              ].map(([label, value]) => (
                <div key={label} class="flex justify-between gap-2">
                  <dt class="text-gray-400 flex-shrink-0">{label}</dt>
                  <dd class={`font-medium text-right truncate ${label === "Amount" ? "text-red-600" : ""}`}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
