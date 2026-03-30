"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  ChevronRight,
  Building2,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Users,
  Gift,
  Banknote,
  Globe,
  Star,
  Instagram,
  Youtube,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { campaignApi, CampaignOut, ApplicationOut } from "@/lib/api";
import { MarkdownPreview } from "@/components/MarkdownPreview";

type Verdict = "pending" | "pass" | "fail";
type Tab = "概要" | "応募者";

function formatFollowers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return String(n);
}

export default function CampaignDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">読み込み中...</div>}>
      <CampaignDetailContent />
    </Suspense>
  );
}

function CampaignDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as Tab) ?? "概要";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const campaignId = parseInt(params.id as string);

  const [campaign, setCampaign] = useState<CampaignOut | null>(null);
  const [applications, setApplications] = useState<ApplicationOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [verdicts, setVerdicts] = useState<Record<number, Verdict>>({});
  const [modal, setModal] = useState<{ id: number; verdict: "pass" | "fail" } | null>(null);
  const [statusModal, setStatusModal] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);

  const statusSteps = ["募集中", "進行中", "完了"] as const;
  const statusColors: Record<string, string> = {
    "募集中": "bg-amber-100 text-amber-700",
    "進行中": "bg-blue-100 text-blue-700",
    "完了": "bg-emerald-100 text-emerald-700",
  };

  const fetchData = async () => {
    if (!campaignId) return;
    try {
      const [cData, aData] = await Promise.all([
        campaignApi.get(campaignId),
        campaignApi.listApplications(campaignId),
      ]);
      setCampaign(cData);
      setApplications(aData);

      // Initialize verdicts from application data
      const vMap: Record<number, Verdict> = {};
      aData.forEach((a) => {
        vMap[a.id] = (a.verdict as Verdict) || "pending";
      });
      setVerdicts(vMap);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignId]);

  const handleStatusChange = (status: string) => {
    if (!campaign || status === campaign.status) return;
    setStatusModal(status);
  };

  const confirmStatusChange = async () => {
    if (!statusModal || !campaign) return;
    setSavingStatus(true);
    try {
      await campaignApi.updateStatus(campaign.id, statusModal);
      setCampaign({ ...campaign, status: statusModal });
      setStatusModal(null);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("ステータスの更新に失敗しました");
    } finally {
      setSavingStatus(false);
    }
  };

  const openModal = (id: number, v: "pass" | "fail") => setModal({ id, verdict: v });
  const closeModal = () => setModal(null);
  const confirmVerdict = async () => {
    if (!modal || !campaign) return;
    const currentVerdict = verdicts[modal.id];
    const nextVerdict = currentVerdict === modal.verdict ? "pending" : modal.verdict;

    try {
      await campaignApi.updateVerdict(campaign.id, modal.id, nextVerdict);
      setVerdicts((prev) => ({ ...prev, [modal.id]: nextVerdict }));
      // Optional: re-fetch to update approval counts/status if needed
      if (nextVerdict === "pass") {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update verdict", err);
      alert("判定の更新に失敗しました");
    } finally {
      closeModal();
    }
  };

  if (loading || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  const passCount = Object.values(verdicts).filter((v) => v === "pass").length;
  const failCount = Object.values(verdicts).filter((v) => v === "fail").length;
  const tabs: Tab[] = ["概要", "応募者"];

  return (
    <div className="space-y-5 max-w-5xl">
      {/* パンくず & 戻るボタン */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/admin/campaigns" className="hover:text-foreground transition-colors">プロジェクト一覧</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{campaign.title}</span>
      </div>

      {/* ページヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/admin/campaigns">
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 mt-0.5">
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-foreground">{campaign.title}</h2>
              <Badge className={`text-[12px] lg:text-[10px] px-2 border-0 ${statusColors[campaign.status]}`}>
                {campaign.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 basis-full sm:basis-auto">
                <Building2 className="h-3 w-3" />
                {campaign.client_name || "クライアント"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                期限: {campaign.publish_end ? new Date(campaign.publish_end).toLocaleDateString("ja-JP") : "—"}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {campaign.category || "未設定"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ステータス変更バー */}
      <div className="flex items-center gap-2 sm:gap-3 px-1 py-2 bg-white rounded-xl border border-border shadow-sm">
        <span className="text-xs text-muted-foreground shrink-0 pl-3">ステータス</span>
        <div className="flex items-center gap-1 flex-1 pr-1">
          {statusSteps.map((step, i) => {
            const currentIdx = statusSteps.indexOf(campaign.status as typeof statusSteps[number]);
            const isDone = i < currentIdx;
            const isActive = i === currentIdx;
            return (
              <div key={step} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => handleStatusChange(step)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors border ${
                    isActive
                      ? `${statusColors[step]} border-transparent shadow-sm underline underline-offset-4 decoration-2`
                      : isDone
                      ? "bg-emerald-50 text-emerald-600 border-transparent"
                      : "bg-background text-muted-foreground border-border hover:border-violet-300 hover:text-foreground"
                  }`}
                >
                  {isDone ? "✓ " : ""}{step}
                </button>
                {i < statusSteps.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* タブ */}
      <div className="border-b border-border flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "応募者" ? (
              <span className="inline-flex items-center gap-1.5">
                応募者
                <span className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-violet-100 text-violet-700 text-[12px] lg:text-[10px] font-bold">
                  {applications.length}
                </span>
              </span>
            ) : tab}
          </button>
        ))}
      </div>

      {/* ---- 概要タブ ---- */}
      {activeTab === "概要" && (
        <div className="space-y-5">
            {/* 案件情報 */}
            <Card className="border border-border shadow-none">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-sm font-semibold">案件情報</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <Gift className="h-3.5 w-3.5" />
                    報酬スタイル
                  </span>
                  <Badge className={`border-0 text-[12px] lg:text-[10px] px-2 ${campaign.reward_style === "gifting" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>
                    {campaign.reward_style === "gifting" ? "ギフティング" : "有償"}
                  </Badge>
                </div>
                {campaign.reward_style === "paid" && (
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                      <Banknote className="h-3.5 w-3.5" />
                      予算
                    </span>
                    <span className="font-medium text-foreground">
                      ¥{(campaign.min_budget || 0).toLocaleString()} 〜 ¥{(campaign.max_budget || 0).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <Calendar className="h-3.5 w-3.5" />
                    公開期間
                  </span>
                  <span className="font-medium text-foreground">
                    {campaign.publish_start ? new Date(campaign.publish_start).toLocaleDateString("ja-JP") : "—"} 〜 {campaign.publish_end ? new Date(campaign.publish_end).toLocaleDateString("ja-JP") : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <Clock className="h-3.5 w-3.5" />
                    実施期間
                  </span>
                  <span className="font-medium text-foreground">
                    {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString("ja-JP") : "—"} 〜 {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString("ja-JP") : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <MapPin className="h-3.5 w-3.5" />
                    エリア
                  </span>
                  <span className="font-medium text-foreground">{campaign.area || "未設定"}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <Globe className="h-3.5 w-3.5" />
                    ターゲット国
                  </span>
                  <span className="font-medium text-foreground">{campaign.country || "未設定"}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <Users className="h-3.5 w-3.5" />
                    定員数
                  </span>
                  <span className="font-medium text-foreground">{(campaign as any).max_slots || "—"} 名</span>
                </div>
              </CardContent>
            </Card>

            {/* 案件説明 */}
            <Card className="border border-border shadow-none">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-sm font-semibold">案件説明</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  <MarkdownPreview content={campaign.description || ""} />
                </div>
                {campaign.video_url && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg flex items-center gap-2 text-xs">
                    <Youtube className="h-4 w-4 text-red-500" />
                    <span className="text-muted-foreground text-xs">紹介動画:</span>
                    <a href={campaign.video_url} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                      {campaign.video_url}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 会社情報 */}
            <Card className="border border-border shadow-none">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-sm font-semibold">会社情報</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <div className="flex items-start gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <Building2 className="h-3.5 w-3.5" />
                    企業名
                  </span>
                  <span className="font-medium text-foreground">{campaign.client_name || "—"}</span>
                </div>
                <div className="flex items-start gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <MapPin className="h-3.5 w-3.5" />
                    本社所在地
                  </span>
                  <span className="font-medium text-foreground">{campaign.client_address || "—"}</span>
                </div>
                <div className="flex items-start gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <Globe className="h-3.5 w-3.5" />
                    ホームページ
                  </span>
                  <span className="font-medium text-foreground">
                    {campaign.client_website ? (
                      <a href={campaign.client_website} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                        {campaign.client_website}
                      </a>
                    ) : "—"}
                  </span>
                </div>
                <div className="flex items-start gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0 w-24">
                    <FileText className="h-3.5 w-3.5" />
                    事業内容
                  </span>
                  <p className="font-medium text-foreground leading-relaxed flex-1">
                    {campaign.client_business_description || "—"}
                  </p>
                </div>
              </CardContent>
            </Card>
        </div>
      )}

      {/* ---- 応募者タブ ---- */}
      {activeTab === "応募者" && (
        <div className="space-y-4">
          {/* サマリーバー */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 bg-violet-50 text-violet-700 px-3 py-1.5 rounded-lg border border-violet-100">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">定員 <span className="font-bold">{(campaign as any).max_slots || "—"}</span> 名</span>
            </div>
            <span className="text-muted-foreground text-[10px]">のうち</span>
            <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">応募 <span className="font-bold text-gray-900">{applications.length}</span> 名</span>
            </div>
            <span className="text-muted-foreground text-[10px]">/</span>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-xs">採用 <span className="font-bold text-emerald-900">{passCount}</span> 名</span>
            </div>
          </div>

          {/* 応募者カード一覧 */}
          {applications.length === 0 ? (
            <div className="py-20 text-center text-sm text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
              まだ応募者はいません
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((a) => {
                const verdict = verdicts[a.id];
                const inf = a.influencer;
                const initials = inf?.name ? inf.name.substring(0, 1) : "?";
                const avatarColors = [
                  "from-pink-400 to-rose-400",
                  "from-sky-400 to-blue-500",
                  "from-amber-400 to-orange-400",
                  "from-violet-400 to-purple-500",
                  "from-emerald-400 to-teal-500"
                ];
                const avatarColor = avatarColors[a.id % avatarColors.length];

                return (
                  <Card
                    key={a.id}
                    className={`border shadow-none transition-all ${
                      verdict === "pass"
                        ? "border-emerald-300 bg-emerald-50/50"
                        : verdict === "fail"
                        ? "border-red-200 bg-red-50/40"
                        : "border-border hover:border-violet-200"
                    }`}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                          {/* アバター */}
                          <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-base sm:text-lg font-bold shrink-0 shadow-sm`}>
                            {initials}
                          </div>

                          {/* メイン情報 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="text-sm font-semibold text-foreground">{inf?.name || "名前なし"}</p>
                              {inf?.profile?.handle && (
                                <p className="text-xs text-muted-foreground">{inf.profile.handle}</p>
                              )}
                              {verdict === "pass" && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="h-3 w-3" /> 採用確定
                                </span>
                              )}
                              {verdict === "fail" && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                                  <ThumbsDown className="h-3 w-3" /> 見送り
                                </span>
                              )}
                            </div>

                            {/* スタッツ */}
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mb-3">
                              <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-md">
                                {inf?.profile?.platform === "youtube"
                                  ? <Youtube className="h-3 w-3 text-red-500" />
                                  : <Instagram className="h-3 w-3 text-pink-500" />
                                }
                                {formatFollowers(inf?.profile?.followers || 0)}フォロワー
                              </span>
                              <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-md">
                                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                {inf?.rating_avg ? inf.rating_avg.toFixed(1) : "—"}
                              </span>
                              <span className="text-muted-foreground">応募: {new Date(a.applied_at).toLocaleDateString("ja-JP")}</span>
                            </div>

                            {/* 応募コメント */}
                            {a.comment && (
                              <p className="text-[11px] text-muted-foreground bg-white border border-border/60 rounded-lg px-3 py-2 leading-relaxed mb-2">
                                &ldquo;{a.comment}&rdquo;
                              </p>
                            )}
                            <Link
                              href={`/admin/influencers/${inf?.id}`}
                              className="inline-block text-[11px] text-violet-600 hover:text-violet-800 font-semibold transition-colors"
                            >
                              プロフィールを見る →
                            </Link>
                          </div>
                        </div>

                        {/* アクションボタン */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 self-end sm:self-start w-full sm:w-auto mt-4 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/messages?id=${inf?.id}`)}
                            className="h-8 text-[11px] gap-1.5 flex-1 sm:flex-none w-full sm:min-w-[100px]"
                          >
                            <Send className="h-3 w-3" />
                            メッセージ
                          </Button>

                          <div className="flex gap-2 w-full">
                            <Button
                              size="sm"
                              onClick={() => openModal(a.id, "pass")}
                              className={`h-8 text-[11px] gap-1 flex-1 shadow-none ${
                                verdict === "pass"
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              採用
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openModal(a.id, "fail")}
                              className={`h-8 text-[11px] gap-1 flex-1 shadow-none ${
                                verdict === "fail"
                                  ? "bg-red-500 hover:bg-red-600 text-white"
                                  : "bg-red-50 hover:bg-red-100 text-red-500 border border-red-200"
                              }`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              見送り
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---- ステータス変更確認モーダル ---- */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setStatusModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${statusColors[statusModal].split(" ")[0]}`}>
              <span className="text-2xl font-bold" style={{ color: "inherit" }}>
                {statusModal === "募集中" ? "📢" : statusModal === "進行中" ? "🔄" : "✅"}
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900 mb-1">ステータスを変更しますか？</h3>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{campaign.status}</span>
                {" → "}
                <span className={`font-semibold px-1.5 py-0.5 rounded text-xs ${statusColors[statusModal]}`}>{statusModal}</span>
                {" に変更します。"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-10 text-sm" onClick={() => setStatusModal(null)} disabled={savingStatus}>
                キャンセル
              </Button>
              <Button className="flex-1 h-10 text-sm bg-violet-600 hover:bg-violet-700 text-white" onClick={confirmStatusChange} disabled={savingStatus}>
                {savingStatus ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "変更する"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---- 合否確認モーダル ---- */}
      {modal && (() => {
        const applicant = applications.find((a) => a.id === modal.id)!;
        const isPass = modal.verdict === "pass";
        const isToggle = verdicts[modal.id] === modal.verdict;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${isPass ? "bg-emerald-100" : "bg-red-100"}`}>
                {isPass
                  ? <ThumbsUp className="h-7 w-7 text-emerald-600" />
                  : <ThumbsDown className="h-7 w-7 text-red-500" />
                }
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {isToggle ? "判定を取り消しますか？" : `${isPass ? "採用" : "見送り"}にしますか？`}
                </h3>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">{applicant.influencer?.name || "インフルエンサー"}</span>
                  {isToggle
                    ? ` の${isPass ? "採用" : "見送り"}判定を取り消します。`
                    : isPass
                    ? " をこの案件の採用者に設定します。"
                    : " をこの案件の選考から外します。"
                  }
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-10 text-sm" onClick={closeModal}>
                  キャンセル
                </Button>
                <Button
                  className={`flex-1 h-10 text-sm text-white ${
                    isToggle
                      ? "bg-gray-500 hover:bg-gray-600"
                      : isPass
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  onClick={confirmVerdict}
                >
                  {isToggle ? "取り消す" : isPass ? "採用にする" : "見送りにする"}
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
