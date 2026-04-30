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
          ClearPath · Interactive Demo
        </div>
        <h1 class="text-white text-5xl font-extrabold tracking-tight mb-3">
          Fraud claims,<br />
          <span class="text-brand-blue">out from behind the wall.</span>
        </h1>
        <p class="text-slate-300 text-base max-w-lg mx-auto leading-relaxed">
          When you report fraud, you usually get a case number and silence. ClearPath
          shows the consumer and the bank investigator the same view of the case —
          every stage, every permission, every dollar, with the jargon translated.
          This demo lets you click through both sides of one real-feeling claim.
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
          <div class="font-bold text-brand-navy text-base mb-1">File a fraud claim</div>
          <div class="text-slate-500 text-xs leading-relaxed mb-4">
            Walk through the form a real customer fills out the day they spot a
            transaction they didn't make.
          </div>
          <div class="text-brand-blue text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            Start the form
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
          <div class="font-bold text-brand-navy text-base mb-1">See it as the customer</div>
          <div class="text-slate-500 text-xs leading-relaxed mb-4">
            You're Jane Smith, who just had $2,847 wired out of her account. See
            the case stages, what data the bank is using, and what's happening to
            your money in real time.
          </div>
          <div class="text-brand-blue text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            Open Jane's view
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
          <div class="font-bold text-brand-navy text-base mb-1">See it as the analyst</div>
          <div class="text-slate-500 text-xs leading-relaxed mb-4">
            You're M. Rodriguez at First Community Bank. Move the investigation
            forward, answer Jane's questions, and watch her view update the moment
            you save.
          </div>
          <div class="text-brand-blue text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            Open the analyst's view
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </a>
      </div>

      <p class="mt-10 text-slate-400 text-xs text-center max-w-md leading-relaxed">
        Use the{" "}
        <span class="font-semibold text-white">demo controls</span> at the bottom to
        advance the case from "claim filed" to "money returned." Open the customer
        and analyst views in two tabs to watch them stay in sync.
      </p>
    </div>
  );
}
