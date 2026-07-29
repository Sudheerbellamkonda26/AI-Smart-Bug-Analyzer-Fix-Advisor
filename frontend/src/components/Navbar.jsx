import { NavLink } from "react-router-dom";
import { Bug, LayoutDashboard, History } from "lucide-react";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <nav className="bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bug className="text-white" size={24} />
          </div>

          <div>
            <h1 className="text-white font-bold text-lg">
              AI Smart Bug Analyzer
            </h1>

            <p className="text-slate-500 text-xs">
              Fix Advisor
            </p>
          </div>
        </NavLink>

        <div className="flex flex-wrap gap-2">

          <NavLink to="/" className={linkClass}>
            <Bug size={18} />
            Analyzer
          </NavLink>

          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/history" className={linkClass}>
            <History size={18} />
            History
          </NavLink>

        </div>

      </div>
    </nav>
  );
}