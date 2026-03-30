"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Users,
  CheckCircle2,
  Megaphone,
  ChevronRight,
  Briefcase,
  Search,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import { campaignApi, dashboardApi } from "@/lib/api";

const CATEGORIES = ["すべて", "ホテル＆宿泊", "飲食店", "体験＆ツアー"];
const AREAS = ["すべて", "全国", "関東", "関西", "東海", "九州・沖縄", "北海道・東北", "中国・四国", "海外"];
const SNS_LIST = ["すべて", "Instagram", "YouTube", "TikTok"];
const COUNTRIES = ["すべて", "日本", "アメリカ", "韓国", "中国", "台湾", "東南アジア", "ヨーロッパ"];

type Tab = "全て" | "募集中" | "進行中" | "完了";

const STATUS_COLOR: Record<string, string> = {
  "募集中": "bg-amber-100 text-amber-700",
  "進行中": "bg-blue-100 text-blue-700",
  "完了": "bg-emerald-100 text-emerald-700",
};

const GRADIENTS = [
  "from-blue-200 to-cyan-200",
  "from-emerald-200 to-teal-200",
  "from-rose-200 to-red-200",
  "from-amber-200 to-yellow-400",
  "from-fuchsia-300 to-purple-400",
  "from-blue-400 to-indigo-500",
  "from-yellow-300 to-orange-400",
  "from-cyan-300 to-sky-400",
];

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">読み込み中...</div>}>
      <CampaignsContent />
    </Suspense>
  );
}

function CampaignsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) ?? "全て";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("すべて");
  const [area, setArea] = useState("すべて");
  const [sns, setSns] = useState("すべて");
  const [country, setCountry] = useState("すべて");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 9;

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    recruiting: 0,
    active: 0,
    completed: 0,
    total: 0
  });

  const fetchStats = async () => {
    try {
      const s = await dashboardApi.getStats();
      setStats({
        recruiting: s.recruiting_campaigns,
        active: s.active_campaigns,
        completed: s.completed_campaigns,
        total: s.recruiting_campaigns + s.active_campaigns + s.completed_campaigns
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(currentPage),
        per_page: String(PER_PAGE),
      };
      if (activeTab !== "全て") params.status = activeTab;
      if (keyword.trim()) params.keyword = keyword.trim();
      if (category !== "すべて") params.category = category;
      if (area !== "すべて") params.area = area;
      if (sns !== "すべて") params.platform = sns;
      if (country !== "すべて") params.country = country;

      const res = await campaignApi.list(params);
      setCampaigns(res.items);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCampaigns();
  }, [activeTab, currentPage, keyword, category, area, sns, country]);

  const hasFilter = keyword !== "" || category !== "すべて" || area !== "すべて" || sns !== "すべて" || country !== "すべて";

  const resetFilters = () => {
    setKeyword("");
    setCategory("すべて");
    setArea("すべて");
    setSns("すべて");
    setCountry("すべて");
    setCurrentPage(1);
  };

  const tabs = [
    { key: "全て" as Tab, label: "全ての案件", icon: Users },
    { key: "募集中" as Tab, label: "募集中の案件", icon: Megaphone },
    { key: "進行中" as Tab, label: "進行中の案件", icon: Briefcase },
    { key: "完了" as Tab, label: "完了案件", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-4">
      {/* 検索 & フィルター */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 h-9 flex-1 max-w-sm rounded-lg border border-border bg-background px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="キーワードで検索..."
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {hasFilter && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 transition-colors"
            >
              <X className="h-3 w-3" />
              リセット
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
            <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">カテゴリー</span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCategory(c); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${category === c ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                >{c}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
            <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">プラットフォーム</span>
            <div className="flex flex-wrap gap-1.5">
              {SNS_LIST.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSns(s); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${sns === s ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2 lg:gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
              <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">エリア</span>
              <div className="flex flex-wrap gap-1.5">
                {AREAS.map((a) => (
                  <button key={a} onClick={() => { setArea(a); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${area === a ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                  >{a}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
              <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">ターゲット国</span>
              <div className="flex flex-wrap gap-1.5">
                {COUNTRIES.map((c) => (
                  <button key={c} onClick={() => { setCountry(c); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${country === c ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                  >{c}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 lg:mt-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl text-left transition-all duration-150 ${isActive ? "bg-violet-700 text-white shadow-sm" : "bg-violet-50 text-violet-700 hover:bg-violet-100"}`}
            >
              <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-white/20" : "bg-violet-100"}`}>
                <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? "text-white" : "text-violet-600"}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs truncate ${isActive ? "text-violet-200" : "text-violet-500"}`}>{tab.label}</p>
                <p className={`text-base sm:text-lg font-bold leading-none mt-0.5 ${isActive ? "text-white" : "text-violet-700"}`}>
                  {tab.key === "全て" ? stats.total :
                   tab.key === "募集中" ? stats.recruiting :
                   tab.key === "進行中" ? stats.active :
                   stats.completed}件
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 件数 & 新規作成 */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{total} 件の案件が見つかりました</p>
        <Link href="/admin/campaigns/new">
          <Button size="sm" className="h-10 lg:h-8 text-sm lg:text-xs bg-violet-600 hover:bg-violet-700 text-white">
            新規作成
          </Button>
        </Link>
      </div>

      {/* カードグリッド */}
      {loading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">読み込み中...</div>
      ) : campaigns.length === 0 ? (
        <div className="py-20 text-center text-sm text-muted-foreground">該当する案件はありません</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-3 lg:mt-0">
          {campaigns.map((c, idx) => {
            const gradient = c.image_gradient || GRADIENTS[idx % GRADIENTS.length];
            const statusColor = STATUS_COLOR[c.status] || "bg-gray-100 text-gray-700";
            return (
              <Card key={c.id} className="border border-border shadow-none hover:shadow-md hover:border-violet-200 transition-all group overflow-hidden pt-0">
                <CardContent className="p-0">
                  <div className={`aspect-video w-full bg-gradient-to-br ${gradient} relative`}>
                    <Badge className={`absolute top-3 left-3 text-[12px] lg:text-[10px] px-2 py-0.5 border-0 ${statusColor}`}>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="px-4 pt-4 pb-2 space-y-3">
                    <div>
                      <Link href={`/admin/campaigns/${c.id}`}>
                        <p className="text-lg md:text-sm font-semibold text-foreground hover:text-violet-600 transition-colors leading-snug line-clamp-2">
                          {c.title}
                        </p>
                      </Link>
                      <p className="text-sm lg:text-[11px] text-muted-foreground mt-0.5">{c.client_name || "—"}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {[c.category, c.area, c.platform].filter(Boolean).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[12px] lg:text-[10px] font-medium">{tag}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="text-[12px] lg:text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                          <Users className="h-3 w-3" /> 応募
                        </p>
                        <p className="text-sm font-bold text-foreground mt-0.5">{c.applicant_count || 0}名</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="text-[12px] lg:text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                          <Calendar className="h-3 w-3" /> 締切
                        </p>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          {c.publish_end ? new Date(c.publish_end).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }) : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pt-4 lg:pt-3 border-t border-border">
                      {c.status === "募集中" ? (
                        <Link href={`/admin/campaigns/${c.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="h-11 lg:h-8 text-sm lg:text-[11px] w-full">編集</Button>
                        </Link>
                      ) : (
                        <Button size="sm" className="flex-1 h-11 lg:h-8 text-sm lg:text-[11px] bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100 border-0" disabled>編集</Button>
                      )}
                      <Link href={`/admin/campaigns/${c.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="h-11 lg:h-8 text-sm lg:text-[11px] w-full">詳細</Button>
                      </Link>
                      {c.status === "募集中" ? (
                        <Link href={`/admin/campaigns/${c.id}?tab=応募者`} className="flex-1">
                          <Button size="sm" className="h-11 lg:h-8 text-sm lg:text-[11px] bg-violet-600 hover:bg-violet-700 text-white w-full gap-1">
                            募集確認<ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" className="flex-1 h-11 lg:h-8 text-sm lg:text-[11px] bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100" disabled>募集終了</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
