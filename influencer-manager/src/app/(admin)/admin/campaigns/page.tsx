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

/* ───────────────────────── データ定義 ───────────────────────── */

type Status = "募集中" | "進行中" | "完了";

const myCampaigns = [
  {
    id: 1,
    title: "高級旅館 宿泊体験 PR キャンペーン",
    company: "BeautyBrand Co.",
    status: "進行中" as Status,
    statusColor: "bg-blue-100 text-blue-700",
    genre: "ホテル＆宿泊",
    area: "東京",
    sns: "Instagram",
    country: "日本",
    deadline: "2025/08/31",
    budget: "¥380,000",
    applicants: 3,
    slots: 3,
    progress: 100,
    messages: 3,
    image: "from-blue-200 to-cyan-200",
  },
  {
    id: 2,
    title: "リゾートホテル サウナPR",
    company: "Relaxation Inc.",
    status: "募集中" as Status,
    statusColor: "bg-amber-100 text-amber-700",
    genre: "ホテル＆宿泊",
    area: "沖縄",
    sns: "YouTube",
    country: "日本",
    deadline: "2025/09/15",
    budget: "¥250,000",
    applicants: 8,
    slots: 5,
    progress: 60,
    messages: 1,
    image: "from-emerald-200 to-teal-200",
  },
  {
    id: 3,
    title: "都内 ラグジュアリーカフェ紹介",
    company: "Cafe De Paris",
    status: "完了" as Status,
    statusColor: "bg-emerald-100 text-emerald-700",
    genre: "飲食店",
    area: "東京",
    sns: "TikTok",
    country: "韓国",
    deadline: "2025/07/20",
    budget: "¥120,000",
    applicants: 15,
    slots: 10,
    progress: 100,
    messages: 0,
    image: "from-rose-200 to-red-200",
  },
  {
    id: 4,
    title: "グランピング施設 開業PR",
    company: "NatureStay",
    status: "募集中" as Status,
    statusColor: "bg-amber-100 text-amber-700",
    genre: "ホテル＆宿泊",
    area: "北海道",
    sns: "Instagram",
    country: "日本",
    deadline: "2025/12/01",
    budget: "¥550,000",
    applicants: 0,
    slots: 3,
    progress: 0,
    messages: 0,
    image: "from-amber-200 to-yellow-400",
  },
  {
    id: 5,
    title: "箱根 温泉旅館 冬季プランPR",
    company: "Hakone Resort",
    status: "進行中" as Status,
    statusColor: "bg-blue-100 text-blue-700",
    genre: "ホテル＆宿泊",
    area: "関東",
    sns: "YouTube",
    country: "台湾",
    deadline: "2025/11/30",
    budget: "¥280,000",
    applicants: 2,
    slots: 4,
    progress: 50,
    messages: 2,
    image: "from-fuchsia-300 to-purple-400",
  },
  {
    id: 6,
    title: "海外旅行用 スーツケースPR",
    company: "TravelGear",
    status: "完了" as Status,
    statusColor: "bg-emerald-100 text-emerald-700",
    genre: "体験＆ツアー",
    area: "海外",
    sns: "TikTok",
    country: "アメリカ",
    deadline: "2025/06/10",
    budget: "¥150,000",
    applicants: 5,
    slots: 5,
    progress: 100,
    messages: 0,
    image: "from-blue-400 to-indigo-500",
  },
  {
    id: 7,
    title: "名古屋 名物グルメPR",
    company: "Nagoya Eats",
    status: "募集中" as Status,
    statusColor: "bg-amber-100 text-amber-700",
    genre: "飲食店",
    area: "名古屋",
    sns: "Instagram",
    country: "日本",
    deadline: "2025/11/01",
    budget: "¥85,000",
    applicants: 3,
    slots: 4,
    progress: 75,
    messages: 0,
    image: "from-yellow-300 to-orange-400",
  },
  {
    id: 8,
    title: "デザインホテル インフルエンサー PR",
    company: "LinguaBoost",
    status: "募集中" as Status,
    statusColor: "bg-amber-100 text-amber-700",
    genre: "ホテル＆宿泊",
    area: "全国",
    sns: "TikTok",
    country: "台湾",
    deadline: "2025/10/20",
    budget: "¥180,000",
    applicants: 2,
    slots: 5,
    progress: 40,
    messages: 1,
    image: "from-cyan-300 to-sky-400",
  },
];

const CATEGORIES = ["すべて", "ホテル＆宿泊", "飲食店", "体験＆ツアー"];
const AREAS = ["すべて", "全国", "関東", "関西", "東海", "九州・沖縄", "北海道・東北", "中国・四国", "海外"];
const SNS_LIST = ["すべて", "Instagram", "YouTube", "TikTok"];
const COUNTRIES = ["すべて", "日本", "アメリカ", "韓国", "中国", "台湾", "東南アジア", "ヨーロッパ"];

type Tab = "全て" | "募集中" | "進行中" | "完了";

