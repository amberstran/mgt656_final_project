from django.shortcuts import render


def profile_view(request):
    ctx = {
        "name":  "Yiru Li",
        "major": "Health Informatics",
        "year":  "Graduate Student",
        "posts": 3,
        "likes": 12,
        "sparks": 8,
        # "avatar_url": "https://i.pravatar.cc/128?img=47",  # 如需动态头像
    }
    return render(request, "profile.html", ctx)


