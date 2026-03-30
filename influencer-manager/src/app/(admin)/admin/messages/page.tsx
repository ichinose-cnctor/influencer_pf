"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Send,
  Check,
  CheckCheck,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { messageApi } from "@/lib/api";

// ユーティリティ: 名前からイニシャルと色を生成
const getAvatarData = (name: string, id: number) => {
  const initials = name ? name.substring(0, 1) : "?";
  const colors = [
    "from-blue-400 to-indigo-500",
    "from-orange-400 to-amber-500",
    "from-rose-400 to-red-500",
    "from-violet-400 to-purple-500",
    "from-fuchsia-400 to-pink-500",
    "from-emerald-400 to-teal-500",
  ];
  const color = colors[id % colors.length];
  return { initials, color };
};

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">読み込み中...</div>}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await messageApi.list_threads();
      setThreads(res);
      setLoadingThreads(false);
      
      const idParam = searchParams.get("id");
      if (idParam) {
        handleSelectThread(Number(idParam));
      }
    } catch (err) {
      console.error("Failed to fetch threads", err);
      setLoadingThreads(false);
    }
  };

  const handleSelectThread = async (id: number) => {
    setSelectedThreadId(id);
    setMobileView("chat");
    setLoadingMessages(true);
    try {
      const res = await messageApi.get_messages(id);
      setMessages(res);
      setThreads(prev => prev.map(t => t.id === id ? { ...t, unread_count: 0 } : t));
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !selectedThreadId) return;
    
    const thread = threads.find(t => t.id === selectedThreadId);
    if (!thread) return;

    try {
      const content = inputText;
      setInputText("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      const res = await messageApi.send_message(thread.other_user_id, content);
      setMessages(prev => [...prev, res]);
      
      setThreads(prev => prev.map(t => 
        t.id === selectedThreadId 
          ? { ...t, last_message: content, last_message_at: new Date().toISOString() } 
          : t
      ));
    } catch (err) {
      console.error("Failed to send message", err);
      alert("メッセージの送信に失敗しました。");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredThreads = threads.filter(t => 
    (t.other_user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.campaign_title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  return (
    <div
      className="flex border border-border rounded-xl overflow-hidden bg-card"
      style={{ height: "calc(100vh - 112px)" }}
    >
      <div
        className={cn(
          "w-full sm:w-80 shrink-0 flex flex-col border-r border-border",
          mobileView === "chat" ? "hidden sm:flex" : "flex"
        )}
      >
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">メッセージ</p>
          </div>
          <div className="flex items-center gap-2 h-9 rounded-lg border border-border bg-muted/50 px-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingThreads ? (
            <div className="p-8 text-center text-xs text-muted-foreground">読み込み中...</div>
          ) : filteredThreads.map((t) => {
            const { initials, color } = getAvatarData(t.other_user_name || "User", t.other_user_id);
            return (
              <button
                key={t.id}
                onClick={() => handleSelectThread(t.id)}
                className={cn(
                  "w-full text-left px-4 py-4 border-b border-border transition-colors hover:bg-muted/50",
                  selectedThreadId === t.id && "bg-violet-50 border-l-2 border-l-violet-600"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-base font-bold shrink-0`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold text-foreground truncate">{t.other_user_name}</p>
                      <p className="text-[10px] text-muted-foreground shrink-0 ml-1">
                        {t.last_message_at ? new Date(t.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <p className={cn("text-xs truncate", t.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                        {t.last_message || "メッセージはありません"}
                      </p>
                      {t.unread_count > 0 && (
                        <span className="h-4.5 min-w-[18px] px-1 rounded-full bg-violet-600 text-white text-[9px] flex items-center justify-center shrink-0 font-bold">
                          {t.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          {!loadingThreads && filteredThreads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Search className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">会話が見つかりません</p>
            </div>
          )}
        </div>
      </div>

      <div className={cn("flex-1 flex-col min-w-0 bg-muted/5", mobileView === "chat" ? "flex" : "hidden sm:flex")}>
        {selectedThread ? (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card shrink-0">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground sm:hidden" onClick={() => setMobileView("list")}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getAvatarData(selectedThread.other_user_name, selectedThread.other_user_id).color} flex items-center justify-center text-white font-bold`}>
                  {getAvatarData(selectedThread.other_user_name, selectedThread.other_user_id).initials}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{selectedThread.other_user_name}</p>
                  <p className="text-[11px] text-muted-foreground">{selectedThread.campaign_title || "フリートーク"}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
              {messages.map((msg, i) => {
                const isMine = msg.sender_id !== selectedThread.other_user_id;
                const dateStr = new Date(msg.created_at).toLocaleDateString();
                const prevDateStr = i > 0 ? new Date(messages[i-1].created_at).toLocaleDateString() : "";
                const showDate = i === 0 || dateStr !== prevDateStr;

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex items-center gap-3 my-6">
                        <Separator className="flex-1" />
                        <span className="text-[11px] font-medium text-muted-foreground px-2 bg-muted/20 py-0.5 rounded-full">{dateStr}</span>
                        <Separator className="flex-1" />
                      </div>
                    )}
                    <div className={cn("flex gap-3", isMine ? "flex-row-reverse" : "flex-row")}>
                      {!isMine && (
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${getAvatarData(selectedThread.other_user_name, selectedThread.other_user_id).color} flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-auto`}>
                          {getAvatarData(selectedThread.other_user_name, selectedThread.other_user_id).initials}
                        </div>
                      )}
                      <div className={cn("flex flex-col gap-1.5 max-w-[85%] sm:max-w-[70%]", isMine ? "items-end" : "items-start")}>
                        <div className={cn("px-4 py-3 rounded-2xl text-[14px] whitespace-pre-wrap leading-relaxed shadow-sm", 
                          isMine ? "bg-violet-600 text-white rounded-tr-none" : "bg-card text-foreground border border-border rounded-tl-none")}>
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1.5 px-1">
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && (msg.is_read ? <CheckCheck className="h-3.5 w-3.5 text-violet-500" /> : <Check className="h-3.5 w-3.5 text-muted-foreground" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 border-t border-border bg-card p-4">
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
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
                  placeholder="メッセージを入力..."
                  className="flex-1 bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-400 resize-none overflow-hidden transition-all"
                  style={{ maxHeight: "150px" }}
                />
                <Button size="icon" onClick={handleSend} disabled={!inputText.trim()} className="h-11 w-11 bg-violet-600 hover:bg-violet-700 rounded-xl shrink-0 shadow-sm transition-all active:scale-95">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
              <Clock className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">会話を選択してください</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">左側のリストから、インフルエンサーとのチャットを開始できます。</p>
          </div>
        )}
      </div>
    </div>
  );
}
