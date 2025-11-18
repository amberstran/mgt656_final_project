# 🗄️ PostgreSQL Setup for macOS

## Step 1: Install PostgreSQL

### Option A: Using Homebrew (Recommended)
```bash
brew install postgresql@15
```

### Option B: Download Installer
Visit: https://www.postgresql.org/download/macosx/

---

## Step 2: Start PostgreSQL

```bash
# Start PostgreSQL service
brew services start postgresql@15

# Verify it's running
brew services list | grep postgresql
```

---

## Step 3: Create Database & User

```bash
# Connect to PostgreSQL
psql postgres

# In psql, run these commands:
CREATE DATABASE agora_db;
CREATE USER agora_user WITH PASSWORD 'password123';
ALTER ROLE agora_user SET client_encoding TO 'utf8';
ALTER ROLE agora_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE agora_user SET default_transaction_deferrable TO on;
ALTER ROLE agora_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE agora_db TO agora_user;
\c agora_db
GRANT ALL ON SCHEMA public TO agora_user;
\q
```

---

## Step 4: Test Connection

```bash
psql -U agora_user -d agora_db -h localhost
```

If you can connect, you're good! Type `\q` to exit.

---

## Step 5: Run Agora

Now run the startup script:
```bash
bash START.sh
```

It should now connect to PostgreSQL successfully!

---

## Troubleshooting

### PostgreSQL won't start
```bash
# Check status
brew services list

# Stop and restart
brew services stop postgresql@15
brew services start postgresql@15
```

### Can't connect to PostgreSQL
```bash
# Check if running on port 5432
lsof -i :5432

# Restart PostgreSQL
brew services restart postgresql@15
```

### Wrong password
```bash
# Reset password for agora_user
psql postgres
ALTER USER agora_user WITH PASSWORD 'password123';
\q
```

### Database already exists
```bash
# Drop and recreate
psql postgres
DROP DATABASE IF EXISTS agora_db;
CREATE DATABASE agora_db;
GRANT ALL PRIVILEGES ON DATABASE agora_db TO agora_user;
\q
```

---

## Verify Setup

After starting PostgreSQL:

```bash
# Check if PostgreSQL is running
ps aux | grep postgres

# List databases
psql -U agora_user -d agora_db -h localhost -c "\l"

# List users
psql postgres -c "\du"
```

---

## Next Steps

Once PostgreSQL is set up and running:

```bash
cd /Users/liyiru/mgt656_final_project
bash START.sh
```

Your Agora website will start with PostgreSQL! 🚀

---

## Full Connection Details

```
Host:     localhost
Port:     5432
Database: agora_db
User:     agora_user
Password: password123
```

Make sure these match `backend/agora_backend/settings.py` DATABASES configuration.

---

## Stop PostgreSQL (when done)

```bash
brew services stop postgresql@15
```

---

**Questions?** Check `docs/guides/POSTGRESQL_SETUP.md` for more details.
