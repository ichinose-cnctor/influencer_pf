"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ---- 全案件データマップ ----
const campaignDataMap: Record<string, {
  id: string; title: string; client: string; clientLogo: string; clientLogoColor: string;
  status: string; statusColor: string; category: string; deadline: string; createdAt: string;
  budget: number; platform: string; description: string; slots: number;
  rewardStyle: "gifting" | "paid"; publishStart: string; publishEnd: string; startDate: string; endDate: string; area: string; country: string;
  deliverables: { label: string; count: number; done: boolean }[];
  influencer: { name: string; handle: string; initials: string; avatarColor: string; followers: number; engagementRate: number; rating: number; location: string; platform: string };
  milestones: { label: string; date: string; done: boolean }[];
}> = {
  "1": {
    id: "1", title: "高級旅館 宿泊体験 PR キャンペーン",
    client: "和の宿 花水月", clientLogo: "花", clientLogoColor: "from-pink-400 to-rose-500",
    status: "進行中", statusColor: "bg-blue-100 text-blue-700",
    category: "ホテル＆宿泊", deadline: "2025-08-31", createdAt: "2025-07-01",
    budget: 380000, platform: "instagram", slots: 3,
    rewardStyle: "paid", publishStart: "2025-07-01", publishEnd: "2025-09-30", startDate: "2025-07-01", endDate: "2025-08-31", area: "関東", country: "日本",
    description: "創業100年を超える老舗旅館の宿泊体験をInstagramでPRしていただきます。温泉・懐石料理・客室などの魅力を伝える投稿をお願いします。ターゲットは30〜50代の旅行好きな方々です。",
    deliverables: [
      { label: "宿泊レポート投稿", count: 1, done: true },
      { label: "ストーリーズ（チェックイン〜チェックアウト）", count: 5, done: false },
      { label: "リール動画（ダイジェスト）", count: 1, done: false },
    ],
    influencer: { name: "山田 花子", handle: "@hanako_travel", initials: "山", avatarColor: "from-pink-400 to-rose-400", followers: 128000, engagementRate: 4.8, rating: 4.9, location: "東京都", platform: "instagram" },
    milestones: [
      { label: "契約締結", date: "2025-07-01", done: true },
      { label: "宿泊日程確定", date: "2025-07-10", done: true },
      { label: "宿泊・撮影", date: "2025-07-25", done: true },
      { label: "フィード投稿", date: "2025-08-05", done: true },
      { label: "リール公開", date: "2025-08-20", done: false },
      { label: "最終報告・支払い", date: "2025-08-31", done: false },
    ],
  },
  "2": {
    id: "2", title: "新オープン レストラン インスタ投稿",
    client: "TRATTORIA VINO", clientLogo: "V", clientLogoColor: "from-orange-400 to-red-500",
    status: "募集中", statusColor: "bg-amber-100 text-amber-700",
    category: "飲食店", deadline: "2025-09-15", createdAt: "2025-08-01",
    budget: 150000, platform: "instagram", slots: 5,
    rewardStyle: "paid", publishStart: "2025-08-01", publishEnd: "2025-10-15", startDate: "2025-08-01", endDate: "2025-09-15", area: "関西", country: "日本",
    description: "今秋グランドオープンするイタリアンレストランのPRです。シェフのこだわり料理・店内の雰囲気・ワインセレクションを中心に、食欲をそそる投稿をお願いします。グルメ・食系アカウントの方を優先します。",
    deliverables: [
      { label: "ディナーレポート投稿", count: 1, done: false },
      { label: "ストーリーズ", count: 3, done: false },
    ],
    influencer: { name: "佐藤 めぐみ", handle: "@megumi_gourmet", initials: "佐", avatarColor: "from-orange-400 to-amber-300", followers: 95000, engagementRate: 5.5, rating: 4.6, location: "大阪府", platform: "instagram" },
    milestones: [
      { label: "契約締結", date: "2025-08-10", done: false },
      { label: "試食会・撮影", date: "2025-08-25", done: false },
      { label: "投稿公開", date: "2025-09-05", done: false },
      { label: "最終報告・支払い", date: "2025-09-15", done: false },
    ],
  },
  "3": {
    id: "3", title: "地方体験ツアー 動画レビュー",
    client: "FitLife App", clientLogo: "F", clientLogoColor: "from-emerald-400 to-teal-500",
    status: "完了", statusColor: "bg-emerald-100 text-emerald-700",
    category: "体験＆ツアー", deadline: "2025-07-20", createdAt: "2025-06-01",
    budget: 220000, platform: "youtube", slots: 2,
    rewardStyle: "paid", publishStart: "2025-06-01", publishEnd: "2025-08-20", startDate: "2025-06-01", endDate: "2025-07-20", area: "全国", country: "日本",
    description: "地方の自然・文化を体験できるツアーのYouTube動画レビューです。農業体験・伝統工芸・地元グルメなど、都市部ではできない体験を魅力的に伝えていただきます。",
    deliverables: [
      { label: "YouTube動画（10分以上）", count: 1, done: true },
      { label: "ショート動画", count: 2, done: true },
      { label: "概要欄リンク掲載", count: 1, done: true },
    ],
    influencer: { name: "田中 けんじ", handle: "@kenji_adventure", initials: "田", avatarColor: "from-emerald-400 to-teal-300", followers: 210000, engagementRate: 4.2, rating: 4.8, location: "東京都", platform: "youtube" },
    milestones: [
      { label: "契約締結", date: "2025-06-01", done: true },
      { label: "ツアー参加・撮影", date: "2025-06-20", done: true },
      { label: "動画編集・提出", date: "2025-07-05", done: true },
      { label: "YouTube公開", date: "2025-07-15", done: true },
      { label: "最終報告・支払い", date: "2025-07-20", done: true },
    ],
  },
  "4": {
    id: "4", title: "オーガニックカフェ SNS 企画",
    client: "GreenEats Japan", clientLogo: "G", clientLogoColor: "from-lime-400 to-green-500",
    status: "進行中", statusColor: "bg-blue-100 text-blue-700",
    category: "飲食店", deadline: "2025-09-01", createdAt: "2025-07-15",
    budget: 95000, platform: "instagram", slots: 4,
    rewardStyle: "gifting", publishStart: "2025-07-15", publishEnd: "2025-10-01", startDate: "2025-07-15", endDate: "2025-09-01", area: "関東", country: "日本",
    description: "オーガニック素材にこだわったカフェのSNSプロモーションです。ヘルシーなメニュー・居心地の良い空間・サステナブルな取り組みを発信していただきます。健康・ライフスタイル系アカウントの方歓迎です。",
    deliverables: [
      { label: "カフェレポート投稿", count: 1, done: true },
      { label: "ストーリーズ", count: 3, done: false },
    ],
    influencer: { name: "鈴木 あおい", handle: "@aoi_healthy", initials: "鈴", avatarColor: "from-lime-400 to-green-300", followers: 67000, engagementRate: 6.1, rating: 4.5, location: "東京都", platform: "instagram" },
    milestones: [
      { label: "契約締結", date: "2025-07-15", done: true },
      { label: "来店・撮影", date: "2025-07-28", done: true },
      { label: "投稿公開", date: "2025-08-10", done: false },
      { label: "最終報告・支払い", date: "2025-09-01", done: false },
    ],
  },
  "5": {
    id: "5", title: "冒険ツアー TikTok PR",
    client: "TravelMate", clientLogo: "T", clientLogoColor: "from-violet-400 to-purple-500",
    status: "募集中", statusColor: "bg-amber-100 text-amber-700",
    category: "体験＆ツアー", deadline: "2025-10-01", createdAt: "2025-08-15",
    budget: 200000, platform: "tiktok", slots: 6,
    rewardStyle: "paid", publishStart: "2025-08-15", publishEnd: "2025-11-01", startDate: "2025-08-15", endDate: "2025-10-01", area: "北海道・東北", country: "日本",
    description: "カヤック・クライミング・ジップラインなどのアクティビティ体験ツアーのTikTok PRです。スリルと達成感を動画で表現していただきます。アウトドア・旅行系インフルエンサー歓迎です。",
    deliverables: [
      { label: "TikTok動画（60秒）", count: 2, done: false },
      { label: "TikTokライブ（任意）", count: 1, done: false },
    ],
    influencer: { name: "中村 りょう", handle: "@ryo_outdoor", initials: "中", avatarColor: "from-violet-400 to-purple-300", followers: 180000, engagementRate: 4.9, rating: 4.7, location: "北海道", platform: "tiktok" },
    milestones: [
      { label: "契約締結", date: "2025-08-20", done: false },
      { label: "ツアー参加・撮影", date: "2025-09-05", done: false },
      { label: "動画公開", date: "2025-09-20", done: false },
      { label: "最終報告・支払い", date: "2025-10-01", done: false },
    ],
  },
  "6": {
    id: "6", title: "グランピング体験 YouTube レビュー",
    client: "DeskSetup Pro", clientLogo: "D", clientLogoColor: "from-orange-400 to-amber-500",
    status: "募集中", statusColor: "bg-amber-100 text-amber-700",
    category: "体験＆ツアー", deadline: "2025-10-15", createdAt: "2025-08-20",
    budget: 120000, platform: "youtube", slots: 3,
    rewardStyle: "gifting", publishStart: "2025-08-20", publishEnd: "2025-11-15", startDate: "2025-08-20", endDate: "2025-10-15", area: "関東", country: "日本",
    description: "都市近郊のグランピング施設のYouTubeレビューです。設備・食事・自然環境などを丁寧に紹介していただきます。ファミリー・カップル向けのコンテンツを歓迎します。",
    deliverables: [
      { label: "YouTube動画（8分以上）", count: 1, done: false },
      { label: "サムネイル提供", count: 1, done: false },
    ],
    influencer: { name: "伊藤 ゆうき", handle: "@yuki_camp", initials: "伊", avatarColor: "from-orange-400 to-amber-300", followers: 88000, engagementRate: 5.0, rating: 4.4, location: "神奈川県", platform: "youtube" },
    milestones: [
      { label: "契約締結", date: "2025-09-01", done: false },
      { label: "宿泊・撮影", date: "2025-09-20", done: false },
      { label: "動画公開", date: "2025-10-05", done: false },
      { label: "最終報告・支払い", date: "2025-10-15", done: false },
    ],
  },
  "7": {
    id: "7", title: "こだわり居酒屋 SNS キャンペーン",
    client: "PawLife Japan", clientLogo: "居", clientLogoColor: "from-yellow-400 to-orange-500",
    status: "募集中", statusColor: "bg-amber-100 text-amber-700",
    category: "飲食店", deadline: "2025-11-01", createdAt: "2025-09-01",
    budget: 85000, platform: "instagram", slots: 4,
    rewardStyle: "gifting", publishStart: "2025-09-01", publishEnd: "2025-12-01", startDate: "2025-09-01", endDate: "2025-11-01", area: "九州・沖縄", country: "日本",
    description: "地元の食材にこだわった創作居酒屋のInstagram・X投稿PRです。旬の一品料理・日本酒セレクション・温かい雰囲気を伝えていただきます。グルメ系・食べ歩き系アカウント歓迎です。",
    deliverables: [
      { label: "Instagram投稿", count: 1, done: false },
      { label: "X（Twitter）投稿", count: 2, done: false },
    ],
    influencer: { name: "山口 たろう", handle: "@taro_izakaya", initials: "山", avatarColor: "from-yellow-400 to-orange-300", followers: 42000, engagementRate: 7.2, rating: 4.3, location: "福岡県", platform: "instagram" },
    milestones: [
      { label: "契約締結", date: "2025-09-15", done: false },
      { label: "来店・撮影", date: "2025-10-01", done: false },
      { label: "投稿公開", date: "2025-10-20", done: false },
      { label: "最終報告・支払い", date: "2025-11-01", done: false },
    ],
  },
  "8": {
    id: "8", title: "デザインホテル インフルエンサー PR",
    client: "LinguaBoost", clientLogo: "H", clientLogoColor: "from-cyan-400 to-sky-500",
    status: "募集中", statusColor: "bg-amber-100 text-amber-700",
    category: "ホテル＆宿泊", deadline: "2025-10-20", createdAt: "2025-09-05",
    budget: 180000, platform: "instagram", slots: 5,
    rewardStyle: "paid", publishStart: "2025-09-05", publishEnd: "2025-11-20", startDate: "2025-09-05", endDate: "2025-10-20", area: "関東", country: "日本",
    description: "アートとデザインをコンセプトにしたブティックホテルのインフルエンサーPRです。フォトジェニックな客室・ルーフトップバー・アート作品などを魅力的に発信していただきます。",
    deliverables: [
      { label: "宿泊レポート投稿", count: 2, done: false },
      { label: "ストーリーズ", count: 5, done: false },
      { label: "リール動画", count: 1, done: false },
    ],
    influencer: { name: "小林 なな", handle: "@nana_hotel", initials: "小", avatarColor: "from-cyan-400 to-sky-300", followers: 155000, engagementRate: 4.6, rating: 4.8, location: "東京都", platform: "instagram" },
    milestones: [
      { label: "契約締結", date: "2025-09-10", done: false },
      { label: "宿泊日程確定", date: "2025-09-20", done: false },
      { label: "宿泊・撮影", date: "2025-10-01", done: false },
      { label: "投稿公開", date: "2025-10-10", done: false },
      { label: "最終報告・支払い", date: "2025-10-20", done: false },
    ],
  },
};

