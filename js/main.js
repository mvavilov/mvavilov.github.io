/**
 * Main JavaScript for Academic Research Website
 * Prof. Maxim Vavilov - Condensed Matter Theory & Quantum Computing
 */

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    setupMobileMenu();
    
    // Smooth scrolling
    setupSmoothScrolling();
    
    // Active navigation highlighting
    updateActiveNav();
    window.addEventListener('scroll', updateActiveNav);
    
    // Fade-in animations
    setupScrollAnimations();
    
    // Load publications from arXiv if on publications page
    const publicationsContainer = document.getElementById('publications-list');
    if (publicationsContainer) {
        loadArXivPublications();
    }
    
    // Team image error handling
    setupTeamImages();
    
    // Load members data if on homepage
    const membersGrid = document.getElementById('members-grid');
    if (membersGrid) {
        loadMembers();
    }
    
    // Load alumni data if on homepage
    const alumniContent = document.getElementById('alumni-content');
    if (alumniContent) {
        loadAlumni();
    }
    
    // Load news data if on homepage
    const newsContent = document.getElementById('news-content');
    if (newsContent) {
        loadNews();
    }
    
    // Load research themes if on homepage
    const themesGrid = document.getElementById('research-themes-grid');
    if (themesGrid) {
        loadResearchThemes();
    }
    
    // Setup hero image thumbs up animation
    setupHeroImageInteraction();
});

// ===== Mobile Menu Setup =====
function setupMobileMenu() {
    document.addEventListener('click', function(e) {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu && hamburger) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        }
    });
}

// ===== Smooth Scrolling =====
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            });
        });
    }

// ===== Active Navigation Highlighting =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// ===== Scroll Animations =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-card, .research-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== Team Images =====
function setupTeamImages() {
    const teamImages = document.querySelectorAll('.team-member img');
    teamImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Ccircle fill="%232c4a6b" cx="80" cy="80" r="80"/%3E%3Ctext fill="%23e6edf3" font-family="Georgia" font-size="42" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E%3F%3C/text%3E%3C/svg%3E';
        });
    });
}

