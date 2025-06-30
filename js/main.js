// Main JavaScript functionality for Professor Vavilov's website

class ProfessorWebsite {
    constructor() {
        this.currentSection = 'home';
        this.publications = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupNavigation();
            this.showSection('home');
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                this.setActiveNavLink(link);
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.add('hidden'));

        // Show the requested section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = sectionName;

            // Load section-specific content
            if (sectionName === 'publications' && this.publications.length === 0) {
                this.loadPublications();
            }
        }
    }

    setActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    async loadPublications() {
        const container = document.getElementById('publications-list');
        if (!container) return;

        // Show loading state
        container.innerHTML = `
            <div class="publication-loading">
                <span class="loading-spinner"></span>
                Loading publications from arXiv...
            </div>
        `;

        try {
            const arxivQuery = 'https://export.arxiv.org/api/query?search_query=au:Maxim+Vavilov+AND+cat:quant-ph&sortBy=submittedDate&sortOrder=descending&max_results=50';
            const response = await fetch(arxivQuery);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            const entries = xmlDoc.querySelectorAll('entry');
            this.publications = Array.from(entries).map(entry => this.parsePublicationEntry(entry));

            this.renderPublications();
        } catch (error) {
            console.error('Error loading publications:', error);
            container.innerHTML = `
                <div class="publication-error">
                    Error loading publications. Please try again later.
                </div>
            `;
        }
    }

    parsePublicationEntry(entry) {
        const title = entry.querySelector('title')?.textContent?.trim() || 'Untitled';
        const authors = Array.from(entry.querySelectorAll('author name'))
            .map(author => author.textContent.trim())
            .join(', ') || 'Unknown authors';
        const abstract = entry.querySelector('summary')?.textContent?.trim() || 'No abstract available.';
        const publishedDate = entry.querySelector('published')?.textContent?.trim() || '';
        const pdfLink = entry.querySelector('link[title="pdf"]')?.getAttribute('href') || '#';

        return {
            title,
            authors,
            abstract,
            publishedDate: this.formatDate(publishedDate),
            pdfLink
        };
    }

    renderPublications() {
        const container = document.getElementById('publications-list');
        if (!container || this.publications.length === 0) {
            container.innerHTML = '<div class="publication-error">No publications found.</div>';
            return;
        }

        // Group publications by year
        const publicationsByYear = {};
        this.publications.forEach(pub => {
            const year = new Date(pub.publishedDate).getFullYear();
            if (!publicationsByYear[year]) {
                publicationsByYear[year] = [];
            }
            publicationsByYear[year].push(pub);
        });

        // Sort years in descending order
        const sortedYears = Object.keys(publicationsByYear).sort((a, b) => b - a);

        // Generate HTML for each year group
        const publicationsHTML = sortedYears.map(year => `
            <div class="publication-year-group">
                <h2 class="publication-year">${year} <span class="publication-count">(${publicationsByYear[year].length} papers)</span></h2>
                ${publicationsByYear[year].map(pub => `
                    <div class="publication-item">
                        <h3 class="publication-title">
                            <a href="${pub.pdfLink}" target="_blank" rel="noopener noreferrer">
                                ${pub.title}
                            </a>
                        </h3>
                        <div class="publication-authors">
                            <strong>Authors:</strong> ${pub.authors}
                        </div>
                        <div class="publication-date">
                            <strong>Published:</strong> ${pub.publishedDate}
                        </div>
                        <div class="publication-abstract">
                            ${pub.abstract}
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');

        container.innerHTML = publicationsHTML;
    }

    formatDate(dateString) {
        if (!dateString) return 'Date not available';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    // Utility method to add news items (for future use)
    addNewsItem(date, content) {
        const newsContainer = document.getElementById('news-list');
        if (!newsContainer) return;

        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <div class="news-date">${date}</div>
            <div class="news-content">${content}</div>
        `;

        newsContainer.insertBefore(newsItem, newsContainer.firstChild);
    }

    // Method to highlight author name in publications
    highlightAuthor(authorString, authorName = 'Maxim Vavilov') {
        return authorString.replace(
            new RegExp(`\\b${authorName}\\b`, 'gi'),
            `<strong>${authorName}</strong>`
        );
    }
}

// Initialize the website
const website = new ProfessorWebsite();

// Expose some methods globally for potential external use
window.ProfessorWebsite = {
    showSection: (section) => website.showSection(section),
    addNews: (date, content) => website.addNewsItem(date, content),
    refreshPublications: () => website.loadPublications()
}; 