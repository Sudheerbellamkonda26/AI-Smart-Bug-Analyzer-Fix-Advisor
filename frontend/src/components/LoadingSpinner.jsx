export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">

      <div className="relative">

        <div className="w-16 h-16 rounded-full border-4 border-slate-700"></div>

        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>

      </div>

      <h2 className="mt-6 text-xl font-semibold text-white">
        AI Agents are analyzing your bug...
      </h2>

      <p className="text-slate-400 mt-2">
        Triage • Log Analysis • Root Cause • Fix Recommendation
      </p>

    </div>
  );
}