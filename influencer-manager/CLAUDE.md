# Influencer Manager - 進捗メモ

最終更新: 2026-03-24

---

## 技術スタック

- **フレームワーク**: Next.js 16.1.6（App Router）
- **言語**: TypeScript
- **スタイル**: Tailwind CSS v4
- **UIコンポーネント**: shadcn/ui v4
- **アイコン**: Lucide React
- **グラフ**: Recharts
- **開発サーバー**: `npm run dev` → http://localhost:3000

---

## モバイルブレークポイントの扱い

Tailwind CSS のブレークポイントを以下のルールで使い分けている：

| プレフィックス | 幅 | 用途 |
|---|---|---|
| （なし） | 0px〜 | モバイル向けのデフォルトスタイル |
| `sm:` | 640px〜 | 一部コンポーネントでPC扱いとして使用 |
| `lg:` | 1024px〜 | **基本的なPC/モバイルの分岐はこちら** |

- **原則は `lg:` 基準**でモバイル/PC を切り替える
- ステップインジケーターや一部の幅調整など、局所的に `sm:` を使っている箇所あり
- `globals.css` に `@media (max-width: 1023px)` で `.text-xs` を14pxにオーバーライドしているため、モバイルでは `text-xs` が実質14pxになる

---

## 修正済みファイル一覧

### レイアウト・共通コンポーネント
| ファイルパス | 主な変更内容 |
|---|---|
| `src/app/globals.css` | `@media (max-width:1023px)` で `.text-xs` を14pxに上書き、`html { @apply bg-background }`追加 |
| `src/components/layout/Header.tsx` | `sticky top-0` に変更、高さ `h-12 lg:h-16`、Bellアイコン `!h-[22px] !w-[22px]` |
| `src/components/layout/Sidebar.tsx` | モバイルで右からスライドイン、ログアウトボタンをモバイルのみ表示 |
| `src/components/layout/NotificationPanel.tsx` | モバイル=上から・PC=右からスライド、`shadow-xl` を open 時のみ適用 |
| `src/components/layout/Footer.tsx` | コピーライトをモバイルで最下部に移動、テキストサイズ調整 |

### 管理者画面ページ
| ファイルパス | 主な変更内容 |
|---|---|
| `src/app/(admin)/admin/dashboard/page.tsx` | KPI `grid-cols-2`、「完了案件（累計）」→「完了案件」 |
| `src/app/(admin)/admin/campaigns/page.tsx` | フィルターをモバイルで縦積み、ボタン高さ `h-11 lg:h-8` |
| `src/app/(admin)/admin/campaigns/[id]/page.tsx` | ステータス変更バー追加、案件情報↔案件説明の順序入れ替え、宿泊施設名をモバイルで単独行 |
| `src/app/(admin)/admin/campaigns/new/page.tsx` | ステップインジケーターをモバイルで番号下にテキスト縦積み・中央揃え |
| `src/app/(admin)/admin/campaigns/new/requirements/page.tsx` | 未使用インポート削除のみ |
| `src/app/(admin)/admin/campaigns/new/confirm/page.tsx` | 変更なし |
| `src/app/(admin)/admin/announcements/new/page.tsx` | ステップインジケーターを campaigns/new と同様のUIに変更 |
| `src/app/(admin)/admin/influencers/page.tsx` | 検索ボックス+並び替えのレイアウト調整（`min-w-0`・`shrink-0`・select固定幅） |
| `src/app/(admin)/admin/influencers/[id]/page.tsx` | フォロワー・累計案件数・評価の3項目を `gap-1.5`・`text-[11px]`・`whitespace-nowrap` で1行化 |
| `src/app/(admin)/admin/messages/page.tsx` | 入力欄を `textarea` に変更（自動リサイズ）、`text-base sm:text-sm` でズーム防止 |
| `src/app/(admin)/admin/analytics/page.tsx` | 未使用インポート削除のみ |

---

## 現在のフォルダ構造

