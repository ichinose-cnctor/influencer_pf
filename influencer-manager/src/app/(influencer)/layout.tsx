import { Sparkles, Bell, HelpCircle, BookOpen, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* インフルエンサー用ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 border-b border-border bg-background/90 backdrop-blur-md flex items-center px-6 gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-foreground">Influencer Manager</span>
          <span className="text-xs text-muted-foreground ml-1">for クリエイター</span>
        </div>
        <nav className="flex items-center gap-1">
          {/* ヘルプ */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <HelpCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>ヘルプ</TooltipContent>
          </Tooltip>

          {/* FAQ */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <BookOpen className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>FAQ</TooltipContent>
          </Tooltip>

          {/* 通知 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>通知</TooltipContent>
          </Tooltip>

          {/* セパレーター */}
          <div className="h-6 w-px bg-border mx-1" />

          {/* アカウント名 */}
          <div className="flex flex-col leading-tight px-2">
            <span className="text-sm font-medium text-foreground">田中 太郎</span>
            <span className="text-xs text-muted-foreground">tanaka@cnctor.jp</span>
          </div>

          {/* ログアウト */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>ログアウト</TooltipContent>
          </Tooltip>
        </nav>
      </header>

      <main className="pt-14 min-h-screen">
        {children}
      </main>
    </div>
  );
}
