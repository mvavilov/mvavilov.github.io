---
layout: default
title: "Prof. Maxim Vavilov - Quantum Computing Research"
---

<!-- Home Section -->
<section id="home" class="section">
    <div class="text-center mb-4">
        <h2>Welcome to Prof. Maxim Vavilov's Research Group</h2>
        <p class="lead">Advancing the frontiers of quantum computing through innovative research in quantum information processing, fluxonium qubits, and quantum circuit design.</p>
    </div>

    <!-- Professor Photo -->
    <div class="photo-container">
        <div class="professor-photo">
            <img src="{{ site.baseurl }}/images/professor.jpg" alt="Prof. Maxim Vavilov" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="photo-placeholder" style="display: none;">
                <div>
                    <strong>Professor Photo</strong><br>
                    <small>Add professor's photo here:<br>
                    Place image in /images/professor.jpg</small>
                </div>
            </div>
            <div class="photo-caption">
                Prof. Maxim Vavilov<br>
                Principal Investigator
            </div>
        </div>
    </div>

    <!-- Brief Introduction -->
    <div class="mt-4">
        <h3>About Our Research</h3>
        <p>Our research group focuses on theoretical and experimental aspects of quantum computing, with particular emphasis on superconducting quantum circuits and novel qubit architectures. We work at the intersection of quantum physics, condensed matter theory, and quantum information science.</p>
    </div>

    <!-- SEEQC Advisory Card -->
    <div class="advisory-card">
        <div class="advisory-logo">
            <img src="{{ site.baseurl }}/assets/seeqc_us_logo.jpg" alt="SEEQC Logo">
        </div>
        <div class="advisory-content">
            <h3>Advisory Board Member</h3>
            <p>Prof. Maxim Vavilov serves on the advisory board of <a href="https://seeqc.com/" target="_blank" class="advisory-link">SEEQC</a>, a leading quantum computing startup focused on developing the world's first quantum computing system-on-a-chip. SEEQC is pioneering digital quantum management systems and scalable quantum computing solutions.</p>
        </div>
    </div>

    <!-- Research Directions Section -->
    <div class="mt-4">
        <h2 class="text-center mb-4">Research Directions</h2>
        {% include research-cards.html %}
    </div>

    <!-- Team Photo Section -->
    <div class="team-section">
        <h3>Our Research Team</h3>
        {% include team-photo.html %}
        <!-- <div class="photo-caption mt-2">
            Quantum Computing Research Group<br>
            <em>Building the future of quantum information processing</em>
        </div> -->
    </div>
</section>

<!-- Publications Section -->
<section id="publications" class="section hidden">
    <h2 class="text-center mb-4">Publications</h2>
    <p class="text-center mb-4">Publications from arXiv, automatically updated.</p>
    
    <div class="publications-container">
        <div id="publications-list">
            <!-- Publications will be loaded dynamically by JavaScript -->
        </div>
    </div>
    
    <div class="text-center mt-4">
        <a href="https://arxiv.org/search/?query=au%3AMaxim+Vavilov&searchtype=author" target="_blank" class="btn btn-outline">
            View All Publications on arXiv
        </a>
    </div>
</section>

<!-- News Section -->
<section id="news" class="section hidden">
    <h2 class="text-center mb-4">News & Updates</h2>
    
    <div id="news-list">
        <div class="news-item">
            <div class="news-date">June 2025</div>
            <div class="news-content">
                Website launched! Taking photos will make students feel more connected and increase sense of belonging! 
            </div>
        </div>
        
        <!-- Add more news items here -->
        <!-- Example of how to add news:
        <div class="news-item">
            <div class="news-date">Month Year</div>
            <div class="news-content">
                Your news content here...
            </div>
        </div>
        -->
    </div>
    
    <div class="text-center mt-4">
        <p class="text-secondary">
            <em>For the latest updates, please check our recent publications or contact us directly.</em>
        </p>
    </div>
</section> 