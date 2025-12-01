# ⚠️ ARCHIVED - DO NOT USE

This directory (`core_archived_unused/`) is **NOT** the active Django app.

## Why This Directory Exists

This is an older/duplicate copy of the `core` app that was created during development. 
It has been archived on **December 1, 2025** to prevent confusion.

## Active App Location

The **ACTIVE** core app used by Django is located at:
```
backend/core/
```

This is the app referenced in `backend/agora_backend/settings.py`:
```python
INSTALLED_APPS = [
    ...
    'backend.core.apps.CoreConfig',  # ← Active app
]
```

## Key Differences

The active `backend/core/` has:
- ✅ Profile fields: `bio`, `avatar`, `program`, `grade`, `post_with_real_name`
- ✅ Bio sanitization with `bleach`
- ✅ Image upload support (`ImageField` on Post model)
- ✅ Test files and management commands
- ✅ More complete CircleMembership implementation

This archived version is missing:
- ❌ Profile expansion features
- ❌ Content sanitization
- ❌ Test infrastructure
- ❌ Latest API views

## What To Do

**For all development work**, edit files in `backend/core/`, not here.

If you need to reference old code, this archive is safe to browse but should not be imported or deployed.

## Safe to Delete?

Yes, after confirming the active `backend/core/` has all needed functionality, this directory can be completely removed.

---
*Archived by: GitHub Copilot*  
*Date: December 1, 2025*  
*Reason: Duplicate/outdated copy preventing confusion with active backend/core/*
