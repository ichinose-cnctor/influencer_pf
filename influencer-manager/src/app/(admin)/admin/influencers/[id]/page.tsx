"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Star,
  Instagram,
  Youtube,
  CheckCircle2,
  Clock,
  ChevronRight,
  Send,
  ClipboardList,
  Pencil,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { influencerCampaignHistory, type CampaignHistory } from "@/lib/influencer-data";

/* ─── インフルエンサーデータ ─── */
const influencerMap: Record<string, {
  id: number; name: string; handle: string; initials: string;
  avatarColor: string; platform: string; followers: number;
  engagementRate: number; genres: string[]; rating: number;
  campaigns: number; status: string; statusColor: string;
  bio: string;
}> = {
  "1": { id: 1, name: "山田 花子", handle: "@hanako_lifestyle", initials: "山", avatarColor: "from-pink-400 to-rose-400", platform: "instagram", followers: 128000, engagementRate: 4.8, genres: ["ホテル＆宿泊"], rating: 4.9, campaigns: 12, status: "空き有り", statusColor: "bg-emerald-100 text-emerald-700", bio: "旅行・ホテル・宿泊体験を中心に発信するライフスタイル系インフルエンサー。丁寧な写真とレポートが好評。" },
  "2": { id: 2, name: "鈴木 健太", handle: "@kenta_fitness", initials: "鈴", avatarColor: "from-sky-400 to-blue-500", platform: "youtube", followers: 342000, engagementRate: 6.2, genres: ["体験＆ツアー"], rating: 4.7, campaigns: 8, status: "案件中", statusColor: "bg-blue-100 text-blue-700", bio: "アウトドア・体験ツアー専門のYouTuber。実際の体験をリアルに伝える動画で高エンゲージメントを維持。" },
  "3": { id: 3, name: "佐藤 みのり", handle: "@minori_foodie", initials: "佐", avatarColor: "from-amber-400 to-orange-400", platform: "instagram", followers: 89000, engagementRate: 5.5, genres: ["飲食店"], rating: 4.6, campaigns: 15, status: "空き有り", statusColor: "bg-emerald-100 text-emerald-700", bio: "グルメ・飲食店レポート専門。食欲をそそる写真とリアルな口コミで飲食系案件に強みを持つ。" },
  "4": { id: 4, name: "中村 咲", handle: "@saki_travel", initials: "中", avatarColor: "from-violet-400 to-purple-500", platform: "instagram", followers: 215000, engagementRate: 3.9, genres: ["ホテル＆宿泊"], rating: 4.5, campaigns: 20, status: "空き有り", statusColor: "bg-emerald-100 text-emerald-700", bio: "旅行・ホテル・リゾートを中心に国内外の宿泊施設を紹介。フォロワー層は20〜40代女性が中心。" },
  "5": { id: 5, name: "田中 ゆい", handle: "@yui_beauty", initials: "田", avatarColor: "from-fuchsia-400 to-pink-500", platform: "youtube", followers: 560000, engagementRate: 7.1, genres: ["飲食店"], rating: 5.0, campaigns: 31, status: "案件中", statusColor: "bg-blue-100 text-blue-700", bio: "グルメ・飲食特化のYouTuber。新店舗レポートや話題グルメの動画が毎回高再生数を記録。" },
  "6": { id: 6, name: "伊藤 大輝", handle: "@daiki_tech", initials: "伊", avatarColor: "from-slate-400 to-gray-500", platform: "youtube", followers: 98000, engagementRate: 4.2, genres: ["体験＆ツアー"], rating: 4.3, campaigns: 6, status: "空き有り", statusColor: "bg-emerald-100 text-emerald-700", bio: "体験型アクティビティ・ツアーを得意とするYouTuber。丁寧な解説と臨場感ある映像が特徴。" },
  "7": { id: 7, name: "高橋 あおい", handle: "@aoi_fashion", initials: "高", avatarColor: "from-teal-400 to-cyan-400", platform: "instagram", followers: 175000, engagementRate: 5.8, genres: ["ホテル＆宿泊"], rating: 4.8, campaigns: 18, status: "案件中", statusColor: "bg-blue-100 text-blue-700", bio: "ラグジュアリーホテル・高級旅館を専門とするInstagramer。フォトジェニックな投稿で人気。" },
  "8": { id: 8, name: "渡辺 そら", handle: "@sora_outdoor", initials: "渡", avatarColor: "from-lime-400 to-green-500", platform: "youtube", followers: 62000, engagementRate: 8.3, genres: ["体験＆ツアー"], rating: 4.4, campaigns: 4, status: "空き有り", statusColor: "bg-emerald-100 text-emerald-700", bio: "自然・アウトドア体験に特化したYouTuber。エンゲージメント率が高く、熱心なファンコミュニティを持つ。" },
};


