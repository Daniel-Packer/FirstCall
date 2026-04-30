import { useEffect, useState } from "preact/hooks";
import {
  clearPermissionDecisions,
  clearProtections,
  clearQuestions,
  clearRevocations,
  DEMO_STAGE_DEFAULT,
  DEMO_STAGE_MAX,
  LOCALSTORAGE_KEY,
  STAGE_CHANGE_EVENT,
  STAGE_LABELS,
} from "../lib/demoData.ts";

export default function DemoBar() {
  const [stage, setStage] = useState<number | null>(null);
  const [path, setPath] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    const n = saved ? parseInt(saved) : DEMO_STAGE_DEFAULT;
    setStage(isNaN(n) ? DEMO_STAGE_DEFAULT : n);
    setPath(globalThis.location.pathname);

    const handler = (e: Event) => setStage((e as CustomEvent<number>).detail);
    globalThis.addEventListener(STAGE_CHANGE_EVENT, handler);
    return () => globalThis.removeEventListener(STAGE_CHANGE_EVENT, handler);
  }, []);

  if (stage === null) return null;

  const dispatch = (next: number) => {
    setStage(next);
    localStorage.setItem(LOCALSTORAGE_KEY, String(next));
    globalThis.dispatchEvent(new CustomEvent(STAGE_CHANGE_EVENT, { detail: next }));
  };

  return (
    <div class="fixed bottom-0 left-0 right-0 z-50 bg-brand-navy border-t border-brand-blue/30 text-white shadow-[0_-8px_24px_-8px_rgba(10,18,36,0.4)]">
      <div class="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3 text-sm">
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
        </div>
        <span class="text-[10px] font-bold tracking-[0.2em] text-brand-blue uppercase flex-shrink-0">
          Demo
        </span>
        <span class="w-px h-4 bg-white/10 flex-shrink-0" />
        <span class="text-slate-300 flex-1 truncate text-xs">
          {STAGE_LABELS[stage] ?? `Stage ${stage}`}
        </span>
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <a
            href="/consumer"
            class={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
              path === "/consumer"
                ? "bg-brand-blue text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Consumer
          </a>
          <a
            href="/bank"
            class={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
              path === "/bank"
                ? "bg-brand-blue text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Bank Agent
          </a>
          <span class="w-px h-4 bg-white/10 mx-1" />
          <button
            class="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
            onClick={() => {
              dispatch(DEMO_STAGE_DEFAULT);
              clearPermissionDecisions();
              clearQuestions();
              clearProtections();
              clearRevocations();
            }}
          >
            Reset
          </button>
          <button
            class="bg-brand-blue hover:bg-brand-blue-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shadow-md shadow-brand-blue/30"
            onClick={() => stage < DEMO_STAGE_MAX && dispatch(stage + 1)}
            disabled={stage >= DEMO_STAGE_MAX}
          >
            Advance →
          </button>
        </div>
      </div>
    </div>
  );
}
