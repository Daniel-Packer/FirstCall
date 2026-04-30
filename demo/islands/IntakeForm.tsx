import { useState } from "preact/hooks";
import { DEMO_CASE } from "../lib/demoData.ts";

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
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default function IntakeForm() {
  const [rows, setRows] = useState<TxnRow[]>([mkRow()]);
  const [description, setDescription] = useState("");
  const [policeReport, setPoliceReport] = useState(false);
  const [policeReportNumber, setPoliceReportNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isBulk = rows.length > 1;
  const hasAnyPending = rows.some((r) => r.isPending);
  const totalAmount = rows.reduce((sum, r) => {
    const n = parseFloat(r.amount.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const updateRow = (id: string, patch: Partial<TxnRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const addRow = () => setRows((prev) => [...prev, mkRow()]);

  const fillDemo = () => {
    setRows([{ ...DEMO_ROW, id: rows[0].id }]);
    setDescription(DEMO_CASE.description);
    setPoliceReport(true);
    setPoliceReportNumber(DEMO_CASE.policeReport);
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    rows.forEach((r, i) => {
      const prefix = isBulk ? `txn${i}_` : "";
      if (!r.date) errs[`${prefix}date`] = "Required";
      if (!r.amount || isNaN(parseFloat(r.amount))) errs[`${prefix}amount`] = "Enter a valid amount";
      if (!r.merchant.trim()) errs[`${prefix}merchant`] = "Required";
    });
    if (!description.trim()) errs["description"] = "Please describe what happened";
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
    return <Confirmation isBulk={isBulk} rows={rows} totalAmount={totalAmount} hasAnyPending={hasAnyPending} />;
  }

  return (
    <div class="min-h-screen bg-slate-50 pb-24">
      {/* Bank header */}
      <header class="bg-blue-900 text-white px-4 py-4">
        <div class="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div class="font-bold text-base">First Community Bank</div>
            <div class="text-blue-200 text-xs">Fraud Claim Portal</div>
          </div>
          <div class="text-right text-sm">
            <div class="font-medium">{DEMO_CASE.consumer.name}</div>
            <div class="text-blue-200 text-xs">Account ••••{DEMO_CASE.consumer.accountEnding}</div>
          </div>
        </div>
      </header>

      <div class="max-w-2xl mx-auto px-4 py-6">
        {/* Page title */}
        <div class="mb-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-xl font-bold text-gray-900">Report Fraudulent Activity</h1>
              <p class="text-sm text-gray-500 mt-1 leading-relaxed">
                Tell us about the transaction(s) you didn't authorize. Your case will be assigned a
                number and you'll receive a confirmation by email and text.
              </p>
            </div>
            <button
              type="button"
              class="flex-shrink-0 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
              onClick={fillDemo}
            >
              Fill demo data
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Transaction(s) section ── */}
          <div class="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-semibold text-gray-900">
                {isBulk ? `Fraudulent Transactions (${rows.length})` : "Fraudulent Transaction"}
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
                  onChange={(patch) => updateRow(row.id, patch)}
                  onRemove={rows.length > 1 ? () => removeRow(row.id) : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              class="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 transition-colors"
              onClick={addRow}
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add another transaction
            </button>
          </div>

          {/* ── Description section ── */}
          <div class="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <h2 class="font-semibold text-gray-900 mb-3">What Happened</h2>
            <div>
              <label class={LABEL}>
                Describe the fraud in your own words <span class="text-red-500 normal-case">*</span>
              </label>
              <textarea
                class={`${INPUT} ${errors.description ? "border-red-400 ring-1 ring-red-400" : ""}`}
                rows={4}
                placeholder="Explain what happened — how you discovered the transaction, any communications you received, etc."
                value={description}
                onInput={(e) => {
                  setDescription((e.target as HTMLTextAreaElement).value);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
              />
              {errors.description && (
                <p class="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* ── Police report section ── */}
          <div class="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <h2 class="font-semibold text-gray-900 mb-3">Police Report</h2>
            <label class="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-blue-600"
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

          {/* ── Supporting documents note ── */}
          <div class="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 mb-6 flex items-center gap-3 text-sm text-gray-500">
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>Supporting documents (screenshots, statements, police reports) can be uploaded after your claim is submitted.</span>
          </div>

          {/* ── High-priority notice ── */}
          {hasAnyPending && (
            <div class="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5 flex items-start gap-3">
              <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div class="text-sm">
                <strong class="text-amber-800">High Priority — Pending Transaction Detected</strong>
                <p class="text-amber-700 mt-0.5">
                  One or more transactions you marked as pending may still be cancellable. Your case will be escalated immediately upon submission.
                </p>
              </div>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-base"
          >
            Submit Fraud Claim
          </button>

          <p class="mt-3 text-xs text-gray-400 text-center leading-relaxed">
            By submitting you confirm that the information above is accurate to the best of your knowledge.
            A fraud specialist will review your claim within 1–2 business days.
          </p>
        </form>
      </div>

      {/* Support footer */}
      <div class="max-w-2xl mx-auto px-4 pb-4">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center text-xs text-gray-500">
          Need help?{" "}
          <a href="tel:18005551234" class="font-semibold text-blue-700">
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
  onChange,
  onRemove,
}: {
  row: TxnRow;
  index: number;
  isBulk: boolean;
  errors: Record<string, string>;
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

      <div class="grid grid-cols-2 gap-3 mb-3">
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

        {/* Merchant */}
        <div>
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
      </div>

      {/* Pending checkbox */}
      <label
        class={`flex items-start gap-2.5 cursor-pointer select-none p-3 rounded-lg mb-3 transition-colors ${
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
                class="text-blue-600"
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
  );
}

function Confirmation({
  isBulk,
  rows,
  totalAmount,
  hasAnyPending,
}: {
  isBulk: boolean;
  rows: TxnRow[];
  totalAmount: number;
  hasAnyPending: boolean;
}) {
  return (
    <div class="min-h-screen bg-slate-50 pb-24">
      <header class="bg-blue-900 text-white px-4 py-4">
        <div class="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div class="font-bold text-base">First Community Bank</div>
            <div class="text-blue-200 text-xs">Fraud Claim Portal</div>
          </div>
          <div class="text-right text-sm">
            <div class="font-medium">{DEMO_CASE.consumer.name}</div>
            <div class="text-blue-200 text-xs">Account ••••{DEMO_CASE.consumer.accountEnding}</div>
          </div>
        </div>
      </header>

      <div class="max-w-2xl mx-auto px-4 py-10 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-2">Claim Submitted</h1>
        <p class="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
          Your fraud claim has been received. A confirmation has been sent to{" "}
          <strong>{DEMO_CASE.consumer.email}</strong> and{" "}
          <strong>{DEMO_CASE.consumer.phone}</strong>.
        </p>

        {/* Case summary card */}
        <div class="bg-white rounded-2xl border border-gray-200 p-6 text-left mb-6 max-w-sm mx-auto">
          <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Your Case Number</div>
          <div class="text-2xl font-bold text-blue-700 mb-4">#{DEMO_CASE.id}</div>

          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-500">
                {isBulk ? `Transactions` : "Transaction"}
              </dt>
              <dd class="font-medium">
                {isBulk
                  ? `${rows.length} transactions`
                  : `${TXN_TYPES.find((t) => t.value === rows[0].type)?.label ?? rows[0].type}`}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Amount{isBulk ? " (total)" : ""}</dt>
              <dd class="font-semibold text-red-600">
                $
                {totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Filed</dt>
              <dd class="font-medium">{DEMO_CASE.filed}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Reg E Deadline</dt>
              <dd class="font-medium text-amber-700">{DEMO_CASE.regEDeadline}</dd>
            </div>
          </dl>

          {hasAnyPending && (
            <div class="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>High Priority</strong> — Your case has been escalated due to a pending transaction.
            </div>
          )}
        </div>

        {/* Next steps */}
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left mb-6 max-w-sm mx-auto">
          <h3 class="text-sm font-semibold text-blue-900 mb-3">What happens next</h3>
          <ol class="space-y-2 text-xs text-blue-800 leading-relaxed list-none">
            {[
              "A fraud specialist will review your claim within 1–2 business days.",
              "You may be asked to verify your identity and grant access to account records.",
              "We'll notify you at each stage of the investigation.",
              "Under Regulation E, we are required to resolve your case within 45 business days.",
            ].map((step, i) => (
              <li key={i} class="flex gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center flex-shrink-0 font-semibold text-xs">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <a
          href="/consumer"
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors text-sm"
        >
          View Case Status →
        </a>

        <div class="mt-4">
          <a href="/consumer/intake" class="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Report another claim
          </a>
        </div>
      </div>
    </div>
  );
}
