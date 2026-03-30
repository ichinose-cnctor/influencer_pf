"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  Search, 
  Filter, 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Users,
  Clock,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { announcementApi } from "@/lib/api";

export default function AnnouncementListPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementApi.list();
      setAnnouncements(res);
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("このお知らせを削除してよろしいですか？")) return;
    try {
      await announcementApi.delete(id);
      fetchAnnouncements();
    } catch (err) {
      alert("削除に失敗しました。");
    }
  };

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "重要": return "bg-amber-100 text-amber-700 border-amber-200";
      case "緊急": return "bg-rose-100 text-rose-700 border-rose-200";
      case "システム": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-sky-100 text-sky-700 border-sky-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">お知らせ管理</h1>
          <p className="text-sm text-muted-foreground mt-1">インフルエンサーへ通知するお知らせを作成・管理します</p>
        </div>
        <Link href="/admin/announcements/new">
          <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
            <Plus className="h-4 w-4" />
            新規作成
          </Button>
        </Link>
      </div>

      <Card className="border-border shadow-none">
        <CardHeader className="p-4 sm:p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="タイトルや本文で検索..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 h-9">
                <Filter className="h-4 w-4" />
                フィルター
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground px-6 py-3">お知らせ</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">送信対象</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">公開日時</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">ステータス</th>
                  <th className="w-[100px] px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">読み込み中...</td>
                  </tr>
                ) : filteredAnnouncements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">お知らせが見つかりません</td>
                  </tr>
                ) : (
                  filteredAnnouncements.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 max-w-sm">
                          <Badge variant="outline" className={`w-fit h-5 text-[10px] px-1.5 font-medium ${getCategoryColor(a.category)}`}>
                            {a.category || "お知らせ"}
                          </Badge>
                          <Link href={`/admin/announcements/${a.id}`} className="font-semibold text-foreground hover:text-violet-600 transition-colors line-clamp-1">
                            {a.title}
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1">{a.body}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {a.target === "active" ? "進行中の案件のみ" : "全インフルエンサー"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-foreground font-medium">
                            {new Date(a.created_at).toLocaleDateString('ja-JP')}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {new Date(a.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-medium h-6 text-[11px]">
                          公開中
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <Link href={`/admin/announcements/${a.id}`}>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" /> 詳細
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/admin/announcements/new?edit=${a.id}`}>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Pencil className="h-4 w-4" /> 編集
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                              onClick={() => handleDelete(a.id)}
                            >
                              <Trash2 className="h-4 w-4" /> 削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
