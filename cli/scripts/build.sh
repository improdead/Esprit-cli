#!/bin/bash
# Build Esprit CLI as a standalone binary using PyInstaller
#
# Usage:
#   ./scripts/build.sh [--release]
#
# Options:
#   --release    Build optimized release binary (strips debug info)
#
# Output:
#   dist/esprit  - Standalone executable

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building Esprit CLI...${NC}"

# Check for PyInstaller
if ! command -v pyinstaller &> /dev/null; then
    echo -e "${YELLOW}PyInstaller not found. Installing...${NC}"
    pip install pyinstaller
fi

# Check for UPX (optional, for compression)
if command -v upx &> /dev/null; then
    echo -e "${GREEN}UPX found, will compress binary${NC}"
    UPX_OPT=""
else
    echo -e "${YELLOW}UPX not found, binary will not be compressed${NC}"
    echo -e "${YELLOW}Install with: brew install upx${NC}"
    UPX_OPT="--noupx"
fi

# Clean previous builds
rm -rf build/ dist/

# Build options
BUILD_OPTS="--clean --noconfirm"

if [[ "$1" == "--release" ]]; then
    echo -e "${GREEN}Building release version...${NC}"
    BUILD_OPTS="$BUILD_OPTS --strip"
fi

# Build using spec file
echo -e "${GREEN}Running PyInstaller...${NC}"
pyinstaller $BUILD_OPTS $UPX_OPT esprit.spec

# Check if build succeeded
if [[ -f "dist/esprit" ]]; then
    # Get binary size
    SIZE=$(du -h dist/esprit | cut -f1)

    echo ""
    echo -e "${GREEN}Build successful!${NC}"
    echo -e "Binary: dist/esprit"
    echo -e "Size: $SIZE"
    echo ""

    # Test the binary
    echo -e "${GREEN}Testing binary...${NC}"
    ./dist/esprit --help > /dev/null 2>&1 && echo -e "${GREEN}Binary runs successfully!${NC}" || echo -e "${RED}Binary test failed${NC}"

    # Show version
    echo ""
    ./dist/esprit --version 2>/dev/null || true
else
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}To install globally:${NC}"
echo "  sudo cp dist/esprit /usr/local/bin/"
echo ""
echo -e "${GREEN}To create a release:${NC}"
echo "  tar -czvf esprit-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m).tar.gz -C dist esprit"
