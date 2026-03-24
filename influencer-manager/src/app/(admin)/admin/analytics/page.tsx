"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ---- モックデータ ----
const monthlyRevenue = [
  { month: "1月", 売上: 1200000, 支払報酬: 780000, 利益: 420000 },
  { month: "2月", 売上: 980000, 支払報酬: 620000, 利益: 360000 },
  { month: "3月", 売上: 1450000, 支払報酬: 920000, 利益: 530000 },
  { month: "4月", 売上: 1680000, 支払報酬: 1050000, 利益: 630000 },
  { month: "5月", 売上: 1350000, 支払報酬: 860000, 利益: 490000 },
  { month: "6月", 売上: 1920000, 支払報酬: 1180000, 利益: 740000 },
  { month: "7月", 売上: 2100000, 支払報酬: 1290000, 利益: 810000 },
  { month: "8月", 売上: 2480000, 支払報酬: 1520000, 利益: 960000 },
];

const genreData = [
  { name: "コスメ・美容", value: 34, color: "#8b5cf6" },
  { name: "ファッション", value: 22, color: "#ec4899" },
  { name: "グルメ", value: 15, color: "#f59e0b" },
  { name: "フィットネス", value: 13, color: "#10b981" },
  { name: "旅行", value: 10, color: "#3b82f6" },
  { name: "その他", value: 6, color: "#94a3b8" },
];

const platformData = [
  { month: "5月", Instagram: 820000, YouTube: 380000, TikTok: 150000 },
  { month: "6月", Instagram: 1050000, YouTube: 620000, TikTok: 250000 },
  { month: "7月", Instagram: 1180000, YouTube: 680000, TikTok: 240000 },
  { month: "8月", Instagram: 1420000, YouTube: 810000, TikTok: 250000 },
];

const topInfluencers = [
  { name: "田中 ゆい", handle: "@yui_beauty", revenue: 680000, campaigns: 5, initials: "田", color: "from-fuchsia-400 to-pink-500" },
  { name: "山田 花子", handle: "@hanako_lifestyle", revenue: 520000, campaigns: 4, initials: "山", color: "from-pink-400 to-rose-400" },
  { name: "中村 咲", handle: "@saki_travel", revenue: 390000, campaigns: 3, initials: "中", color: "from-violet-400 to-purple-500" },
  { name: "鈴木 健太", handle: "@kenta_fitness", revenue: 340000, campaigns: 3, initials: "鈴", color: "from-sky-400 to-blue-500" },
  { name: "高橋 あおい", handle: "@aoi_fashion", revenue: 290000, campaigns: 2, initials: "高", color: "from-teal-400 to-cyan-400" },
];

const recentTransactions = [
  { id: "TXN-001", campaign: "夏季コスメ PR", client: "BeautyBrand Co.", amount: 152000, type: "中間払い", date: "2025-08-05", status: "完了" },
  { id: "TXN-002", campaign: "スニーカー インスタ", client: "SneakerWorld", amount: 75000, type: "着手金", date: "2025-08-02", status: "完了" },
  { id: "TXN-003", campaign: "フィットネスアプリ", client: "FitLife App", amount: 220000, type: "最終払い", date: "2025-07-28", status: "完了" },
  { id: "TXN-004", campaign: "オーガニック食品", client: "GreenEats Japan", amount: 28500, type: "着手金", date: "2025-07-25", status: "保留中" },
  { id: "TXN-005", campaign: "旅行アプリ TikTok", client: "TravelMate", amount: 60000, type: "着手金", date: "2025-07-20", status: "完了" },
];

