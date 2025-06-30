/**
 * Dynamic Research Directions Loader
 * Automatically loads research directions from the research-directions/ folder
 * Maintains the decoupled design where adding/removing folders updates the website
 */

class ResearchDirectionsLoader {
    constructor() {
        this.researchDirections = [];
        this.baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
    }

    async loadResearchDirections() {
        // Try to discover research directions dynamically
        const directions = await this.discoverResearchDirections();
        
        // Sort by order field
        directions.sort((a, b) => (a.order || 999) - (b.order || 999));
        
        this.researchDirections = directions;
        return directions;
    }

    async discoverResearchDirections() {
        // First, try to load a directory index (if available)
        const knownDirections = await this.tryLoadDirectoryIndex();
        
        // If that fails, fall back to common research direction names
        const fallbackDirections = [
            'fluxonium-qubits', 'gatemon', 'quantum-error-correction', 
            'quantum-circuits', 'quantum-information', 'superconducting-qubits',
            'quantum-computing', 'quantum-devices', 'quantum-theory'
        ];
        
        const directionsToTry = knownDirections.length > 0 ? knownDirections : fallbackDirections;
        const directions = [];
        
        for (const dirName of directionsToTry) {
            try {
                const siteBaseUrl = this.getSiteBaseUrl();
                const response = await fetch(`${siteBaseUrl}/research-directions/${dirName}/direction.md`);
                if (response.ok) {
                    const content = await response.text();
                    const parsed = this.parseMarkdownWithFrontMatter(content);
                    if (parsed) {
                        directions.push({
                            key: dirName,
                            ...parsed.frontMatter,
                            content: parsed.content,
                            path: dirName
                        });
                    }
                }
            } catch (error) {
                // Silently continue - this is expected for non-existent directories
            }
        }
        
        return directions;
    }

