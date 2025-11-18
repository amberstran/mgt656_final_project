
# ===== local settings (dev) =====
from .settings import *            # 先继承主设置
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# 避免环境变量覆盖（例如 DATABASE_URL）
os.environ.pop("DATABASE_URL", None)

# 强制使用 SQLite（不再连 5432）
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# 模板目录（如果你把 profile.html 放在 backend/templates，就保留这行即可）
# 如需额外前端模板目录，可按需追加：
# TEMPLATES[0]["DIRS"] = [BASE_DIR / "templates"] + list(TEMPLATES[0].get("DIRS", []))

# 本地调试友好
DEBUG = True
ALLOWED_HOSTS = ["*"]

# （可选）CAS 成功后回到 /profile/
LOGIN_REDIRECT_URL = "/profile/"
LOGOUT_REDIRECT_URL = "/profile/"

# （可选）Canvas 外链：如果有需要从 /canvas/ 跳过去
CANVAS_EXTERNAL_URL = "https://yale.instructure.com/"
