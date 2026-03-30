"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Pencil, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { announcementApi } from "@/lib/api";
import { MarkdownPreview } from "@/components/MarkdownPreview";

const categoryColors: Record<string, string> = {
  お知らせ: "bg-sky-100 text-sky-700",
  重要: "bg-amber-100 text-amber-700",
  緊急: "bg-rose-100 text-rose-700",
  システム: "bg-slate-100 text-slate-700",
};

const targetLabels: Record<string, string> = {
  all: "全インフルエンサー",
  active: "進行中の案件のみ",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 border-b border-border last:border-0">
      <span className="w-36 shrink-0 text-xs text-muted-foreground pt-0.5">{label}</span>
      <span className="text-sm text-foreground flex-1">{value || <span className="text-muted-foreground">—</span>}</span>
    </div>
  );
}

export default function AnnouncementDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await announcementApi.get(Number(id));
        setAnnouncement(res);
      } catch (err) {
        console.error("Failed to fetch announcement details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = () => {
    if (announcement) {
      // API形式のデータをフォームが期待する形式（キャメルケース含む）にマッピングして保存
      const editingData = {
        editingId: announcement.id,
        title: announcement.title,
        body: announcement.body,
        category: announcement.category,
        target: announcement.target,
        publishDate: announcement.publish_start,
        expiryDate: announcement.publish_end,
      };
      sessionStorage.setItem("announcement-editing", JSON.stringify(editingData));
      router.push("/admin/announcements/new");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">読み込み中...</div>;
  }

  if (!announcement) {
    return (
      <div className="max-w-3xl py-20 text-center text-sm text-muted-foreground">
        お知らせが見つかりませんでした
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          戻る
        </button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleEdit}
          className="h-8 text-xs gap-1.5"
        >
          <Pencil className="h-3.5 w-3.5" />
          編集する
        </Button>
      </div>

      {/* タイトル・バッジ */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className={`text-sm lg:text-[11px] px-2 py-0.5 border-0 font-medium ${categoryColors[announcement.category] ?? "bg-slate-100 text-slate-700"}`}>
            {announcement.category}
          </Badge>
          <span className="text-xs text-muted-foreground">{targetLabels[announcement.target] ?? "全インフルエンサー"}</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground leading-tight">{announcement.title}</h2>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(announcement.created_at).toLocaleDateString("ja-JP", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </div>
      </div>

      {/* 詳細 */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 bg-muted/40 border-b border-border">
          <p className="text-sm font-semibold text-foreground">お知らせの詳細</p>
        </div>
        <div className="px-5 pb-2">
          <Row label="カテゴリ" value={announcement.category} />
          <Row label="送信対象" value={targetLabels[announcement.target] ?? "全インフルエンサー"} />
          <Row
            label="本文"
            value={<MarkdownPreview content={announcement.body} />}
          />
          <Row
            label="公開日時"
            value={announcement.publish_start ? announcement.publish_start.replace("T", " ") : "即時公開"}
          />
          <Row
            label="公開期限"
            value={announcement.publish_end ? announcement.publish_end.replace("T", " ") : "期限なし"}
          />
        </div>
      </div>
    </div>
  );
}
