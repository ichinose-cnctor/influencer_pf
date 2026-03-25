"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Briefcase, Megaphone, ArrowUpRight, Clock, CheckCircle2, Bell, Pencil, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { dashboardApi } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();

  const [statsData, setStatsData] = useState<any>(null);
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data for things not yet in the DB
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, campaignsRes] = await Promise.all([
          dashboardApi.stats(),
          dashboardApi.recentCampaigns()
        ]);
        setStatsData(statsRes);
        setRecentCampaigns(campaignsRes);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // LocalStorage announcements
    const saved = localStorage.getItem("announcements");
    if (saved) setAnnouncements(JSON.parse(saved));
  }, []);

  if (loading) {
    return <div className="p-8 flex items-center justify-center">読み込み中...</div>;
  }

  const stats = [
    {
      label: "登録インフルエンサー",
      value: statsData?.total_influencers || 0,
      change: `+${statsData?.new_influencers_this_month || 0} 今月`,
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50",
      href: "/admin/influencers",
      linkLabel: "一覧を見る",
    },
    {
      label: "募集中の案件",
      value: statsData?.recruiting_campaigns || 0,
      icon: Megaphone,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/admin/campaigns?tab=募集中",
      linkLabel: "案件を見る",
    },
    {
      label: "進行中の案件",
      value: statsData?.active_campaigns || 0,
      icon: Briefcase,
      color: "text-violet-600",
      bg: "bg-violet-50",
      href: "/admin/campaigns?tab=進行中",
      linkLabel: "案件を見る",
    },
    {
      label: "完了案件",
      value: statsData?.completed_campaigns || 0,
      icon: CheckCircle2,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/campaigns?tab=完了",
      linkLabel: "案件を見る",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "募集中": return "bg-amber-100 text-amber-700";
      case "進行中": return "bg-blue-100 text-blue-700";
      case "完了": return "bg-emerald-100 text-emerald-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

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
                    {stat.change && (
                      <p className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                        <ArrowUpRight className="h-3 w-3" />
                        {stat.change}
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
                <Link href="/admin/campaigns" className="text-xs text-violet-600 hover:underline">
                  すべて見る
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-2.5">案件名</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5">ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCampaigns.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3">
                          <Link href={`/admin/campaigns/${c.id}`} className="block">
                            <p className="font-medium text-foreground text-sm lg:text-xs leading-tight hover:text-violet-600 transition-colors">{c.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{c.client_name}</p>
                          </Link>
                        </td>
                        <td className="px-3 py-3">
                          <Badge className={`text-[10px] px-2 py-0.5 ${getStatusColor(c.status)} border-0`}>
                            {c.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {recentCampaigns.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-5 py-8 text-center text-sm text-muted-foreground">
                          案件がありません
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* お知らせ */}
        <div className="xl:col-span-1 space-y-6">
          {/* お知らせ管理 */}
          <Card className="border border-border shadow-none overflow-hidden block">
            <CardHeader className="p-4 bg-muted/10 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-violet-600" />
                  <CardTitle className="text-sm font-semibold">お知らせ</CardTitle>
                </div>
                <Link
                  href="/admin/announcements/new"
                  className="flex items-center gap-1 text-[10px] lg:text-[11px] font-medium text-violet-600 hover:text-violet-700 transition-colors bg-violet-50 px-2 py-1 rounded-full border border-violet-100/50"
                  prefetch={true}
                >
                  <Pencil className="h-3 w-3" />
                  新規作成
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {announcements.length === 0 ? (
                <div className="p-8 text-center bg-gray-50/50">
                  <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3 border border-border/50 shadow-sm">
                    <Bell className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 leading-none">発信中のお知らせはありません</p>
                  <p className="text-xs text-gray-500 mt-2">重要な通知や案内を作成しましょう</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
                  {announcements.map((a) => (
                    <div key={a.id} className="p-4 hover:bg-muted/20 transition-colors relative group">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex flex-col items-start gap-1">
                          <Badge className={`text-[10px] px-1.5 py-0 border border-transparent font-medium ${categoryColors[a.category] || "bg-gray-100 text-gray-700"}`}>
                            {a.category}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground shrink-0 uppercase tracking-wider font-medium">
                            {new Date(a.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded-sm">
                            <Users className="h-3 w-3" />
                            {targetLabels[a.target] || "全インフルエンサー"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-violet-600 transition-colors line-clamp-1 leading-snug">
                          {a.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {a.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {announcements.length > 0 && (
                <div className="p-3 border-t border-border/50 bg-muted/10">
                  <button className="w-full text-xs font-medium text-violet-600 hover:text-violet-700 flex items-center justify-center gap-1 py-1 rounded-lg hover:bg-violet-50 transition-colors">
                    すべて確認する
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
