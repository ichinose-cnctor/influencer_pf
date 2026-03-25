import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Megaphone,
  MessageSquare,
  CreditCard,
  BarChart3,
  Shield,
  Star,
  TrendingUp,
  Zap,
  ChevronRight,
} from "lucide-react";

/* ───────────────────────────── データ定義 ───────────────────────────── */

const stats = [
  { value: "2,400+", label: "登録インフルエンサー" },
  { value: "180+", label: "利用企業" },
  { value: "12,000+", label: "成立した案件" },
  { value: "98%", label: "満足度" },
];

const features = [
  {
    icon: Users,
    title: "スマートマッチング",
    description:
      "ジャンル・フォロワー数・エンゲージメント率・スキルで絞り込み。AIが相性の良いインフルエンサーを提案します。",
  },
  {
    icon: Megaphone,
    title: "案件を一元管理",
    description:
      "複数の案件を並行管理。進捗バー・ステータス管理・納品物の確認まで、ひとつのダッシュボードで完結。",
  },
  {
    icon: MessageSquare,
    title: "チャットで即連絡",
    description:
      "既読表示付きのリアルタイムチャット。ファイル添付・スレッドで、メール往来を減らしてスピーディに進行。",
  },
  {
    icon: CreditCard,
    title: "安心の決済フロー",
    description:
      "マイルストーン支払いで双方が安心。報酬の支払い状況を一覧化し、振込漏れ・遅延を防止します。",
  },
  {
    icon: BarChart3,
    title: "効果測定・レポート",
    description:
      "リーチ・インプレッション・CVを自動集計。案件ごとのROIをグラフで可視化し、次の戦略に活かせます。",
  },
  {
    icon: Shield,
    title: "コンプライアンス対応",
    description:
      "ステルスマーケティング規制に対応したガイドライン管理。契約書テンプレートと電子署名で法的リスクを低減。",
  },
];

const steps = [
  {
    step: "01",
    title: "案件を作成",
    description: "案件タイトル・ジャンル・予算・要件を入力するだけ。2ステップで公開完了。",
  },
  {
    step: "02",
    title: "インフルエンサーを探す",
    description: "検索・フィルターで候補を絞り込み、プロフィール・実績を確認してオファーを送信。",
  },
  {
    step: "03",
    title: "チャットで進行",
    description: "合意後はチャット上でディレクション・確認・フィードバックをスムーズに実施。",
  },
  {
    step: "04",
    title: "納品・支払い完了",
    description: "納品物を確認・承認したらワンクリックで報酬を支払い。案件を完結させます。",
  },
];

const plans = [
  {
    name: "スターター",
    price: "¥9,800",
    period: "/月",
    description: "小規模チームや個人ブランドに",
    features: [
      "同時進行案件 5件まで",
      "インフルエンサー検索（月50回）",
      "チャット機能",
      "基本レポート",
    ],
    cta: "14日間無料で試す",
    href: "/admin/dashboard",
    highlight: false,
  },
  {
    name: "プロ",
    price: "¥29,800",
    period: "/月",
    description: "成長中のブランド・マーケ担当者に",
    features: [
      "同時進行案件 無制限",
      "インフルエンサー検索（無制限）",
      "チャット・ファイル共有",
      "詳細レポート・ROI分析",
      "マイルストーン支払い",
      "優先サポート",
    ],
    cta: "14日間無料で試す",
    href: "/admin/dashboard",
    highlight: true,
  },
  {
    name: "エンタープライズ",
    price: "お問い合わせ",
    period: "",
    description: "大規模チーム・代理店向け",
    features: [
      "プロの全機能",
      "専任カスタマーサクセス",
      "カスタムレポート",
      "API連携",
      "SLA保証",
    ],
    cta: "資料請求・相談する",
    href: "#contact",
    highlight: false,
  },
];

const testimonials = [
  {
    name: "田中 恵子",
    role: "マーケティング部長 / コスメブランドA",
    content:
      "以前はスプレッドシートで管理していましたが、Influencer Managerに切り替えてから工数が半分以下に。チャット・納品確認・支払いがまとまっているのが最高です。",
    rating: 5,
  },
  {
    name: "佐藤 大輝",
    role: "プロデューサー / フードEC B社",
    content:
      "インフルエンサー探しが圧倒的に楽になりました。エンゲージメント率でフィルタリングできるので、数字だけ多くて実効性の低いアカウントを避けられます。",
    rating: 5,
  },
  {
    name: "山本 さくら",
    role: "フリーランスインフルエンサー（フォロワー12万人）",
    content:
      "企業さんとのやりとりがチャットでまとまっているので、メールを掘り返す必要がなくなりました。報酬の支払い状況も一目でわかって安心感があります。",
    rating: 5,
  },
];

