"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---- 選択肢データ ----
const platformOptions = ["Instagram", "YouTube", "TikTok"];
const headcountOptions = ["1人", "2〜3人", "4〜5人", "6〜10人", "11人以上"];
const followerOptions = [
  "1万人以上",
  "3万人以上",
  "5万人以上",
  "10万人以上",
  "30万人以上",
  "50万人以上",
  "100万人以上",
];
const skillOptions = [
  "写真撮影", "動画編集", "ライティング", "グラフィックデザイン", "ライブ配信",
];
const languageOptions = ["日本語", "英語", "韓国語", "中国語（簡体字）", "中国語（繁体字）", "スペイン語", "フランス語", "その他"];

// ---- ステップ定義 ----
const steps = [
  { label: "プロジェクトについて", sub: "詳細を編集", href: "/admin/campaigns/new", done: true },
  { label: "クリエイターの希望条件", sub: null, href: "/admin/campaigns/new/requirements", done: false, active: true },
  { label: "入力内容を確認", sub: null, href: "/admin/campaigns/new/confirm", done: false, active: false },
];

// ---- マルチセレクトコンポーネント ----
function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(options.length * 40 + 8, 280);
      const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

      setDropdownStyle({
        position: "fixed",
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        ...(showAbove
          ? { bottom: window.innerHeight - rect.top + 4 }
          : { top: rect.bottom + 4 }),
      });
    }
    setOpen(!open);
  };

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        onClick={handleOpen}
        className={cn(
          "min-h-[44px] w-full border rounded-lg px-3 py-2 flex flex-wrap gap-1.5 cursor-pointer transition",
          open ? "border-violet-400 ring-2 ring-violet-100" : "border-border hover:border-violet-300",
          "bg-background"
        )}
      >
        {selected.length === 0 && (
          <span className="text-sm text-muted-foreground self-center">{placeholder}</span>
        )}
        {selected.map((s) => (
          <Badge
            key={s}
            className="gap-1 bg-violet-100 text-violet-700 border-violet-200 text-xs px-2 py-0.5"
            onClick={(e) => { e.stopPropagation(); toggle(s); }}
          >
            {s}
            <X className="h-3 w-3" />
          </Badge>
        ))}
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div
            style={dropdownStyle}
            className="bg-card border border-border rounded-lg shadow-xl max-h-[280px] overflow-y-auto py-1"
          >
            {options.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggle(opt)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors",
                    isSelected ? "bg-violet-50 text-violet-700" : "hover:bg-muted text-foreground"
                  )}
                >
                  {opt}
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function RequirementsPage() {
  const router = useRouter();

  const [platform, setPlatform] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [maxSlots, setMaxSlots] = useState("");
  const [follower, setFollower] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("campaign-step2");
    if (saved) {
      const data = JSON.parse(saved);
      setPlatform(data.platform ?? "");
      setHeadcount(data.headcount ?? "");
      setMaxSlots(data.maxSlots ?? "");
      setFollower(data.follower ?? "");
      setSkills(data.skills ?? []);
      setLanguages(data.languages ?? []);
    }
  }, []);


  const handleNext = () => {
    // バリデーション
    if (!platform) {
      alert("募集対象のプラットフォームを選択してください");
      return;
    }
    if (!headcount) {
      alert("採用予定人数を選択してください");
      return;
    }
    if (!maxSlots) {
      alert("定員数を入力してください（自動遷移に必要です）");
      return;
    }
    if (Number(maxSlots) < 1) {
      alert("定員数には1以上の数値を入力してください");
      return;
    }
    if (!follower) {
      alert("希望するフォロワー数を選択してください");
      return;
    }

    sessionStorage.setItem("campaign-step2", JSON.stringify({
      platform, headcount, maxSlots, follower, skills, languages,
    }));
    router.push("/admin/campaigns/new/confirm");
  };

  return (
    <div className="max-w-3xl space-y-8 w-full">
      {/* ===== 上: ステップインジケーター（横） ===== */}
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
                    className={cn(
                      "text-xs leading-snug",
                      step.done ? "text-violet-500 hover:underline cursor-pointer" : "text-muted-foreground"
                    )}
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

      {/* ===== フォーム ===== */}
      <div className="pb-28">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          どんなクリエイターを募集しますか？
        </h2>

        <div className="space-y-6">
          {/* プラットフォーム */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              プラットフォーム <span className="text-rose-500">*</span>
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background appearance-none text-foreground"
            >
              <option value="">プラットフォームを選択</option>
              {platformOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* 採用予定人数 & フォロワー数 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                採用予定人数 <span className="text-rose-500">*</span>
              </label>
              <select
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background appearance-none text-foreground"
              >
                <option value="">採用予定人数を選択してください</option>
                {headcountOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                定員数（進行中への切替基準）
              </label>
              <input
                type="number"
                min={1}
                value={maxSlots}
                onChange={(e) => setMaxSlots(e.target.value)}
                placeholder="例: 3"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background text-foreground"
              />
              <p className="text-[11px] text-muted-foreground">応募者がこの人数に達すると自動で「進行中」に切り替わります</p>
            </div>
          </div>

          {/* フォロワー数 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              フォロワー数 <span className="text-rose-500">*</span>
            </label>
            <select
              value={follower}
              onChange={(e) => setFollower(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-background appearance-none text-foreground"
            >
              <option value="">希望するフォロワー数を選択してください...</option>
              {followerOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>


          {/* 必要なスキル */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">必要なスキル</label>
            <MultiSelect
              options={skillOptions}
              selected={skills}
              onChange={setSkills}
              placeholder="リストからスキルを選択してください"
            />
          </div>

          {/* 対応言語 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">対応言語</label>
            <MultiSelect
              options={languageOptions}
              selected={languages}
              onChange={setLanguages}
              placeholder="リストから対応言語を選択してください"
            />
          </div>

        </div>

        {/* フッター */}
        <div className="fixed bottom-0 left-0 lg:left-60 right-0 bg-background/90 backdrop-blur-sm border-t border-border px-4 sm:px-8 py-4 flex items-center justify-between z-20">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/campaigns/new")}
            className="gap-1.5 h-11 px-6 text-sm font-semibold rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
            戻る
          </Button>

          <Button
            onClick={handleNext}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 h-11 text-sm font-semibold gap-2 rounded-full"
          >
            確認する
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
