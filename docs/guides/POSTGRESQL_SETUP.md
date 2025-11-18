# PostgreSQL Setup Guide for Agora

## Prerequisites

Make sure PostgreSQL is installed on your system. If not:

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from https://www.postgresql.org/download/windows/

---

## Step 1: Create Database and User

Connect to PostgreSQL as the default user:

```bash
psql -U postgres
```

Then run these SQL commands:

```sql
-- Create the database
CREATE DATABASE agora_db;

-- Create the user
CREATE USER agora_user WITH PASSWORD 'password123';

-- Grant privileges
ALTER ROLE agora_user SET client_encoding TO 'utf8';
ALTER ROLE agora_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE agora_user SET default_transaction_deferrable TO on;
ALTER ROLE agora_user SET timezone TO 'UTC';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE agora_db TO agora_user;

-- Exit psql
\q
```

---

## Step 2: Update Database Credentials (if needed)

Edit `backend/agora_backend/settings.py` and update the DATABASES section:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'agora_db',          # Your database name
        'USER': 'agora_user',        # Your PostgreSQL username
        'PASSWORD': 'password123',   # Your PostgreSQL password
        'HOST': 'localhost',         # PostgreSQL host
        'PORT': '5432',              # PostgreSQL port
    }
}
```

---

## Step 3: Verify Connection

Test the connection from Python:

```bash
cd backend
python manage.py dbshell
```

If successful, you should see:

```
psql (15.x (Debian 15.x-1.pgdg120+1))
Type "help" for help.

agora_db=>
```

Type `\q` to exit.

---

## Step 4: Run Migrations

Once the database is created and connection is verified:

```bash
cd backend
python manage.py migrate
```

You should see output like:

```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, core, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying core.0001_initial... OK
  ...
```

---

## Step 5: Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account:

```
Username: admin
Email address: admin@agora.local
Password: 
Password (again): 
Superuser created successfully.
```

---

## Step 6: Run Development Server

```bash
python manage.py runserver
```

You should see:

```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

---

## Step 7: Access the Application

- **Profile Page**: http://localhost:8000/profile/
- **Admin Panel**: http://localhost:8000/admin/

Login with the superuser credentials you created.

---

## Troubleshooting

### Error: `psycopg2.OperationalError: FATAL: role "agora_user" does not exist`

**Solution**: The user wasn't created. Run the SQL commands in Step 1 again.

### Error: `psycopg2.OperationalError: FATAL: database "agora_db" does not exist`

**Solution**: The database wasn't created. Run these SQL commands:

```sql
CREATE DATABASE agora_db;
GRANT ALL PRIVILEGES ON DATABASE agora_db TO agora_user;
```

### Error: `connection refused` on port 5432

**Solution**: PostgreSQL is not running. Start it:

**macOS:**
```bash
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo systemctl start postgresql
```

### Error: `Couldn't connect to display ":0.0"`

**Solution**: You may need to create the PostgreSQL data directory. Try:

```bash
initdb /usr/local/var/postgres
postgres -D /usr/local/var/postgres
```

---

## Quick Reference Commands

```bash
# Start PostgreSQL
brew services start postgresql          # macOS
sudo systemctl start postgresql         # Linux

# Stop PostgreSQL
brew services stop postgresql           # macOS
sudo systemctl stop postgresql          # Linux

# Connect to database
psql -U agora_user -d agora_db

# List databases
psql -U postgres -l

# Backup database
pg_dump -U agora_user agora_db > backup.sql

# Restore database
psql -U agora_user agora_db < backup.sql
```

---

## Environment Variables (Optional)

For better security, use environment variables instead of hardcoding credentials:

Create a `.env` file in the `backend/` directory:

```
DATABASE_URL=postgresql://agora_user:password123@localhost:5432/agora_db
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
```

Then update `settings.py`:

```python
import os
from urllib.parse import urlparse

DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    db = urlparse(DATABASE_URL)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db.path[1:],
            'USER': db.username,
            'PASSWORD': db.password,
            'HOST': db.hostname,
            'PORT': db.port or '5432',
        }
    }
```

---

## Next Steps

Once PostgreSQL is running and migrations are complete:

1. Access the profile page: http://localhost:8000/profile/
2. Use the admin panel to manage users and data
3. Start building your features!

---

**Last Updated**: November 12, 2025