// ===== arXiv Publications Fetching =====
async function loadArXivPublications() {
        const container = document.getElementById('publications-list');
        if (!container) return;

        // Show loading state
        container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
            <div class="loading" style="margin: 0 auto 1rem;"></div>
            <p>Loading publications from arXiv...</p>
            </div>
        `;

        try {
        // Fetch from arXiv API using author name (gets all categories)
        // Prof. Vavilov has papers in quant-ph, cond-mat.mes-hall, cond-mat.dis-nn, etc.
        const apiUrl = 'https://export.arxiv.org/api/query?search_query=Vavilov_M&sortBy=submittedDate&sortOrder=descending&max_results=100';
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch from arXiv');
        
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            const entries = xmlDoc.querySelectorAll('entry');
        if (entries.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
                    <p>No publications found. Please check arXiv directly.</p>
                    <a href="https://arxiv.org/search/?query=Maxim+G+Vavilov&searchtype=author" 
                       class="btn" style="margin-top: 1rem;">
                        View on arXiv
                    </a>
                </div>
            `;
            return;
        }

        // Parse and organize publications by year
        const publications = [];
        entries.forEach(entry => {
            const title = entry.querySelector('title')?.textContent.trim().replace(/\n/g, ' ');
            const authors = Array.from(entry.querySelectorAll('author name')).map(a => a.textContent.trim());
            
            // FILTER: Only include papers where Maxim G. Vavilov is actually an author
            // This ensures we don't get papers from other M. Vavilovs
            const isVavilovPaper = authors.some(author => {
                const normalizedAuthor = author.toLowerCase();
                return (normalizedAuthor.includes('maxim') && normalizedAuthor.includes('vavilov')) ||
                       normalizedAuthor === 'm. g. vavilov' ||
                       normalizedAuthor === 'm.g. vavilov' ||
                       normalizedAuthor === 'maxim vavilov' ||
                       normalizedAuthor === 'maxim g. vavilov' ||
                       normalizedAuthor === 'vavilov, m. g.' ||
                       normalizedAuthor === 'vavilov, m.g.' ||
                       normalizedAuthor === 'vavilov, maxim' ||
                       normalizedAuthor === 'vavilov, maxim g.';
            });
            
            // Skip papers that don't belong to our Maxim G. Vavilov
            if (!isVavilovPaper) {
                return;
            }
            
            const summary = entry.querySelector('summary')?.textContent.trim().replace(/\n/g, ' ');
            const published = entry.querySelector('published')?.textContent;
            const updated = entry.querySelector('updated')?.textContent;
            const arxivId = entry.querySelector('id')?.textContent.split('/abs/')[1];
            const pdfLink = `https://arxiv.org/pdf/${arxivId}.pdf`;
            const absLink = `https://arxiv.org/abs/${arxivId}`;
            
            // Get categories
            const categories = Array.from(entry.querySelectorAll('category')).map(cat => 
                cat.getAttribute('term')
            );
            
            // Get journal reference and DOI - need to use getElementsByTagNameNS for arxiv namespace
            let journalRef = null;
            let doi = null;
            
            // Try to get journal_ref from arxiv namespace
            const journalRefNodes = entry.getElementsByTagNameNS('http://arxiv.org/schemas/atom', 'journal_ref');
            if (journalRefNodes.length > 0) {
                journalRef = journalRefNodes[0].textContent.trim();
            }
            
            // Try to get DOI
            const doiNodes = entry.getElementsByTagNameNS('http://arxiv.org/schemas/atom', 'doi');
            if (doiNodes.length > 0) {
                doi = doiNodes[0].textContent.trim();
            }
            
            publications.push({
                title,
                authors,
                summary,
                published,
                updated,
                arxivId,
                pdfLink,
                absLink,
                categories,
                journalRef,
                doi
            });
        });
        
        // Group by year - extract year from journal ref or published date
        const publicationsByYear = {};
        publications.forEach(pub => {
            let year;
            
            // Try to get year from journal reference first (more accurate for published papers)
            if (pub.journalRef) {
                const yearMatch = pub.journalRef.match(/\((\d{4})\)/);
                if (yearMatch) {
                    year = parseInt(yearMatch[1]);
                } else {
                    // Try to find any 4-digit year in journal ref
                    const yearMatch2 = pub.journalRef.match(/\b(20\d{2}|19\d{2})\b/);
                    year = yearMatch2 ? parseInt(yearMatch2[1]) : new Date(pub.published).getFullYear();
                }
            } else {
                // Use arXiv publication date
                year = new Date(pub.published).getFullYear();
            }
            
            if (!publicationsByYear[year]) {
                publicationsByYear[year] = [];
            }
            publicationsByYear[year].push(pub);
        });

        // Render publications
        const years = Object.keys(publicationsByYear).sort((a, b) => b - a);
        let html = '';
        
        years.forEach(year => {
            html += `<h2 class="year-header">${year}</h2>`;
            publicationsByYear[year].forEach(pub => {
                html += renderPublication(pub);
            });
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading publications:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
                <p>Error loading publications. Please visit arXiv directly.</p>
                <a href="https://arxiv.org/search/?query=Maxim+G+Vavilov&searchtype=author" 
                   class="btn" style="margin-top: 1rem;">
                    View on arXiv
                </a>
                        </div>
        `;
    }
}

function renderPublication(pub) {
    // Format authors - highlight Vavilov
    const authorList = pub.authors.map(author => {
        if (author.includes('Vavilov')) {
            return `<strong>${author}</strong>`;
        }
        return author;
    }).join(', ');
    
    // Create venue string - prioritize journal reference
    let venueHtml = '';
    if (pub.journalRef) {
        // Published in journal - show in bold
        venueHtml = `<div class="publication-venue"><strong>${pub.journalRef}</strong></div>`;
        // Also show arXiv ID as secondary info
        if (pub.categories && pub.categories.length > 0) {
            venueHtml += `<div style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.3rem;">arXiv:${pub.arxivId} [${pub.categories[0]}]</div>`;
        } else {
            venueHtml += `<div style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.3rem;">arXiv:${pub.arxivId}</div>`;
        }
    } else {
        // Only on arXiv - show arXiv as venue
        if (pub.categories && pub.categories.length > 0) {
            venueHtml = `<div class="publication-venue">arXiv:${pub.arxivId} [${pub.categories[0]}]</div>`;
        } else {
            venueHtml = `<div class="publication-venue">arXiv:${pub.arxivId}</div>`;
        }
    }
    
    return `
        <div class="publication-item">
            <div class="publication-title">${pub.title}</div>
            <div class="publication-authors">${authorList}</div>
            ${venueHtml}
            <div class="publication-links">
                <a href="${pub.absLink}" target="_blank">arXiv</a>
                <a href="${pub.pdfLink}" target="_blank">PDF</a>
                ${pub.doi ? `<a href="https://doi.org/${pub.doi}" target="_blank">DOI</a>` : ''}
            </div>
        </div>
    `;
}

