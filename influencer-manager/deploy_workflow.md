# フロントエンド・デプロイ ワークフロー

このファイルは、デプロイにおけるミス（ビルドエラーの未確認、環境変数の欠落）を根絶するために策定された厳格な手順書です。Antigravity は,デプロイにあたり必ずこの手順を順守しなければなりません。

## 1. 事前ビルド確認（必須）
デプロイ前に必ずローカル環境でビルドを完遂させ、ソースコードの整合性を担保します。
```powershell
# influencer-manager ディレクトリで実行
npm run build
```
- **確認事項**: `Compiled successfully` が表示され、`Exit code: 0` であること。
- **異常時**: ビルドに失敗した場合は、修正を行うまで絶対にデプロイコマンドを実行しないこと。

## 2. 環境変数の注入
ビルド引数としての API 参照先の設定が、今回のデプロイ環境に適しているかを検証します。
- **Staging URL**: `https://influencerpf-api-stg-452312580.asia-northeast1.run.app`
- **注入方法**: `--set-build-env-vars=NEXT_PUBLIC_API_URL=[URL]` をデプロイコマンドに含める。

## 3. デプロイ実行
```powershell
gcloud run deploy influencerpf-web-stg --source . --region asia-northeast1 --allow-unauthenticated --set-build-env-vars=NEXT_PUBLIC_API_URL=https://influencerpf-api-stg-452312580.asia-northeast1.run.app
```

## 4. 反映後の最終確認
デプロイ完了後、ターゲットのサービスが稼働しているかを確認します。
```powershell
gcloud run services list --region asia-northeast1
```
- **確認事項**: `LAST DEPLOYED AT` が現在時刻付近であること。
- **UI確認**: ステージング環境の該当ページ（一覧・詳細）を自らチェックし、修正およびデータ取得が正常であることを目視確認する。
