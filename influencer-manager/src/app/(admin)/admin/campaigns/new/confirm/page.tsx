"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---- ステップ定義 ----
const steps = [
  { label: "プロジェクトについて", sub: "詳細を編集", href: "/admin/campaigns/new", done: true },
  { label: "クリエイターの希望条件", sub: "詳細を編集", href: "/admin/campaigns/new/requirements", done: true },
  { label: "入力内容を確認", sub: null, href: "/admin/campaigns/new/confirm", done: false, active: true },
];

interface Step1Data {
  title: string;
  rewardStyle: "gifting" | "paid";
  minBudget: string;
  maxBudget: string;
  publishStart?: string;
  publishEnd?: string;
  startDate?: string;
  endDate?: string;
  period: string;
  genre: string;
  area: string;
  country: string;
  description: string;
  videoUrl: string;
  uploadedFileNames: string[];
}

interface Step2Data {
  platform: string;
  headcount: string;
  follower: string;
  skills: string[];
  languages: string[];
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 border-b border-border last:border-0">
      <span className="w-36 shrink-0 text-xs text-muted-foreground pt-0.5">{label}</span>
      <span className="text-sm text-foreground flex-1">{value || <span className="text-muted-foreground">—</span>}</span>
    </div>
  );
}

export default function ConfirmPage() {
  const router = useRouter();
  const [step1, setStep1] = useState<Step1Data | null>(null);
  const [step2, setStep2] = useState<Step2Data | null>(null);

  useEffect(() => {
    const s1 = sessionStorage.getItem("campaign-step1");
    const s2 = sessionStorage.getItem("campaign-step2");
    if (s1) setStep1(JSON.parse(s1));
    if (s2) setStep2(JSON.parse(s2));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    if (!step1) return;
    setIsSubmitting(true);
    try {
      await import("@/lib/api").then(({ campaignApi }) => 
        campaignApi.create({
          title: step1.title,
          description: step1.description,
          category: step1.genre, // Mapping genre -> category
          area: step1.area,
          country: step1.country,
          reward_style: step1.rewardStyle,
          min_budget: step1.minBudget ? parseInt(step1.minBudget, 10) : 0,
          max_budget: step1.maxBudget ? parseInt(step1.maxBudget, 10) : 0,
          publish_start: step1.publishStart || null,
          publish_end: step1.publishEnd || null,
          start_date: step1.startDate || null,
          end_date: step1.endDate || null,
          video_url: step1.videoUrl,
          platform: step2?.platform || null,
          headcount: step2?.headcount || null,
          min_followers: step2?.follower || null,
          required_skills: step2?.skills || [],
          required_languages: step2?.languages || [],
          status: "募集中",
        })
      );
      sessionStorage.removeItem("campaign-step1");
      sessionStorage.removeItem("campaign-step2");
      router.push("/admin/campaigns");
    } catch (err) {
      console.error(err);
      alert("案件の保存に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 w-full">
      {/* ステップインジケーター（横） */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold",
                step.active || step.done ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </div>
              <div>
                <p className={cn(
                  "text-sm font-semibold leading-tight",
                  step.active || step.done ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                {step.sub && (
                  <button
                    onClick={() => step.done && router.push(step.href)}
                    className="text-xs text-violet-500 hover:underline cursor-pointer leading-snug"
                  >
                    {step.sub}
                  </button>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-4 h-px bg-border" />
            )}
          </div>
        ))}
      </div>

      {/* 確認内容 */}
      <div className="space-y-6 pb-28">
        <h2 className="text-2xl font-bold text-foreground">入力内容を確認してください</h2>

        {/* プロジェクトについて */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border">
            <p className="text-sm font-semibold text-foreground">プロジェクトについて</p>
            <button
              onClick={() => router.push("/admin/campaigns/new")}
              className="text-xs text-violet-500 hover:underline"
            >
              編集する
            </button>
          </div>
          <div className="px-5">
            <Row label="案件名" value={step1?.title} />
            <Row
              label="報酬スタイル"
              value={step1?.rewardStyle === "gifting" ? "ギフティング" : "有償"}
            />
            {step1?.rewardStyle === "paid" && (
              <>
                <Row label="最小固定予算" value={step1.minBudget ? `¥${Number(step1.minBudget).toLocaleString()}` : undefined} />
                <Row label="最大固定予算" value={step1.maxBudget ? `¥${Number(step1.maxBudget).toLocaleString()}` : undefined} />
              </>
            )}
            <Row label="プロジェクト期間" value={step1?.period} />
            <Row label="カテゴリー" value={step1?.genre} />
            <Row label="エリア" value={step1?.area} />
            <Row label="ターゲット国" value={step1?.country} />
            <Row
              label="プロジェクト説明"
              value={
                step1?.description
                  ? <span className="whitespace-pre-wrap">{step1.description}</span>
                  : undefined
              }
            />
            <Row label="動画URL" value={step1?.videoUrl} />
            <Row
              label="添付ファイル"
              value={
                step1?.uploadedFileNames?.length
                  ? step1.uploadedFileNames.join("、")
                  : undefined
              }
            />
          </div>
        </div>

        {/* クリエイターの希望条件 */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border">
            <p className="text-sm font-semibold text-foreground">クリエイターの希望条件</p>
            <button
              onClick={() => router.push("/admin/campaigns/new/requirements")}
              className="text-xs text-violet-500 hover:underline"
            >
              編集する
            </button>
          </div>
          <div className="px-5">
            <Row label="プラットフォーム" value={step2?.platform} />
            <Row label="採用予定人数" value={step2?.headcount} />
            <Row label="フォロワー数" value={step2?.follower} />
            <Row label="必要なスキル" value={step2?.skills?.join("、")} />
            <Row label="対応言語" value={step2?.languages?.join("、")} />
          </div>
        </div>

        {/* フッター */}
        <div className="fixed bottom-0 left-0 lg:left-60 right-0 bg-background/90 backdrop-blur-sm border-t border-border px-4 sm:px-8 py-4 flex items-center justify-between z-20">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/campaigns/new/requirements")}
            className="gap-1.5 h-11 px-6 text-sm font-semibold rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
            戻る
          </Button>
          <Button
            onClick={handlePublish}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 h-11 text-sm font-semibold gap-2 rounded-full"
          >
            公開する
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
