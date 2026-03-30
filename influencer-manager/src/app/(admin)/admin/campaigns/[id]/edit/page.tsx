"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
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
  CheckCircle2,
  Gift,
  Banknote,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { campaignApi } from "@/lib/api";

const genreOptions = ["ホテル＆宿泊", "飲食店", "体験＆ツアー"];
const areaOptions = ["全国", "関東", "関西", "東海", "九州・沖縄", "北海道・東北", "中国・四国", "海外"];
const countryOptions = ["日本", "アメリカ", "韓国", "中国", "台湾", "東南アジア", "ヨーロッパ"];

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = params?.id as string;
  const id = parseInt(idStr);

  const [loading, setLoading] = useState(true);
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
  const [videoUrl, setVideoUrl] = useState("");
  const [maxSlots, setMaxSlots] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await campaignApi.get(id);
        setTitle(data.title);
        setRewardStyle((data.reward_style as "gifting" | "paid") || "gifting");
        setMinBudget(String(data.min_budget || ""));
        setMaxBudget(String(data.max_budget || ""));
        setPublishStart(data.publish_start?.split("T")[0] || "");
        setPublishEnd(data.publish_end?.split("T")[0] || "");
        setStartDate(data.start_date?.split("T")[0] || "");
        setEndDate(data.end_date?.split("T")[0] || "");
        setGenre(data.category || "");
        setArea(data.area || "");
        setCountry(data.country || "");
        setDescription(data.description || "");
        setVideoUrl(data.video_url || "");
        // backend models/schemas need to support max_slots in CampaignOut
        setMaxSlots(String((data as any).max_slots || ""));
      } catch (err) {
        console.error("Failed to fetch campaign", err);
        alert("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("案件名を入力してください");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title,
        reward_style: rewardStyle,
        min_budget: minBudget ? parseInt(minBudget) : 0,
        max_budget: maxBudget ? parseInt(maxBudget) : 0,
        publish_start: publishStart || null,
        publish_end: publishEnd || null,
        start_date: startDate || null,
        end_date: endDate || null,
        category: genre || null,
        area: area || null,
        country: country || null,
        description: description || null,
        video_url: videoUrl || null,
        max_slots: maxSlots ? parseInt(maxSlots) : null,
      };
      await campaignApi.update(id, payload);
      setSaved(true);
      setTimeout(() => {
        router.push(`/admin/campaigns/${id}`);
      }, 800);
    } catch (err) {
      console.error("Failed to update campaign", err);
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full space-y-8 pb-32">
      {/* パンくど & 戻るボタン */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => router.push("/admin/campaigns")}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          プロジェクト一覧
        </button>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{title}</span>
        <span>/</span>
        <span className="text-foreground">編集</span>
      </div>

      {/* タイトル */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">プロジェクトを編集</h2>
        <p className="text-sm text-muted-foreground mt-1">変更後、「保存する」ボタンで更新されます。</p>
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
            <div className={cn("h-9 w-9 rounded-full flex items-center justify-center", rewardStyle === "gifting" ? "bg-violet-100" : "bg-muted")}>
              <Gift className={cn("h-4 w-4", rewardStyle === "gifting" ? "text-violet-600" : "text-muted-foreground")} />
            </div>
          </button>

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
            <div className={cn("h-9 w-9 rounded-full flex items-center justify-center", rewardStyle === "paid" ? "bg-violet-100" : "bg-muted")}>
              <Banknote className={cn("h-4 w-4", rewardStyle === "paid" ? "text-violet-600" : "text-muted-foreground")} />
            </div>
          </button>
        </div>

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

        {/* 定員数 (NEW) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">定員数</label>
          <input
            type="number"
            value={maxSlots}
            onChange={(e) => setMaxSlots(e.target.value)}
            placeholder="例: 3"
            min={1}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background text-foreground"
          />
          <p className="text-[10px] text-muted-foreground mt-1">※この人数が合格すると自動で「進行中」になります</p>
        </div>
      </div>

      {/* プロジェクト説明 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          プロジェクトの説明 <span className="text-rose-500">*</span>
        </label>
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
          <select className="text-xs bg-transparent border-none outline-none text-muted-foreground cursor-pointer">
            <option>Paragraph</option>
            <option>見出し 1</option>
            <option>見出し 2</option>
          </select>
          <div className="w-px h-4 bg-border mx-1" />
          {[
            { icon: Bold, label: "太字" },
            { icon: Italic, label: "斜体" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} title={label} className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          {[
            { icon: AlignLeft, label: "左揃え" },
            { icon: AlignCenter, label: "中央揃え" },
            { icon: AlignRight, label: "右揃え" },
            { icon: List, label: "リスト" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} title={label} className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
          <button className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground ml-auto">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
        <textarea
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

      {/* 固定フッター */}
      <div className="fixed bottom-0 left-0 lg:left-60 right-0 bg-background/90 backdrop-blur-sm border-t border-border px-4 sm:px-8 py-4 flex items-center justify-between z-20">
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/campaigns/${id}`)}
          className="h-10 px-6 text-sm"
        >
          キャンセル
        </Button>

        <Button
          onClick={handleSave}
          disabled={saved || saving}
          className="h-10 px-8 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white gap-2 rounded-full disabled:opacity-80"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              保存しました
            </>
          ) : (
            "保存する"
          )}
        </Button>
      </div>
    </div>
  );
}
