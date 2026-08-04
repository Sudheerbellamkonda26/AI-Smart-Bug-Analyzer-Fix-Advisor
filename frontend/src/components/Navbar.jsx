export default function Navbar() {
  return (
    <nav className="bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">

        <h1 className="text-white font-bold">
          AI Smart Bug Analyzer
        </h1>

        <div className="flex gap-6">

          <a href="/" className="text-white">
            Home
          </a>

          <a href="/dashboard" className="text-white">
            Dashboard
          </a>

          <a href="/history" className="text-white">
            History
          </a>

        </div>

      </div>
    </nav>
  );
}