#!/bin/bash

##############################################################################
# 🚀 AGORA YALE - Complete Startup Script
# 
# This script sets up and runs the complete Agora application with:
# - Django Backend (API + Profile)
# - React Frontend
# - Email Verification System
# - Database Setup
#
# Usage: bash START.sh [option]
# Options:
#   start       - Start both backend and frontend (default)
#   backend     - Start only Django backend
#   frontend    - Start only React frontend
#   db-setup    - Initialize database
#   clean       - Remove temporary files
#   help        - Show this help message
##############################################################################

set -e

# Add PostgreSQL to PATH if it exists
export PATH="/usr/local/opt/postgresql@15/bin:$PATH"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/backend/agora_frontend"
VENV_DIR="$PROJECT_ROOT/venv"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════╗"
echo "║     🔥 AGORA YALE - Community Discussion App 🔥     ║"
echo "╚════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================================================
# Helper Functions
# ============================================================================

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_python() {
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is not installed"
        exit 1
    fi
    log_success "Python $(python3 --version | cut -d' ' -f2) found"
}

check_node() {
    if ! command -v node &> /dev/null; then
        log_warning "Node.js is not installed - React frontend won't work"
        log_info "Install Node.js from https://nodejs.org/"
        return 1
    fi
    log_success "Node.js $(node --version | cut -d'v' -f2) found"
    return 0
}

check_postgres() {
    if ! command -v psql &> /dev/null; then
        log_warning "PostgreSQL is not installed - using SQLite for development"
        return 1
    fi
    log_success "PostgreSQL found"
    return 0
}

setup_venv() {
    if [ ! -d "$VENV_DIR" ]; then
        log_info "Creating virtual environment..."
        python3 -m venv "$VENV_DIR"
        log_success "Virtual environment created"
    else
        log_success "Virtual environment exists"
    fi
    
    # Activate virtual environment
    source "$VENV_DIR/bin/activate"
    log_success "Virtual environment activated"
}

install_dependencies() {
    log_info "Installing Python dependencies..."
    pip install --upgrade pip setuptools wheel > /dev/null 2>&1
    pip install -r "$PROJECT_ROOT/requirements.txt" > /dev/null 2>&1
    log_success "Python dependencies installed"
}

setup_env_file() {
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        log_info "Creating .env file from template..."
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
        log_success ".env file created"
        log_warning "Please edit .env to configure email settings if needed"
    else
        log_success ".env file exists"
    fi
}

setup_database() {
    log_info "Setting up database..."
    cd "$BACKEND_DIR"
    
    # Run migrations
    python manage.py makemigrations --noinput > /dev/null 2>&1 || true
    python manage.py migrate --noinput > /dev/null 2>&1 || true
    
    log_success "Database migrations completed"
    
    # Check if superuser exists
    if ! python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.get(username='admin')" 2>/dev/null; then
        log_info "Creating superuser (admin/admin)..."
        python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('✅ Superuser created: admin/admin')
else:
    print('✅ Superuser already exists')
END
    else
        log_success "Superuser already exists"
    fi
}

# ============================================================================
# Start Functions
# ============================================================================

