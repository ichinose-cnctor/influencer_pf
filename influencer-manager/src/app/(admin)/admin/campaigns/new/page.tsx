"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Upload,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  MoreHorizontal,
  Undo,
  Redo,
  Gift,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const genreOptions = ["ホテル＆宿泊", "飲食店", "体験＆ツアー"];
const areaOptions = ["全国", "関東", "関西", "東海", "九州・沖縄", "北海道・東北", "中国・四国", "海外"];
const countryOptions = ["日本", "アメリカ", "韓国", "中国", "台湾", "東南アジア", "ヨーロッパ"];

export default function CreateCampaignPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [rewardStyle, setRewardStyle] = useState<"gifting" | "paid">("gifting");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [publishStart, setPublishStart] = useState("");
  const [publishEnd, setPublishEnd] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [genre, setGenre] = useState("");
  const [area, setArea] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
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
    setDescription(newText);

    // フォーカスを戻して選択範囲を調整
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = () => {
    // バリデーション
    if (!title.trim()) {
      alert("プロジェクトの案件名を入力してください");
      return;
    }
    if (!publishStart || !publishEnd) {
      alert("募集の公開期間を入力してください");
      return;
    }
    if (new Date(publishStart) > new Date(publishEnd)) {
      alert("公開期間の開始日が終了日より後の日付になっています");
      return;
    }
    if (!startDate || !endDate) {
      alert("プロジェクトの実施期間を入力してください");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("プロジェクト期間の開始日が終了日より後の日付になっています");
      return;
    }
    if (!genre) {
      alert("カテゴリーを選択してください");
      return;
    }
    if (!description.trim()) {
      alert("プロジェクトの説明を入力してください");
      return;
    }
    if (rewardStyle === "paid") {
      if (!minBudget || !maxBudget) {
        alert("予算を入力してください");
        return;
      }
      if (Number(minBudget) > Number(maxBudget)) {
        alert("予算の最小額が最大額を上回っています");
        return;
      }
    }

    sessionStorage.setItem("campaign-step1", JSON.stringify({
      title, rewardStyle, minBudget, maxBudget, publishStart, publishEnd, startDate, endDate, genre, area, country, description, videoUrl,
      uploadedFileNames: uploadedFiles.map((f) => f.name),
    }));
    router.push("/admin/campaigns/new/requirements");
  };

  const steps = [
    { label: "プロジェクトについて", sub: null, active: true, done: false },
    { label: "クリエイターの希望条件", sub: null, active: false, done: false },
    { label: "入力内容を確認", sub: null, active: false, done: false },
  ];

  return (
    <div className="max-w-3xl space-y-8 w-full">
      {/* ステップインジケーター（横） */}
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
      {/* タイトル */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">プロジェクトはどんな内容ですか？</h2>
      </div>

      {/* 案件名 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          案件名をつけましょう <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="プロジェクトのタイトルを入力してください"
          className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background placeholder:text-muted-foreground"
        />
      </div>

      {/* 報酬スタイル */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          報酬のスタイルを選びましょう <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* ギフティング */}
          <button
            type="button"
            onClick={() => setRewardStyle("gifting")}
            className={cn(
              "rounded-xl border-2 p-4 text-left transition-all",
              rewardStyle === "gifting"
                ? "border-violet-600 bg-violet-50/50"
                : "border-border bg-background hover:border-violet-300"
            )}
          >
            <p className="font-bold text-sm text-foreground mb-1">ギフティング</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              商品やサービスをクリエイターに無償で提供します
            </p>
            <div className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center",
              rewardStyle === "gifting" ? "bg-violet-100" : "bg-muted"
            )}>
              <Gift className={cn("h-4 w-4", rewardStyle === "gifting" ? "text-violet-600" : "text-muted-foreground")} />
            </div>
          </button>

          {/* 有償 */}
          <button
            type="button"
            onClick={() => setRewardStyle("paid")}
            className={cn(
              "rounded-xl border-2 p-4 text-left transition-all",
              rewardStyle === "paid"
                ? "border-violet-600 bg-violet-50/50"
                : "border-border bg-background hover:border-violet-300"
            )}
          >
            <p className="font-bold text-sm text-foreground mb-1">有償</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              各マイルストーンに応じてクリエイターへ固定額を支払います
            </p>
            <div className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center",
              rewardStyle === "paid" ? "bg-violet-100" : "bg-muted"
            )}>
              <Banknote className={cn("h-4 w-4", rewardStyle === "paid" ? "text-violet-600" : "text-muted-foreground")} />
            </div>
          </button>
        </div>

        {/* 有償の場合：予算入力 */}
        {rewardStyle === "paid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">最小固定予算を追加</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">¥</span>
                <input
                  type="number"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  placeholder="0"
                  min={0}
                  className="w-full border border-border rounded-lg pl-7 pr-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">最大固定予算を追加</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">¥</span>
                <input
                  type="number"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  placeholder="0"
                  min={0}
                  className="w-full border border-border rounded-lg pl-7 pr-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 公開期間 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          公開期間 <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={publishStart}
            onChange={(e) => setPublishStart(e.target.value)}
            className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background text-foreground"
          />
          <span className="text-sm text-muted-foreground shrink-0">〜</span>
          <input
            type="date"
            value={publishEnd}
            min={publishStart}
            onChange={(e) => setPublishEnd(e.target.value)}
            className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background text-foreground"
          />
        </div>
      </div>

      {/* プロジェクト期間 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          プロジェクト期間 <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background text-foreground"
          />
          <span className="text-sm text-muted-foreground shrink-0">〜</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background text-foreground"
          />
        </div>
      </div>

      {/* 詳細フォーム */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* カテゴリー */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            カテゴリー <span className="text-rose-500">*</span>
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background appearance-none text-foreground"
          >
            <option value="">選択</option>
            {genreOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* エリア */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">エリア</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background appearance-none text-foreground"
          >
            <option value="">エリアを選択</option>
            {areaOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* ターゲット国 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">ターゲット国</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background appearance-none text-foreground"
          >
            <option value="">ターゲット国を選択</option>
            {countryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

      </div>

      {/* プロジェクト説明 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          プロジェクトの説明 <span className="text-rose-500">*</span>
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="プロジェクトの詳細を入力してください"
          rows={8}
          className="w-full border border-border border-t-0 rounded-b-lg px-4 py-3 text-sm outline-none focus:border-violet-400 transition bg-background placeholder:text-muted-foreground resize-none"
        />
      </div>

      {/* 添付メディア */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-foreground">
          添付メディア <span className="text-rose-500">*</span>
        </p>

        {/* 動画URL */}
        <div className="space-y-1.5">
          <label className="text-sm text-foreground">プロジェクト紹介動画を追加</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="動画リンクを入力"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background placeholder:text-muted-foreground"
          />
        </div>

        {/* ファイルアップロード */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-violet-300 hover:bg-violet-50/30 transition-colors cursor-pointer group"
        >
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-violet-100 transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground group-hover:text-violet-500 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ここにファイルをドロップしてアップロードしてください
            </p>
            <span className="text-sm text-violet-600 hover:underline font-medium mt-1 inline-block">
              ここをクリック
            </span>
          </div>
        </div>

        {/* 選択済みファイル一覧 */}
        {uploadedFiles.length > 0 && (
          <ul className="space-y-1">
            {uploadedFiles.map((f, i) => (
              <li key={i} className="flex items-center justify-between text-xs text-foreground bg-muted/40 rounded-lg px-3 py-2">
                <span className="truncate">{f.name}</span>
                <button
                  onClick={() => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="ml-3 text-muted-foreground hover:text-rose-500 transition-colors shrink-0"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <p className="text-xs text-muted-foreground">※ ギャラリー画像の推奨縦横比は 1:1.7 です。</p>
      </div>

      {/* 続けるボタン（固定フッター） */}
      <div className="fixed bottom-0 left-0 lg:left-60 right-0 bg-background/90 backdrop-blur-sm border-t border-border px-4 sm:px-8 py-4 flex justify-end z-20">
        <Button
          onClick={handleSubmit}
          className="bg-rose-500 hover:bg-rose-600 text-white px-8 h-11 text-sm font-semibold gap-2 rounded-full"
        >
          続ける
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      </div>
    </div>
  );
}
