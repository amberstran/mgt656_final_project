#!/bin/bash

# PostgreSQL Setup Script for Agora (macOS)

echo "🗄️  PostgreSQL Setup for Agora"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed"
    echo "Install from: https://brew.sh"
    exit 1
fi

# Check if PostgreSQL is installed
if ! brew list postgresql@15 &> /dev/null; then
    echo "ℹ️  Installing PostgreSQL 15..."
    brew install postgresql@15
    echo "✅ PostgreSQL installed"
else
    echo "✅ PostgreSQL already installed"
fi

# Start PostgreSQL
echo ""
echo "ℹ️  Starting PostgreSQL..."
brew services start postgresql@15
sleep 2
echo "✅ PostgreSQL started"

# Find psql path
PSQL_PATH=$(brew --prefix postgresql@15)/bin/psql

if [ ! -f "$PSQL_PATH" ]; then
    echo "❌ psql not found. Trying to add to PATH..."
    export PATH="$(brew --prefix postgresql@15)/bin:$PATH"
    PSQL_PATH="psql"
fi

# Create database and user
echo ""
echo "ℹ️  Creating database and user..."

$PSQL_PATH postgres << 'EOF'
DROP DATABASE IF EXISTS agora_db;
DROP USER IF EXISTS agora_user;

CREATE DATABASE agora_db;
CREATE USER agora_user WITH PASSWORD 'password123';

ALTER ROLE agora_user SET client_encoding TO 'utf8';
ALTER ROLE agora_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE agora_user SET default_transaction_deferrable TO on;
ALTER ROLE agora_user SET timezone TO 'UTC';

GRANT ALL PRIVILEGES ON DATABASE agora_db TO agora_user;
EOF

echo "✅ Database and user created"

# Test connection
echo ""
echo "ℹ️  Testing connection..."
if $PSQL_PATH -U agora_user -d agora_db -h localhost -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ Connection successful"
else
    echo "⚠️  First connection test failed, trying with password..."
    PGPASSWORD='password123' $PSQL_PATH -U agora_user -d agora_db -h localhost -c "SELECT 1"
    if [ $? -eq 0 ]; then
        echo "✅ Connection successful"
    else
        echo "❌ Connection failed"
        exit 1
    fi
fi

echo ""
echo "✅ PostgreSQL setup complete!"
echo ""
echo "Connection details:"
echo "  Host:     localhost"
echo "  Port:     5432"
echo "  Database: agora_db"
echo "  User:     agora_user"
echo "  Password: password123"
echo ""
echo "Next: Run 'bash START.sh' to start Agora"
echo ""
