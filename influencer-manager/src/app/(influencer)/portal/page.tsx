import { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, DollarSign, Star, TrendingUp, Loader2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { campaignApi, CampaignOut } from "@/lib/api";

const stats = [
  { label: "応募中の案件", value: "3", icon: Briefcase, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "進行中", value: "2", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "累計報酬", value: "¥420,000", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "平均評価", value: "4.8", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
];

const statusColors: Record<string, string> = {
  "募集中": "bg-amber-100 text-amber-700",
  "進行中": "bg-blue-100 text-blue-700",
  "完了": "bg-emerald-100 text-emerald-700",
};

export default function InfluencerPortalPage() {
  const [campaigns, setCampaigns] = useState<CampaignOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignApi.list();
        setCampaigns(data.items);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* ウェルカム */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">こんにちは、山田さん</h1>
        <p className="text-sm text-muted-foreground mt-1">新しいオファーが届いています。確認しましょう。</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border border-border shadow-none">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`${s.bg} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-[12px] lg:text-[10px] text-muted-foreground">{s.label}</p>
                  <p className="text-base font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 案件一覧 */}
      <Card className="border border-border shadow-none">
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">案件・オファー一覧</h2>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-6 w-6 text-violet-600 animate-spin" />
              <p className="text-xs text-muted-foreground">案件を読み込み中...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              現在公開中の案件はありません。
            </div>
          ) : (
            campaigns.map((o) => (
              <Link
                key={o.id}
                href={`/portal/campaigns/${o.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group"
              >
                <div className={`h-12 w-16 rounded-lg bg-gradient-to-br ${o.image_gradient || "from-slate-200 to-slate-200"} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-violet-600 transition-colors">{o.title}</p>
                    <Badge className={`text-[12px] lg:text-[10px] px-2 py-0.5 border-0 shrink-0 ${statusColors[o.status] || "bg-slate-100 text-slate-700"}`}>
                      {o.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{o.client_name || "クライアント名未設定"} · {o.category || "未設定"}</p>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
                  <span className="font-bold text-foreground text-sm">
                    {o.min_budget ? `¥${o.min_budget.toLocaleString()}〜` : "応相談"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {o.publish_end ? new Date(o.publish_end).toLocaleDateString("ja-JP") : "未設定"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
