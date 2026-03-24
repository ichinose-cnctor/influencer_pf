"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { label: "お知らせの内容", href: "/admin/announcements/new", done: true },
  { label: "確認・送信", href: "/admin/announcements/new/confirm", done: false, active: true },
];

const targetLabels: Record<string, string> = {
  all: "全インフルエンサー",
  active: "進行中の案件のみ",
};

interface AnnouncementData {
  editingId?: number | null;
  title: string;
  body: string;
  category: string;
  target: string;
  scheduleEnabled: boolean;
  publishDate: string;
  expiryEnabled: boolean;
  expiryDate: string;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 border-b border-border last:border-0">
      <span className="w-36 shrink-0 text-xs text-muted-foreground pt-0.5">{label}</span>
      <span className="text-sm text-foreground flex-1">{value || <span className="text-muted-foreground">—</span>}</span>
    </div>
  );
}

export default function AnnouncementConfirmPage() {
  const router = useRouter();
  const [data, setData] = useState<AnnouncementData | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("announcement-step1");
    if (saved) setData(JSON.parse(saved));
  }, []);

  const handlePublish = () => {
    if (data) {
      const existing: Record<string, unknown>[] = JSON.parse(localStorage.getItem("announcements") ?? "[]");
      if (data.editingId) {
        const updated = existing.map((a) =>
          a.id === data.editingId
            ? { ...a, title: data.title, body: data.body, category: data.category, target: data.target,
                publishDate: data.scheduleEnabled && data.publishDate ? data.publishDate : null,
                expiryDate: data.expiryEnabled && data.expiryDate ? data.expiryDate : null }
            : a
        );
        localStorage.setItem("announcements", JSON.stringify(updated));
      } else {
        const newItem = {
          id: Date.now(),
          title: data.title,
          body: data.body,
          category: data.category,
          target: data.target,
          publishDate: data.scheduleEnabled && data.publishDate ? data.publishDate : null,
          expiryDate: data.expiryEnabled && data.expiryDate ? data.expiryDate : null,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("announcements", JSON.stringify([newItem, ...existing]));
      }
    }
    sessionStorage.removeItem("announcement-step1");
    router.push("/admin/dashboard");
  };

  return (
    <div className="max-w-3xl space-y-8 w-full">
      {/* ステップインジケーター */}
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
                {step.done && !step.active && (
                  <button
                    onClick={() => router.push(step.href)}
                    className="text-xs text-violet-500 hover:underline cursor-pointer leading-snug"
                  >
                    詳細を編集
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

        {/* お知らせの内容 */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border">
            <p className="text-sm font-semibold text-foreground">お知らせの内容</p>
            <button
              onClick={() => router.push("/admin/announcements/new")}
              className="text-xs text-violet-500 hover:underline"
            >
              編集する
            </button>
          </div>
          <div className="px-5">
            <Row label="カテゴリ" value={data?.category} />
            <Row label="タイトル" value={data?.title} />
            <Row
              label="本文"
              value={
                data?.body
                  ? <span className="whitespace-pre-wrap">{data.body}</span>
                  : undefined
              }
            />
            <Row
              label="送信対象"
              value={data?.target ? targetLabels[data.target] : undefined}
            />
            <Row
              label="公開日時"
              value={
                data?.scheduleEnabled && data.publishDate
                  ? data.publishDate.replace("T", " ")
                  : data?.scheduleEnabled
                  ? "指定あり（未設定）"
                  : "即時公開"
              }
            />
            <Row
              label="公開期限"
              value={
                data?.expiryEnabled && data.expiryDate
                  ? data.expiryDate.replace("T", " ")
                  : data?.expiryEnabled
                  ? "設定あり（未設定）"
                  : "期限なし"
              }
            />
          </div>
        </div>

        {/* フッター */}
        <div className="fixed bottom-0 left-0 lg:left-60 right-0 bg-background/90 backdrop-blur-sm border-t border-border px-4 sm:px-8 py-4 flex items-center justify-between z-20">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/announcements/new")}
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