const applicantsData = [
  {
    id: 1,
    name: "山田 花子",
    handle: "@hanako_lifestyle",
    initials: "山",
    avatarColor: "from-pink-400 to-rose-400",
    followers: 128000,
    engagementRate: 4.8,
    rating: 4.9,
    platform: "instagram",
    appliedAt: "2025/08/01",
    comment: "旅行・ホテル・宿泊体験の発信が得意です。丁寧なレポートでフォロワーへ魅力を伝えます！",
  },
  {
    id: 2,
    name: "鈴木 健太",
    handle: "@kenta_fitness",
    initials: "鈴",
    avatarColor: "from-sky-400 to-blue-500",
    followers: 342000,
    engagementRate: 6.2,
    rating: 4.7,
    platform: "youtube",
    appliedAt: "2025/08/02",
    comment: "体験型コンテンツに強みがあります。YouTube動画でリアルな体験をお届けできます。",
  },
  {
    id: 3,
    name: "佐藤 みのり",
    handle: "@minori_foodie",
    initials: "佐",
    avatarColor: "from-amber-400 to-orange-400",
    followers: 89000,
    engagementRate: 5.5,
    rating: 4.6,
    platform: "instagram",
    appliedAt: "2025/08/03",
    comment: "グルメ・飲食店レポートが専門です。食欲をそそる写真と口コミで訴求します！",
  },
  {
    id: 4,
    name: "中村 咲",
    handle: "@saki_travel",
    initials: "中",
    avatarColor: "from-violet-400 to-purple-500",
    followers: 215000,
    engagementRate: 3.9,
    rating: 4.5,
    platform: "instagram",
    appliedAt: "2025/08/04",
    comment: "旅行・宿泊系の発信が中心ですが、食×旅コンテンツも好評です。ぜひ参加させてください。",
  },
  {
    id: 5,
    name: "田中 ゆい",
    handle: "@yui_beauty",
    initials: "田",
    avatarColor: "from-fuchsia-400 to-pink-500",
    followers: 560000,
    engagementRate: 7.1,
    rating: 5.0,
    platform: "youtube",
    appliedAt: "2025/08/05",
    comment: "グルメ特化のYouTuberです。新店舗レポートに豊富な実績があります。ぜひご一緒しましょう！",
  },
];

