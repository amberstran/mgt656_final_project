# core/views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.conf import settings

LEVELS = [
    {"name": "Ember",  "min": 0,  "max": 19,  "hint": "A faint ember — your journey just begins."},
    {"name": "Spark",  "min": 20, "max": 39,  "hint": "You’re lighting up the space with ideas."},
    {"name": "Flame",  "min": 40, "max": 69,  "hint": "Your energy is felt across the community."},
    {"name": "Blaze",  "min": 70, "max": 94,  "hint": "You’re a blazing fire — driving discussions."},
    {"name": "Aurora", "min": 95, "max": 999, "hint": "A rare light that inspires others."},
]

def _calc_level(score: int):
    for r in LEVELS:
        if r["min"] <= score <= r["max"]:
            return r
    return LEVELS[0]

@login_required
def profile_view(request):
    # 模拟统计数据（后期可改为真实帖子/互动）
    stats = {
        "posts": 3,
        "comments": 4,
        "likes": 10,
    }
    score = stats["posts"] * 5 + stats["comments"] * 2 + stats["likes"]
    level = _calc_level(score)
    stats.update({"score": score, "level_name": level["name"], "level_hint": level["hint"]})
    return render(request, "profile.html", {"stats": stats})

@login_required
def canvas_verify_view(request):
    # 如果你想直接跳 Canvas 官网（例如耶鲁）
    canvas_url = getattr(settings, "CANVAS_EXTERNAL_URL", "https://yale.instructure.com/")
    return HttpResponseRedirect(canvas_url)




