# Security hardening changes

This project has a small set of conservative, zero-risk hardening steps applied so far:

1. Frontend: avoid using innerHTML for user-provided data
   - File changed: `frontend/profile/profile.js`
   - We now build DOM nodes with `document.createElement` and set `textContent`.
   - This prevents accidental XSS when `profileData` is replaced by external API responses.

2. Backend: sanitize user bio
   - File changed: `backend/core/models.py`
   - `CustomUser.save()` now strips any HTML from `bio` using `bleach` (tags=[]). This prevents stored XSS.
   - `bleach` is added to `requirements.txt`.

3. Tests
   - Added a unit test `test_bio_sanitized_on_save` in `backend/core/tests.py` to verify sanitization.

4. No `mark_safe`
   - We proactively searched the codebase for `mark_safe` and `|safe` usage; none found in the project's own templates. (Django library uses `mark_safe` internally.)

5. Suggested next steps (optional):
   - Add a Content-Security-Policy header in `settings.py` for production.
   - Sanitize and validate other free-text user input (posts, comments) at save-time.
   - Review any client-side code that uses `.innerHTML` or `dangerouslySetInnerHTML`.

If you'd like, I can add either a small integration test for the profile page or add `bleach` installation instructions to `README.md`.
