from fastapi import APIRouter

router = APIRouter(prefix="/api/master", tags=["Master Data"])

CATEGORIES = ["ホテル＆宿泊", "飲食店", "体験＆ツアー"]
AREAS = ["全国", "関東", "関西", "東海", "九州・沖縄", "北海道・東北", "中国・四国", "海外"]
COUNTRIES = ["日本", "アメリカ", "韓国", "中国", "台湾", "東南アジア", "ヨーロッパ"]
PLATFORMS = ["Instagram", "YouTube", "TikTok"]
SKILLS = ["写真撮影", "動画編集", "ライティング", "グラフィックデザイン", "ライブ配信"]
LANGUAGES = ["日本語", "英語", "韓国語", "中国語（簡体字）", "中国語（繁体字）", "スペイン語", "フランス語", "その他"]


@router.get("/categories")
def get_categories():
    return CATEGORIES

@router.get("/areas")
def get_areas():
    return AREAS

@router.get("/countries")
def get_countries():
    return COUNTRIES

@router.get("/platforms")
def get_platforms():
    return PLATFORMS

@router.get("/skills")
def get_skills():
    return SKILLS

@router.get("/languages")
def get_languages():
    return LANGUAGES