// ===== Alumni Data Loading =====
async function loadAlumni() {
    try {
        const response = await fetch('/alumni-data.json');
        if (!response.ok) {
            console.warn('Alumni data file not found. No alumni will be displayed.');
            renderAlumni({});
            return;
        }
        const alumniData = await response.json();
        renderAlumni(alumniData);
    } catch (error) {
        console.error('Error loading alumni data:', error);
        renderAlumni({});
    }
}

function renderAlumni(data) {
    // Render PhD Alumni
    const phdContainer = document.getElementById('phd-alumni');
    if (phdContainer && data.phd_alumni) {
        phdContainer.innerHTML = data.phd_alumni.map(alumnus => 
            `<strong>${alumnus.name}</strong> · ${alumnus.position}`
        ).join('<br>');
    }
    
    // Render Postdoc Alumni
    const postdocContainer = document.getElementById('postdoc-alumni');
    if (postdocContainer && data.postdoc_alumni) {
        postdocContainer.innerHTML = data.postdoc_alumni.map(alumnus => 
            `<strong>${alumnus.name}</strong> · ${alumnus.position}`
        ).join('<br>');
    }
    
    // Render Master's & Undergrad Alumni
    const mastersContainer = document.getElementById('masters-undergrad-alumni');
    if (mastersContainer && data.masters_undergrad_alumni) {
        mastersContainer.innerHTML = data.masters_undergrad_alumni.map(alumnus => 
            `<strong>${alumnus.name}</strong> (${alumnus.type}) · ${alumnus.position}`
        ).join('<br>');
    }
    
}

// ===== Members Data Loading =====
async function loadMembers() {
    try {
        const response = await fetch('/members-data.json');
        if (!response.ok) {
            console.warn('Members data file not found. No members will be displayed.');
            renderMembers({ members: [] });
            return;
        }
        const membersData = await response.json();
        renderMembers(membersData);
    } catch (error) {
        console.error('Error loading members data:', error);
        renderMembers({ members: [] });
    }
}

