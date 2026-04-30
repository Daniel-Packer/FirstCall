import { useState } from "preact/hooks";
import {
  DEMO_CASE,
  formatDecidedAt,
  INITIAL_PERMISSIONS,
  loadPermissionDecisions,
  savePermissionDecisions,
} from "../lib/demoData.ts";

type MerchantContact = "yes" | "no" | "na";

interface TxnRow {
  id: string;
  date: string;
  amount: string;
  type: string;
  merchant: string;
  isPending: boolean;
  merchantContacted: MerchantContact;
  merchantContactOutcome: string;
}

function mkRow(partial?: Partial<TxnRow>): TxnRow {
  return {
    id: Math.random().toString(36).slice(2),
    date: "",
    amount: "",
    type: "wire",
    merchant: "",
    isPending: false,
    merchantContacted: "no",
    merchantContactOutcome: "",
    ...partial,
  };
}

const DEMO_ROW = mkRow({
  date: "2026-04-08",
  amount: "2847.50",
  type: "wire",
  merchant: "Unknown Recipient",
  isPending: false,
  merchantContacted: "no",
});

const TXN_TYPES = [
  { value: "ach", label: "ACH Transfer" },
  { value: "wire", label: "Wire Transfer" },
  { value: "card", label: "Card Transaction" },
  { value: "check", label: "Check" },
  { value: "other", label: "Other" },
];

const LABEL = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";
const INPUT =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-shadow";

