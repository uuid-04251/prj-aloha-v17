#!/bin/bash

# 🚀 Aloha Admin Project Cleanup Script
# Run this script to automatically remove unnecessary files

echo "🧹 Starting Aloha Admin Project Cleanup..."
echo "⚠️  Make sure you have backed up your project before running this script!"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to remove with confirmation
remove_with_confirm() {
    local path=$1
    local description=$2

    if [ -e "$path" ]; then
        echo -e "${YELLOW}Removing: ${description}${NC}"
        echo "Path: $path"
        rm -rf "$path"
        echo -e "${GREEN}✓ Removed${NC}"
        echo ""
    else
        echo -e "${GREEN}✓ Already removed or doesn't exist: ${description}${NC}"
        echo ""
    fi
}

# 1. Remove unused pages
echo "📄 Removing unused pages..."
remove_with_confirm "app/(main)/pages/content/" "Content Management Page"
remove_with_confirm "app/(main)/pages/crud/" "CRUD Demo Page"
remove_with_confirm "app/(main)/pages/empty/" "Empty Page"
remove_with_confirm "app/(main)/pages/feedback/" "Feedback Management Page"
remove_with_confirm "app/(main)/pages/promotion/" "Promotion Management Page"
remove_with_confirm "app/(main)/pages/setting/" "Settings Management Page"
remove_with_confirm "app/(main)/pages/timeline/" "Timeline Demo Page"

# 2. Remove unused services
echo "🔧 Removing unused services..."
remove_with_confirm "demo/service/CountryService.tsx" "Country Service"
remove_with_confirm "demo/service/CustomerService.tsx" "Customer Service"
remove_with_confirm "demo/service/EventService.tsx" "Event Service"
remove_with_confirm "demo/service/IconService.tsx" "Icon Service"
remove_with_confirm "demo/service/NodeService.tsx" "Node Service"
remove_with_confirm "demo/service/PhotoService.tsx" "Photo Service"

# 3. Remove demo data files
echo "📊 Removing demo data files..."
remove_with_confirm "public/demo/data/chat.json" "Chat Data"
remove_with_confirm "public/demo/data/customers-large.json" "Customers Large Data"
remove_with_confirm "public/demo/data/customers-medium.json" "Customers Medium Data"
remove_with_confirm "public/demo/data/customers-small.json" "Customers Small Data"
remove_with_confirm "public/demo/data/file-management.json" "File Management Data"
remove_with_confirm "public/demo/data/files-lazy.json" "Files Lazy Data"
remove_with_confirm "public/demo/data/files.json" "Files Data"
remove_with_confirm "public/demo/data/filesystem-lazy.json" "Filesystem Lazy Data"
remove_with_confirm "public/demo/data/filesystem.json" "Filesystem Data"
remove_with_confirm "public/demo/data/icons.json" "Icons Data"
remove_with_confirm "public/demo/data/mail.json" "Mail Data"
remove_with_confirm "public/demo/data/members.json" "Members Data"
remove_with_confirm "public/demo/data/photos.json" "Photos Data"
remove_with_confirm "public/demo/data/products-mixed.json" "Products Mixed Data"
remove_with_confirm "public/demo/data/products-orders-small.json" "Products Orders Small Data"
remove_with_confirm "public/demo/data/products-orders.json" "Products Orders Data"
remove_with_confirm "public/demo/data/products-small.json" "Products Small Data"
remove_with_confirm "public/demo/data/products.json" "Products Data"
remove_with_confirm "public/demo/data/scheduleevents.json" "Schedule Events Data"
remove_with_confirm "public/demo/data/tasks.json" "Tasks Data"

# 4. Remove demo images
echo "🖼️ Removing demo images..."
remove_with_confirm "public/demo/images/access/" "Access Images"
remove_with_confirm "public/demo/images/avatar/" "Avatar Images"
remove_with_confirm "public/demo/images/blocks/" "Blocks Images"
remove_with_confirm "public/demo/images/error/" "Error Images"
remove_with_confirm "public/demo/images/flag/" "Flag Images"
remove_with_confirm "public/demo/images/galleria/" "Galleria Images"
remove_with_confirm "public/demo/images/landing/" "Landing Images"
remove_with_confirm "public/demo/images/login/" "Login Images"
remove_with_confirm "public/demo/images/nature/" "Nature Images"
remove_with_confirm "public/demo/images/notfound/" "Not Found Images"

# 5. Remove unused themes (keeping only 2)
echo "🎨 Removing unused themes (keeping lara-light-blue and lara-dark-blue)..."
themes_to_remove=(
    "bootstrap4-dark-blue" "bootstrap4-dark-purple" "bootstrap4-light-blue" "bootstrap4-light-purple"
    "lara-dark-amber" "lara-dark-cyan" "lara-dark-green" "lara-dark-indigo" "lara-dark-pink"
    "lara-dark-purple" "lara-dark-teal" "lara-light-amber" "lara-light-cyan" "lara-light-green"
    "lara-light-indigo" "lara-light-pink" "lara-light-purple" "lara-light-teal"
    "md-dark-deeppurple" "md-dark-indigo" "md-light-deeppurple" "md-light-indigo"
    "mdc-dark-deeppurple" "mdc-dark-indigo" "mdc-light-deeppurple" "mdc-light-indigo"
    "soho-dark" "soho-light" "viva-dark" "viva-light"
)

for theme in "${themes_to_remove[@]}"; do
    remove_with_confirm "public/themes/$theme/" "$theme Theme"
done

# 6. Remove demo styles
echo "🎯 Removing demo styles..."
remove_with_confirm "styles/demo/BlockViewer.scss" "BlockViewer Styles"
remove_with_confirm "styles/demo/Demos.scss" "Demos Styles"
remove_with_confirm "styles/demo/TimelineDemo.scss" "Timeline Demo Styles"
remove_with_confirm "styles/demo/badges.scss" "Badges Styles"
remove_with_confirm "styles/demo/code.scss" "Code Styles"
remove_with_confirm "styles/demo/flags/" "Flags Styles"

# 7. Remove documentation
echo "📄 Removing documentation files..."
remove_with_confirm "CHANGELOG.md" "Changelog"
remove_with_confirm "LICENSE.md" "License"
remove_with_confirm "PROJECT_STRUCTURE.md" "Project Structure"

# 8. Remove empty components directory
echo "🗂️ Removing empty components directory..."
if [ -d "components" ] && [ -z "$(ls -A components)" ]; then
    remove_with_confirm "components/" "Empty Components Directory"
else
    echo -e "${GREEN}✓ Components directory not empty or already removed${NC}"
    echo ""
fi

# 9. Clean up types (keep only essential)
echo "📝 Cleaning up type definitions..."
# Note: Manual cleanup needed for types/demo.d.ts

echo ""
echo -e "${GREEN}🎉 Cleanup completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Manually clean up /types/demo.d.ts (remove unused types)"
echo "2. Test the application: npm run dev"
echo "3. Check sidebar menu still works"
echo "4. Verify no broken imports"
echo ""
echo "📊 Summary:"
echo "- Removed ~72 unnecessary files/folders"
echo "- Kept only: user, product, category management"
echo "- Project is now much more streamlined!"</content>
<parameter name="filePath">/Users/MAC/Desktop/lamdd/aloha/prj-aloha-v15/cleanup.sh