/**
 * Member Containers JavaScript Module
 * Handles rendering of team member cards with photos, websites, and social media
 */

class MemberContainers {
    constructor() {
        this.members = {};
        this.baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
    }

    getSiteBaseUrl() {
        // Try to get baseurl from meta tag first (if we add it), otherwise detect from URL
        const metaBaseUrl = document.querySelector('meta[name="site-baseurl"]');
        if (metaBaseUrl) {
            return metaBaseUrl.getAttribute('content');
        }
        
        // Fallback: detect from current URL path
        const path = window.location.pathname;
        if (path.includes('/PI_website_fork')) {
            return '/PI_website_fork';
        }
        return '';
    }

    setMembersData(membersData) {
        this.members = membersData;
        console.log('Set members data:', this.members);
    }

    async loadMembers() {
        // Keep the fallback method for compatibility
        if (Object.keys(this.members).length > 0) {
            return this.members;
        }

        try {
            const siteBaseUrl = this.getSiteBaseUrl();
            const response = await fetch(`${siteBaseUrl}/_data/members.yml`);
            if (response.ok) {
                const yamlText = await response.text();
                this.members = this.parseYaml(yamlText);
                console.log('Loaded members data from YAML:', this.members);
            }
        } catch (error) {
            console.log('Could not load members data');
        }
        return this.members;
    }

    parseYaml(yamlText) {
        // Simple YAML parser for the specific format we use
        const lines = yamlText.split('\n');
        const members = {};
        let currentMember = null;
        let currentSection = null;
    
        for (const line of lines) {
            if (line.trim() === '---' || line.trim() === '') continue;
            
            const indentation = line.search(/\S/);
            const content = line.trim();
            
            if (indentation === 0 && content.endsWith(':')) {
                // New member
                currentMember = content.slice(0, -1);
                members[currentMember] = {};
                currentSection = null;
            } else if (indentation === 2 && content.endsWith(':')) {
                // New section within member
                currentSection = content.slice(0, -1);
                members[currentMember][currentSection] = content.includes('social_media') ? {} : '';
            } else if (indentation === 4 && currentSection) {
                // Content within a section
                const [key, ...valueParts] = content.split(':');
                const value = valueParts.join(':').trim();
                if (currentSection === 'social_media') {
                    members[currentMember][currentSection][key] = value;
                } else {
                    members[currentMember][currentSection] = value;
                }
            } else if (indentation === 2) {
                // Direct member property
                const [key, ...valueParts] = content.split(':');
                const value = valueParts.join(':').trim();
                members[currentMember][key] = value;
            }
        }
        
        return members;
    }

    renderSocialMedia(socialMedia) {
        const svgIcons = {
            linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor"><path d="M474.919 0H38.592C17.72 0 0 16.504 0 36.841V475.14C0 495.496 11.629 512 32.492 512h436.327C489.718 512 512 495.496 512 475.14V36.841C512 16.504 495.809 0 474.919 0zM195.043 195.043h68.928v35.136h.755c10.505-18.945 41.541-38.177 79.921-38.177 73.655 0 94.214 39.108 94.214 111.538v135.321h-73.148V316.883c0-32.427-12.947-60.883-43.227-60.883-36.768 0-54.295 24.889-54.295 65.758v117.103h-73.148V195.043zM73.139 438.861h73.148V195.043H73.139v243.818zm82.289-329.148c0 25.258-20.457 45.715-45.715 45.715-25.258 0-45.715-20.457-45.715-45.715 0-25.258 20.457-45.715 45.715-45.715 25.258 0 45.715 20.457 45.715 45.715z"/></svg>`,
            twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 462.799" fill="currentColor"><path d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"/></svg>`,
            github: `<svg width="16" height="16" viewBox="0 0 98 96" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>`,
            scholar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.242 13.769 0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>`,
            email: '📧',
            orcid: '🆔'
        };

        const links = Object.entries(socialMedia)
            .filter(([_, url]) => url && url.trim() !== '') // Only include non-empty URLs
            .map(([platform, url]) => {
                const icon = svgIcons[platform] || '🌐';
                return `<a href="${url}" target="_blank" class="social-link" title="${platform}">${icon}</a>`;
            })
            .join('');

        return links ? `<div class="member-social-media">${links}</div>` : '';
    }

    renderMemberContainer(memberId) {
        console.log('Looking for member:', memberId);
        console.log('Available members:', Object.keys(this.members));
        
        const member = this.members[memberId];
        if (!member) {
            console.log('Member not found:', memberId);
            return `
                <div class="member-container member-not-found">
                    <div class="member-placeholder">
                        <span class="member-id">${memberId}</span>
                        <small>Member data not found</small>
                    </div>
                </div>
            `;
        }

        console.log('Found member data:', member);
        const socialMediaHtml = this.renderSocialMedia(member.social_media || {});
        // Get the site's base URL from the current page location
        const siteBaseUrl = this.getSiteBaseUrl();
        const imageUrl = member.image ? `${siteBaseUrl}/members/${encodeURIComponent(member.image)}` : `${siteBaseUrl}/members/default.jpg`;

        return `
            <div class="member-container" data-member-id="${memberId}">
                <div class="member-photo">
                    <img src="${imageUrl}" alt="${member.name}" 
                         onerror="this.parentElement.innerHTML='<div class=\\'photo-placeholder\\'><span>${member.name.split(' ').map(n => n[0]).join('')}</span></div>'">
                </div>
                <div class="member-info">
                    <div class="member-name">
                        ${member.personal_website ? 
                            `<a href="${member.personal_website}" target="_blank" class="member-name-link">${member.name} 🔗</a>` :
                            member.name
                        }
                    </div>
                    <div class="member-position">${member.position || 'Graduate Student'}</div>
                    ${member.bio ? `<div class="member-bio">${member.bio}</div>` : ''}
                    ${socialMediaHtml}
                </div>
            </div>
        `;
    }

    renderMembersList(memberIds) {
        if (!memberIds || memberIds.length === 0) {
            return `
                <div class="members-placeholder">
                    <div class="placeholder-content">
                        <strong>Team Members</strong><br>
                        <small>Add members to this research direction</small>
                    </div>
                </div>
            `;
        }

        const membersHtml = memberIds.map(memberId => this.renderMemberContainer(memberId)).join('');
        return `<div class="members-grid">${membersHtml}</div>`;
    }

    async renderMembersInElement(element, memberIds, membersData = null) {
        if (membersData) {
            this.setMembersData(membersData);
        } else {
            await this.loadMembers();
        }
        element.innerHTML = this.renderMembersList(memberIds);
    }
}

// Initialize member containers when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const memberContainers = new MemberContainers();
    
    // Find all member containers and populate them
    document.querySelectorAll('[data-members]').forEach(async (element) => {
        const memberIds = JSON.parse(element.getAttribute('data-members') || '[]');
        const membersData = element.getAttribute('data-members-data') ? 
            JSON.parse(element.getAttribute('data-members-data')) : null;
        
        await memberContainers.renderMembersInElement(element, memberIds, membersData);
    });
});

// Export for external use
window.MemberContainers = MemberContainers; 