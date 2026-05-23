document.addEventListener('DOMContentLoaded', function() {
    loadPublications();
});

function loadPublications() {
    fetch('publications.json')
        .then(response => response.json())
        .then(data => {
            const publicationsList = document.getElementById('publications-list');
            if (!publicationsList) return;

            const sortedPublications = data.publications
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            const html = sortedPublications.map(pub => `
                <div class="pub-item" data-year="${pub.year}" data-date="${pub.date}">
                    <div class="pub-content">
                        <h3>${pub.title}</h3>
                        <p class="authors">${pub.authors}</p>
                        <p class="journal">${pub.journal}</p>
                        <div class="pub-abstract">
                            <p>${pub.abstract}</p>
                        </div>
                        <div class="pub-links">
                            <a href="${pub.doi}" target="_blank" class="pub-link">
                                <i class="fas fa-external-link-alt"></i> DOI
                            </a>
                        </div>
                    </div>
                    <div class="pub-image">
                        <img src="${pub.image}" alt="Publication Figure">
                    </div>
                </div>
            `).join('');

            publicationsList.innerHTML = html;
            initializeFilters();
        })
        .catch(error => console.error('Error loading publications:', error));
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.pub-filters .filter-btn');
    const publicationItems = document.querySelectorAll('.pub-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const selectedYear = this.getAttribute('data-year');

            publicationItems.forEach(item => {
                if (selectedYear === 'all' || item.getAttribute('data-year') === selectedYear) {
                    item.style.display = 'grid';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}
