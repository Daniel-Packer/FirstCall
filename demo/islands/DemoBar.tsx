import { useEffect, useState } from "preact/hooks";
import {
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
    <div class="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-gray-800 text-white">
      <div class="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
        <span class="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase flex-shrink-0">
          DEMO
        </span>
        <span class="text-gray-300 flex-1 truncate text-xs">
          {STAGE_LABELS[stage] ?? `Stage ${stage}`}
        </span>
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <a
            href="/consumer"
            class={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              path === "/consumer"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Consumer
          </a>
          <a
            href="/bank"
            class={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              path === "/bank"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Bank Agent
          </a>
          <span class="w-px h-4 bg-gray-700 mx-1" />
          <button
            class="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 transition-colors"
            onClick={() => dispatch(DEMO_STAGE_DEFAULT)}
          >
            Reset
          </button>
          <button
            class="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
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
