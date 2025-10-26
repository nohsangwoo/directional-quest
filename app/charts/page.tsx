"use client";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import AuthGuard from "../(routes)/guard";
import { Fragment } from "react";

const COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];

export default function ChartsPage() {
  const coffee = useQuery({
    queryKey: ["mock", "top-coffee-brands"],
    queryFn: async () => (await http.get("/mock/top-coffee-brands")).data,
  });

  const mood = useQuery({
    queryKey: ["mock", "weekly-mood-trend"],
    queryFn: async () => (await http.get("/mock/weekly-mood-trend")).data,
  });

  const consumption = useQuery({
    queryKey: ["mock", "coffee-consumption"],
    queryFn: async () => (await http.get("/mock/coffee-consumption")).data,
  });

  // 응답 정규화: Recharts는 Array를 요구함
  type CoffeeBrand = { brand: string; popularity: number };
  type MoodItem = { week: string; happy: number; tired: number; stressed: number };
  type TeamMetrics = { bugs: number; productivity: number };
  type TeamSeriesPoint = { cups: number; bugs: number; productivity: number };
  type TeamData = { team: string; series: TeamSeriesPoint[] };
  type ConsumptionResponse = { teams: TeamData[] };
  type ConsumptionRow = { cups: number } & Record<string, TeamMetrics | undefined>;

  function normalizeArray<T>(data: unknown): T[] {
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === "object" && Array.isArray((data as { items?: unknown[] }).items)) {
      return (data as { items: unknown[] }).items as T[];
    }
    return [];
  }

  function toConsumptionCombined(data: unknown): { points: ConsumptionRow[]; teams: string[] } {
    const raw = data as Partial<ConsumptionResponse> | undefined;
    const teamsArr = Array.isArray(raw?.teams) ? (raw!.teams as TeamData[]) : [];
    if (!teamsArr.length) return { points: [], teams: [] };

    const cupsSet = new Set<number>();
    const byTeam = new Map<string, Map<number, TeamMetrics>>();

    for (const t of teamsArr) {
      const map = new Map<number, TeamMetrics>();
      for (const s of t.series || []) {
        cupsSet.add(s.cups);
        map.set(s.cups, { bugs: s.bugs, productivity: s.productivity });
      }
      byTeam.set(t.team, map);
    }

    const cupsList = Array.from(cupsSet).sort((a, b) => a - b);
    const points: ConsumptionRow[] = cupsList.map((cups) => {
      const row: ConsumptionRow = { cups };
      for (const [team, map] of byTeam) {
        const metrics = map.get(cups);
        if (metrics) row[team] = metrics;
      }
      return row;
    });

    return { points, teams: teamsArr.map((t) => t.team) };
  }

  const coffeeData = normalizeArray<CoffeeBrand>(coffee.data as unknown);
  const moodData = normalizeArray<MoodItem>(mood.data as unknown);
  const { points: consumptionData, teams: consumptionTeams } = toConsumptionCombined(consumption.data as unknown);

  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-6">
        <h1 className="text-xl font-bold">차트</h1>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">/mock/top-coffee-brands</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coffeeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="popularity" fill="#1f77b4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={coffeeData} dataKey="popularity" nameKey="brand" cx="50%" cy="50%" outerRadius={80} label>
                    {coffeeData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">/mock/weekly-mood-trend</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar stackId="m" dataKey="happy" fill="#2ca02c" />
                  <Bar stackId="m" dataKey="tired" fill="#ff7f0e" />
                  <Bar stackId="m" dataKey="stressed" fill="#d62728" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" stackId="a" dataKey="happy" stroke="#2ca02c" fill="#2ca02c" />
                  <Area type="monotone" stackId="a" dataKey="tired" stroke="#ff7f0e" fill="#ff7f0e" />
                  <Area type="monotone" stackId="a" dataKey="stressed" stroke="#d62728" fill="#d62728" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">/mock/coffee-consumption</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cups" label={{ value: "잔/일", position: "insideBottomRight", offset: -5 }} />
                <YAxis yAxisId="left" label={{ value: "버그 수", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: "생산성", angle: 90, position: "insideRight" }} />
                <Tooltip />
                <Legend />
                {(consumptionTeams.length ? consumptionTeams : (['Frontend','Backend','AI','Mobile'] as string[])).map((team, idx) => (
                  <Fragment key={team}>
                    <Line yAxisId="left" type="monotone" dataKey={`${team}.bugs`} name={`${team} bugs`} stroke={COLORS[idx % COLORS.length]} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey={`${team}.productivity`} name={`${team} productivity`} stroke={COLORS[idx % COLORS.length]} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </Fragment>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
