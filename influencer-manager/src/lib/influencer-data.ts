/* ─── インフルエンサー案件履歴データ（共有） ─── */

export type CampaignHistory = {
  id: number;
  title: string;
  client: string;
  category: string;
  platform: string;
  status: "完了" | "進行中" | "応募中";
  statusColor: string;
  period: string;
  reward: string;
  imageColor: string;
  campaignId?: number;
};

export const influencerCampaignHistory: Record<string, CampaignHistory[]> = {
  "1": [
    { id: 1, title: "高級旅館 宿泊体験 PR キャンペーン", client: "和の宿 花水月", category: "ホテル＆宿泊", platform: "Instagram", status: "完了", statusColor: "bg-emerald-100 text-emerald-700", period: "2025/07〜2025/08", reward: "¥380,000", imageColor: "from-pink-300 to-rose-400", campaignId: 1 },
  ],
  "2": [
    { id: 2, title: "地方体験ツアー 動画レビュー", client: "FitLife App", category: "体験＆ツアー", platform: "YouTube", status: "完了", statusColor: "bg-emerald-100 text-emerald-700", period: "2025/06〜2025/07", reward: "¥220,000", imageColor: "from-emerald-300 to-teal-400", campaignId: 3 },
    { id: 202, title: "冒険ツアー TikTok PR", client: "TravelMate", category: "体験＆ツアー", platform: "YouTube", status: "完了", statusColor: "bg-emerald-100 text-emerald-700", period: "2025/09〜2025/10", reward: "¥200,000", imageColor: "from-violet-300 to-purple-400", campaignId: 5 },
  ],
  "3": [
    { id: 4, title: "オーガニックカフェ SNS 企画", client: "GreenEats Japan", category: "飲食店", platform: "Instagram", status: "完了", statusColor: "bg-emerald-100 text-emerald-700", period: "2025/07〜2025/09", reward: "¥95,000", imageColor: "from-lime-300 to-green-400", campaignId: 4 },
    { id: 301, title: "新オープン レストラン インスタ投稿", client: "TRATTORIA VINO", category: "飲食店", platform: "Instagram", status: "完了", statusColor: "bg-emerald-100 text-emerald-700", period: "2025/08〜2025/09", reward: "¥150,000", imageColor: "from-sky-300 to-blue-400", campaignId: 2 },
  ],
  "4": [
    { id: 8, title: "デザインホテル インフルエンサー PR", client: "LinguaBoost", category: "ホテル＆宿泊", platform: "Instagram", status: "完了", statusColor: "bg-emerald-100 text-emerald-700", period: "2025/10〜2025/10", reward: "¥180,000", imageColor: "from-cyan-300 to-sky-400", campaignId: 8 },
  ],
  "5": [
    { id: 501, title: "新オープン レストラン インスタ投稿", client: "TRATTORIA VINO", category: "飲食店", platform: "YouTube", status: "完了", statusColor: "bg-emerald-100 text-emerald-700", period: "2025/08〜2025/09", reward: "¥150,000", imageColor: "from-sky-300 to-blue-400", campaignId: 2 },
  ],
  "6": [
    { id: 601, title: "グランピング体験 YouTube レビュー", client: "DeskSetup Pro", category: "体験＆ツアー", platform: "YouTube", status: "完了", statusColor: "bg-emerald-100 text-emerald-700", period: "2025/09〜2025/10", reward: "¥120,000", imageColor: "from-orange-300 to-amber-400", campaignId: 6 },
  ],
  "7": [
    { id: 1, title: "高級旅館 宿泊体験 PR キャンペーン", client: "和の宿 花水月", category: "ホテル＆宿泊", platform: "Instagram", status: "進行中", statusColor: "bg-blue-100 text-blue-700", period: "2025/07〜2025/08", reward: "¥380,000", imageColor: "from-pink-300 to-rose-400", campaignId: 1 },
    { id: 701, title: "デザインホテル インフルエンサー PR", client: "LinguaBoost", category: "ホテル＆宿泊", platform: "Instagram", status: "応募中", statusColor: "bg-amber-100 text-amber-700", period: "2025/10〜2025/10", reward: "¥180,000", imageColor: "from-cyan-300 to-sky-400", campaignId: 8 },
  ],
  "8": [
    { id: 801, title: "冒険ツアー TikTok PR", client: "TravelMate", category: "体験＆ツアー", platform: "YouTube", status: "完了", statusColor: "bg-emerald-100 text-emerald-700", period: "2025/09〜2025/10", reward: "¥200,000", imageColor: "from-violet-300 to-purple-400", campaignId: 5 },
  ],
};

/** 案件数（完了 + 進行中）を返す */
export function getCampaignCount(influencerId: number | string): number {
  const history = influencerCampaignHistory[String(influencerId)] ?? [];
  return history.filter((c) => c.status === "完了" || c.status === "進行中").length;
}