export default function IntakeForm() {
  const [rows, setRows] = useState<TxnRow[]>([mkRow()]);
  const [description, setDescription] = useState("");
  const [policeReport, setPoliceReport] = useState(false);
  const [policeReportNumber, setPoliceReportNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [formExpanded, setFormExpanded] = useState(false);
  const [manyOthers, setManyOthers] = useState(false);

  const toggleRowExpand = (id: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const isBulk = rows.length > 1;
  const hasAnyPending = rows.some((r) => r.isPending);
  const totalAmount = rows.reduce((sum, r) => {
    const n = parseFloat(r.amount.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const updateRow = (id: string, patch: Partial<TxnRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const addRow = () => setRows((prev) => [...prev, mkRow()]);

  const fillDemo = () => {
    const rowId = rows[0].id;
    setRows([{ ...DEMO_ROW, id: rowId }]);
    setDescription(DEMO_CASE.description);
    setPoliceReport(true);
    setPoliceReportNumber(DEMO_CASE.policeReport);
    setErrors({});
    setExpandedRows(new Set([rowId]));
    setFormExpanded(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    rows.forEach((r, i) => {
      const prefix = isBulk ? `txn${i}_` : "";
      if (!r.date) errs[`${prefix}date`] = "Required";
      if (!r.amount || isNaN(parseFloat(r.amount))) errs[`${prefix}amount`] = "Enter a valid amount";
      if (!r.merchant.trim()) errs[`${prefix}merchant`] = "Required";
    });
    if (policeReport && !policeReportNumber.trim()) errs["policeReportNumber"] = "Enter the report number";
    return errs;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Confirmation
        isBulk={isBulk}
        rows={rows}
        totalAmount={totalAmount}
        hasAnyPending={hasAnyPending}
        manyOthers={manyOthers}
      />
    );
  }

  return (
    <div class="min-h-screen bg-brand-slate pb-24">
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

      <div class="max-w-2xl mx-auto px-4 py-6">
        {/* Page title */}
        <div class="mb-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-brand-navy tracking-tight">Tell us what happened</h1>
              <p class="text-sm text-gray-500 mt-1 leading-relaxed">
                You'll get a case number right away and a confirmation by email and
                text. A fraud specialist reviews your claim within 1–2 business days,
                and federal law requires us to finish within 45 business days. You won't
                pay for any fraud we confirm.
              </p>
            </div>
            <button
              type="button"
              class="flex-shrink-0 text-xs text-brand-blue hover:text-brand-blue-hover border border-brand-blue/30 hover:border-brand-blue bg-brand-blue-soft hover:bg-brand-blue-soft/70 px-3 py-1.5 rounded-lg transition-colors font-semibold"
              onClick={fillDemo}
            >
              Fill demo data
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Transaction(s) section ── */}
          <div class="bg-white rounded-xl border border-gray-200 p-5 mb-4 brand-card-shadow">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-semibold text-brand-navy">
                {isBulk
                  ? `Transactions you didn't authorize (${rows.length})`
                  : "The transaction you didn't authorize"}
              </h2>
              {isBulk && totalAmount > 0 && (
                <span class="text-sm font-semibold text-red-600">
                  Total: ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>

            <div class="space-y-6">
              {rows.map((row, i) => (
                <TxnRowForm
                  key={row.id}
                  row={row}
                  index={i}
                  isBulk={isBulk}
                  errors={errors}
                  expanded={expandedRows.has(row.id)}
                  onToggleExpand={() => toggleRowExpand(row.id)}
                  onChange={(patch) => updateRow(row.id, patch)}
                  onRemove={rows.length > 1 ? () => removeRow(row.id) : undefined}
                />
              ))}
            </div>

            <div class="mt-4 flex flex-col gap-3">
              <button
                type="button"
                class="self-start text-sm text-brand-blue hover:text-brand-blue-hover font-semibold flex items-center gap-1.5 transition-colors"
                onClick={addRow}
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add another transaction
              </button>

              <label
                class={`flex items-start gap-2.5 cursor-pointer select-none p-3 rounded-lg border transition-colors ${
                  manyOthers
                    ? "bg-brand-blue-soft border-brand-blue/30"
                    : "bg-gray-50 border-gray-100 hover:border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300 text-brand-blue mt-0.5 accent-brand-blue"
                  checked={manyOthers}
                  onChange={(e) => setManyOthers((e.target as HTMLInputElement).checked)}
                />
                <div>
                  <span class="text-sm font-medium text-gray-800">
                    There are more I haven't listed
                  </span>
                  <p class="text-xs text-gray-500 mt-0.5">
                    Use this if the rows above are just examples. Your investigator
                    will call you to walk through the rest — you don't have to list
                    them all here.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* ── Optional extras (collapsible) ── */}
          <div class="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden brand-card-shadow">
            <button
              type="button"
              class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setFormExpanded((v) => !v)}
              aria-expanded={formExpanded}
            >
              <div>
                <h2 class="font-semibold text-brand-navy">Anything else we should know?</h2>
                <p class="text-xs text-gray-500 mt-0.5">
                  Optional. Tell us how you noticed, or add a police report number if you have one.
                </p>
              </div>
              <svg
                class={`w-5 h-5 text-gray-400 transition-transform ${formExpanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {formExpanded && (
              <div class="px-5 pb-5 border-t border-gray-100 pt-4 space-y-5">
                <div>
                  <label class={LABEL}>What happened, in your own words</label>
                  <textarea
                    class={INPUT}
                    rows={4}
                    placeholder="How did you notice? Did anyone call or email you? Anything you remember helps the investigator understand the case."
                    value={description}
                    onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
                  />
                </div>

                <div>
                  <label class="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 accent-brand-blue"
                      checked={policeReport}
                      onChange={(e) => setPoliceReport((e.target as HTMLInputElement).checked)}
                    />
                    <span class="text-sm text-gray-700">I have filed a police report for this fraud</span>
                  </label>

                  {policeReport && (
                    <div class="mt-3 pl-6">
                      <label class={LABEL}>
                        Report Number <span class="text-red-500 normal-case">*</span>
                      </label>
                      <input
                        type="text"
                        class={`${INPUT} max-w-xs ${errors.policeReportNumber ? "border-red-400 ring-1 ring-red-400" : ""}`}
                        placeholder="e.g. RPT-2026-44892"
                        value={policeReportNumber}
                        onInput={(e) => {
                          setPoliceReportNumber((e.target as HTMLInputElement).value);
                          setErrors((prev) => ({ ...prev, policeReportNumber: "" }));
                        }}
                      />
                      {errors.policeReportNumber && (
                        <p class="mt-1 text-xs text-red-500">{errors.policeReportNumber}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Supporting documents note ── */}
          <div class="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 mb-6 flex items-center gap-3 text-sm text-gray-500">
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>
              Have screenshots, statements, or a police report? You'll be able to
              upload them right after you submit — don't worry about gathering
              everything now.
            </span>
          </div>

          {/* ── High-priority notice ── */}
          {hasAnyPending && (
            <div class="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5 flex items-start gap-3">
              <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div class="text-sm">
                <strong class="text-amber-800">We're putting this at the front of the queue</strong>
                <p class="text-amber-700 mt-0.5">
                  You marked at least one transaction as still pending. Pending
                  transactions can sometimes be cancelled before the money leaves —
                  so your case jumps to the top as soon as you submit.
                </p>
              </div>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            class="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold py-3.5 px-6 rounded-xl transition-all text-base shadow-lg shadow-brand-blue/25 hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5"
          >
            Submit my claim
          </button>

          <p class="mt-3 text-xs text-gray-400 text-center leading-relaxed">
            By submitting, you're saying the information here is true to the best of
            your knowledge. A fraud specialist reviews every claim within 1–2 business
            days, and you can ask questions on any stage of your case.
          </p>
        </form>
      </div>

      {/* Support footer */}
      <div class="max-w-2xl mx-auto px-4 pb-4">
        <div class="bg-white border border-gray-200 rounded-lg p-3 text-center text-xs text-gray-500">
          Need help?{" "}
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

function TxnRowForm({
  row,
  index,
  isBulk,
  errors,
  expanded,
  onToggleExpand,
  onChange,
  onRemove,
}: {
  row: TxnRow;
  index: number;
  isBulk: boolean;
  errors: Record<string, string>;
  expanded: boolean;
  onToggleExpand: () => void;
  onChange: (patch: Partial<TxnRow>) => void;
  onRemove?: () => void;
}) {
  const p = isBulk ? `txn${index}_` : "";

  return (
    <div class={isBulk ? "border border-gray-100 rounded-xl p-4 relative" : ""}>
      {isBulk && (
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Transaction {index + 1}
          </span>
          {onRemove && (
            <button
              type="button"
              class="text-xs text-red-400 hover:text-red-600 transition-colors"
              onClick={onRemove}
            >
              Remove
            </button>
          )}
        </div>
      )}

      <div class="grid grid-cols-2 gap-3 mb-3">
        {/* Date */}
        <div>
          <label class={LABEL}>
            Date <span class="text-red-500 normal-case">*</span>
          </label>
          <input
            type="date"
            class={`${INPUT} ${errors[`${p}date`] ? "border-red-400" : ""}`}
            value={row.date}
            onInput={(e) => onChange({ date: (e.target as HTMLInputElement).value })}
          />
          {errors[`${p}date`] && (
            <p class="mt-1 text-xs text-red-500">{errors[`${p}date`]}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label class={LABEL}>
            Amount <span class="text-red-500 normal-case">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="text"
              inputMode="decimal"
              class={`${INPUT} pl-6 ${errors[`${p}amount`] ? "border-red-400" : ""}`}
              placeholder="0.00"
              value={row.amount}
              onInput={(e) => onChange({ amount: (e.target as HTMLInputElement).value })}
            />
          </div>
          {errors[`${p}amount`] && (
            <p class="mt-1 text-xs text-red-500">{errors[`${p}amount`]}</p>
          )}
        </div>
      </div>

      {/* Merchant */}
      <div class="mb-3">
        <label class={LABEL}>
          Merchant / Counterparty <span class="text-red-500 normal-case">*</span>
        </label>
        <input
          type="text"
          class={`${INPUT} ${errors[`${p}merchant`] ? "border-red-400" : ""}`}
          placeholder="Name on the transaction"
          value={row.merchant}
          onInput={(e) => onChange({ merchant: (e.target as HTMLInputElement).value })}
        />
        {errors[`${p}merchant`] && (
          <p class="mt-1 text-xs text-red-500">{errors[`${p}merchant`]}</p>
        )}
      </div>

      <button
        type="button"
        class="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 transition-colors"
        onClick={onToggleExpand}
        aria-expanded={expanded}
      >
        <svg
          class={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {expanded ? "Hide details" : "More details (type, pending, merchant contact)"}
      </button>

      {expanded && (
        <div class="mt-3 pt-3 border-t border-gray-100 space-y-3">
          {/* Type */}
          <div>
            <label class={LABEL}>Transaction Type</label>
            <select
              class={INPUT}
              value={row.type}
              onChange={(e) => onChange({ type: (e.target as HTMLSelectElement).value })}
            >
              {TXN_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Pending checkbox */}
          <label
            class={`flex items-start gap-2.5 cursor-pointer select-none p-3 rounded-lg transition-colors ${
              row.isPending ? "bg-amber-50 border border-amber-200" : "bg-gray-50 border border-gray-100"
            }`}
          >
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-amber-500 mt-0.5"
              checked={row.isPending}
              onChange={(e) => onChange({ isPending: (e.target as HTMLInputElement).checked })}
            />
            <div>
              <span class="text-sm font-medium text-gray-800">
                This transaction has not yet posted (still pending)
              </span>
              {row.isPending && (
                <p class="text-xs text-amber-700 mt-0.5">
                  This will flag your case as high priority — pending transactions may still be cancellable.
                </p>
              )}
            </div>
          </label>

          {/* Merchant contact */}
          <div>
            <label class={LABEL}>Have you contacted the merchant about this transaction?</label>
            <div class="flex gap-4 mb-2">
              {(["yes", "no", "na"] as MerchantContact[]).map((v) => (
                <label key={v} class="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    class="accent-brand-blue"
                    name={`merchant_contact_${row.id}`}
                    value={v}
                    checked={row.merchantContacted === v}
                    onChange={() => onChange({ merchantContacted: v, merchantContactOutcome: "" })}
                  />
                  {v === "yes" ? "Yes" : v === "no" ? "No" : "Not applicable"}
                </label>
              ))}
            </div>
            {row.merchantContacted === "yes" && (
              <div class="pl-1">
                <label class={LABEL}>What was the outcome of that communication?</label>
                <input
                  type="text"
                  class={INPUT}
                  placeholder="e.g. Merchant refused to refund, said the transaction was valid"
                  value={row.merchantContactOutcome}
                  onInput={(e) =>
                    onChange({ merchantContactOutcome: (e.target as HTMLInputElement).value })
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type PermissionDecision = "pending" | "granted" | "denied";

function Confirmation({
  isBulk,
  rows,
  totalAmount,
  hasAnyPending,
  manyOthers,
}: {
  isBulk: boolean;
  rows: TxnRow[];
  totalAmount: number;
  hasAnyPending: boolean;
  manyOthers: boolean;
}) {
  const [decisions, setDecisions] = useState<Record<string, PermissionDecision>>(
    () => {
      const initial: Record<string, PermissionDecision> = Object.fromEntries(
        INITIAL_PERMISSIONS.map((p) => [p.id, "pending"]),
      );
      const existing = loadPermissionDecisions();
      if (existing) {
        for (const r of existing) initial[r.id] = r.status;
      }
      return initial;
    },
  );

  const persist = (next: Record<string, PermissionDecision>) => {
    setDecisions(next);
    const prev = loadPermissionDecisions() ?? [];
    const prevMap = Object.fromEntries(prev.map((r) => [r.id, r]));
    const nowStamp = formatDecidedAt();
    const records = INITIAL_PERMISSIONS
      .filter((p) => next[p.id] !== "pending")
      .map((p) => {
        const status = next[p.id] as "granted" | "denied";
        const earlier = prevMap[p.id];
        return {
          id: p.id,
          status,
          decidedAt: earlier && earlier.status === status ? earlier.decidedAt : nowStamp,
        };
      });
    savePermissionDecisions(records);
  };

  const decide = (id: string, choice: PermissionDecision) =>
    persist({ ...decisions, [id]: choice });

  const grantAll = () =>
    persist(Object.fromEntries(INITIAL_PERMISSIONS.map((p) => [p.id, "granted"])));

  const totalDecided = Object.values(decisions).filter((d) => d !== "pending").length;
  const allDecided = totalDecided === INITIAL_PERMISSIONS.length;
  const grantedCount = Object.values(decisions).filter((d) => d === "granted").length;
  return (
    <div class="min-h-screen bg-brand-slate pb-24">
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

      <div class="max-w-md mx-auto px-4 py-4">
        {/* Compact success banner */}
        <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3 flex items-center gap-3 brand-card-shadow">
          <div class="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-gray-900 text-sm">
              Your claim is in. Case #{DEMO_CASE.id}.
            </div>
            <div class="text-xs text-gray-500 truncate">
              ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {isBulk ? ` · ${rows.length} transactions` : ` · ${TXN_TYPES.find((t) => t.value === rows[0].type)?.label ?? rows[0].type}`}
              {" · "}Decision due by {DEMO_CASE.regEDeadline}
            </div>
          </div>
        </div>

        {(hasAnyPending || manyOthers) && (
          <div class="mb-3 space-y-1.5">
            {hasAnyPending && (
              <div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                <strong>Front of the queue.</strong> One of your transactions is still
                pending, so we're trying to cancel it before the money moves.
              </div>
            )}
            {manyOthers && (
              <div class="bg-brand-blue-soft border border-brand-blue/30 rounded-lg px-3 py-2 text-xs text-brand-navy">
                <strong>We'll call you.</strong> You said there are more transactions
                we should know about — your investigator will reach out to walk through them.
              </div>
            )}
          </div>
        )}

        {/* Permissions grant */}
        <div class="bg-white border border-gray-200 rounded-xl p-4 mb-3 brand-card-shadow">
          <div class="flex items-center justify-between gap-3 mb-2">
            <div class="min-w-0">
              <h3 class="font-semibold text-brand-navy text-sm leading-tight">
                What can we look at?
              </h3>
              <p class="text-xs text-gray-500 leading-tight mt-0.5">
                We can only investigate what you let us see. Pick what you're
                comfortable with — you can change your mind later.
              </p>
            </div>
            <button
              type="button"
              class="flex-shrink-0 text-xs text-brand-blue hover:text-brand-blue-hover font-semibold whitespace-nowrap"
              onClick={grantAll}
            >
              Allow all
            </button>
          </div>

          <div class="space-y-1.5">
            {INITIAL_PERMISSIONS.map((perm) => {
              const decision = decisions[perm.id];
              return (
                <div
                  key={perm.id}
                  class={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
                    decision === "granted"
                      ? "bg-green-50 border-green-200"
                      : decision === "denied"
                      ? "bg-gray-100 border-gray-200"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">{perm.label}</div>
                    <div class="text-xs text-gray-500 truncate">{perm.description}</div>
                  </div>
                  <div class="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      title="Grant"
                      aria-label={`Grant ${perm.label}`}
                      aria-pressed={decision === "granted"}
                      class={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                        decision === "granted"
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-400 border border-gray-300 hover:text-green-600 hover:border-green-400"
                      }`}
                      onClick={() => decide(perm.id, decision === "granted" ? "pending" : "granted")}
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Decline"
                      aria-label={`Decline ${perm.label}`}
                      aria-pressed={decision === "denied"}
                      class={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                        decision === "denied"
                          ? "bg-gray-500 text-white"
                          : "bg-white text-gray-400 border border-gray-300 hover:text-gray-700 hover:border-gray-400"
                      }`}
                      onClick={() => decide(perm.id, decision === "denied" ? "pending" : "denied")}
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p class="mt-2 text-xs text-gray-400 text-right">
            {allDecided
              ? `${grantedCount} of ${INITIAL_PERMISSIONS.length} allowed`
              : `${totalDecided} of ${INITIAL_PERMISSIONS.length} answered`}
          </p>
        </div>

        <a
          href="/consumer"
          class={`block w-full text-center font-semibold py-3 px-6 rounded-xl transition-all text-sm ${
            allDecided
              ? "bg-brand-blue hover:bg-brand-blue-hover text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {allDecided ? "See where my case stands →" : "Skip for now — see my case"}
        </a>

        <div class="mt-2 text-center">
          <a href="/consumer/intake" class="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            File another claim
          </a>
        </div>
      </div>
    </div>
  );
}