function renderMembers(data) {
    const membersContainer = document.getElementById('members-grid');
    if (!membersContainer) return;
    
    if (!data.members || data.members.length === 0) {
        membersContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">No members to display.</p>';
        return;
    }
    
    // Filter out members without position or with position as empty string
    // These are typically alumni that should appear in the alumni section instead
    const currentMembers = data.members.filter(member => 
        member.position && 
        member.position.trim() !== '' && 
        !member.position.toLowerCase().includes('former')
    );
    
    if (currentMembers.length === 0) {
        membersContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">No current members to display.</p>';
        return;
    }
    
    const memberCards = currentMembers.map(member => {
        const imagePath = member.image ? `/members/${member.image}` : '/members/default.jpg';
        
        // Build social links
        const socialLinks = [];
        
        if (member.personal_website) {
            socialLinks.push(`<a href="${member.personal_website}" target="_blank" class="member-link website" title="Personal Website">WEB</a>`);
        }
        
        if (member.social_media) {
            if (member.social_media.linkedin) {
                socialLinks.push(`<a href="${member.social_media.linkedin}" target="_blank" class="member-link" title="LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>`);
            }
            
            if (member.social_media.github) {
                socialLinks.push(`<a href="${member.social_media.github}" target="_blank" class="member-link" title="GitHub">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>`);
            }
            
            if (member.social_media.twitter) {
                socialLinks.push(`<a href="${member.social_media.twitter}" target="_blank" class="member-link" title="Twitter/X">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>`);
            }
        }
        
        if (member.email) {
            // Format email properly (replace 'at' with '@' if present)
            const emailFormatted = member.email.replace(/at/gi, '@').replace(/\s/g, '');
            socialLinks.push(`<a href="mailto:${emailFormatted}" class="member-link" title="Email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/></svg>
            </a>`);
        }
        
        return `
            <div class="member-card">
                <img src="${imagePath}" alt="${member.name}" class="member-photo" 
                     onerror="this.src='/members/default.jpg'">
                <div class="member-name">${member.name}</div>
                ${member.position ? `<div class="member-position">${member.position}</div>` : ''}
                ${member.bio ? `<div class="member-bio">${member.bio}</div>` : ''}
                ${socialLinks.length > 0 ? `
                    <div class="member-links">
                        ${socialLinks.join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    membersContainer.innerHTML = memberCards;
}

// ===== News Data Loading =====
async function loadNews() {
    try {
        const response = await fetch('/news-data.json');
        if (!response.ok) {
            console.warn('News data file not found. No news will be displayed.');
            renderNews({ recent_news: [] });
            return;
        }
        const newsData = await response.json();
        renderNews(newsData);
    } catch (error) {
        console.error('Error loading news data:', error);
        renderNews({ recent_news: [] });
    }
}

function buildNewsSlidesMarkup(items, includeIds) {
    const n = items.length;
    return items.map((item, i) => {
        const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const link = (item.link || '').trim();
        const hasLink = link && link !== '#';
        const readMore = hasLink
            ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="news-slide-link">Read More →</a>`
            : '';

        const idAttr = includeIds ? ` id="news-slide-${i}"` : '';
        const a11y = includeIds
            ? ` role="tabpanel" aria-roledescription="slide" aria-label="${i + 1} of ${n}"`
            : ' role="presentation" aria-hidden="true"';

        return `
            <article class="news-slide"${idAttr}${a11y}>
                <div class="news-slide-card">
                    <div class="news-slide-header">
                        <h3 class="news-slide-title">${item.title}</h3>
                        <span class="news-slide-category">${item.category}</span>
                    </div>
                    <p class="news-slide-summary">${item.summary}</p>
                    <div class="news-slide-footer">
                        <span class="news-slide-date">${formattedDate}</span>
                        ${readMore}
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function renderNews(data) {
    const newsContainer = document.getElementById('news-content');
    if (!newsContainer || !data.recent_news) return;

    const items = data.recent_news;
    if (items.length === 0) {
        newsContainer.innerHTML = '';
        return;
    }

    const segmentA = buildNewsSlidesMarkup(items, true);
    const segmentB = buildNewsSlidesMarkup(items, false);

    const multi = items.length > 1;

    newsContainer.innerHTML = `
        <div class="news-carousel news-banner${multi ? '' : ' news-banner--single'}" role="region" aria-label="Recent news">
            <div class="news-carousel-viewport news-banner-viewport" tabindex="0" aria-label="Scrolling news — drag to move, or pause briefly when you interact">
                <div class="news-banner-track">
                    <div class="news-banner-segment">${segmentA}</div>
                    ${multi ? `<div class="news-banner-segment" aria-hidden="true">${segmentB}</div>` : ''}
                </div>
            </div>
        </div>
    `;

    initNewsBanner(newsContainer.querySelector('.news-carousel'), multi);
}

/**
 * Smooth banner: translate3d driven by rAF + seamless loop (duplicate segment).
 * Draggable (pointer capture); auto-scroll resumes after idle. Links still click if you don’t drag.
 */
function initNewsBanner(root, enableMarquee) {
    const viewport = root.querySelector('.news-carousel-viewport');
    const track = root.querySelector('.news-banner-track');
    const segment = root.querySelector('.news-banner-segment');

    if (!viewport || !track || !segment) return;

    const SPEED_PX_PER_SEC = 45;
    const IDLE_RESUME_MS = 4000;
    const DRAG_THRESHOLD_PX = 6;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let idleResumeId = null;
    let rafId = null;
    let offsetPx = 0;
    let lastTickTs = 0;
    let playing = enableMarquee && !reducedMotion;
    let dragPointerId = null;
    let dragActive = false;
    let dragStartClientX = 0;
    let dragStartOffsetPx = 0;

    function viewportWidth() {
        return viewport.clientWidth;
    }

    function getSlidesPerView() {
        const w = viewportWidth();
        if (w < 640) return 1;
        if (w < 1024) return 2;
        return 3;
    }

    function getSegmentGapPx() {
        const raw = window.getComputedStyle(segment).columnGap || window.getComputedStyle(segment).gap;
        const n = parseFloat(raw);
        return Number.isFinite(n) ? n : 12;
    }

    function updateSlideWidthVar() {
        const perView = getSlidesPerView();
        const gap = getSegmentGapPx();
        const cw = viewportWidth();
        const totalGaps = Math.max(0, perView - 1) * gap;
        const cellW = Math.max(220, Math.floor((cw - totalGaps) / perView));
        viewport.style.setProperty('--news-viewport-w', `${cellW}px`);
    }

    function loopWidthPx() {
        const w = segment.offsetWidth;
        return w > 0 ? w : 0;
    }

    function normalizeOffset() {
        const w = loopWidthPx();
        if (w <= 0) return;
        while (offsetPx >= w) offsetPx -= w;
        while (offsetPx < 0) offsetPx += w;
    }

    function applyTransform() {
        track.style.transform = `translate3d(${-offsetPx}px, 0, 0)`;
    }

    function clearIdleResume() {
        if (idleResumeId !== null) {
            window.clearTimeout(idleResumeId);
            idleResumeId = null;
        }
    }

    function scheduleResumePlay() {
        if (!enableMarquee || reducedMotion) return;
        clearIdleResume();
        idleResumeId = window.setTimeout(() => {
            idleResumeId = null;
            lastTickTs = 0;
            playing = true;
        }, IDLE_RESUME_MS);
    }

    function stopDragVisuals() {
        dragActive = false;
        dragPointerId = null;
        viewport.classList.remove('is-dragging');
    }

    function onPointerDown(e) {
        if (!enableMarquee || reducedMotion) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (dragPointerId !== null) return;

        playing = false;
        clearIdleResume();
        dragPointerId = e.pointerId;
        dragActive = false;
        dragStartClientX = e.clientX;
        dragStartOffsetPx = offsetPx;
    }

    function onPointerMove(e) {
        if (!enableMarquee || reducedMotion) return;
        if (dragPointerId !== e.pointerId) return;

        const dx = e.clientX - dragStartClientX;
        if (!dragActive) {
            if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
            dragActive = true;
            viewport.classList.add('is-dragging');
            try {
                viewport.setPointerCapture(e.pointerId);
            } catch (_) {
                /* ignore */
            }
        }

        e.preventDefault();
        offsetPx = dragStartOffsetPx - (e.clientX - dragStartClientX);
        normalizeOffset();
        applyTransform();
    }

    function endPointerInteraction(e) {
        if (dragPointerId !== e.pointerId) return;

        if (dragActive) {
            try {
                viewport.releasePointerCapture(e.pointerId);
            } catch (_) {
                /* ignore */
            }
        }

        normalizeOffset();
        applyTransform();
        stopDragVisuals();
        scheduleResumePlay();
    }

    function tick(ts) {
        rafId = window.requestAnimationFrame(tick);

        if (!enableMarquee || reducedMotion || document.hidden) return;
        if (dragActive) return;
        if (!playing) return;

        const loopW = loopWidthPx();
        if (loopW <= 0) return;

        if (lastTickTs === 0) lastTickTs = ts;
        const dt = Math.min(0.05, (ts - lastTickTs) / 1000);
        lastTickTs = ts;

        offsetPx += SPEED_PX_PER_SEC * dt;
        while (offsetPx >= loopW) offsetPx -= loopW;
        applyTransform();
    }

    updateSlideWidthVar();
    requestAnimationFrame(() => {
        updateSlideWidthVar();
        normalizeOffset();
        applyTransform();
    });

    const ro = new ResizeObserver(() => {
        updateSlideWidthVar();
        window.requestAnimationFrame(() => {
            normalizeOffset();
            applyTransform();
        });
    });
    ro.observe(viewport);

    if (enableMarquee && !reducedMotion) {
        rafId = window.requestAnimationFrame(tick);

        viewport.addEventListener('pointerdown', onPointerDown);
        viewport.addEventListener('pointermove', onPointerMove, { passive: false });
        viewport.addEventListener('pointerup', endPointerInteraction);
        viewport.addEventListener('pointercancel', endPointerInteraction);
        viewport.addEventListener('lostpointercapture', () => {
            if (dragActive) {
                normalizeOffset();
                applyTransform();
                stopDragVisuals();
                scheduleResumePlay();
            }
        });

        viewport.addEventListener('wheel', () => {
            playing = false;
            clearIdleResume();
            scheduleResumePlay();
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                playing = false;
                clearIdleResume();
            } else {
                lastTickTs = 0;
                playing = true;
            }
        });
    } else if (reducedMotion && enableMarquee) {
        track.style.transform = '';
    }
}

// ===== Research Themes Loading =====
async function loadResearchThemes() {
    try {
        // Fetch the JSON file generated by Jekyll from YAML data
        const response = await fetch('/research-areas-data.json');
        if (!response.ok) {
            console.warn('Research areas data file not found. No research areas will be displayed.');
            renderResearchThemes([]);
            return;
        }
        
        const data = await response.json();
        
        if (!data.areas || data.areas.length === 0) {
            console.warn('No research areas defined.');
            renderResearchThemes([]);
            return;
        }
        
        // Render the areas
        renderResearchThemes(data.areas);
        
    } catch (error) {
        console.error('Error loading research themes:', error);
        renderResearchThemes([]);
    }
}

function renderResearchThemes(areas) {
    const container = document.getElementById('research-themes-grid');
    if (!container) return;
    
    // If no areas, display nothing (empty grid)
    if (!areas || areas.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    const html = areas.map(area => {
        const papersHTML = area.selected_papers && area.selected_papers.length > 0
            ? `<div class="theme-papers">
                ${area.selected_papers.map(paper => {
                    const journalHTML = paper.url 
                        ? `<a href="${paper.url}" target="_blank" rel="noopener noreferrer"><strong>${paper.journal}</strong></a>`
                        : `<strong>${paper.journal}</strong>`;
                    
                    return `
                        <div class="theme-paper-item">
                            <div class="paper-title-small">${paper.title}</div>
                            <div class="paper-meta">
                                <span class="paper-authors">${paper.authors}</span>
                            </div>
                            <div class="paper-venue-small">
                                ${journalHTML} (${paper.year})
                            </div>
                        </div>
                    `;
                }).join('')}
               </div>`
            : '<div class="theme-papers-empty">Selected publications coming soon.</div>';
        
        return `
            <div class="theme-card" data-theme-id="${area.id}">
                <div class="theme-card-inner">
                    <div class="theme-icon">
                        <img src="${area.icon}" alt="${area.title}" />
                    </div>
                    <h3 class="theme-title">${area.title}</h3>
                    ${papersHTML}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// ===== Hero Image Thumbs Up Animation =====
function setupHeroImageInteraction() {
    const heroImage = document.querySelector('.hero-image img');
    if (!heroImage) return;
    
    heroImage.addEventListener('click', function(e) {
        createThumbsUpAnimation(e);
    });
}

function createThumbsUpAnimation(event) {
    // Get the hero image container for positioning
    const heroImageContainer = document.querySelector('.hero-image');
    if (!heroImageContainer) return;
    
    // Create thumbs up emoji element
    const thumbsUp = document.createElement('div');
    thumbsUp.className = 'thumbs-up-emoji';
    thumbsUp.textContent = '👍';
    
    // Get the mouse position relative to the hero image container
    const rect = heroImageContainer.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Position the emoji at the mouse click position
    thumbsUp.style.left = mouseX + 'px';
    thumbsUp.style.top = mouseY + 'px';
    
    // Add to hero image container
    heroImageContainer.appendChild(thumbsUp);
    
    // Remove the element after animation completes
    setTimeout(() => {
        if (thumbsUp.parentNode) {
            thumbsUp.parentNode.removeChild(thumbsUp);
        }
    }, 1000);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMobileMenu,
        loadArXivPublications,
        loadAlumni,
        loadNews,
        loadResearchThemes,
        setupHeroImageInteraction
    };
}
