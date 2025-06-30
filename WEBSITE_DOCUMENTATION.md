# Website Documentation for Prof. Maxim Vavilov

## Overview

This website is built using Jekyll with an advanced decoupled architecture that automatically manages research directions. The site is organized into separate files and folders for easy maintenance and updates, following modern web development practices.

## File Structure

```
├── _layouts/                   # Website templates
│   └── default.html           # Main page template
├── _includes/                  # Reusable components
│   └── research-cards.html    # Research direction cards template
├── _plugins/                   # Jekyll plugins
│   └── research_directions.rb # Automatic research direction loader
├── css/                        # Styling files
│   ├── main.css               # Main styles
│   └── components.css         # Component-specific styles
├── js/                         # JavaScript functionality
│   └── main.js                # Main website functionality
├── images/                     # Store photos here
│   ├── professor.jpg          # Professor's photo
│   └── team.jpg               # Team photo
├── assets/                     # Other website assets
│   └── seeqc_us_logo.jpg      # SEEQC logo
├── research-directions/        # AUTOMATIC RESEARCH MANAGEMENT
│   ├── README.md              # Research directions guide
│   ├── fluxonium-qubits/      # Research direction folder
│   │   ├── direction.md       # Research content
│   │   ├── images/           # Research images
│   │   └── members/          # Student photos
│   └── [other-directions]/    # Additional research areas
├── index.md                    # MAIN CONTENT FILE
├── _config.yml                # Website configuration
└── WEBSITE_DOCUMENTATION.md   # This documentation file
```

## Key Features

### 🔄 **Automatic Research Direction Management**
The website automatically scans the `research-directions/` folder and generates research cards on the homepage. No manual coding required!

### 📱 **Responsive Design**
Works perfectly on desktop, tablet, and mobile devices.

### 📚 **Dynamic Publications**
Publications are automatically loaded from arXiv using your name.

### 👥 **Team Management**
Student photos and names are automatically displayed based on filename.

## How to Update Website Content

### 1. Adding Photos

**Professor Photo:**
1. Save your professional photo as `professor.jpg` in the `images/` folder
2. The website will automatically display it in place of the placeholder

**Team Photo:**
1. Save your team photo as `team.jpg` in the `images/` folder
2. The website will automatically display it at the bottom of the homepage

**Photo Requirements:**
- Format: JPG or PNG
- Professor photo: 800x600 pixels or similar aspect ratio
- Team photo: 1200x800 pixels or similar wide format
- File size: Keep under 2MB for fast loading

### 2. Managing Research Directions

#### **Adding a New Research Direction:**

1. **Create the folder structure:**
   ```
   research-directions/
   └── your-new-research-area/
       ├── direction.md
       ├── images/
       │   └── research-image.jpg
       └── members/
           ├── student-name-1.jpg
           └── student-name-2.jpg
   ```

2. **Create `direction.md` with this format:**
   ```yaml
   ---
   title: "Your Research Area Title"
   order: 5
   keywords: ["keyword1", "keyword2", "keyword3"]
   papers:
     - title: "Paper Title"
       authors: "Author list"
       journal: "Journal name"
       year: 2024
       url: "https://arxiv.org/abs/xxxx.xxxxx"
   ---

   Brief description of your research area. This text appears on the homepage card.
   ```

3. **Add the research image** to `images/research-image.jpg`

4. **Add student photos** to `members/` folder (filename becomes display name)

5. **Update the website data** by running: `./update_research.sh`

#### **Updating Existing Research Directions:**

- **Change description**: Edit the content in `direction.md`
- **Add/remove papers**: Update the `papers` section in `direction.md`
- **Add/remove students**: Add/remove photos in the `members/` folder
- **Change research image**: Replace `images/research-image.jpg`
- **After any changes**: Run `./update_research.sh` to update the website

#### **Student Photo Naming:**
- `john-smith.jpg` displays as "John Smith"
- `mary-johnson.jpg` displays as "Mary Johnson"
- Use hyphens for spaces, lowercase filenames

### 3. Adding News Items

Edit `index.md` and find the "News Section". Add new items at the top:

```html
<div class="news-item">
    <div class="news-date">Month Year</div>
    <div class="news-content">
        Your news content here...
    </div>
</div>
```

**Example:**
```html
<div class="news-item">
    <div class="news-date">January 2025</div>
    <div class="news-content">
        Our paper on quantum error correction was accepted at Physical Review Letters.
    </div>
</div>
```

### 4. Updating Research Directions

**Important**: After adding, removing, or modifying research directions, you must run the update script:

```bash
./update_research.sh
```

This script:
- Scans your `research-directions/` folder
- Generates the data file that powers the website
- Shows you which research directions are currently active
- Works with both local development and GitHub Pages

**When to run the update script:**
- After adding a new research direction folder
- After removing a research direction folder  
- After modifying `direction.md` files
- After changing research direction content

### 5. Publications

Publications are **completely automatic**! The system:
- Searches arXiv for papers with "Maxim Vavilov" as author
- Filters for quantum physics papers
- Displays the 50 most recent papers
- Updates automatically when visitors view the Publications page

**No manual updates needed for publications!**

### 5. SEEQC Advisory Information

The SEEQC advisory board card is automatically displayed. To update:
- Edit the text in the "SEEQC Advisory Card" section of `index.md`
- The logo is stored in `/assets/seeqc_us_logo.jpg`

## Website Sections Explained

### Home Page (All-in-One)
- **Welcome message** and professor photo
- **SEEQC advisory board** information with logo
- **Research directions** automatically generated from folders
- **Team photo** at the bottom

### Publications Page
- Automatically populated from arXiv
- Shows title, authors, publication date, and abstract
- Links directly to PDFs on arXiv

### News Page
- Manually updated news items
- Chronological display (newest first)

## Advanced Features

### Automatic Research Cards
Each research direction automatically displays:
- Research image from `images/research-image.jpg`
- Title and description from `direction.md`
- Up to 3 related papers with links
- Team member photos with names
- Keyword tags

### Smart Image Handling
- Shows actual images when available
- Shows helpful placeholders when images are missing
- Provides exact file paths for easy image addition

### Responsive Team Display
- Student photos are displayed in a responsive grid
- Names are automatically formatted from filenames
- Hover effects for better interactivity

## File Naming Conventions

### Research Directions
- **Folder names**: `quantum-error-correction` (lowercase, hyphens)
- **Content file**: Always `direction.md`
- **Research image**: Always `research-image.jpg` or `research-image.png`

### Student Photos
- **Format**: `firstname-lastname.jpg` (lowercase, hyphens for spaces)
- **Examples**: `john-smith.jpg`, `mary-jane-watson.jpg`
- **Size**: 150x150 pixels (square), under 500KB

### Main Photos
- **Professor**: `images/professor.jpg`
- **Team**: `images/team.jpg`

## Troubleshooting

### Research Direction Not Showing
1. Check that the folder is in `research-directions/`
2. Verify `direction.md` exists with proper front matter
3. Check YAML formatting (indentation matters!)
4. Ensure `order` field is a number

### Images Not Displaying
1. Check exact filenames match requirements
2. Verify images are in correct subfolders
3. Check file extensions (.jpg, .png)
4. Ensure images aren't corrupted

### Student Names Not Displaying
1. Check filename format: `firstname-lastname.jpg`
2. Use lowercase filenames
3. Use hyphens (not underscores or spaces)
4. Ensure photos are in `members/` subfolder

## Quick Reference

### Most Common Tasks

1. **Add a new student to a research direction:**
   - Save photo as `firstname-lastname.jpg` in the appropriate `members/` folder

2. **Update research description:**
   - Edit the content below the `---` in `direction.md`

3. **Add a new research paper:**
   - Add to the `papers:` section in `direction.md`

4. **Add news:**
   - Add a new `news-item` div at the top of the news section in `index.md`

5. **Change photos:**
   - Replace `images/professor.jpg` or `images/team.jpg`

### Getting Help

**For content updates**: Follow this documentation
**For technical issues**: Contact your web developer
**For research direction problems**: Check `research-directions/README.md`

---

**Remember**: The website automatically rebuilds when you make changes. Most updates appear within a few minutes of saving your files! 