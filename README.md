# MedGym — 筋トレ × 医学学習アプリ

医療系学生（看護・医学・PT・OT）向けの筋トレ記録 × 医学学習 Web アプリです。
トレーニングを記録すると、鍛えた筋肉の解剖学情報や国試問題が AI で自動生成されます。

## 機能

- **カレンダー付きトレーニング記録** — 部位・メニュー・重量・回数・セット数を記録
- **AI医学情報生成** — 起始停止・支配神経・関連疾患をClaude APIで自動生成（日別キャッシュ）
- **国試問題（5択）** — 毎日テーマが変わる看護師/医師/PT/OT国試レベルの問題
- **復習テスト** — その日に閲覧した問題をまとめて復習、スコア表示
- **振り返りグラフ** — 重量推移の折れ線グラフ、部位バランスのドーナツグラフ
- **カスタムメニュー追加** — マスターにないメニューを自由に登録可能
- **ダーク/ライトモード** — next-themes で切替対応

## 技術スタック

- Next.js 14（App Router）/ TypeScript
- Tailwind CSS / Framer Motion
- SQLite（sql.js — WebAssembly版）
- Anthropic Claude API（claude-sonnet-4-5）
- Recharts（グラフ）/ Lucide React（アイコン）

## ローカル起動手順

### 1. リポジトリをクローン

```bash
git clone <リポジトリURL>
cd medgym
```

### 2. 依存パッケージをインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env.local` を編集し、Anthropic API キーを設定してください。

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
DATABASE_PATH=./medgym.db
```

API キーは [Anthropic Console](https://console.anthropic.com/) で取得できます。

### 4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## Vercel デプロイ手順

### 1. Vercel にプロジェクトをインポート

GitHub リポジトリを Vercel にインポートします。

### 2. 環境変数を設定

Vercel ダッシュボードの **Settings → Environment Variables** で以下を設定:

| 変数名 | 値 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic API キー |
| `DATABASE_PATH` | `/tmp/medgym.db` |

### 3. デプロイ

メインブランチにプッシュすると自動デプロイされます。

### 本番運用の注意点

Vercel の `/tmp` ディレクトリは関数再起動でリセットされる可能性があります。
本番運用では **Turso**（SQLite互換クラウドDB）への移行を推奨します。

## ライセンス

MIT
