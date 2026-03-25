"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function InfluencerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/portal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-pink-50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Influencer Manager</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-border p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold text-foreground">インフルエンサー ログイン</h1>
            <p className="text-sm text-muted-foreground">アカウントにログインして案件を確認</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="influencer@example.com"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="パスワードを入力"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="text-center text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
            <p className="font-medium">デモ用アカウント</p>
            <p>インフルエンサー: hanako@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
