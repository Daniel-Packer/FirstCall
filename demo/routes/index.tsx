export default function Home() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex flex-col items-center justify-center px-6 pb-20">
      <div class="text-center mb-10">
        <div class="text-blue-300 text-xs font-semibold tracking-widest uppercase mb-3">
          Demo
        </div>
        <h1 class="text-white text-4xl font-bold tracking-tight mb-2">ClearPath</h1>
        <p class="text-blue-200 text-base max-w-sm mx-auto leading-relaxed">
          Fraud Redress Transparency Platform
          <br />
          <span class="text-blue-300 text-sm">First Community Bank</span>
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-5 w-full max-w-md">
        <a
          href="/consumer"
          class="flex-1 bg-white rounded-2xl p-7 text-center shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all group"
        >
          <div class="text-4xl mb-3">👤</div>
          <div class="font-bold text-gray-900 text-base mb-1">Consumer Portal</div>
          <div class="text-gray-500 text-xs leading-relaxed">
            View your fraud claim as Jane Smith, an account holder
          </div>
          <div class="mt-4 text-blue-600 text-sm font-semibold group-hover:text-blue-800 transition-colors">
            Enter →
          </div>
        </a>

        <a
          href="/bank"
          class="flex-1 bg-white rounded-2xl p-7 text-center shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all group"
        >
          <div class="text-4xl mb-3">🏦</div>
          <div class="font-bold text-gray-900 text-base mb-1">Bank Portal</div>
          <div class="text-gray-500 text-xs leading-relaxed">
            Manage the investigation as a fraud analyst
          </div>
          <div class="mt-4 text-blue-600 text-sm font-semibold group-hover:text-blue-800 transition-colors">
            Enter →
          </div>
        </a>
      </div>

      <p class="mt-8 text-blue-300 text-xs text-center max-w-xs leading-relaxed">
        Use the{" "}
        <span class="font-semibold text-blue-100">demo controls</span> bar at the bottom to
        advance case stages and see how both sides update in real time.
      </p>
    </div>
  );
}
