export default function Home() {
  return (
    <div class="min-h-screen brand-radial flex flex-col items-center justify-center px-6 pb-24 relative overflow-hidden">
      {/* Decorative motion dots, top-left, echoing the logo */}
      <div class="absolute top-10 left-10 hidden md:flex flex-col gap-2 opacity-70">
        <span class="w-2 h-2 rounded-full bg-brand-blue"></span>
        <span class="w-2 h-2 rounded-full bg-brand-blue"></span>
        <span class="w-2 h-2 rounded-full bg-brand-blue"></span>
      </div>

      <div class="text-center mb-12 relative">
        <div class="flex justify-center mb-6">
          <div class="bg-white rounded-2xl px-6 py-3 shadow-2xl">
            <img
              src="/firstcall-logo.png"
              alt="FirstCall"
              class="h-10 w-auto"
            />
          </div>
        </div>
        <div class="text-brand-blue text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
          ClearPath · Demo
        </div>
        <h1 class="text-white text-5xl font-extrabold tracking-tight mb-3">
          Fraud Redress,<br />
          <span class="text-brand-blue">Made Transparent.</span>
        </h1>
        <p class="text-slate-300 text-base max-w-md mx-auto leading-relaxed">
          A unified workspace where consumers and bank investigators stay in sync
          throughout every fraud claim.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 w-full max-w-3xl">
        <a
          href="/consumer/intake"
          class="flex-1 bg-white rounded-2xl p-7 text-left brand-card-shadow brand-card-shadow-hover hover:-translate-y-1 transition-all group border border-white/10"
        >
          <div class="w-11 h-11 rounded-xl bg-brand-blue-soft flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
            <svg class="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="font-bold text-brand-navy text-base mb-1">File a Claim</div>
          <div class="text-slate-500 text-xs leading-relaxed mb-4">
            Start the consumer intake flow and submit a fraud claim.
          </div>
          <div class="text-brand-blue text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            Begin
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </a>

        <a
          href="/consumer"
          class="flex-1 bg-white rounded-2xl p-7 text-left brand-card-shadow brand-card-shadow-hover hover:-translate-y-1 transition-all group border border-white/10"
        >
          <div class="w-11 h-11 rounded-xl bg-brand-blue-soft flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
            <svg class="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="font-bold text-brand-navy text-base mb-1">Consumer Portal</div>
          <div class="text-slate-500 text-xs leading-relaxed mb-4">
            View your fraud claim as Jane Smith, an account holder.
          </div>
          <div class="text-brand-blue text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            Enter
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </a>

        <a
          href="/bank"
          class="flex-1 bg-white rounded-2xl p-7 text-left brand-card-shadow brand-card-shadow-hover hover:-translate-y-1 transition-all group border border-white/10"
        >
          <div class="w-11 h-11 rounded-xl bg-brand-blue-soft flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
            <svg class="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
            </svg>
          </div>
          <div class="font-bold text-brand-navy text-base mb-1">Bank Portal</div>
          <div class="text-slate-500 text-xs leading-relaxed mb-4">
            Manage the investigation as a fraud analyst.
          </div>
          <div class="text-brand-blue text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            Enter
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </a>
      </div>

      <p class="mt-10 text-slate-400 text-xs text-center max-w-sm leading-relaxed">
        Use the{" "}
        <span class="font-semibold text-white">demo controls</span> bar at the bottom to
        advance case stages and watch both portals stay in sync.
      </p>
    </div>
  );
}