```
src/app/
├── layout.tsx                        # ルートレイアウト（Geist フォント・globals.css）
│
├── (marketing)/                      # 非ログイン向け LP
│   ├── layout.tsx
│   └── page.tsx                      # / → ランディングページ
│
├── (admin)/                          # 管理者画面
│   ├── layout.tsx                    # SidebarProvider + Header(sticky) + NotificationPanel + main
│   └── admin/
│       ├── dashboard/page.tsx        # /admin/dashboard
│       ├── campaigns/
│       │   ├── page.tsx              # /admin/campaigns（プロジェクト管理・3カラムカード・ページネーション）
│       │   ├── [id]/page.tsx         # /admin/campaigns/[id]（案件詳細）
│       │   ├── [id]/edit/page.tsx    # /admin/campaigns/[id]/edit（案件編集）
│       │   └── new/
│       │       ├── page.tsx          # /admin/campaigns/new（作成 Step1）
│       │       ├── requirements/page.tsx  # Step2
│       │       └── confirm/page.tsx       # Step3・確認
│       ├── announcements/
│       │   ├── [id]/page.tsx         # /admin/announcements/[id]（お知らせ詳細）
│       │   └── new/
│       │       ├── page.tsx          # /admin/announcements/new（作成 Step1）
│       │       └── confirm/page.tsx  # /admin/announcements/new/confirm（Step2・確認）
│       ├── influencers/
│       │   ├── page.tsx              # /admin/influencers（一覧・ページネーション）
│       │   └── [id]/page.tsx         # /admin/influencers/[id]（詳細）
│       ├── messages/page.tsx         # /admin/messages
│       ├── settings/page.tsx         # /admin/settings（アカウント設定）
│       └── analytics/page.tsx        # 未使用・サイドバー非表示
│
└── (influencer)/                     # インフルエンサー向け画面
    ├── layout.tsx
    └── portal/page.tsx               # /portal（スケルトン）

src/components/layout/
├── Header.tsx                        # sticky top-0 / z-30 / mainの中に配置
├── Sidebar.tsx                       # モバイル=右からスライド / PC=左固定
├── SidebarContext.tsx                # サイドバー開閉状態の Context
├── SidebarOverlay.tsx                # モバイル用暗転オーバーレイ（z-[35]）
├── NotificationContext.tsx           # 通知パネルの状態・データ管理
├── NotificationPanel.tsx             # モバイル=上から / PC=右からスライド
├── AccountContext.tsx                # アカウント情報（名前・写真）管理
└── Footer.tsx                        # ダークフッター（#220051）

src/components/ui/
└── Pagination.tsx                    # 共通ページネーションコンポーネント
```

---

## 完成済みのページ

| URL | 状態 | 内容 |
|-----|------|------|
| `/` | ✅ 完成 | ランディングページ（ヒーロー・実績・機能・料金・導入事例） |
| `/admin/dashboard` | ✅ 完成 | KPI4枚・案件テーブル・ステータス管理・お知らせ表示 |
| `/admin/campaigns` | ✅ 完成 | 3カラムカード（16:9サムネイル）・フィルター・タブ・ページネーション(9件/p) |
| `/admin/campaigns/[id]` | ✅ 完成 | タブ3つ（概要/応募者/支払い） |
| `/admin/campaigns/[id]/edit` | ✅ 完成 | 案件編集フォーム |
| `/admin/campaigns/new` | ✅ 完成 | 案件作成 Step1 |
| `/admin/campaigns/new/requirements` | ✅ 完成 | 案件作成 Step2 |
| `/admin/campaigns/new/confirm` | ✅ 完成 | 案件作成 Step3（確認・公開） |
| `/admin/announcements/new` | ✅ 完成 | お知らせ作成 Step1 |
| `/admin/announcements/new/confirm` | ✅ 完成 | お知らせ作成 Step2（確認・公開） |
| `/admin/announcements/[id]` | ✅ 完成 | お知らせ詳細・編集ボタン |
| `/admin/influencers` | ✅ 完成 | 検索・フィルター・ページネーション(9件/p) |
| `/admin/influencers/[id]` | ✅ 完成 | プロフィール・スタッツ・案件履歴 |
| `/admin/messages` | ✅ 完成 | 会話リスト・チャットUI |
| `/admin/settings` | ✅ 完成 | プロフィール写真・名前変更（localStorage永続化） |
| `/portal` | ✅ スケルトン | インフルエンサー向けダッシュボード |

---

## 作業内容（2026-03-24）

### 案件詳細ページ モバイル調整（`campaigns/[id]/page.tsx`）
- h2タイトル下の宿泊施設名を含むバッジ行: モバイルで宿泊施設名を単独行に（`flex-wrap` + `basis-full sm:basis-auto`）
- 案件情報・案件説明の順序を入れ替え（案件情報を上に）

### ダッシュボード テキスト変更（`dashboard/page.tsx`）
- 「完了案件（累計）」→「完了案件」に変更

### インフルエンサー詳細 モバイル調整（`influencers/[id]/page.tsx`）
- フォロワー・累計案件数・評価の3項目: `gap-1.5 lg:gap-4`・`p-2 lg:p-3`・`text-[11px]`・`whitespace-nowrap` で1行に収まるよう調整

### インフルエンサー一覧 モバイル調整（`influencers/page.tsx`）
- 「並び替え」テキストの縦並び解消: `whitespace-nowrap` → `text-center leading-tight` + モバイルのみ `<br>`
- 検索ボックスとソートが画面幅に収まるよう調整: `min-w-0`・`shrink-0`・select に `w-[5.5rem] sm:w-auto`

