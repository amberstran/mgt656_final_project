#!/bin/bash
# Test runner script for all core tests

cd "$(dirname "$0")/backend"

echo "========================================="
echo "Running Automated Test Suite"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test settings
SETTINGS="agora_backend.test_settings"

# Function to run a test file
run_test() {
    local test_name=$1
    local test_path=$2
    
    echo "----------------------------------------"
    echo "Testing: $test_name"
    echo "----------------------------------------"
    
    if python manage.py test "$test_path" --settings=$SETTINGS 2>&1 | tee /tmp/test_output.txt | grep -q "OK"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        grep "Ran.*test" /tmp/test_output.txt
    else
        echo -e "${RED}❌ FAILED${NC}"
        grep -E "(ERROR|FAIL|Ran.*test)" /tmp/test_output.txt | head -5
    fi
    echo ""
}

# Run individual test files
run_test "Profile Tests" "core.tests.test_profile"
run_test "Circles API Tests" "core.tests.test_circles"
run_test "Model Tests" "core.tests.test_models"
run_test "View Tests" "core.tests.test_views"
run_test "Serializer Tests" "core.tests.test_serializers"

echo "========================================="
echo "Test Summary Complete"
echo "========================================="
echo ""
echo "To run tests individually:"
echo "  python manage.py test core.tests.test_profile --settings=$SETTINGS"
echo "  python manage.py test core.tests.test_circles --settings=$SETTINGS"
echo "  python manage.py test core.tests.test_models --settings=$SETTINGS"
echo "  python manage.py test core.tests.test_views --settings=$SETTINGS"
echo "  python manage.py test core.tests.test_serializers --settings=$SETTINGS"