    async tryLoadDirectoryIndex() {
        // Try to load a directory listing (works on some servers)
        try {
            const siteBaseUrl = this.getSiteBaseUrl();
            const response = await fetch(`${siteBaseUrl}/research-directions/`);
            if (response.ok) {
                const html = await response.text();
                // Parse directory listing HTML to extract folder names
                const folderRegex = /<a[^>]*href="([^"]+)\/?"[^>]*>([^<]+)<\/a>/gi;
                const folders = [];
                let match;
                
                while ((match = folderRegex.exec(html)) !== null) {
                    const folderName = match[1];
                    // Skip parent directory, current directory, and files
                    if (folderName && !folderName.startsWith('.') && !folderName.includes('.')) {
                        folders.push(folderName.replace(/\/$/, ''));
                    }
                }
                
                return folders.filter(folder => folder !== 'README.md' && folder !== '_includes');
            }
        } catch (error) {
            // Directory indexing not available
        }
        
        return [];
    }

    parseMarkdownWithFrontMatter(content) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);
        
        if (!match) {
            return null;
        }
        
        const frontMatterText = match[1];
        const markdownContent = match[2];
        
        // Simple YAML parser for our specific needs
        const frontMatter = {};
        const lines = frontMatterText.split('\n');
        let currentKey = null;
        let currentArray = null;
        let currentObject = null;
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            // Handle indented properties (for papers)
            if (trimmed.startsWith('  ') && currentObject) {
                const [key, ...valueParts] = trimmed.trim().split(':');
                const value = valueParts.join(':').trim().replace(/^"(.*)"$/, '$1');
                currentObject[key.trim()] = value;
                continue;
            }
            
            if (trimmed.startsWith('- ')) {
                // Array item
                if (currentArray) {
                    if (trimmed.startsWith('- title:')) {
                        const paperTitle = trimmed.replace('- title:', '').trim().replace(/^"(.*)"$/, '$1');
                        currentObject = { title: paperTitle };
                        currentArray.push(currentObject);
                    } else if (trimmed.startsWith('- ')) {
                        const value = trimmed.substring(2).trim().replace(/^"(.*)"$/, '$1');
                        currentArray.push(value);
                        currentObject = null;
                    }
                }
            } else if (trimmed.includes(':')) {
                const [key, ...valueParts] = trimmed.split(':');
                const value = valueParts.join(':').trim().replace(/^"(.*)"$/, '$1');
                
                if (key.trim() === 'keywords' || key.trim() === 'papers') {
                    currentKey = key.trim();
                    currentArray = [];
                    currentObject = null;
                    frontMatter[currentKey] = currentArray;
                } else {
                    currentKey = key.trim();
                    currentArray = null;
                    currentObject = null;
                    frontMatter[currentKey] = value;
                }
            }
        }
        
        return {
            frontMatter,
            content: markdownContent.trim()
        };
    }

    async renderResearchCards() {
        const directions = await this.loadResearchDirections();
        const container = document.getElementById('research-directions-container');
        
        if (!container) {
            console.error('Research directions container not found');
            return;
        }
        
        if (directions.length === 0) {
            container.innerHTML = `
                <div class="research-directions-placeholder">
                    <h3>Research Directions Not Found</h3>
                    <p>Research directions will appear here automatically when you add them to the <code>research-directions/</code> folder.</p>
                    <p>Please ensure the directory contains valid <code>direction.md</code> files.</p>
                    <p>See <code>research-directions/README.md</code> for instructions.</p>
                </div>
            `;
            return;
        }
        
        const cardsHtml = directions.map(direction => this.renderResearchCard(direction)).join('');
        container.innerHTML = `<div class="research-directions-grid">${cardsHtml}</div>`;
    }

    renderResearchCard(direction) {
        const keywordsHtml = direction.keywords ? 
            `<div class="research-keywords">
                ${direction.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
            </div>` : '';

        const papersHtml = direction.papers ? 
            `<div class="research-papers">
                <h4>Related Publications:</h4>
                ${direction.papers.slice(0, 3).map(paper => `
                    <div class="paper-item">
                        <a href="${paper.url || '#'}" target="_blank" class="paper-title">
                            ${paper.title || 'Untitled'}
                        </a>
                        <div class="paper-meta">
                            ${paper.authors || 'Unknown'} (${paper.year || 'TBD'})
                        </div>
                    </div>
                `).join('')}
            </div>` : '';

        // Create image URLs for both extensions
        const baseImagePath = `${this.getSiteBaseUrl()}/research-directions/${direction.key}/images/research-image`;
        const jpgUrl = `${baseImagePath}.jpg`;
        const pngUrl = `${baseImagePath}.png`;

        return `
            <div class="research-direction-card">
                <!-- Research Image -->
                <div class="research-image">
                    <img src="${jpgUrl}" 
                         alt="${direction.title}"
                         onerror="if (this.src === '${jpgUrl}') { this.src = '${pngUrl}'; } else { this.style.display='none'; this.nextElementSibling.style.display='flex'; }">
                    <div class="image-placeholder" style="display: none;">
                        <div>
                            <strong>Research Image</strong><br>
                            <small>Add image: ${baseImagePath}.jpg or ${baseImagePath}.png</small>
                        </div>
                    </div>
                </div>

                <!-- Research Content -->
                <div class="research-content">
                    <h3>${direction.title}</h3>
                    <div class="research-description">
                        ${this.markdownToHtml(direction.content)}
                    </div>

                    ${keywordsHtml}
                    ${papersHtml}

                    <!-- Team Members -->
                    <div class="research-team">
                        <h4>Team Members:</h4>
                        <div class="team-members">
                            <div class="team-placeholder">
                                <div>
                                    <strong>Team Photos</strong><br>
                                    <small>Add student photos to:<br>${this.getSiteBaseUrl()}/research-directions/${direction.key}/members/</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    markdownToHtml(markdown) {
        // Simple markdown to HTML conversion for our needs
        return markdown
            .replace(/\n\n/g, '</p><p>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loader = new ResearchDirectionsLoader();
    loader.renderResearchCards();
});

// Export for potential external use
window.ResearchDirectionsLoader = ResearchDirectionsLoader; 