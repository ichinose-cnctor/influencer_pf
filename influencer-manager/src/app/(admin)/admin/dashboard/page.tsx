"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Briefcase, Megaphone, ArrowUpRight, Clock, CheckCircle2, Bell, Pencil, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  {
    label: "登録インフルエンサー",
    value: "248",
    change: "+18 今月",
    icon: Users,
    color: "text-sky-600",
    bg: "bg-sky-50",
    href: "/admin/influencers",
    linkLabel: "一覧を見る",
  },
  {
    label: "募集中の案件",
    value: "5",
    icon: Megaphone,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    href: "/admin/campaigns?tab=募集中",
    linkLabel: "案件を見る",
  },
  {
    label: "進行中の案件",
    value: "12",
    icon: Briefcase,
    color: "text-violet-600",
    bg: "bg-violet-50",
    href: "/admin/campaigns?tab=進行中",
    linkLabel: "案件を見る",
  },
  {
    label: "完了案件",
    value: "87",
    icon: CheckCircle2,
    color: "text-amber-600",
    bg: "bg-amber-50",
    href: "/admin/campaigns?tab=完了",
    linkLabel: "案件を見る",
  },
];

const campaigns = [
  {
    id: 1,
    title: "夏季コスメ PR キャンペーン",
    client: "BeautyBrand Co.",
    status: "進行中",
    statusColor: "bg-blue-100 text-blue-700",
    influencer: "山田 花子",
    initials: "山",
    deadline: "2025-08-31",
    amount: "¥380,000",
  },
  {
    id: 2,
    title: "新作スニーカー インスタ投稿",
    client: "SneakerWorld",
    status: "募集中",
    statusColor: "bg-amber-100 text-amber-700",
    influencer: "未アサイン",
    initials: "?",
    deadline: "2025-09-15",
    amount: "¥150,000",
  },
  {
    id: 3,
    title: "フィットネスアプリ 動画レビュー",
    client: "FitLife App",
    status: "完了",
    statusColor: "bg-emerald-100 text-emerald-700",
    influencer: "鈴木 健太",
    initials: "鈴",
    deadline: "2025-07-20",
    amount: "¥220,000",
  },
  {
    id: 4,
    title: "オーガニック食品 ブログ記事",
    client: "GreenEats Japan",
    status: "進行中",
    statusColor: "bg-blue-100 text-blue-700",
    influencer: "佐藤 みのり",
    initials: "佐",
    deadline: "2025-09-01",
    amount: "¥95,000",
  },
  {
    id: 5,
    title: "旅行アプリ TikTok PR",
    client: "TravelMate",
    status: "募集中",
    statusColor: "bg-amber-100 text-amber-700",
    influencer: "未アサイン",
    initials: "?",
    deadline: "2025-10-01",
    amount: "¥200,000",
  },
];

const recentActivity = [
  { icon: CheckCircle2, color: "text-emerald-500", text: "山田花子さんが「夏季コスメ PR」の投稿を完了しました", time: "10分前" },
  { icon: Megaphone, color: "text-violet-500", text: "新規案件「秋冬ファッション特集」が作成されました", time: "1時間前" },
  { icon: Users, color: "text-sky-500", text: "中村 咲さんが新規登録しました（フォロワー 12万人）", time: "3時間前" },
  { icon: Clock, color: "text-amber-500", text: "「フィットネスアプリ」の支払い処理が完了しました", time: "昨日" },
];

const statusCounts = [
  { label: "募集中", count: 5, color: "bg-amber-400" },
  { label: "進行中", count: 12, color: "bg-blue-500" },
  { label: "完了", count: 87, color: "bg-emerald-500" },
];

const categoryColors: Record<string, string> = {
  お知らせ: "bg-sky-100 text-sky-700",
  重要: "bg-amber-100 text-amber-700",
  緊急: "bg-rose-100 text-rose-700",
  システム: "bg-slate-100 text-slate-700",
};

const targetLabels: Record<string, string> = {
  all: "全インフルエンサー",
  active: "進行中の案件のみ",
};

interface Announcement {
  id: number;
  title: string;
  body: string;
  category: string;
  target: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("announcements");
    if (saved) setAnnouncements(JSON.parse(saved));
  }, []);

  const router = useRouter();

  const editAnnouncement = (a: Announcement) => {
    sessionStorage.setItem("announcement-editing", JSON.stringify(a));
    router.push("/admin/announcements/new");
  };

  return (
    <div className="space-y-6">
      {/* KPI カード */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border border-border shadow-none h-full">
              <CardContent className="p-3 sm:p-5 flex flex-col h-full">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    {"change" in stat && (
                      <p className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                        <ArrowUpRight className="h-3 w-3" />
                        {(stat as typeof stat & { change: string }).change}
                      </p>
                    )}
                  </div>
                  <div className={`${stat.bg} p-2 sm:p-2.5 rounded-lg shrink-0`}>
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-auto pt-1 sm:pt-2 flex justify-end">
                  <Link
                    href={stat.href}
                    className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {stat.linkLabel}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 案件一覧テーブル */}
        <div className="xl:col-span-2">
          <Card className="border border-border shadow-none">
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">最近の案件</CardTitle>
                <a href="/admin/campaigns" className="text-xs text-violet-600 hover:underline">
                  すべて見る
                </a>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-2.5">案件名</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5">ステータス</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5 hidden md:table-cell">担当</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3">
                          <Link href={`/admin/campaigns/${c.id}`} className="block">
                            <p className="font-medium text-foreground text-sm lg:text-xs leading-tight hover:text-violet-600 transition-colors">{c.title}</p>
                            <p className="text-sm lg:text-[11px] text-muted-foreground mt-0.5">{c.client}</p>
                          </Link>
                        </td>
                        <td className="px-3 py-3">
                          <Badge className={`text-[12px] lg:text-[10px] px-2 py-0.5 ${c.statusColor} border-0`}>
                            {c.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[12px] lg:text-[10px] bg-violet-100 text-violet-700">
                                {c.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{c.influencer}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右サイドパネル */}
        <div className="space-y-4">
          {/* ステータス概要 */}
          <Card className="border border-border shadow-none">
            <CardHeader className="pb-3 px-5 pt-5">
              <CardTitle className="text-sm font-semibold">案件ステータス</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {statusCounts.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="text-base lg:text-xs font-semibold text-foreground">{s.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full`}
                      style={{ width: `${Math.min((s.count / 104) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* お知らせ */}
          <Card className="border border-border shadow-none">
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                  <CardTitle className="text-sm font-semibold">お知らせ</CardTitle>
                </div>
                <Link href="/admin/announcements/new" className="text-xs text-violet-600 hover:underline">
                  作成する
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {announcements.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  お知らせはありません
                </p>
              ) : (
                <div className="space-y-3">
                  {announcements.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge className={`text-[12px] lg:text-[10px] px-1.5 py-0 border-0 shrink-0 ${categoryColors[a.category] ?? "bg-slate-100 text-slate-700"}`}>
                            {a.category}
                          </Badge>
                          <span className="text-[12px] lg:text-[10px] text-muted-foreground shrink-0">{targetLabels[a.target] ?? a.target}</span>
                        </div>
                        <p className="text-xs font-semibold text-foreground leading-tight truncate">{a.title}</p>
                        <p className="text-[12px] lg:text-[10px] text-muted-foreground">
                          {new Date(a.createdAt).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => editAnnouncement(a)}
                          className="p-1.5 text-muted-foreground hover:text-violet-600 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <Link href={`/admin/announcements/${a.id}`} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
