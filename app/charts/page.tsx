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
  const coffeeData = Array.isArray(coffee.data)
    ? coffee.data
    : Array.isArray((coffee.data as any)?.items)
    ? (coffee.data as any).items
    : [];

  const moodData = Array.isArray(mood.data)
    ? mood.data
    : Array.isArray((mood.data as any)?.items)
    ? (mood.data as any).items
    : [];

  const consumptionData = Array.isArray(consumption.data)
    ? consumption.data
    : Array.isArray((consumption.data as any)?.items)
    ? (consumption.data as any).items
    : [];

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
                  <Bar dataKey="value" fill="#1f77b4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={coffeeData} dataKey="value" nameKey="brand" cx="50%" cy="50%" outerRadius={80} label>
                    {coffeeData.map((_: any, idx: number) => (
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
                <XAxis dataKey="cupsPerDay" label={{ value: "잔/일", position: "insideBottomRight", offset: -5 }} />
                <YAxis yAxisId="left" label={{ value: "버그 수", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: "생산성", angle: 90, position: "insideRight" }} />
                <Tooltip />
                <Legend />
                {/* 팀별 2개 라인: 같은 색, 실선/점선 */}
                {(["Frontend", "Backend", "AI", "Mobile"] as const).map((team, idx) => (
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
