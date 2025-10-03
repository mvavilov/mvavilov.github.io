# Prof. Maxim Vavilov - Research Website

A sophisticated academic website for Prof. Maxim Vavilov's condensed matter theory and quantum computing research group at the University of Wisconsin-Madison.

## Features

- 🎓 **Academic Design**: Elegant typography with serif headings, muted color palette
- 📚 **Automatic Publications**: Real-time arXiv integration - publications auto-fetch on page load
- 🔬 **Physics-Focused**: Content emphasizes deep physics research (fluxonium qubits, Josephson junctions, circuit QED)
- 📱 **Responsive**: Works perfectly on all devices
- ⚡ **Fast**: Optimized CSS and efficient JavaScript

## Design Philosophy

**Sophisticated Academic Aesthetic** - not trendy, not startup-like
- Muted navy blues and charcoal backgrounds (no bright colors)
- Georgia serif for headings (elegant, academic)
- Clean, professional layout
- Minimal effects, maximum readability

## Key Pages

### Homepage (`index.md`)
- Professional hero section
- 6 research areas based on actual publications
- Recent publications highlight
- Collaborations & advisory board roles
- Contact call-to-action

### Publications (`publications.md`)
- **Automatically fetches from arXiv API**
- Organized by year
- Highlights Prof. Vavilov's name
- Links to arXiv, PDF, DOI
- No manual updates needed!

### Contact (`contact.md`)
- Contact information
- Prospective student information
- Collaboration opportunities

## Automatic arXiv Integration

Publications are fetched automatically from arXiv when the publications page loads:

```javascript
// Fetches from: https://export.arxiv.org/api/query
// Query: au:Maxim+G+Vavilov
// Displays: Latest 50 papers, sorted by date, grouped by year
```

**No manual updates required** - always current!

## Color Palette

```css
--color-primary: #2c4a6b;        /* Deep navy blue */
--color-secondary: #4a6b8a;      /* Muted steel blue */
--color-accent: #6b5b4a;         /* Warm bronze */
--color-bg-dark: #0d1117;        /* Deep charcoal */
--color-text: #e6edf3;           /* Soft white */
```

## Structure

```
├── _includes/              # Reusable components
│   ├── head.html          # HTML head
│   ├── navigation.html    # Navigation bar
│   └── footer.html        # Footer
├── _layouts/
│   └── default.html       # Default layout
├── css/
│   └── styles.css         # Main stylesheet (~650 lines)
├── js/
│   └── main.js            # JavaScript + arXiv fetching
├── index.md               # Homepage
├── publications.md        # Publications (auto-loading)
├── contact.md             # Contact page
└── _config.yml            # Jekyll configuration
```

## Local Development

```bash
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000`

## Deployment

Push to GitHub - automatically deploys via GitHub Pages.

## Customization

### Change Colors

Edit `css/styles.css`:

```css
:root {
    --color-primary: #2c4a6b;      /* Your color here */
    --color-secondary: #4a6b8a;
    --color-accent: #6b5b4a;
}
```

### Update Research Areas

Edit `index.md` - research areas based on Prof. Vavilov's actual publications

### Add Pages

Create `yourpage.md` with front matter:

```yaml
---
layout: default
title: "Your Title"
---

Your content here...
```

Update navigation in `_includes/navigation.html`

## Research Focus

Based on Prof. Vavilov's actual research:
- Fluxonium qubits (99.9%+ fidelity gates)
- Josephson junction physics
- Circuit QED theory
- Mesoscale & nanoscale physics
- Quantum many-body systems
- Quantum gate operations

## External Links

- arXiv: https://arxiv.org/search/?query=au:Maxim+G+Vavilov&searchtype=author
- ORCID: https://orcid.org/0000-0002-4953-8069
- Department: https://physics.wisc.edu/

## Technical Notes

- **Jekyll**: Static site generator
- **No database**: Publications fetched client-side from arXiv API
- **SEO optimized**: Proper meta tags and semantic HTML
- **Performance**: Single CSS file, minimal JavaScript
- **Accessibility**: WCAG compliant

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

© 2025 Prof. Maxim Vavilov. All rights reserved.

## Contact

Website issues: vavilov@wisc.edu

---

**Academic. Elegant. Automatic.**
