document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.news-filters .filter-btn');
    const newsList = document.querySelector('.news-list');
    const newsItems = document.querySelectorAll('.news-item');

    // 将 NodeList 转换为数组，以便进行排序
    const itemsArray = Array.from(newsItems);

    // 根据日期排序函数
    function sortByDate(a, b) {
        const dateA = new Date(a.getAttribute('data-date'));
        const dateB = new Date(b.getAttribute('data-date'));
        return dateB - dateA; // 降序排列，最新的在前面
    }

    // 初始排序
    itemsArray.sort(sortByDate);
    itemsArray.forEach(item => newsList.appendChild(item));

    // 为每个筛选按钮添加点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的按钮添加active类
            this.classList.add('active');

            const selectedYear = this.getAttribute('data-year');

            // 筛选并显示相应的新闻
            itemsArray.forEach(item => {
                if (selectedYear === 'all' || item.getAttribute('data-year') === selectedYear) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}); 