const kpis = [
  {
    label: "今月の売上",
    value: "¥2,480,000",
    change: "+18.1%",
    up: true,
    icon: DollarSign,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    label: "今月の利益",
    value: "¥960,000",
    change: "+18.5%",
    up: true,
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "進行中案件",
    value: "12件",
    change: "+2件",
    up: true,
    icon: Briefcase,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    label: "平均単価",
    value: "¥206,667",
    change: "-3.2%",
    up: false,
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const periods = ["3ヶ月", "6ヶ月", "1年"] as const;
type Period = typeof periods[number];

const periodSlice: Record<Period, number> = {
  "3ヶ月": 3,
  "6ヶ月": 6,
  "1年": 8,
};

function formatYen(value: number) {
  if (value >= 1000000) return `¥${(value / 1000000).toFixed(1)}M`;
  if (value >= 10000) return `¥${(value / 10000).toFixed(0)}万`;
  return `¥${value.toLocaleString()}`;
}

// カスタムツールチップ
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium text-foreground">{formatYen(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-foreground font-medium">{payload[0].value}%</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("6ヶ月");
  const sliced = monthlyRevenue.slice(-periodSlice[period]);

  return (
    <div className="space-y-6">
      {/* ヘッダー操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-muted rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            期間指定
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
            <Download className="h-3.5 w-3.5" />
            CSV出力
          </Button>
        </div>
      </div>

      {/* KPI カード */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="border border-border shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`${kpi.bg} p-2.5 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      kpi.up ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {kpi.up
                      ? <ArrowUpRight className="h-3.5 w-3.5" />
                      : <ArrowDownRight className="h-3.5 w-3.5" />
                    }
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* グラフ行 1: 売上推移（エリア） */}
      <Card className="border border-border shadow-none">
        <CardHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">売上・利益推移</CardTitle>
            <div className="flex items-center gap-4 text-sm lg:text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-violet-500 inline-block" />
                売上
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-pink-400 inline-block" />
                支払報酬
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400 inline-block" />
                利益
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-5">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={sliced} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradFee" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => formatYen(v)} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="売上" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradSales)" dot={{ r: 3, fill: "#8b5cf6" }} />
              <Area type="monotone" dataKey="支払報酬" stroke="#ec4899" strokeWidth={2} fill="url(#gradFee)" dot={{ r: 3, fill: "#ec4899" }} />
              <Area type="monotone" dataKey="利益" stroke="#10b981" strokeWidth={2} fill="url(#gradProfit)" dot={{ r: 3, fill: "#10b981" }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* グラフ行 2: プラットフォーム別 + ジャンル円グラフ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* プラットフォーム別棒グラフ */}
        <Card className="lg:col-span-3 border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="text-sm font-semibold">プラットフォーム別売上</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={platformData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => formatYen(v)} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="Instagram" fill="#ec4899" radius={[3, 3, 0, 0]} />
                <Bar dataKey="YouTube" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="TikTok" fill="#1c1917" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ジャンル別円グラフ */}
        <Card className="lg:col-span-2 border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="text-sm font-semibold">ジャンル別割合</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {genreData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* 凡例 */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
              {genreData.map((g) => (
                <div key={g.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                  <span className="text-[12px] lg:text-[10px] text-muted-foreground truncate">{g.name}</span>
                  <span className="text-[12px] lg:text-[10px] font-semibold text-foreground ml-auto">{g.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 下段: インフルエンサーランキング + 取引履歴 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* インフルエンサー売上ランキング */}
        <Card className="lg:col-span-2 border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="text-sm font-semibold">インフルエンサー別売上 TOP5</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            {topInfluencers.map((inf, i) => {
              const maxRevenue = topInfluencers[0].revenue;
              const ratio = (inf.revenue / maxRevenue) * 100;
              return (
                <div key={inf.name} className="flex items-center gap-3">
                  <span className="text-sm lg:text-[11px] font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                  <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${inf.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {inf.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-foreground truncate">{inf.name}</p>
                      <p className="text-xs font-bold text-foreground shrink-0 ml-2">{formatYen(inf.revenue)}</p>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    <p className="text-[12px] lg:text-[10px] text-muted-foreground mt-0.5">{inf.campaigns}件</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 最近の取引 */}
        <Card className="lg:col-span-3 border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">最近の取引</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-violet-600 hover:text-violet-700">
                すべて見る
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left font-medium text-muted-foreground px-5 py-2">取引ID</th>
                    <th className="text-left font-medium text-muted-foreground px-3 py-2">案件</th>
                    <th className="text-left font-medium text-muted-foreground px-3 py-2 hidden md:table-cell">種別</th>
                    <th className="text-left font-medium text-muted-foreground px-3 py-2 hidden md:table-cell">日付</th>
                    <th className="text-left font-medium text-muted-foreground px-3 py-2">ステータス</th>
                    <th className="text-right font-medium text-muted-foreground px-5 py-2">金額</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 text-muted-foreground font-mono">{tx.id}</td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-foreground">{tx.campaign}</p>
                        <p className="text-muted-foreground">{tx.client}</p>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">{tx.type}</td>
                      <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">{tx.date}</td>
                      <td className="px-3 py-3">
                        <Badge
                          className={`text-[12px] lg:text-[10px] border-0 px-1.5 ${
                            tx.status === "完了"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-foreground">
                        ¥{tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
