## Features

- **Automatic Publications**: Dynamic loading of publications from arXiv
- **Organized Structure**: Modular file organization for easy maintenance
- **Mobile Friendly**: Responsive design that works on all devices

## Quick Start

### Local Development

1. **Prerequisites**:
   - Ruby (version 2.7 or higher)
   - Bundler gem
   - Jekyll gem

2. **Installation**:
   ```bash
   git clone <repository-url>
   cd PI_website_fork
   bundle install
   ```

3. **Run locally**:
   ```bash
   bundle exec jekyll serve --livereload
   ```
   
4. **View the website**:
   Open your browser to `http://localhost:4000`

### GitHub Pages Deployment

The website is configured to deploy automatically to GitHub Pages:

1. Push changes to the `main` branch
2. GitHub Actions will build and deploy the site
3. Visit your GitHub Pages URL to see the live site