/* ───────────────────────── コンポーネント ───────────────────────── */

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

  const [campaigns, setCampaigns] = useState(myCampaigns);
  useEffect(() => {
    setCampaigns(myCampaigns.map((c) => {
      const saved = localStorage.getItem(`campaign-status-${c.id}`);
      if (!saved) return c;
      const colorMap: Record<string, string> = {
        "募集中": "bg-amber-100 text-amber-700",
        "進行中": "bg-blue-100 text-blue-700",
        "完了": "bg-emerald-100 text-emerald-700",
      };
      return { ...c, status: (saved as Status) ?? c.status, statusColor: colorMap[saved] ?? c.statusColor };
    }));
  }, []);

  const tabs = [
    { key: "全て" as Tab, label: "全ての案件", icon: Users, count: campaigns.length },
    { key: "募集中" as Tab, label: "募集中の案件", icon: Megaphone, count: campaigns.filter((c) => c.status === "募集中").length },
    { key: "進行中" as Tab, label: "進行中の案件", icon: Briefcase, count: campaigns.filter((c) => c.status === "進行中").length },
    { key: "完了" as Tab, label: "完了案件", icon: CheckCircle2, count: campaigns.filter((c) => c.status === "完了").length },
  ];

  const hasFilter = keyword !== "" || category !== "すべて" || area !== "すべて" || sns !== "すべて" || country !== "すべて";

  const resetFilters = () => {
    setKeyword("");
    setCategory("すべて");
    setArea("すべて");
    setSns("すべて");
    setCountry("すべて");
    setCurrentPage(1);
  };

  const byTab = activeTab === "全て" ? campaigns : campaigns.filter((c) => c.status === activeTab);

  const filtered = byTab.filter((c) => {
    const kw = keyword.trim().toLowerCase();
    if (kw && !c.title.toLowerCase().includes(kw) && !c.company.toLowerCase().includes(kw)) return false;
    if (category !== "すべて" && c.genre !== category) return false;
    if (area !== "すべて" && c.area !== area) return false;
    if (sns !== "すべて" && c.sns !== sns) return false;
    if (country !== "すべて" && c.country !== country) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="space-y-4">
      {/* 検索 & フィルター */}
      <div className="flex flex-col gap-3">
        {/* 検索バー */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 h-9 flex-1 max-w-sm rounded-lg border border-border bg-background px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="キーワードで検索..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
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

        {/* フィルタータブ */}
        <div className="flex flex-col gap-2">
          {/* カテゴリー */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
            <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">カテゴリー</span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${
                    category === c
                      ? "bg-violet-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {c === "すべて" ? "すべて" : c}
                </button>
              ))}
            </div>
          </div>

          {/* プラットフォーム */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
            <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">プラットフォーム</span>
            <div className="flex flex-wrap gap-1.5">
              {SNS_LIST.map((s) => (
                <button
                  key={s}
                  onClick={() => setSns(s)}
                  className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${
                    sns === s
                      ? "bg-violet-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* エリア・国 */}
          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2 lg:gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
              <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">エリア</span>
              <div className="flex flex-wrap gap-1.5">
                {AREAS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${
                      area === a
                        ? "bg-violet-600 text-white"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
              <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">ターゲット国</span>
              <div className="flex flex-wrap gap-1.5">
                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCountry(c)}
                    className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${
                      country === c
                        ? "bg-violet-600 text-white"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 案件一覧 */}
      {/* タブ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 lg:mt-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl text-left transition-all duration-150 ${
                isActive
                  ? "bg-violet-700 text-white shadow-sm"
                  : "bg-violet-50 text-violet-700 hover:bg-violet-100"
              }`}
            >
              <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-white/20" : "bg-violet-100"}`}>
                <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? "text-white" : "text-violet-600"}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs sm:text-xs truncate ${isActive ? "text-violet-200" : "text-violet-500"}`}>{tab.label}</p>
                <p className={`text-base sm:text-lg font-bold leading-none mt-0.5 ${isActive ? "text-white" : "text-violet-700"}`}>{tab.count}件</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 件数 & 新規作成 */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{filtered.length} 件の案件が見つかりました</p>
        <Link href="/admin/campaigns/new">
          <Button size="sm" className="h-10 lg:h-8 text-sm lg:text-xs bg-violet-600 hover:bg-violet-700 text-white">
            新規作成
          </Button>
        </Link>
      </div>

      {/* カードグリッド */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-sm text-muted-foreground">
          該当する案件はありません
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-3 lg:mt-0">
          {paginated.map((c) => (
            <Card
              key={c.id}
              className="border border-border shadow-none hover:shadow-md hover:border-violet-200 transition-all group overflow-hidden pt-0"
            >
              <CardContent className="p-0">
                {/* サムネイル */}
                <div className={`aspect-video w-full bg-gradient-to-br ${c.image} relative`}>
                  <Badge className={`absolute top-3 left-3 text-[12px] lg:text-[10px] px-2 py-0.5 border-0 ${c.statusColor}`}>
                    {c.status}
                  </Badge>
                </div>

                <div className="px-4 pt-4 pb-2 lg:px-4 lg:pt-4 lg:pb-2 space-y-3">
                  {/* タイトル・会社 */}
                  <div>
                    <Link href={`/admin/campaigns/${c.id}`}>
                      <p className="text-lg md:text-sm font-semibold text-foreground hover:text-violet-600 transition-colors leading-snug line-clamp-2">
                        {c.title}
                      </p>
                    </Link>
                    <p className="text-sm lg:text-[11px] text-muted-foreground mt-0.5">{c.company}</p>
                  </div>

                  {/* タグ */}
                  <div className="flex flex-wrap gap-1">
                    {[c.genre, c.area, c.sns].map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[12px] lg:text-[10px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 統計 */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-[12px] lg:text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                        <Users className="h-3 w-3" /> 応募
                      </p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{c.applicants}/{c.slots}名</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-[12px] lg:text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                        <Calendar className="h-3 w-3" /> 締切
                      </p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{c.deadline}</p>
                    </div>
                  </div>

                  {/* 進捗バー */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[12px] lg:text-[10px] text-muted-foreground">
                      <span>進捗</span>
                      <span>{c.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.progress === 100 ? "bg-emerald-500" : "bg-violet-500"}`}
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* ボタン */}
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
                          募集確認
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" className="flex-1 h-11 lg:h-8 text-sm lg:text-[11px] bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100" disabled>募集終了</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
