"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

const mainLinks = [
  { label: "ダッシュボード", href: "/admin/dashboard" },
  { label: "プロジェクト管理", href: "/admin/campaigns" },
  { label: "インフルエンサー", href: "/admin/influencers" },
  { label: "メッセージ", href: "/admin/messages" },
  { label: "設定", href: "/admin/settings" },
];

const createLinks = [
  { label: "案件を作成する", href: "/admin/campaigns/new" },
  { label: "お知らせを作成する", href: "/admin/announcements/new" },
];

export function Footer() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <footer className="text-white" style={{ backgroundColor: "#220051" }}>
      <div className="px-6 sm:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* ロゴ */}
          <div className="shrink-0 flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2 lg:w-24">
            <img src="/logo.png" alt="logo" className="h-12 w-12 object-contain shrink-0" />
            <div>
              <div className="leading-tight">
                <p className="text-base lg:text-xs font-bold text-white">Influencer</p>
                <p className="text-base lg:text-[11px] text-slate-400">Manager</p>
              </div>
              <p className="hidden lg:block text-[12px] lg:text-[10px] text-slate-500 leading-tight mt-1">
                © 2026 LevGo Inc. All rights reserved.
              </p>
            </div>
          </div>

          {/* 区切り線（デスクトップのみ） */}
          <div className="hidden lg:block w-px bg-slate-700 shrink-0" />

          {/* 遷移マップ */}
          <div className="flex-1 space-y-4">
            {/* メイン・管理（横並び） */}
            <div>
              <p className="text-sm lg:text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                管理画面
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 作成（その下） */}
            <div>
              <p className="text-sm lg:text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                作成
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {createLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 区切り線（デスクトップのみ） */}
          <div className="hidden lg:block w-px bg-slate-700 shrink-0" />

          {/* お問い合わせ */}
          <div className="lg:w-72 shrink-0 space-y-3">
            <p className="text-sm lg:text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              お問い合わせ
            </p>
            <p className="text-sm lg:text-xs text-slate-400 leading-relaxed">
              サイトに関する不具合や機能改善のご意見がございましたらこちらにご入力をお願い致します。
            </p>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="メッセージを入力..."
                rows={4}
                className="w-full rounded-lg bg-slate-800 border border-slate-600 text-sm text-white placeholder:text-slate-500 px-3 py-2.5 outline-none focus:border-violet-500 resize-none"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="absolute bottom-3 right-3 p-1.5 rounded-md bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
            {sent && (
              <p className="text-xs text-emerald-400">送信しました。ありがとうございます。</p>
            )}
            <p className="text-sm lg:text-[11px] text-slate-500 leading-relaxed">
              ※サービス退会、案件情報、選考情報等の個別のお問い合わせにつきましては、本ページ内の
              <Link href="/admin/messages" className="text-slate-400 underline hover:text-white transition-colors">
                「メッセージ」
              </Link>
              からお問い合わせ頂きますようお願いいたします。
            </p>
          </div>

        </div>
        {/* コピーライト（モバイルのみ・最下部） */}
        <p className="lg:hidden text-[12px] text-slate-500 leading-tight pt-8 mt-4 border-t border-slate-700">
          © 2026 LevGo Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
