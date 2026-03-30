"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  MoreHorizontal,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categoryOptions = ["お知らせ", "重要", "緊急", "システム"];

const steps = [
  { label: "お知らせの内容", active: true },
  { label: "確認・送信", active: false },
];

export default function NewAnnouncementPage() {
  const router = useRouter();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("お知らせ");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [publishDate, setPublishDate] = useState("");
  const [expiryEnabled, setExpiryEnabled] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [target, setTarget] = useState("all");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyStyle = (prefix: string, suffix: string = "") => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = before + prefix + selectedText + suffix + after;
    setBody(newText);

    // フォーカスを戻して選択範囲を調整
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  useEffect(() => {
    const editing = sessionStorage.getItem("announcement-editing");
    if (editing) {
      const data = JSON.parse(editing);
      setEditingId(data.id);
      setTitle(data.title ?? "");
      setBody(data.body ?? "");
      setCategory(data.category ?? "お知らせ");
      setTarget(data.target ?? "all");
      setScheduleEnabled(!!data.publishDate);
      setPublishDate(data.publishDate ?? "");
      setExpiryEnabled(!!data.expiryDate);
      setExpiryDate(data.expiryDate ?? "");
      sessionStorage.removeItem("announcement-editing");
    }
  }, []);

  const canSubmit = title.trim() !== "" && body.trim() !== "";

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("タイトルを入力してください");
      return;
    }
    if (!body.trim()) {
      alert("本文を入力してください");
      return;
    }
    sessionStorage.setItem("announcement-step1", JSON.stringify({
      editingId, title, body, category,
      scheduleEnabled, publishDate,
      expiryEnabled, expiryDate,
    }));
    router.push("/admin/announcements/new/confirm");
  };

  return (
    <div className="max-w-3xl space-y-8 w-full">
      {/* ステップインジケーター */}
      <div className="flex items-start gap-0 justify-center sm:justify-start">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start min-w-0">
            <div className="flex flex-col items-center gap-1 shrink-0 sm:flex-row sm:gap-2.5">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                step.active ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </div>
              <p className={cn(
                "text-[10px] sm:text-sm font-semibold leading-tight text-center sm:text-left",
                step.active ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className="w-8 sm:w-16 mx-1.5 sm:mx-4 h-px bg-border mt-3.5 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* フォーム本体 */}
      <div className="space-y-8 pb-24">

        {/* 見出し */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">どんなお知らせを送りますか？</h2>
        </div>

        {/* カテゴリ */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            カテゴリを選びましょう <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {categoryOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  category === c
                    ? "bg-violet-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* タイトル */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            タイトルをつけましょう <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="お知らせのタイトルを入力してください"
            className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background placeholder:text-muted-foreground"
          />
        </div>

        {/* 本文 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            本文を入力しましょう <span className="text-rose-500">*</span>
          </label>
          {/* ツールバー */}
          <div className="border border-border rounded-t-lg bg-muted/30 px-3 py-2 flex items-center gap-1 flex-wrap">
            {[
              { icon: Undo, label: "元に戻す" },
              { icon: Redo, label: "やり直し" },
            ].map(({ icon: Icon, label }) => (
              <button key={label} title={label} className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
            <select
              className="text-xs bg-transparent border-none outline-none text-muted-foreground cursor-pointer"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "見出し 1") applyStyle("### ", "\n");
                if (val === "見出し 2") applyStyle("#### ", "\n");
                e.target.value = "Paragraph";
              }}
            >
              <option>Paragraph</option>
              <option>見出し 1</option>
              <option>見出し 2</option>
            </select>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={() => applyStyle("**", "**")}
              type="button" title="太字" className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => applyStyle("*", "*")}
              type="button" title="斜体" className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={() => applyStyle("- ", "")}
              type="button" title="リスト" className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground ml-auto">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="お知らせの内容を入力してください"
            rows={8}
            className="w-full border border-border border-t-0 rounded-b-lg px-4 py-3 text-sm outline-none focus:border-violet-400 transition bg-background placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* 公開日時 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">公開日時</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="schedule"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.target.checked)}
              className="accent-violet-600"
            />
            <label htmlFor="schedule" className="text-sm text-muted-foreground cursor-pointer">
              公開日時を指定する
            </label>
          </div>
          {scheduleEnabled && (
            <input
              type="datetime-local"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background"
            />
          )}
        </div>

        {/* 公開期限 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">公開期限</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="expiry"
              checked={expiryEnabled}
              onChange={(e) => setExpiryEnabled(e.target.checked)}
              className="accent-violet-600"
            />
            <label htmlFor="expiry" className="text-sm text-muted-foreground cursor-pointer">
              公開期限を設定する
            </label>
          </div>
          {expiryEnabled && (
            <input
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background"
            />
          )}
        </div>

        {/* 固定フッター */}
        <div className="fixed bottom-0 left-0 lg:left-60 right-0 bg-background/90 backdrop-blur-sm border-t border-border px-4 sm:px-8 py-4 flex justify-end z-20">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 h-11 text-sm font-semibold gap-2 rounded-full disabled:opacity-40"
          >
            確認する
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
