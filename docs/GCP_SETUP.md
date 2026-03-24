# GCP CI/CD セットアップガイド（ステージング＋本番）

## デプロイフロー

```
feature/* → develop にマージ → ステージング環境に自動デプロイ
                                    ↓ 動作確認OK
              develop → main にマージ → 本番環境に自動デプロイ
```

| 環境 | ブランチ | API サービス名 | Web サービス名 |
|------|---------|---------------|---------------|
| ステージング | `develop` | `influencerpf-api-stg` | `influencerpf-web-stg` |
| 本番 | `main` | `influencerpf-api` | `influencerpf-web` |

---

## 1. GCPリソース初期セットアップ

```bash
export PROJECT_ID="your-gcp-project-id"
export REGION="asia-northeast1"

# APIを有効化
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  secretmanager.googleapis.com \
  --project=$PROJECT_ID

# Artifact Registry リポジトリ作成
gcloud artifacts repositories create influencerpf \
  --repository-format=docker \
  --location=$REGION \
  --project=$PROJECT_ID
```

---

## 2. Cloud SQL セットアップ

```bash
# PostgreSQL インスタンス作成
gcloud sql instances create influencerpf-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=$REGION \
  --project=$PROJECT_ID

# 本番DB
gcloud sql databases create influencerpf \
  --instance=influencerpf-db --project=$PROJECT_ID

# ステージングDB（同じインスタンス内に別DB）
gcloud sql databases create influencerpf_stg \
  --instance=influencerpf-db --project=$PROJECT_ID

# DBユーザー
gcloud sql users create appuser \
  --instance=influencerpf-db \
  --password="YOUR_STRONG_PASSWORD" \
  --project=$PROJECT_ID
```

---

## 3. Secret Manager

```bash
# ── 本番用 ──
echo -n "postgresql://appuser:YOUR_PASSWORD@/influencerpf?host=/cloudsql/$PROJECT_ID:$REGION:influencerpf-db" | \
  gcloud secrets create DATABASE_URL --data-file=- --project=$PROJECT_ID

echo -n "$(openssl rand -hex 32)" | \
  gcloud secrets create SECRET_KEY --data-file=- --project=$PROJECT_ID

# ── ステージング用 ──
echo -n "postgresql://appuser:YOUR_PASSWORD@/influencerpf_stg?host=/cloudsql/$PROJECT_ID:$REGION:influencerpf-db" | \
  gcloud secrets create DATABASE_URL_STG --data-file=- --project=$PROJECT_ID

echo -n "$(openssl rand -hex 32)" | \
  gcloud secrets create SECRET_KEY_STG --data-file=- --project=$PROJECT_ID
```

---

## 4. Workload Identity Federation

```bash
SA_EMAIL="github-actions@$PROJECT_ID.iam.gserviceaccount.com"

# サービスアカウント作成
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions" --project=$PROJECT_ID

# ロール付与
for ROLE in roles/run.admin roles/artifactregistry.writer \
            roles/iam.serviceAccountUser roles/secretmanager.secretAccessor; do
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" --role="$ROLE"
done

# Workload Identity Pool
gcloud iam workload-identity-pools create github-pool \
  --location="global" --project=$PROJECT_ID

gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --project=$PROJECT_ID

# GitHub リポジトリとの紐付け
REPO="ichinose-cnctor/influencer_pf"
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/$REPO" \
  --project=$PROJECT_ID
```

---

## 5. GitHub Secrets 設定

リポジトリの Settings > Secrets and variables > Actions に登録:

| Secret名 | 説明 |
|-----------|------|
| `GCP_PROJECT_ID` | GCPプロジェクトID |
| `WIF_PROVIDER` | `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| `WIF_SERVICE_ACCOUNT` | `github-actions@PROJECT_ID.iam.gserviceaccount.com` |
| `FRONTEND_URL_PROD` | 本番フロントエンドURL（初回デプロイ後に設定） |
| `FRONTEND_URL_STG` | ステージングフロントエンドURL（初回デプロイ後に設定） |
| `API_URL_PROD` | 本番APIのURL（初回デプロイ後に設定） |
| `API_URL_STG` | ステージングAPIのURL（初回デプロイ後に設定） |

---

## 6. 初回手動デプロイ

```bash
# ── ステージング API ──
cd backend
gcloud run deploy influencerpf-api-stg \
  --source=. --region=$REGION --allow-unauthenticated \
  --add-cloudsql-instances=$PROJECT_ID:$REGION:influencerpf-db \
  --set-secrets=DATABASE_URL=DATABASE_URL_STG:latest,SECRET_KEY=SECRET_KEY_STG:latest \
  --project=$PROJECT_ID

# ── 本番 API ──
gcloud run deploy influencerpf-api \
  --source=. --region=$REGION --allow-unauthenticated \
  --add-cloudsql-instances=$PROJECT_ID:$REGION:influencerpf-db \
  --set-secrets=DATABASE_URL=DATABASE_URL:latest,SECRET_KEY=SECRET_KEY:latest \
  --project=$PROJECT_ID

# ── URLをメモして GitHub Secrets に設定 ──
# その後フロントエンドも同様にデプロイ
```

---

## 7. 日常の開発フロー

```bash
# 1. featureブランチで開発
git checkout develop
git checkout -b feature/new-feature

# 2. 開発・コミット
git add . && git commit -m "feat: 新機能追加"

# 3. developにマージ → ステージング自動デプロイ
git checkout develop && git merge feature/new-feature
git push origin develop
# → GitHub Actions → ステージング環境にデプロイ

# 4. ステージングで動作確認

# 5. mainにマージ → 本番自動デプロイ
git checkout main && git merge develop
git push origin main
# → GitHub Actions → 本番環境にデプロイ
```