// 案件ごとのステータスと定員マップ（ページ一覧データと一致させる）
const campaignStatusMap: Record<string, { status: string; slots: number }> = {
  "1": { status: "進行中", slots: 3 },
  "2": { status: "募集中", slots: 5 },
  "3": { status: "完了",   slots: 2 },
  "4": { status: "進行中", slots: 4 },
  "5": { status: "募集中", slots: 6 },
  "6": { status: "募集中", slots: 3 },
  "7": { status: "募集中", slots: 4 },
  "8": { status: "募集中", slots: 5 },
};
// campaignDataMap は下部に定義

type Verdict = "pending" | "pass" | "fail";
type Tab = "概要" | "応募者";

function formatFollowers(n: number): string {
  return `${(n / 10000).toFixed(1)}万`;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as Tab) ?? "概要";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const campaignId = String(params.id);
  const campaignData = campaignDataMap[campaignId] ?? campaignDataMap["1"];
  const campaignMeta = campaignStatusMap[campaignId] ?? { status: campaignData.status, slots: campaignData.slots };
  const isConfirmed = campaignMeta.status === "進行中" || campaignMeta.status === "完了";

  // 確定済みキャンペーンは slots 数だけ採用、残りは不採用として初期化
  const initialVerdicts: Record<number, Verdict> = isConfirmed
    ? Object.fromEntries(
        applicantsData.map((a, i) => [a.id, i < campaignMeta.slots ? "pass" : "fail"])
      )
    : Object.fromEntries(applicantsData.map((a) => [a.id, "pending"]));

  const [verdicts, setVerdicts] = useState<Record<number, Verdict>>(initialVerdicts);
  const [modal, setModal] = useState<{ id: number; verdict: "pass" | "fail" } | null>(null);

  const statusSteps = ["募集中", "進行中", "完了"] as const;
  const statusColors: Record<string, string> = {
    "募集中": "bg-amber-100 text-amber-700",
    "進行中": "bg-blue-100 text-blue-700",
    "完了": "bg-emerald-100 text-emerald-700",
  };
  const storageKey = `campaign-status-${campaignId}`;
  const savedStatus = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
  const [currentStatus, setCurrentStatus] = useState(savedStatus ?? campaignMeta.status);

  const [statusModal, setStatusModal] = useState<string | null>(null);

  const handleStatusChange = (status: string) => {
    if (status === currentStatus) return;
    setStatusModal(status);
  };

  const confirmStatusChange = () => {
    if (!statusModal) return;
    setCurrentStatus(statusModal);
    localStorage.setItem(storageKey, statusModal);
    setStatusModal(null);
  };

  const openModal = (id: number, v: "pass" | "fail") => setModal({ id, verdict: v });
  const closeModal = () => setModal(null);
  const confirmVerdict = () => {
    if (!modal) return;
    setVerdicts((prev) => ({
      ...prev,
      [modal.id]: prev[modal.id] === modal.verdict ? "pending" : modal.verdict,
    }));
    closeModal();
  };

  const tabs: Tab[] = ["概要", "応募者"];
  const passCount = Object.values(verdicts).filter((v) => v === "pass").length;
  const failCount = Object.values(verdicts).filter((v) => v === "fail").length;

  return (
    <div className="space-y-5 max-w-5xl">
      {/* パンくず & 戻るボタン */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/admin/campaigns" className="hover:text-foreground transition-colors">プロジェクト一覧</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{campaignData.title}</span>
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
              <h2 className="text-lg font-bold text-foreground">{campaignData.title}</h2>
              <Badge className={`text-[12px] lg:text-[10px] px-2 border-0 ${statusColors[currentStatus]}`}>
                {currentStatus}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 basis-full sm:basis-auto">
                <Building2 className="h-3 w-3" />
                {campaignData.client}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                期限: {campaignData.deadline}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {campaignData.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ステータス変更バー */}
      <div className="flex items-center gap-2 sm:gap-3 px-1 py-2 bg-muted/40 rounded-xl border border-border">
        <span className="text-xs text-muted-foreground shrink-0 pl-1">ステータス</span>
        <div className="flex items-center gap-1 flex-1">
          {statusSteps.map((step, i) => {
            const currentIdx = statusSteps.indexOf(currentStatus as typeof statusSteps[number]);
            const isDone = i < currentIdx;
            const isActive = i === currentIdx;
            return (
              <div key={step} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => handleStatusChange(step)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors border ${
                    isActive
                      ? `${statusColors[step]} border-transparent`
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
                  {applicantsData.length}
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
                {/* 報酬スタイル */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                    <Gift className="h-3.5 w-3.5" />
                    報酬スタイル
                  </span>
                  <Badge className={`border-0 text-[12px] lg:text-[10px] px-2 ${campaignData.rewardStyle === "gifting" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>
                    {campaignData.rewardStyle === "gifting" ? "ギフティング" : "有償"}
                  </Badge>
                </div>
                {/* 予算 */}
                {campaignData.rewardStyle === "paid" && (
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                      <Banknote className="h-3.5 w-3.5" />
                      予算
                    </span>
                    <span className="font-medium text-foreground">¥{campaignData.budget.toLocaleString()}</span>
                  </div>
                )}
                {/* 公開期間 */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                    公開期間
                  </span>
                  <span className="font-medium text-foreground">{campaignData.publishStart} 〜 {campaignData.publishEnd}</span>
                </div>
                {/* プロジェクト期間 */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                    プロジェクト期間
                  </span>
                  <span className="font-medium text-foreground">{campaignData.startDate} 〜 {campaignData.endDate}</span>
                </div>
                {/* カテゴリー */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                    <FileText className="h-3.5 w-3.5" />
                    カテゴリー
                  </span>
                  <span className="font-medium text-foreground">{campaignData.category}</span>
                </div>
                {/* エリア */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                    <MapPin className="h-3.5 w-3.5" />
                    エリア
                  </span>
                  <span className="font-medium text-foreground">{campaignData.area}</span>
                </div>
                {/* ターゲット国 */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                    <Globe className="h-3.5 w-3.5" />
                    ターゲット国
                  </span>
                  <span className="font-medium text-foreground">{campaignData.country}</span>
                </div>
              </CardContent>
            </Card>

            {/* 案件説明 */}
            <Card className="border border-border shadow-none">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-sm font-semibold">案件説明</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{campaignData.description}</p>
              </CardContent>
            </Card>
        </div>
      )}

      {/* ---- 応募者タブ ---- */}
      {activeTab === "応募者" && (
        <div className="space-y-4">
          {/* サマリーバー */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 bg-violet-50 text-violet-700 px-3 py-1.5 rounded-lg">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">定員 <span className="font-bold">{campaignMeta.slots}</span> 名</span>
            </div>
            <span className="text-muted-foreground text-xs">のうち</span>
            <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">応募 <span className="font-bold">{applicantsData.length}</span> 名</span>
            </div>
            <span className="text-muted-foreground text-xs">/</span>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-xs">採用{isConfirmed ? "確定" : ""} <span className="font-bold">{passCount}</span> 名</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg">
              <ThumbsDown className="h-3.5 w-3.5" />
              <span className="text-xs">不採用{isConfirmed ? "確定" : ""} <span className="font-bold">{failCount}</span> 名</span>
            </div>
            {isConfirmed && (
              <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                選考確定済み
              </span>
            )}
          </div>

          {/* 応募者カード一覧 */}
          <div className="space-y-3">
            {applicantsData.map((a) => {
              const verdict = verdicts[a.id];
              return (
                <Card
                  key={a.id}
                  className={`border shadow-none transition-colors ${
                    verdict === "pass"
                      ? "border-emerald-300 bg-emerald-50/50"
                      : verdict === "fail"
                      ? "border-red-200 bg-red-50/40"
                      : "border-border"
                  }`}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* アバター */}
                      <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br ${a.avatarColor} flex items-center justify-center text-white text-base sm:text-lg font-bold shrink-0`}>
                        {a.initials}
                      </div>

                      {/* メイン情報 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-sm font-semibold text-foreground">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.handle}</p>
                          {verdict === "pass" && (
                            <span className="flex items-center gap-0.5 text-sm lg:text-[11px] font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3" /> 採用
                            </span>
                          )}
                          {verdict === "fail" && (
                            <span className="flex items-center gap-0.5 text-sm lg:text-[11px] font-semibold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                              <ThumbsDown className="h-3 w-3" /> 不採用
                            </span>
                          )}
                        </div>

                        {/* スタッツ */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            {a.platform === "youtube"
                              ? <Youtube className="h-3 w-3 text-red-500" />
                              : <Instagram className="h-3 w-3 text-pink-500" />
                            }
                            {(a.followers / 10000).toFixed(1)}万フォロワー
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            {a.rating}
                          </span>
                          <span className="text-sm lg:text-[11px] text-muted-foreground">応募日: {a.appliedAt}</span>
                        </div>

                        {/* 応募コメント */}
                        <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed">
                          &ldquo;{a.comment}&rdquo;
                        </p>
                        <Link
                          href={`/admin/influencers/${a.id}`}
                          className="inline-block text-sm lg:text-[11px] text-violet-600 hover:underline font-medium"
                        >
                          詳細を見る →
                        </Link>
                      </div>
                      </div>

                      {/* アクションボタン */}
                      <div className="flex sm:flex-col items-end gap-2 shrink-0 self-end sm:self-start">
                        {/* メッセージボタン */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/messages?id=${a.id}`)}
                          className="h-8 text-xs gap-1.5"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">メッセージ</span>
                        </Button>

                        {/* 合否ボタン */}
                        <div className="flex sm:flex-col gap-2 items-end">
                          {isConfirmed ? (
                            /* 確定表示（編集不可） */
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              verdict === "pass"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              {verdict === "pass"
                                ? <><CheckCircle2 className="h-3.5 w-3.5" /> 採用確定</>
                                : <><ThumbsDown className="h-3.5 w-3.5" /> 不採用確定</>
                              }
                            </div>
                          ) : (
                            /* 選択可能ボタン */
                            <>
                              <Button
                                size="sm"
                                onClick={() => openModal(a.id, "pass")}
                                className={`h-8 text-xs gap-1.5 ${
                                  verdict === "pass"
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                採用
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => openModal(a.id, "fail")}
                                className={`h-8 text-xs gap-1.5 ${
                                  verdict === "fail"
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-red-50 hover:bg-red-100 text-red-500 border border-red-200"
                                }`}
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                                不採用
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
                <span className="font-semibold text-gray-800">{currentStatus}</span>
                {" → "}
                <span className={`font-semibold px-1.5 py-0.5 rounded text-xs ${statusColors[statusModal]}`}>{statusModal}</span>
                {" に変更します。"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-10 text-sm" onClick={() => setStatusModal(null)}>
                キャンセル
              </Button>
              <Button className="flex-1 h-10 text-sm bg-violet-600 hover:bg-violet-700 text-white" onClick={confirmStatusChange}>
                変更する
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---- 確認モーダル ---- */}
      {modal && (() => {
        const applicant = applicantsData.find((a) => a.id === modal.id)!;
        const isPass = modal.verdict === "pass";
        const isToggle = verdicts[modal.id] === modal.verdict;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* オーバーレイ */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

            {/* モーダル本体 */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">
              {/* アイコン */}
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${isPass ? "bg-emerald-100" : "bg-red-100"}`}>
                {isPass
                  ? <ThumbsUp className="h-7 w-7 text-emerald-600" />
                  : <ThumbsDown className="h-7 w-7 text-red-500" />
                }
              </div>

              {/* テキスト */}
              <div className="text-center">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {isToggle ? "判定を取り消しますか？" : `${isPass ? "採用" : "不採用"}にしますか？`}
                </h3>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">{applicant.name}</span>
                  {isToggle
                    ? ` の${isPass ? "採用" : "不採用"}判定を取り消します。`
                    : isPass
                    ? " をこの案件の採用者に設定します。"
                    : " をこの案件の不採用者に設定します。"
                  }
                </p>
              </div>

              {/* ボタン */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-sm"
                  onClick={closeModal}
                >
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
                  {isToggle ? "取り消す" : isPass ? "採用にする" : "不採用にする"}
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
