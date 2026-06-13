# toyp-koromo-map-web

トイプードル「ころも」のおでかけスポットを紹介するメインサイトです。

## 技術スタック

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (DB / Auth)
- **Cloudflare R2** (画像ストレージ)

## 開発環境のセットアップ

```bash
npm install
cp .env.local.example .env.local  # 環境変数を設定
npm run dev
```

<http://localhost:3000> で起動します。

## 環境変数

| 変数名 | 説明 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon キー |

## コマンド

```bash
npm run dev        # 開発サーバー起動 (port 3000)
npm run build      # プロダクションビルド
npm run test       # テスト実行
npm run test:watch # テスト監視モード
npm run lint       # Lint チェック
```

## 関連リポジトリ

- [toyp-koromo-map-admin](https://github.com/miriwo0104/toyp-koromo-map-admin) — 管理サイト (port 3001)
