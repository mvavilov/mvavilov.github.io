# Members Directory

This directory contains centralized member data for all research team members. Each member is defined by:

1. **Photo**: `member-name.jpg` or `member-name.png`
2. **Data**: `member-name.json` containing member information

## Default Image
The file `default.jpg` is used as a fallback when a member's photo is not available. Please do not delete this file.

## Adding a New Member

### 1. Create the JSON file

Create `member-name.json` with this structure:

```json
{
  "name": "Full Name",
  "personal_website": "https://member-website.com",
  "social_media": {
    "linkedin": "https://linkedin.com/in/username",
    "twitter": "https://twitter.com/username",
    "github": "https://github.com/username",
    "email": "member@university.edu"
  },
  "bio": "Brief description of research interests and background.",
  "position": "PhD Student",
  "email": "member@university.edu"
}
```

### 2. Add the photo (Optional)

Save the member's photo as `member-name.jpg` (or `.png`) matching the JSON filename.
If no photo is provided, the default image will be used automatically.

**Photo requirements:**
- Square aspect ratio (e.g., 400x400 pixels)
- Professional headshot
- File size under 500KB
- Formats: JPG, PNG, or WebP

### 3. Update research directions

In the research direction's `direction.md` file, add the member to the `members` array:

```yaml
---
title: "Research Direction"
members: ["member-name", "other-member"]
---
```

### 4. Regenerate data

Run the update script:
```bash
./update_research.sh
```

## Member Data Fields

### Required Fields
- `name`: Full display name

### Optional Fields
- `personal_website`: Member's personal/academic website
- `social_media`: Object with social media links
  - `linkedin`: LinkedIn profile
  - `twitter`: Twitter profile  
  - `github`: GitHub profile
  - `email`: Email address
  - `orcid`: ORCID identifier
  - `scholar`: Google Scholar profile
- `bio`: Brief description (1-2 sentences)
- `position`: Academic position (default: "Graduate Student")
- `email`: Contact email

## File Naming Convention

- Use lowercase letters and hyphens
- Match JSON and image filenames exactly
- Examples:
  - `john-smith.json` + `john-smith.jpg`
  - `mary-jane-watson.json` + `mary-jane-watson.png`

## Social Media Icons

The system automatically displays icons for supported platforms:
- LinkedIn: 🔗
- Twitter: 🐦  
- GitHub: 💻
- Email: 📧
- ORCID: 🆔
- Google Scholar: 🎓

## Example Member Files

### john-smith.json
```json
{
  "name": "John Smith",
  "personal_website": "https://johnsmith.github.io",
  "social_media": {
    "linkedin": "https://linkedin.com/in/johnsmith",
    "github": "https://github.com/johnsmith",
    "email": "john.smith@university.edu"
  },
  "bio": "PhD student working on quantum error correction and fault-tolerant quantum computing.",
  "position": "PhD Student",
  "email": "john.smith@university.edu"
}
```

### jane-doe.json
```json
{
  "name": "Dr. Jane Doe",
  "personal_website": "https://janedoe.com",
  "social_media": {
    "linkedin": "https://linkedin.com/in/janedoe",
    "orcid": "https://orcid.org/0000-0000-0000-0000"
  },
  "bio": "Postdoc researcher specializing in superconducting qubits and quantum control.",
  "position": "Postdoctoral Researcher",
  "email": "jane.doe@university.edu"
}
```

## Integration with Research Directions

Members are assigned to research directions via the `members` field in `direction.md`:

```yaml
---
title: "Quantum Computing Research"
order: 1
members: ["john-smith", "jane-doe"]
keywords: ["quantum", "computing"]
---
```

The website automatically:
- Displays member photos and information
- Links to personal websites
- Shows social media connections
- Uses default image if no photo is provided

## Automatic Updates

When you add, remove, or modify members:

1. The GitHub Actions workflow automatically detects changes
2. Regenerates the member data files
3. Updates the website
4. No manual intervention required after initial setup

This maintains the decoupled design while providing rich member information across all research directions. 