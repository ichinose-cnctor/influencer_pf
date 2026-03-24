"use client";

import { useState, useRef } from "react";
import { Camera, Save, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/components/layout/AccountContext";

export default function SettingsPage() {
  const { name, setName, photoUrl, setPhotoUrl } = useAccount();
  const [inputName, setInputName] = useState(name);
  const [previewUrl, setPreviewUrl] = useState<string | null>(photoUrl);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setName(inputName);
    setPhotoUrl(previewUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-lg w-full space-y-6">
      <Card className="border border-border shadow-none">
        <CardHeader className="pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-sm font-semibold">アカウント設定</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-8">

          {/* プロフィール写真 */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              プロフィール写真
            </label>
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">{inputName.charAt(0)}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow transition-colors"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs h-8"
                >
                  写真を選択
                </Button>
                {previewUrl && (
                  <div>
                    <button
                      onClick={handleRemovePhoto}
                      className="text-xs text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      写真を削除
                    </button>
                  </div>
                )}
                <p className="text-sm lg:text-[11px] text-muted-foreground">JPG・PNG・GIF（最大 5MB）</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* 名前 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <User className="h-3 w-3" />
              名前
            </label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              placeholder="名前を入力"
            />
          </div>

          {/* 保存ボタン */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={!inputName.trim()}
              className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Save className="h-4 w-4" />
              保存する
            </Button>
            {saved && (
              <span className="text-xs text-emerald-600 font-medium">保存しました</span>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
