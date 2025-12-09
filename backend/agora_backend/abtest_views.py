"""
A/B Test endpoint for MGT656 Final Project
Team nickname: milky-hill
Team endpoint: /1317cca
"""
import random

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Team member nicknames
TEAM_MEMBERS = [
    "delightful-hamster",
    "light-hedgehog",
    "zealous-scorpion"
]

@csrf_exempt
@require_http_methods(["GET"])
def abtest_view(request):
    """
    A/B test endpoint that displays team members and a button
    Button alternates between 'kudos' (Variant A) and 'thanks' (Variant B)
    Uses session-based assignment for consistency per visitor
    """
    # Check if user already has an assigned variant in their session
    if 'ab_variant' not in request.session:
        # Randomly assign variant A or B (50/50 split)
        request.session['ab_variant'] = random.choice(['A', 'B'])

    variant = request.session['ab_variant']
    button_text = 'kudos' if variant == 'A' else 'thanks'

    # Track the variant assignment (optional: you can log this to database)
    # For now, we'll just pass it to the template

    context = {
        'team_members': TEAM_MEMBERS,
        'button_text': button_text,
        'variant': variant
    }

    return render(request, 'abtest.html', context)