start_backend() {
    log_info "Starting Django backend..."
    cd "$BACKEND_DIR"
    
    # Check if port 8000 is available
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        log_warning "Port 8000 is already in use"
        log_info "Kill existing process: lsof -ti:8000 | xargs kill -9"
        return 1
    fi
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🔧 Django Backend Running${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📍 Backend URL: http://localhost:8000${NC}"
    echo -e "${BLUE}📍 Admin Panel: http://localhost:8000/admin${NC}"
    echo -e "${BLUE}📍 Profile: http://localhost:8000/profile${NC}"
    echo -e "${BLUE}📍 Email Verify: http://localhost:8000/email-verify${NC}"
    echo ""
    echo -e "${YELLOW}Credentials:${NC}"
    echo -e "${YELLOW}  Username: admin${NC}"
    echo -e "${YELLOW}  Password: admin${NC}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
    echo ""
    
    python manage.py runserver 0.0.0.0:8000
}

start_frontend() {
    log_info "Starting React frontend..."
    
    if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        log_info "Installing Node.js dependencies..."
        cd "$FRONTEND_DIR"
        npm install > /dev/null 2>&1
        log_success "Node.js dependencies installed"
    fi
    
    cd "$FRONTEND_DIR"
    
    # Check if port 3000 is available
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        log_warning "Port 3000 is already in use"
        return 1
    fi
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}⚛️  React Frontend Running${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📍 Frontend URL: http://localhost:3000${NC}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
    echo ""
    
    npm start
}

start_both() {
    log_info "Starting both backend and frontend..."
    
    # Start backend in background
    log_info "Launching backend in new terminal..."
    
    if command -v open &> /dev/null; then
        # macOS
        open -a Terminal "$PROJECT_ROOT/START.sh"
        sleep 1
        
        # Terminal window opened, run backend
        osascript << EOF
tell application "Terminal"
    do script "cd '$PROJECT_ROOT' && source venv/bin/activate && bash START.sh backend"
end tell
EOF
        sleep 2
    else
        # Linux - try gnome-terminal or xterm
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd '$PROJECT_ROOT' && source venv/bin/activate && bash START.sh backend; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd '$PROJECT_ROOT' && source venv/bin/activate && bash START.sh backend" &
        else
            log_warning "Could not open new terminal. Starting backend in background..."
            source "$VENV_DIR/bin/activate"
            cd "$BACKEND_DIR"
            python manage.py runserver > /tmp/agora_backend.log 2>&1 &
            sleep 2
        fi
    fi
    
    # Start frontend
    start_frontend
}

clean_files() {
    log_info "Cleaning temporary files..."
    
    find "$PROJECT_ROOT" -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
    find "$PROJECT_ROOT" -type f -name "*.pyc" -delete 2>/dev/null || true
    rm -rf "$PROJECT_ROOT/backend/db.sqlite3" 2>/dev/null || true
    rm -rf "$FRONTEND_DIR/node_modules" 2>/dev/null || true
    rm -rf "$FRONTEND_DIR/build" 2>/dev/null || true
    
    log_success "Temporary files cleaned"
}

show_help() {
    cat << EOF

${BLUE}═══════════════════════════════════════════════════════════${NC}
${BLUE}  AGORA YALE - Startup Script Help${NC}
${BLUE}═══════════════════════════════════════════════════════════${NC}

${GREEN}Usage:${NC}
    bash START.sh [option]

${GREEN}Options:${NC}
    start       Start both backend and frontend (default)
    backend     Start only Django backend (port 8000)
    frontend    Start only React frontend (port 3000)
    db-setup    Initialize and setup database
    setup       Run full setup (venv, deps, db)
    clean       Remove temporary files
    help        Show this help message

${GREEN}Examples:${NC}
    bash START.sh                  # Start both services
    bash START.sh backend          # Backend only
    bash START.sh frontend         # Frontend only
    bash START.sh db-setup         # Setup database
    bash START.sh setup            # Full setup
    bash START.sh clean            # Clean temp files

${GREEN}Default Ports:${NC}
    Backend (Django):    http://localhost:8000
    Frontend (React):    http://localhost:3000
    Admin Panel:         http://localhost:8000/admin

${GREEN}Admin Credentials:${NC}
    Username: admin
    Password: admin

${GREEN}Key Endpoints:${NC}
    /                          - Home page
    /profile/                  - User profile
    /email-verify/             - Email verification
    /admin/                    - Django admin panel
    /api/profile/              - Profile API
    /api/email-verify/         - Email verification API

${GREEN}Documentation:${NC}
    EMAIL_VERIFICATION_SETUP.md       - Email configuration
    EMAIL_VERIFICATION_QUICK_START.md - Quick reference
    PROFILE_IMPLEMENTATION_GUIDE.md   - Profile documentation
    README_PROFILE.md                 - Profile overview

${GREEN}Troubleshooting:${NC}
    Port already in use?
        $ lsof -ti:8000 | xargs kill -9   # Kill backend (8000)
        $ lsof -ti:3000 | xargs kill -9   # Kill frontend (3000)
    
    Reset database?
        $ rm backend/db.sqlite3
        $ bash START.sh db-setup
    
    Clean everything?
        $ bash START.sh clean
        $ bash START.sh setup

${BLUE}═══════════════════════════════════════════════════════════${NC}

EOF
}

# ============================================================================
# Main Script
# ============================================================================

main() {
    local option="${1:-start}"
    
    case "$option" in
        start)
            log_info "Starting Agora..."
            check_python
            check_node || log_warning "React frontend may not work without Node.js"
            check_postgres || log_info "Using SQLite for development"
            setup_venv
            install_dependencies
            setup_env_file
            setup_database
            start_both
            ;;
        backend)
            check_python
            check_postgres || log_info "Using SQLite for development"
            setup_venv
            install_dependencies
            setup_env_file
            setup_database
            start_backend
            ;;
        frontend)
            check_node || exit 1
            start_frontend
            ;;
        db-setup)
            check_python
            setup_venv
            install_dependencies
            setup_env_file
            setup_database
            log_success "Database setup complete!"
            ;;
        setup)
            check_python
            check_node || log_warning "Node.js not found - skipping frontend setup"
            setup_venv
            install_dependencies
            setup_env_file
            setup_database
            log_success "Full setup complete!"
            ;;
        clean)
            clean_files
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown option: $option"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
