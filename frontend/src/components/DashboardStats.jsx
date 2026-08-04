import {
  FileSearch,
  AlertTriangle,
  Layers,
  History,
} from "lucide-react";

export default function DashboardStats({ stats }) {
  const cards = [
    {
      title: "Total Analyses",
      value: stats.total,
      icon: FileSearch,
      bg: "bg-cyan-600",
      border: "hover:border-cyan-500",
    },
    {
      title: "High Severity",
      value: stats.high,
      icon: AlertTriangle,
      bg: "bg-red-600",
      border: "hover:border-red-500",
    },
    {
      title: "Components",
      value: stats.components,
      icon: Layers,
      bg: "bg-blue-600",
      border: "hover:border-blue-500",
    },
    {
      title: "History",
      value: stats.history,
      icon: History,
      bg: "bg-green-600",
      border: "hover:border-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className={`bg-slate-900 border border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${card.border}`}
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-400 text-sm">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold text-white mt-2">
                  {card.value}
                </h2>
              </div>

              <div className={`${card.bg} p-4 rounded-xl shadow-lg`}>
                <Icon
                  size={30}
                  className="text-white"
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}