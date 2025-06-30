## Adding a New Research Direction

1. Create a new folder with a descriptive name (use hyphens for spaces)
2. Create the required subfolders: `images/` and `members/`
3. Create `direction.md` with the proper front matter and description
4. Add the research image to `images/research-image.jpg`
5. Add student photos to `members/` with proper filenames
6. The website will automatically include the new direction

### To add/remove team members:
- Add/remove photos in the `members/` folder, just follow the example of existing files

## Automatic Features

The website automatically:
- Scans all research direction folders
- Generates research cards for the homepage
- Displays team members with names derived from filenames
- Handles missing images gracefully with placeholders
- Sorts research directions by the `order` field