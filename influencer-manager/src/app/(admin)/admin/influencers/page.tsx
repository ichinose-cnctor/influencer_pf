"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Star,
  Heart,
  MessageCircle,
  Instagram,
  Youtube,
  ChevronDown,
  ClipboardList,
  X,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import { influencerApi, InfluencerOut } from "@/lib/api";

const genres = ["すべて", "ホテル＆宿泊", "飲食店", "体験＆ツアー"];
const platforms = ["すべて", "Instagram", "YouTube", "TikTok"];
const statuses = ["すべて", "空き有り", "案件中"];

function formatFollowers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return `${n.toLocaleString()}`;
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform?.toLowerCase() === "youtube") return <Youtube className="h-3.5 w-3.5 text-red-500" />;
  return <Instagram className="h-3.5 w-3.5 text-pink-500" />;
}

export default function InfluencersPage() {
  const router = useRouter();
  const [influencers, setInfluencers] = useState<InfluencerOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("すべて");
  const [selectedPlatform, setSelectedPlatform] = useState("すべて");
  const [selectedStatus, setSelectedStatus] = useState("すべて");
  const [sortBy, setSortBy] = useState("フォロワー数");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 9;

  // 評価モーダル
  const [ratingModal, setRatingModal] = useState<{ id: number; name: string } | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});

  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: String(currentPage),
        per_page: String(PER_PAGE),
        sort: sortBy === "フォロワー数" ? "followers" : "登録日",
      };
      if (search) params.keyword = search;
      if (selectedGenre !== "すべて") params.category = selectedGenre;
      if (selectedPlatform !== "すべて") params.platform = selectedPlatform;
      if (selectedStatus !== "すべて") params.status = selectedStatus;

      const res = await influencerApi.list(params);
      setInfluencers(res.items);
      setTotal(res.total);

      // Ratings
      const rMap: Record<number, number> = {};
      res.items.forEach(inf => {
        rMap[inf.id] = inf.rating_avg || 0;
      });
      setRatings(rMap);
    } catch (err) {
      console.error("Failed to fetch influencers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, [currentPage, sortBy, selectedGenre, selectedPlatform, selectedStatus]);

  // Handle Search with debounce or simple delay
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInfluencers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const [hovered, setHovered] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  const openRatingModal = (id: number, name: string) => {
    setTempRating(ratings[id] ?? 0);
    setHovered(0);
    setRatingModal({ id, name });
  };
  const closeRatingModal = () => setRatingModal(null);
  const saveRating = async () => {
    if (!ratingModal) return;
    try {
      await influencerApi.updateRating(ratingModal.id, tempRating);
      setRatings((prev) => ({ ...prev, [ratingModal.id]: tempRating }));
      closeRatingModal();
    } catch (err) {
      alert("評価の保存に失敗しました");
    }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="space-y-5">
      {/* 検索 & フィルター */}
      <div className="flex flex-col gap-3">
        {/* 検索バー */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 h-9 flex-1 sm:max-w-sm rounded-lg border border-border bg-background px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="名前・ハンドルで検索..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground overflow-hidden text-ellipsis"
            />
          </div>

          {/* ソート */}
          <div className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-center leading-tight">並び<br className="sm:hidden" />替え</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-background border border-border rounded-md pl-2 pr-6 py-1.5 text-xs text-foreground outline-none cursor-pointer w-[5.5rem] sm:w-auto"
              >
                <option>フォロワー数</option>
                <option>評価</option>
                <option>案件数</option>
                <option>登録日</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* フィルタータブ */}
        <div className="flex flex-wrap gap-4">
          {/* カテゴリー */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
            <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">カテゴリー</span>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${
                    selectedGenre === g
                      ? "bg-violet-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* プラットフォーム */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
          <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">プラットフォーム</span>
          <div className="flex flex-wrap gap-1.5">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${
                  selectedPlatform === p
                    ? "bg-violet-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        {/* ステータス */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-1.5">
          <span className="text-sm lg:text-[11px] text-muted-foreground shrink-0">ステータス</span>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-2.5 py-1 rounded-full text-sm lg:text-[11px] font-medium transition-colors ${
                  selectedStatus === s
                    ? "bg-violet-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 件数 */}
      <p className="text-xs text-muted-foreground">
        {total} 件のインフルエンサーが見つかりました
      </p>

      {/* カードグリッド */}
      {loading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {influencers.map((inf) => {
            const initials = inf.name ? inf.name.substring(0, 1) : "?";
            const profile = inf.profile || {};
            const statusColor = (profile as any).status === "案件中" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700";
            
            return (
              <Card
                key={inf.id}
                className="border border-border shadow-none hover:shadow-md hover:border-violet-200 transition-all cursor-pointer group"
              >
                <CardContent className="p-5">
                  {/* ヘッダー */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold shrink-0`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-foreground truncate">{inf.name}</p>
                          <PlatformIcon platform={(profile as any).platform} />
                        </div>
                        <p className="text-sm lg:text-[11px] text-muted-foreground">{(profile as any).handle || "@handle"}</p>
                      </div>
                    </div>
                    <Badge className={`text-[12px] lg:text-[10px] px-2 py-0.5 border-0 shrink-0 ${statusColor}`}>
                      {(profile as any).status || "空き有り"}
                    </Badge>
                  </div>

                  {/* 統計 */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-[12px] lg:text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                        <Heart className="h-3 w-3" /> フォロワー
                      </p>
                      <p className="text-sm font-bold text-foreground mt-0.5">
                        {formatFollowers((profile as any).followers || 0)}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-[12px] lg:text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                        <MessageCircle className="h-3 w-3" /> 案件数
                      </p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{inf.campaign_count}</p>
                    </div>
                  </div>

                  {/* ジャンルタグ */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {((profile as any).genres || []).map((g: string) => (
                      <span
                        key={g}
                        className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[12px] lg:text-[10px] font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* フッター */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-foreground">{inf.rating_avg || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span className="text-sm lg:text-[11px]">{new Date(inf.created_at).toLocaleDateString("ja-JP")}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRatingModal(inf.id, inf.name)}
                        className="h-11 w-11 lg:h-9 lg:w-9 p-0"
                      >
                        <ClipboardList className="h-5 w-5 lg:h-4 lg:w-4" />
                      </Button>
                      <Link href={`/admin/influencers/${inf.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-11 lg:h-9 w-full text-sm lg:text-xs px-2.5 lg:px-3"
                        >
                          詳細
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/admin/messages?id=${inf.id}`)}
                        className="flex-1 h-11 lg:h-9 text-sm lg:text-xs px-2.5 lg:px-3 bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        メッセージ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 評価モーダル */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeRatingModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 flex flex-col gap-5">
            {/* 閉じるボタン */}
            <button
              onClick={closeRatingModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* タイトル */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <ClipboardList className="h-4 w-4 text-violet-600" />
                <h3 className="text-base font-bold text-gray-900">評価を入力</h3>
              </div>
              <p className="text-sm text-gray-500">{ratingModal.name}</p>
            </div>

            {/* 星評価 */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setTempRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-9 w-9 transition-colors ${
                        star <= (hovered || tempRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {hovered || tempRating
                  ? `${hovered || tempRating} / 5`
                  : "星をクリックして評価"}
              </p>
            </div>

            {/* ボタン */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-10 text-sm" onClick={closeRatingModal}>
                キャンセル
              </Button>
              <Button
                className="flex-1 h-10 text-sm bg-violet-600 hover:bg-violet-700 text-white"
                disabled={tempRating === 0}
                onClick={saveRating}
              >
                保存する
              </Button>
            </div>
          </div>
        </div>
      )}

      {influencers.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">条件に一致するインフルエンサーが見つかりませんでした</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedGenre("すべて");
              setSelectedPlatform("すべて");
              setSelectedStatus("すべて");
            }}
            className="mt-3 text-xs text-violet-600 hover:underline"
          >
            フィルターをリセット
          </button>
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
