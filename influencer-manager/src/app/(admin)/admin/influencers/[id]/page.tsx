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
import { influencerApi, InfluencerOut, CampaignHistory } from "@/lib/api";

function formatFollowers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return String(n);
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform?.toLowerCase() === "youtube") return <Youtube className="h-4 w-4 text-red-500" />;
  return <Instagram className="h-4 w-4 text-pink-500" />;
}

const statusOrder: Record<string, number> = { "進行中": 0, "応募中": 1, "完了": 2 };

export default function InfluencerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params?.id as string);

  const [inf, setInf] = useState<InfluencerOut | null>(null);
  const [history, setHistory] = useState<CampaignHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const [memo, setMemo] = useState("");
  const [savedMemo, setSavedMemo] = useState("");
  const [memoEditing, setMemoEditing] = useState(false);

  const [rating, setRating] = useState(0);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingHovered, setRatingHovered] = useState(0);
  const [ratingTemp, setRatingTemp] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await influencerApi.get(id);
        setInf(data);
        setHistory(data.campaign_history || []);
        setRating(data.rating_avg || 0);
        setMemo(data.profile?.admin_memo || "");
        setSavedMemo(data.profile?.admin_memo || "");
      } catch (err) {
        console.error("Failed to fetch influencer detail", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const openRatingModal = () => { setRatingTemp(rating); setRatingHovered(0); setRatingModalOpen(true); };
  const closeRatingModal = () => setRatingModalOpen(false);
  const saveRating = async () => {
    try {
      await influencerApi.updateRating(id, ratingTemp);
      setRating(ratingTemp);
      setRatingModalOpen(false);
    } catch (err) {
      alert("評価の保存に失敗しました");
    }
  };

  const handleMemoSave = async () => {
    setSavedMemo(memo);
    setMemoEditing(false);
  };
  const handleMemoCancel = () => {
    setMemo(savedMemo);
    setMemoEditing(false);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground font-medium">読み込み中...</div>;
  if (!inf) return <div className="p-8 text-center text-muted-foreground font-medium">インフルエンサーが見つかりません</div>;

  const profile = inf.profile || {};
  const initials = inf.name ? inf.name.substring(0, 1) : "?";
  const statusColor = (profile as any).status === "案件中" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700";

  const activeCount = history.filter((c) => c.status === "進行中" || c.status === "応募中").length;
  const doneCount = history.filter((c) => c.status === "完了").length;
  const totalCount = history.filter((c) => c.status === "完了" || c.status === "進行中").length;

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
              <div className={`h-16 w-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
                {initials}
              </div>

              {/* 名前・基本情報 */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-xl font-bold text-foreground">{inf.name}</h2>
                  <PlatformIcon platform={(profile as any).platform} />
                  <Badge className={`text-[12px] lg:text-[10px] px-2 py-0.5 border-0 ${statusColor}`}>
                    {(profile as any).status || "空き有り"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{(profile as any).handle || "@handle"}</p>
                <div className="flex flex-wrap gap-1">
                  {((profile as any).genres || []).map((g: string) => (
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
              <p className="text-lg font-bold text-foreground">{formatFollowers((profile as any).followers || 0)}</p>
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
                    {/* サムネイル代わりのアイコン */}
                    <div className={`h-12 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0`}>
                      <Briefcase className="h-6 w-6 text-muted-foreground/40" />
                    </div>

                    {/* メイン情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                        <Badge className={`text-[12px] lg:text-[10px] px-2 py-0.5 border-0 shrink-0 bg-muted text-muted-foreground`}>
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
                      ) : (
                        <Clock className="h-5 w-5 text-blue-500" />
                      )}
                      <ChevronRight className="h-4 w-4 text-violet-400" />
                    </div>
                  </>
                );
                return (
                  <Link key={c.id} href={`/admin/campaigns/${c.campaign_id}`} className={`${rowClass} cursor-pointer`}>
                    {inner}
                  </Link>
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