function formatFollowers(n: number): string {
  return `${(n / 10000).toFixed(1)}万`;
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "youtube") return <Youtube className="h-4 w-4 text-red-500" />;
  return <Instagram className="h-4 w-4 text-pink-500" />;
}

const statusOrder = { "進行中": 0, "応募中": 1, "完了": 2 };

export default function InfluencerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? "1");
  const inf = influencerMap[id] ?? influencerMap["1"];
  const history = (influencerCampaignHistory[id] ?? []).sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  const activeCount = history.filter((c) => c.status === "進行中" || c.status === "応募中").length;
  const doneCount = history.filter((c) => c.status === "完了").length;
  const totalCount = history.filter((c) => c.status === "完了" || c.status === "進行中").length;

  const [memo, setMemo] = useState("");
  const [savedMemo, setSavedMemo] = useState("");
  const [memoEditing, setMemoEditing] = useState(false);

  const [rating, setRating] = useState(() => {
    if (typeof window === "undefined") return Math.round(inf.rating);
    const saved = localStorage.getItem(`influencer-rating-${id}`);
    return saved !== null ? parseInt(saved) : Math.round(inf.rating);
  });
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingHovered, setRatingHovered] = useState(0);
  const [ratingTemp, setRatingTemp] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`influencer-rating-${id}`);
    if (saved !== null) setRating(parseInt(saved));
  }, [id]);

  const openRatingModal = () => { setRatingTemp(rating); setRatingHovered(0); setRatingModalOpen(true); };
  const closeRatingModal = () => setRatingModalOpen(false);
  const saveRating = () => {
    setRating(ratingTemp);
    localStorage.setItem(`influencer-rating-${id}`, String(ratingTemp));
    setRatingModalOpen(false);
  };

  const handleMemoSave = () => {
    setSavedMemo(memo);
    setMemoEditing(false);
  };
  const handleMemoCancel = () => {
    setMemo(savedMemo);
    setMemoEditing(false);
  };

  return (
    <>
    <div className="space-y-6 max-w-4xl">
      {/* パンくず */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/admin/influencers" className="hover:text-foreground transition-colors">
          インフルエンサー
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{inf.name}</span>
      </div>

      {/* プロフィールカード */}
      <Card className="border border-border shadow-none">
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* 戻るボタン */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => router.push("/admin/influencers")}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>

              {/* アバター */}
              <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${inf.avatarColor} flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
                {inf.initials}
              </div>

              {/* 名前・基本情報 */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-xl font-bold text-foreground">{inf.name}</h2>
                  <PlatformIcon platform={inf.platform} />
                  <Badge className={`text-[12px] lg:text-[10px] px-2 py-0.5 border-0 ${inf.statusColor}`}>
                    {inf.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{inf.handle}</p>
                <div className="flex flex-wrap gap-1">
                  {inf.genres.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-sm lg:text-[11px] font-medium">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <Button
              onClick={() => router.push(`/admin/messages?id=${inf.id}`)}
              className="h-9 text-sm bg-violet-600 hover:bg-violet-700 text-white gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              メッセージを送る
            </Button>
          </div>

          {/* スタッツ */}
          <div className="grid grid-cols-3 gap-1.5 lg:gap-4 mt-4">
            <div className="bg-muted/50 rounded-xl p-2 lg:p-3 text-center">
              <p className="text-[11px] lg:text-[11px] text-muted-foreground flex items-center justify-center gap-0.5 mb-1 whitespace-nowrap">
                <Heart className="h-3 w-3 shrink-0" /> フォロワー
              </p>
              <p className="text-lg font-bold text-foreground">{formatFollowers(inf.followers)}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-2 lg:p-3 text-center">
              <p className="text-[11px] lg:text-[11px] text-muted-foreground flex items-center justify-center gap-0.5 mb-1 whitespace-nowrap">
                <MessageCircle className="h-3 w-3 shrink-0" /> 累計案件数
              </p>
              <p className="text-lg font-bold text-foreground">{totalCount}</p>
            </div>
            <button
              onClick={openRatingModal}
              className="bg-muted/50 rounded-xl p-2 lg:p-3 text-center hover:bg-muted/80 transition-colors group"
            >
              <p className="text-[11px] lg:text-[11px] text-muted-foreground flex items-center justify-center gap-0.5 mb-1 whitespace-nowrap">
                <Star className="h-3 w-3" /> 評価
                <Pencil className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-violet-500" />
              </p>
              <div className="flex items-center justify-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <p className="text-lg font-bold text-foreground">{rating}</p>
              </div>
            </button>
          </div>

          {/* メモ欄 */}
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
                管理メモ
              </p>
              {!memoEditing && (
                <button
                  onClick={() => { setMemo(savedMemo); setMemoEditing(true); }}
                  className="text-sm lg:text-[11px] text-violet-600 hover:underline"
                >
                  {savedMemo ? "編集" : "メモを追加"}
                </button>
              )}
            </div>

            {memoEditing ? (
              <div className="space-y-2">
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="管理者メモを入力してください..."
                  rows={4}
                  autoFocus
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background placeholder:text-muted-foreground resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleMemoCancel}>
                    キャンセル
                  </Button>
                  <Button size="sm" className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white" onClick={handleMemoSave}>
                    保存
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => { setMemo(savedMemo); setMemoEditing(true); }}
                className="min-h-[64px] rounded-lg bg-muted/50 px-3 py-2.5 cursor-text"
              >
                {savedMemo ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{savedMemo}</p>
                ) : (
                  <p className="text-sm text-muted-foreground/60">クリックしてメモを追加...</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 案件履歴 */}
      <Card className="border border-border shadow-none">
        <CardHeader className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">案件履歴</CardTitle>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                進行中・応募中 {activeCount}件
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                完了 {doneCount}件
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">案件履歴がありません</p>
          ) : (
            <div>
              {history.map((c, i) => {
                const rowClass = `flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30 ${
                  i < history.length - 1 ? "border-b border-border" : ""
                }`;
                const inner = (
                  <>
                    {/* サムネイル */}
                    <div className={`h-12 w-16 rounded-lg bg-gradient-to-br ${c.imageColor} shrink-0`} />

                    {/* メイン情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                        <Badge className={`text-[12px] lg:text-[10px] px-2 py-0.5 border-0 shrink-0 ${c.statusColor}`}>
                          {c.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.client}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm lg:text-[11px] text-muted-foreground flex-wrap">
                        <span className="px-1.5 py-0.5 rounded bg-muted">{c.category}</span>
                        <span>{c.platform}</span>
                        <span>{c.period}</span>
                      </div>
                    </div>

                    {/* ステータスアイコン + 遷移矢印 */}
                    <div className="shrink-0 flex items-center gap-2">
                      {c.status === "完了" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : c.status === "進行中" ? (
                        <Clock className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-500" />
                      )}
                      {c.campaignId && (
                        <ChevronRight className="h-4 w-4 text-violet-400" />
                      )}
                    </div>
                  </>
                );
                return c.campaignId ? (
                  <Link key={c.id} href={`/admin/campaigns/${c.campaignId}`} className={`${rowClass} cursor-pointer`}>
                    {inner}
                  </Link>
                ) : (
                  <div key={c.id} className={rowClass}>
                    {inner}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>

    {/* 評価モーダル */}
    {ratingModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeRatingModal} />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 flex flex-col gap-5">
          <button onClick={closeRatingModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-4 w-4" />
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <ClipboardList className="h-4 w-4 text-violet-600" />
              <h3 className="text-base font-bold text-gray-900">評価を入力</h3>
            </div>
            <p className="text-sm text-gray-500">{inf.name}</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setRatingHovered(star)}
                  onMouseLeave={() => setRatingHovered(0)}
                  onClick={() => setRatingTemp(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`h-9 w-9 transition-colors ${star <= (ratingHovered || ratingTemp) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                </button>
              ))}
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {ratingHovered || ratingTemp ? `${ratingHovered || ratingTemp} / 5` : "星をクリックして評価"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10 text-sm" onClick={closeRatingModal}>キャンセル</Button>
            <Button className="flex-1 h-10 text-sm bg-violet-600 hover:bg-violet-700 text-white" disabled={ratingTemp === 0} onClick={saveRating}>保存する</Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
