"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Globe,
  FileText,
  BadgeJapaneseYen as Banknote,
  Users,
  Instagram,
  Youtube,
  Loader2,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { campaignApi, CampaignOut } from "@/lib/api";
import { MarkdownPreview } from "@/components/MarkdownPreview";

export default function InfluencerCampaignDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">読み込み中...</div>}>
      <CampaignDetailContent />
    </Suspense>
  );
}

function CampaignDetailContent() {
  const params = useParams();
  const router = useRouter();
  const campaignId = parseInt(params.id as string);

  const [campaign, setCampaign] = useState<CampaignOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) return;
      try {
        const data = await campaignApi.get(campaignId);
        setCampaign(data);
        // TODO: Check if already applied via an API endpoint if available
      } catch (err) {
        console.error("Failed to fetch campaign", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignId]);

  if (loading || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    "募集中": "bg-amber-100 text-amber-700",
    "進行中": "bg-blue-100 text-blue-700",
    "完了": "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* ナビゲーション */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/portal" className="hover:text-foreground transition-colors">ポータル</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium text-xs truncate max-w-[200px] md:max-w-none">{campaign.title}</span>
        </div>
        <Link href="/portal">
          <Button variant="ghost" size="sm" className="text-xs h-8 gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            一覧に戻る
          </Button>
        </Link>
      </div>

      {/* メインヘッダー */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className={`h-24 w-32 md:h-32 md:w-48 rounded-2xl bg-gradient-to-br ${campaign.image_gradient || "from-violet-500 to-purple-600"} shrink-0 flex items-center justify-center shadow-lg border border-white/20`}>
          <span className="text-4xl md:text-5xl font-black text-white/40 select-none">
            {campaign.client_logo || campaign.client_name?.substring(0, 1) || "P"}
          </span>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{campaign.title}</h1>
            <Badge className={`px-2.5 py-0.5 border-0 text-xs font-semibold ${statusColors[campaign.status]}`}>
              {campaign.status}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {campaign.client_name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              掲載終了: {campaign.publish_end ? new Date(campaign.publish_end).toLocaleDateString("ja-JP") : "未設定"}
            </span>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 rounded-xl" disabled={campaign.status !== "募集中" || applied}>
              {applied ? "応募済み" : campaign.status === "募集中" ? "この案件に応募する" : "募集終了"}
            </Button>
            <Button variant="outline" className="rounded-xl border-border">
              <MessageSquare className="h-4 w-4 mr-2" />
              問い合わせ
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左側: 詳細情報 */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border shadow-none rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-600" />
                案件概要
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <MarkdownPreview content={campaign.description || "説明文がありません。"} />
              </div>
            </CardContent>
          </Card>

          {/* 会社情報セクション - ユーザーからの重要リクエスト */}
          <Card className="border-border shadow-none rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-violet-600" />
                会社情報
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">会社名</p>
                  <p className="text-sm font-medium text-foreground">{campaign.client_name || "—"}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">所在地</p>
                  <p className="text-sm flex items-start gap-1.5 text-foreground">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                    {campaign.client_address || "—"}
                  </p>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Webサイト / SNS</p>
                  {campaign.client_website ? (
                    <a 
                      href={campaign.client_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-violet-600 hover:underline flex items-center gap-1.5"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {campaign.client_website}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">—</p>
                  )}
                </div>
                <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-border/50">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">事業内容</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {campaign.client_business_description || "事業内容の詳細情報は登録されていません。"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右側: 募集条件サマリー */}
        <div className="space-y-6">
          <Card className="border-border shadow-none rounded-2xl sticky top-20">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-base">募集条件サマリー</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Banknote className="h-4 w-4" />
                    報酬
                  </span>
                  <span className="font-bold text-foreground">
                    {campaign.reward_style === "paid" ? `¥${campaign.min_budget?.toLocaleString()} 〜 ¥${campaign.max_budget?.toLocaleString()}` : "ギフティング（現物支給）"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    募集人数
                  </span>
                  <span className="font-medium text-foreground">{campaign.headcount || "若干名"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    {campaign.platform === "Instagram" ? <Instagram className="h-4 w-4" /> : <Youtube className="h-4 w-4" />}
                    プラットフォーム
                  </span>
                  <Badge variant="secondary" className="font-medium">{campaign.platform || "Instagram"}</Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">必要なスキル</p>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.required_skills && campaign.required_skills.length > 0 ? (
                    campaign.required_skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-[10px] bg-slate-50">{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">特に指定なし</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">採用フォロワー層</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{campaign.min_followers || "全フォロワー層"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
