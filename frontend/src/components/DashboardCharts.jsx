import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const CHART_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
];

export default function DashboardCharts({
  severityCounts,
  components,
  rootCauses,
  bugThemes,
  historyData,
}) {
  const severityData = [
    {
      name: "Critical",
      value: severityCounts?.critical || 0,
    },
    {
      name: "High",
      value: severityCounts?.high || 0,
    },
    {
      name: "Medium",
      value: severityCounts?.medium || 0,
    },
    {
      name: "Low",
      value: severityCounts?.low || 0,
    },
  ];

  const componentData = Object.entries(
    components || {}
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const rootCauseData = Object.entries(
    rootCauses || {}
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const themeData = Object.entries(
    bugThemes || {}
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const trendData = historyData || [];

  return (
    <div className="mt-8">

      {/* =========================
          MAIN CHARTS
      ========================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Severity Chart */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-bold text-white mb-6">
            Severity Distribution
          </h2>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={severityData}>

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#94a3b8"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    color: "#ffffff",
                  }}
                />

                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Component Chart */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-bold text-white mb-6">
            Affected Components
          </h2>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={componentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  label
                >

                  {componentData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          CHART_COLORS[
                            index %
                              CHART_COLORS.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    color: "#ffffff",
                  }}
                />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

  {/* =========================
      ROOT CAUSE & BUG THEMES
  ========================= */}

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

    {/* Root Cause Patterns */}

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-bold text-white mb-6">
        Root Cause Patterns
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={rootCauseData}
            layout="vertical"
            margin={{
              left: 20,
              right: 20,
            }}
          >

            <XAxis
              type="number"
              allowDecimals={false}
              stroke="#94a3b8"
            />

            <YAxis
              type="category"
              dataKey="name"
              width={120}
              stroke="#94a3b8"
              tick={{
                fontSize: 11,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                color: "#ffffff",
              }}
            />

            <Bar
              dataKey="value"
              fill="#8b5cf6"
              radius={[0, 8, 8, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>


    {/* Recurring Bug Themes */}

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-bold text-white mb-6">
        Recurring Bug Themes
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={themeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={100}
              label
            >

              {themeData.map(
                (entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      CHART_COLORS[
                        index % CHART_COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                color: "#ffffff",
              }}
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>
      {/* =========================
          WEEKLY TREND
      ========================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

        <h2 className="text-xl font-bold text-white mb-6">
          Analysis Trend
        </h2>

        <div className="h-80">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart data={trendData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="day"
                stroke="#94a3b8"
              />

              <YAxis
                allowDecimals={false}
                stroke="#94a3b8"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "#ffffff",
                }}
              />

              <Line
                type="monotone"
                dataKey="analyses"
                stroke="#06b6d4"
                strokeWidth={3}
                dot
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}