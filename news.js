document.addEventListener('DOMContentLoaded', function() {
    loadNews();
});

function loadNews() {
    fetch('news.json')
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById('news-list');
            if (!newsList) return;

            // Sort by date (newest first)
            const sortedNews = data.news
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            // Generate HTML
            const html = sortedNews.map(item => {
                const dateObj = new Date(item.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: '2-digit' 
                });
                return `
                <div class="news-item" data-year="${item.year}" data-date="${item.date}">
                    <h3>${item.title}</h3>
                    <p class="date">${formattedDate}</p>
                    <div class="news-content">
                        <p>${item.summary}</p>
                    </div>
                    <a href="${item.link}" class="news-link">Read More ></a>
                </div>
            `}).join('');

            newsList.innerHTML = html;

            // Initialize filters after loading
            initializeFilters();
        })
        .catch(error => console.error('Error loading news:', error));
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.news-filters .filter-btn');
    const newsItems = document.querySelectorAll('.news-item');

    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const selectedYear = this.getAttribute('data-year');

            // Filter and show/hide news items
            newsItems.forEach(item => {
                if (selectedYear === 'all' || item.getAttribute('data-year') === selectedYear) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}