### 案件作成・お知らせ作成 ステップインジケーター改修
- `campaigns/new/page.tsx` と `announcements/new/page.tsx` の両方
- モバイル: 番号の下にテキスト縦積み（`flex-col items-center`）、`text-[10px]`、中央揃え
- PC（sm:）: 番号の右にテキスト横並び（`sm:flex-row`）、左揃え
- コネクター線: `w-8 sm:w-16 shrink-0`（モバイルで固定幅）

### コードリファクタリング（デッドコード削除）
- `dashboard/page.tsx`: 重複 `"use client"` 削除
- `analytics/page.tsx`: 未使用インポート `LineChart`・`Line`・`TrendingDown` 削除
- `campaigns/new/page.tsx`: 未使用インポート `Circle` 削除
- `campaigns/new/requirements/page.tsx`: 未使用インポート `useEffect`・`Circle` 削除
- `campaigns/[id]/page.tsx`: 未使用インポート `MessageSquare`・`Heart` 削除

---

## 作業内容（2026-03-23）

### モバイル テキストサイズ グローバル調整
- `globals.css` に `@media (max-width: 1023px)` でメディアクエリを追加
- `.text-xs`（12px）→ モバイルで `0.875rem`（14px）にオーバーライド

### ステータスバッジ テキストサイズ
- モバイルで `text-[12px]`、PCは `text-[10px]` のクラスパターンに変更（`text-[12px] lg:text-[10px]`）
- 影響ファイル: `campaigns/page.tsx`、`influencers/page.tsx`、`campaigns/[id]/page.tsx`

### ダッシュボード 案件ステータス数字
- `dashboard/page.tsx`: ステータス数字を `text-base lg:text-xs`（モバイル 16px、PC 12px）に変更

### フッター調整
- `Footer.tsx`: コピーライトをモバイルで最下部に移動（ロゴ横は `hidden lg:block`、下部に `lg:hidden` で表示）
- Influencer/Manager テキストを `text-base lg:text-xs` / `text-base lg:text-[11px]` に拡大
- お問い合わせ説明文を `text-sm lg:text-xs`（モバイル 14px）に変更
- コピーライトの余白: `pt-8 mt-4 border-t`

### プロジェクト管理ページ（`campaigns/page.tsx`）
- フィルタータグをモバイルで縦積みレイアウトに変更
- ボタン高さ: `h-11 lg:h-8`、新規作成ボタン: `h-10 lg:h-8 text-sm lg:text-xs`

### インフルエンサーページ（`influencers/page.tsx`）
- フィルタータグをモバイルで縦積みレイアウトに変更
- カードボタン: メモ `h-11 w-11 lg:h-9 lg:w-9`、詳細/メッセージ `h-11 lg:h-9 text-sm lg:text-xs`

### 案件詳細ページ（`campaigns/[id]/page.tsx`）
- タブ上にステータス変更バーを追加（募集中 / 進行中 / 完了 の3ステップ）
- `localStorage` キー `campaign-status-{id}` で一覧ページと同期

### メッセージページ（`messages/page.tsx`）
- 入力欄を `input` → `textarea` に変更（自動リサイズ）
- モバイルズーム防止: `text-base sm:text-sm`

---

## 作業内容（2026-03-18）

### ヘッダー高さ（PC）
- `Header.tsx`: `h-12` → `h-12 lg:h-16`

### モバイル フォントサイズ調整
- ダッシュボード案件テーブルの案件名: `text-xs` → `text-sm lg:text-xs`
- 通知パネル各通知タイトル: `text-xs` → `text-sm lg:text-xs`
- プロジェクト管理タブラベル: `text-[10px]` → `text-xs`
- 案件カードタイトル: `text-sm` → `text-lg md:text-sm`

---

## 作業内容（2026-03-17）

### フォント修正
- `globals.css` の `--font-sans` 自己参照バグを修正 → `var(--font-geist-sans)` に変更
- `-webkit-text-size-adjust: 100%` 追加

### ダッシュボード モバイル対応
- KPI 4枚カードをモバイルで `grid-cols-2` に変更

### ヘッダー・サイドバー・通知パネル 全面リデザイン
- ヘッダー `fixed` → `sticky top-0`（iOS Safari 対応）
- サイドバー: モバイルで右からスライドイン
- 通知パネル: モバイル=上から / PC=右からスライド
- `shadow-xl` は open 時のみ適用（閉じた状態で常時適用すると画面上部にシャドウが残るバグ）

---

## 断念した機能

