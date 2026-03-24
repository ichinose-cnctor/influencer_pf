import { Briefcase, DollarSign, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "応募中の案件", value: "3", icon: Briefcase, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "進行中", value: "2", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "累計報酬", value: "¥420,000", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "平均評価", value: "4.8", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
];

const offers = [
  {
    id: 1,
    title: "夏季コスメ PR キャンペーン",
    company: "BeautyBrand Co.",
    budget: "¥80,000",
    deadline: "2025/08/31",
    genre: "コスメ・美容",
    status: "新着オファー",
    statusColor: "bg-violet-100 text-violet-700",
    image: "from-pink-300 to-rose-400",
  },
  {
    id: 2,
    title: "フィットネスアプリ 動画レビュー",
    company: "FitLife App",
    budget: "¥50,000",
    deadline: "2025/09/15",
    genre: "フィットネス",
    status: "進行中",
    statusColor: "bg-blue-100 text-blue-700",
    image: "from-emerald-300 to-teal-400",
  },
  {
    id: 3,
    title: "旅行アプリ TikTok PR",
    company: "TravelMate",
    budget: "¥60,000",
    deadline: "2025/10/01",
    genre: "旅行・観光",
    status: "審査中",
    statusColor: "bg-amber-100 text-amber-700",
    image: "from-violet-300 to-purple-400",
  },
];

export default function InfluencerPortalPage() {
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
          {offers.map((o) => (
            <div key={o.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
              <div className={`h-12 w-16 rounded-lg bg-gradient-to-br ${o.image} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">{o.title}</p>
                  <Badge className={`text-[12px] lg:text-[10px] px-2 py-0.5 border-0 shrink-0 ${o.statusColor}`}>
                    {o.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{o.company} · {o.genre}</p>
              </div>
              <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
                <span className="font-bold text-foreground text-sm">{o.budget}</span>
                <span>{o.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