/* ───────────────────────────── コンポーネント ───────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── ナビゲーション ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Influencer Manager</span>
          </Link>

          {/* ナビリンク */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">機能</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">使い方</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">料金</a>
            <a href="#testimonials" className="hover:text-gray-900 transition-colors">導入事例</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              無料で始める
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── ヒーロー ── */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Zap className="h-3.5 w-3.5" />
          インフルエンサーマーケティングを、もっとシンプルに
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          インフルエンサーと<br />
          <span className="text-violet-600">案件をつなぐ</span>、<br />
          ひとつのプラットフォーム
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          ブランドとインフルエンサーを効率よくマッチング。<br />
          案件管理・チャット・納品確認・支払いまで、すべて一か所で完結します。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            14日間無料で試す
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/portal"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            インフルエンサーの方はこちら
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="text-xs text-gray-400">クレジットカード不要・いつでもキャンセル可能</p>
      </section>

      {/* ── 実績数字バー ── */}
      <section className="bg-violet-600 py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-bold mb-1">{s.value}</div>
              <div className="text-sm text-violet-200">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 機能 ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <TrendingUp className="h-3.5 w-3.5" />
            機能
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">すべてが揃ったオールインワン</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            インフルエンサーマーケティングに必要なすべての機能を、ひとつのプラットフォームにまとめました。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group border border-gray-100 rounded-2xl p-6 hover:border-violet-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 mb-4 group-hover:bg-violet-100 transition-colors">
                <f.icon className="h-5 w-5 text-violet-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 使い方 ── */}
      <section id="how-it-works" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <CheckCircle2 className="h-3.5 w-3.5" />
              使い方
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">4ステップで案件を完結</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              登録からインフルエンサーへの支払い完了まで、複雑な工程をシンプルなフローに整理しました。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%-12px)] w-full h-px bg-violet-200 z-0" />
                )}
                <div className="relative z-10 bg-white rounded-2xl p-6 border border-gray-100 h-full">
                  <div className="text-3xl font-bold text-violet-100 mb-3">{s.step}</div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 料金 ── */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <CreditCard className="h-3.5 w-3.5" />
            料金
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">シンプルな料金プラン</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            すべてのプランで14日間の無料トライアルをご利用いただけます。契約期間の縛りはありません。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                p.highlight
                  ? "bg-violet-600 text-white shadow-xl shadow-violet-200"
                  : "border border-gray-200 bg-white"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  人気プラン
                </div>
              )}
              <div className="mb-6">
                <h3 className={`text-base font-bold mb-1 ${p.highlight ? "text-violet-100" : "text-gray-900"}`}>
                  {p.name}
                </h3>
                <p className={`text-sm mb-4 ${p.highlight ? "text-violet-200" : "text-gray-500"}`}>
                  {p.description}
                </p>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-bold ${p.highlight ? "text-white" : "text-gray-900"}`}>
                    {p.price}
                  </span>
                  {p.period && (
                    <span className={`text-sm pb-1 ${p.highlight ? "text-violet-200" : "text-gray-400"}`}>
                      {p.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2
                      className={`h-4 w-4 mt-0.5 shrink-0 ${p.highlight ? "text-violet-300" : "text-violet-500"}`}
                    />
                    <span className={p.highlight ? "text-violet-100" : "text-gray-600"}>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={p.href}
                className={`w-full text-center text-sm font-semibold px-6 py-3 rounded-xl transition-colors ${
                  p.highlight
                    ? "bg-white text-violet-600 hover:bg-violet-50"
                    : "bg-violet-600 text-white hover:bg-violet-700"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 導入事例 ── */}
      <section id="testimonials" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <Star className="h-3.5 w-3.5" />
              導入事例
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">お客様の声</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 最終CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="bg-violet-600 rounded-3xl px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            インフルエンサーマーケティングを、<br />今すぐ効率化しませんか？
          </h2>
          <p className="text-violet-200 mb-8 max-w-xl mx-auto">
            14日間の無料トライアルで、すべての機能をお試しいただけます。クレジットカード不要です。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 bg-white text-violet-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-colors"
            >
              無料トライアルを開始
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portal"
              className="text-sm text-violet-200 hover:text-white transition-colors"
            >
              インフルエンサーとして登録 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── フッター ── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* ブランド */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-gray-900">Influencer Manager</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                ブランドとインフルエンサーを<br />つなぐプラットフォーム
              </p>
            </div>

            {/* 企業向け */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">企業向け</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link href="/admin/dashboard" className="hover:text-gray-900 transition-colors">ダッシュボード</Link></li>
                <li><Link href="/admin/campaigns" className="hover:text-gray-900 transition-colors">案件管理</Link></li>
                <li><Link href="/admin/influencers" className="hover:text-gray-900 transition-colors">インフルエンサー検索</Link></li>
                <li><Link href="/admin/messages" className="hover:text-gray-900 transition-colors">メッセージ</Link></li>
              </ul>
            </div>

            {/* インフルエンサー向け */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">インフルエンサー向け</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link href="/portal" className="hover:text-gray-900 transition-colors">ポータルトップ</Link></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">案件一覧</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">プロフィール編集</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">報酬履歴</a></li>
              </ul>
            </div>

            {/* サポート */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">サポート</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-gray-900 transition-colors">ヘルプセンター</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">利用規約</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">プライバシーポリシー</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-400">© 2026 Influencer Manager. All rights reserved.</p>
            <p className="text-xs text-gray-400">Made with ♡ in Japan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