### メッセージページ ファイル添付（モバイル）
- iOS Safari では `display:none` の `<input type="file">` の `onChange` が発火しない
- **将来対応**: バックエンドAPI実装後に `<label htmlFor="file-input">` + 可視の `<input>` パターンで再実装

---

## データの仕様メモ

### localStorage キー
| キー | 内容 |
|------|------|
| `influencer-rating-{id}` | インフルエンサーIDごとの評価（整数） |
| `account-name` | アカウント名 |
| `account-photo` | プロフィール写真（base64） |
| `announcements` | お知らせ一覧（JSON 配列） |
| `campaign-status-{id}` | 案件ステータス（「募集中」「進行中」「完了」）|

### sessionStorage キー
| キー | 内容 | 削除タイミング |
|------|------|----------------|
| `campaign-step1` | 案件作成 Step1 データ | 公開後 |
| `campaign-step2` | 案件作成 Step2 データ | 公開後 |
| `announcement-step1` | お知らせ作成 Step1 データ | 公開後 |
| `announcement-editing` | 編集中のお知らせデータ | Step1 ページ読み込み後 |

### インフルエンサーデータ（ハードコード）
| id | 名前 | 案件数 | 評価 |
|----|------|--------|------|
| 1 | 山田 花子 | 1 | 5 |
| 2 | 鈴木 健太 | 2 | 5 |
| 3 | 佐藤 みのり | 2 | 5 |
| 4 | 中村 咲 | 1 | 5 |
| 5 | 田中 ゆい | 1 | 5 |
| 6 | 伊藤 大輝 | 1 | 4 |
| 7 | 高橋 あおい | 1 | 5 |
| 8 | 渡辺 そら | 1 | 4 |

---

## z-index 構成（重なり順）

| 要素 | z-index | 備考 |
|------|---------|------|
| Header | z-30 | sticky、main 内の先頭 |
| SidebarOverlay | z-[35] | モバイルのみ表示 |
| Sidebar | z-40 | モバイル=右から / PC=左固定 |
| NotificationPanel backdrop | z-40 | 透明度アニメーション |
| NotificationPanel | z-50 | 最前面 |

---

## 次にやること

### 未着手・高優先度

1. **インフルエンサーポータルの画面追加** `/portal/*`
   - `/portal/campaigns` — 応募中・進行中の案件一覧
   - `/portal/messages` — 企業とのチャット画面
   - `/portal/profile` — プロフィール編集
   - `/portal/earnings` — 報酬履歴・支払い状況

2. **認証フローの実装**
   - ログインページ `/login`
   - ロール分岐（管理者 → `/admin/dashboard`、インフルエンサー → `/portal`）
   - `middleware.ts` で `/admin/*` と `/portal/*` を保護

### 未着手・中優先度

3. **管理者画面の追加ページ**
   - `/admin/notifications` — 通知一覧ページ（現在はパネルのみ）

4. **データの実装**
   - 現在はすべてハードコードのダミーデータ（localStorage で一部永続化）
   - APIルート（`src/app/api/`）またはDBとの接続（Supabase / Prisma 等）

5. **案件作成フロー改善**
   - Step3「公開する」後の完了画面（サンクスページ）

### 未着手・低優先度

6. **analytics ページの扱い決定**
   - `/admin/analytics` のファイルは存在するがサイドバーには非表示

---

## 開発再開時のコマンド

```bash
cd "C:/Users/wakud/OneDrive/デスクトップ/新しいフォルダー/influencer-manager"
npm run dev
```

→ http://localhost:3000 でアクセス
→ スマホ実機確認: `192.168.100.107:3000`（スマホは PC と同じ Wi-Fi に接続すること）

---

## 注意事項・設計メモ

- `(marketing)`, `(admin)`, `(influencer)` は Next.js の Route Groups で URL には影響しない
- **Header は `<main>` の中の先頭に `sticky` で配置**（`fixed` ではない）
- サイドバーはモバイルで右側スライド、PC では左固定。`SidebarContext` で開閉状態を共有
- 通知パネルの `shadow-xl` は**必ず open 時のみ**適用すること（閉じた状態で常時適用すると画面上部にシャドウが残るバグが発生）
- 通知パネルは `NotificationContext` + `NotificationPanel` で共通化
- アカウント名・写真は `AccountContext` で共有。Sidebar・Header・設定ページが同期
- お知らせデータは `localStorage("announcements")` に JSON 配列で保存
- ページネーションは 9件/ページ（campaigns・influencers）
- 案件カードのサムネイルは `aspect-video`（16:9）
- モバイルのブレークポイント: `sm:` = 640px以上をPC扱いとしている箇所と `lg:` = 1024px以上をPC扱いとしている箇所が混在。基本は `lg:` 基準
