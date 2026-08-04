export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 py-8">

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        <div>

          <h2 className="text-white font-semibold">
            AI Smart Bug Analyzer & Fix Advisor
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Multi-Agent AI Platform | Infosys Springboard Internship
          </p>

        </div>

        <div className="flex gap-6 mt-5 md:mt-0">

          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-cyan-400"
          >
            LinkedIn
          </a>

        </div>

      </div>

    </footer>
  );
}