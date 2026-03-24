"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ---- モックデータ ----
type Message = {
  id: number;
  isMine: boolean;
  text: string;
  time: string;
  read: boolean;
};

type Conversation = {
  id: number;
  name: string;
  handle: string;
  initials: string;
  avatarColor: string;
  campaign: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
};

const conversations: Conversation[] = [
  {
    id: 1,
    name: "山田 花子",
    handle: "@hanako_lifestyle",
    initials: "山",
    avatarColor: "from-pink-400 to-rose-400",
    campaign: "夏季コスメ PR",
    lastMessage: "修正しました！ご確認よろしくお願いします。",
    lastTime: "10:34",
    unread: 1,
    online: true,
    messages: [
      { id: 1, isMine: false, text: "こんにちは！今回のキャンペーンをお受けします。商品はいつ頃届きますか？", time: "7/2 10:34", read: true },
      { id: 2, isMine: true, text: "ご参加ありがとうございます！7/8〜10の間に発送予定です。追跡番号は届き次第お送りします。", time: "7/2 11:15", read: true },
      { id: 3, isMine: false, text: "承知しました！商品が届いたら早速撮影を始めます。ハッシュタグはどれを必ず入れれば良いでしょうか？", time: "7/2 11:30", read: true },
      { id: 4, isMine: true, text: "#BeautyBrand #夏コスメ2025 の2つは必須でお願いします。あとはお任せします！", time: "7/2 11:45", read: true },
      { id: 5, isMine: false, text: "フィード投稿の初稿ができました！確認いただけますか？", time: "7/24 14:22", read: true },
      { id: 6, isMine: true, text: "拝見しました！とても素敵な仕上がりです。キャプションの2行目をもう少し自然な表現にして頂けますか？", time: "7/24 16:05", read: true },
      { id: 7, isMine: false, text: "修正しました！ご確認よろしくお願いします。", time: "10:34", read: false },
    ],
  },
  {
    id: 2,
    name: "鈴木 健太",
    handle: "@kenta_fitness",
    initials: "鈴",
    avatarColor: "from-sky-400 to-blue-500",
    campaign: "フィットネスアプリ 動画レビュー",
    lastMessage: "動画の編集が完了しました！",
    lastTime: "昨日",
    unread: 0,
    online: false,
    messages: [
      { id: 1, isMine: true, text: "鈴木さん、今回の案件をよろしくお願いします！", time: "7/10 9:00", read: true },
      { id: 2, isMine: false, text: "こちらこそよろしくお願いします。撮影スケジュールを確認させてください。", time: "7/10 10:15", read: true },
      { id: 3, isMine: true, text: "7/15〜7/20の間で自由に撮影いただければ大丈夫です。", time: "7/10 10:30", read: true },
      { id: 4, isMine: false, text: "了解しました！では7/16に撮影予定で進めます。", time: "7/10 11:00", read: true },
      { id: 5, isMine: false, text: "動画の編集が完了しました！", time: "昨日", read: true },
    ],
  },
  {
    id: 3,
    name: "佐藤 みのり",
    handle: "@minori_foodie",
    initials: "佐",
    avatarColor: "from-amber-400 to-orange-400",
    campaign: "オーガニック食品 ブログ記事",
    lastMessage: "サンプルを受け取りました。ありがとうございます！",
    lastTime: "月曜日",
    unread: 0,
    online: true,
    messages: [
      { id: 1, isMine: true, text: "佐藤さん、オーガニック食品のPR案件のご依頼です。ご興味ありますか？", time: "7/20 14:00", read: true },
      { id: 2, isMine: false, text: "はい！グルメ系は得意ですのでぜひお受けしたいです。", time: "7/20 15:22", read: true },
      { id: 3, isMine: true, text: "ありがとうございます！では詳細資料をお送りします。", time: "7/20 15:40", read: true },
      { id: 4, isMine: false, text: "サンプルを受け取りました。ありがとうございます！", time: "月曜日", read: true },
    ],
  },
  {
    id: 4,
    name: "中村 咲",
    handle: "@saki_travel",
    initials: "中",
    avatarColor: "from-violet-400 to-purple-500",
    campaign: "旅行アプリ TikTok PR",
    lastMessage: "ご連絡ありがとうございます！検討させてください。",
    lastTime: "7/28",
    unread: 2,
    online: false,
    messages: [
      { id: 1, isMine: true, text: "中村さん、旅行アプリのTikTok PRのご依頼をさせてください。", time: "7/28 10:00", read: true },
      { id: 2, isMine: false, text: "ご連絡ありがとうございます！検討させてください。", time: "7/28 12:30", read: false },
    ],
  },
  {
    id: 5,
    name: "田中 ゆい",
    handle: "@yui_beauty",
    initials: "田",
    avatarColor: "from-fuchsia-400 to-pink-500",
    campaign: "次回案件の相談",
    lastMessage: "来月もまたご一緒できれば嬉しいです！",
    lastTime: "7/25",
    unread: 0,
    online: true,
    messages: [
      { id: 1, isMine: false, text: "今回もありがとうございました！またいつでもお声がけください。", time: "7/25 17:00", read: true },
      { id: 2, isMine: true, text: "こちらこそありがとうございました！次のキャンペーンもぜひお願いしたいです。", time: "7/25 17:30", read: true },
      { id: 3, isMine: false, text: "来月もまたご一緒できれば嬉しいです！", time: "7/25 17:45", read: true },
    ],
  },
];

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [convList, setConvList] = useState<Conversation[]>(conversations);

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      const numId = Number(idParam);
      const found = conversations.find((c) => c.id === numId);
      if (found) {
        setSelectedId(numId);
        setMobileView("chat");
        setConvList((prev) =>
          prev.map((c) =>
            c.id === numId
              ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
              : c
          )
        );
      }
    } else {
      // デスクトップのデフォルト選択
      setSelectedId(1);
    }
  }, [searchParams]);

  const filtered = convList.filter(
    (c) =>
      c.name.includes(searchQuery) ||
      c.handle.includes(searchQuery) ||
      c.campaign.includes(searchQuery)
  );

  const selected = selectedId !== null ? convList.find((c) => c.id === selectedId) ?? null : null;

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setMobileView("chat");
    setConvList((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
  };

  const handleBackToList = () => {
    setMobileView("list");
  };

  const handleSend = () => {
    if (!inputText.trim() || selectedId === null) return;
    const newMsg: Message = {
      id: Date.now(),
      isMine: true,
      text: inputText,
      time: "今",
      read: false,
    };
    setConvList((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, lastMessage: inputText, lastTime: "今", messages: [...c.messages, newMsg] }
          : c
      )
    );
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const totalUnread = convList.reduce((s, c) => s + c.unread, 0);

  return (
    <div
      className="flex border border-border rounded-xl overflow-hidden bg-card"
      style={{ height: "calc(100vh - 112px)" }}
    >
      {/* ===== 左ペイン: 会話リスト ===== */}
      <div
        className={cn(
          "w-full sm:w-72 shrink-0 flex flex-col border-r border-border",
          // モバイル: mobileView === "chat" のときは非表示
          mobileView === "chat" ? "hidden sm:flex" : "flex"
        )}
      >
        {/* ヘッダー */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">メッセージ</p>
            {totalUnread > 0 && (
              <Badge className="h-5 min-w-5 px-1.5 text-[12px] lg:text-[10px] bg-violet-600 text-white border-0">
                {totalUnread}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 h-8 rounded-lg border border-border bg-muted/50 px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* 会話一覧 */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleSelect(conv.id)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-border transition-colors hover:bg-muted/50",
                selectedId === conv.id && "bg-violet-50 border-l-2 border-l-violet-600"
              )}
            >
              <div className="flex items-start gap-3">
                {/* アバター */}
                <div className="relative shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${conv.avatarColor} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {conv.initials}
                  </div>
                </div>

                {/* テキスト */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-foreground truncate">{conv.name}</p>
                    <p className="text-[12px] lg:text-[10px] text-muted-foreground shrink-0 ml-1">{conv.lastTime}</p>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className={cn("text-sm lg:text-[11px] truncate", conv.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="h-4 w-4 rounded-full bg-violet-600 text-white text-[9px] flex items-center justify-center shrink-0 font-bold">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Search className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground">一致する会話がありません</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== 右ペイン: チャット ===== */}
      <div
        className={cn(
          "flex-1 flex-col min-w-0",
          // モバイル: mobileView === "chat" のときだけ表示
          mobileView === "chat" ? "flex" : "hidden sm:flex"
        )}
      >
        {selected ? (
          <>
            {/* チャットヘッダー */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* モバイル用戻るボタン */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground sm:hidden"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <div
                    className={`h-9 w-9 rounded-full bg-gradient-to-br ${selected.avatarColor} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {selected.initials}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                </div>
              </div>
            </div>

            {/* メッセージ本文 */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-muted/10">
              {selected.messages.map((msg, i) => {
                const showDate =
                  i === 0 ||
                  selected.messages[i - 1].time.split(" ")[0] !== msg.time.split(" ")[0];

                return (
                  <div key={msg.id}>
                    {showDate && msg.time.includes("/") && (
                      <div className="flex items-center gap-2 my-3">
                        <Separator className="flex-1" />
                        <span className="text-[12px] lg:text-[10px] text-muted-foreground px-2 shrink-0">
                          {msg.time.split(" ")[0]}
                        </span>
                        <Separator className="flex-1" />
                      </div>
                    )}
                    <div className={cn("flex gap-2.5", msg.isMine ? "flex-row-reverse" : "flex-row")}>
                      {/* 相手のアバター */}
                      {!msg.isMine && (
                        <div
                          className={`h-7 w-7 rounded-full bg-gradient-to-br ${selected.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-auto`}
                        >
                          {selected.initials}
                        </div>
                      )}

                      <div className={cn("flex flex-col gap-1 max-w-[75%] sm:max-w-[65%]", msg.isMine ? "items-end" : "items-start")}>
                        <div
                          className={cn(
                            "px-3 sm:px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                            msg.isMine
                              ? "bg-violet-600 text-white rounded-tr-sm"
                              : "bg-card text-foreground rounded-tl-sm border border-border shadow-sm"
                          )}
                        >
                          {msg.text}
                        </div>
                        {/* 時刻 + 既読 */}
                        <div className="flex items-center gap-1 px-1">
                          <span className="text-[12px] lg:text-[10px] text-muted-foreground">{msg.time}</span>
                          {msg.isMine && (
                            msg.read
                              ? <CheckCheck className="h-3 w-3 text-violet-500" />
                              : <Check className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 入力エリア */}
            <div className="shrink-0 border-t border-border bg-card px-4 py-3">
              <div className="flex items-center gap-2">
                {/* PC: ファイルアイコン */}
                <button type="button" className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  <Paperclip className="h-4 w-4" />
                </button>
                {/* モバイル: 画像アイコン */}
                <button type="button" className="lg:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  <ImageIcon className="h-4 w-4" />
                </button>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder={`${selected.name} さんにメッセージを送る...`}
                  className="flex-1 bg-muted/50 border border-border rounded-2xl px-4 py-2 text-base sm:text-sm outline-none placeholder:text-muted-foreground focus:border-violet-300 transition-colors resize-none overflow-hidden"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="h-9 w-9 shrink-0 bg-violet-600 hover:bg-violet-700 text-white rounded-full disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[12px] lg:text-[10px] text-muted-foreground text-center mt-2 hidden sm:block">
                Enter で送信 · Shift+Enter で改行
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground text-sm">会話を選択してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
