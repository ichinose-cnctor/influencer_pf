# ステージング環境 テストデータリセット・スクリプト
# 実行すると、全ての案件、応募、メッセージ、ダミーインフルエンサーを一括削除します。

$API_URL = "https://influencerpf-api-stg-452312580.asia-northeast1.run.app/api/seed/reset"

Write-Host "==== ステージング環境のデータをリセット中.... ====" -ForegroundColor Cyan

try {
    # POSTリクエスト実行
    $response = Invoke-RestMethod -Uri $API_URL -Method Post -ErrorAction Stop
    
    if ($response.status -eq "success") {
        Write-Host "成功: " $response.message -ForegroundColor Green
    } else {
        Write-Host "失敗: " $response.message -ForegroundColor Red
    }
} catch {
    Write-Host "エラーが発生しました: 接続できないか、エンドポイントが未デプロイの可能性があります。" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

Write-Host "`n完了しました。"
