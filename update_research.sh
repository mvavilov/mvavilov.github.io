#!/bin/bash

# Update Research Directions Script
# Run this script whenever you add, remove, or modify research directions

echo "🔄 Updating research directions data..."

# Generate the research directions data file
ruby scripts/generate_research_data.rb

# Generate the members data file
ruby scripts/generate_members_data.rb

if [ $? -eq 0 ]; then
    echo "✅ Research directions data updated successfully!"
    echo ""
    echo "📁 Current research directions:"
    ls -1 research-directions/ | grep -v README.md | grep -v _includes
    echo ""
    echo "🌐 Your website will automatically update with these changes."
    echo "   If running locally, Jekyll will rebuild automatically."
    echo "   If using GitHub Pages, commit and push your changes."
else
    echo "❌ Error updating research directions data!"
    exit 1
fi 