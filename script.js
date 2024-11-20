document.addEventListener('DOMContentLoaded', function() {
    // 将所有的初始化代码放在这里
    initializeSliders();
    initializeStats();
    initializeHeroSlider();
    initializePublicationsFilter();
});

// 优化统计数字的动画
function initializeStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 优化滑块初始化
function initializeSliders() {
    const sliders = {
        member: {
            container: document.querySelector('.member-slider'),
            prevBtn: document.querySelector('.member-slider-container .prev'),
            nextBtn: document.querySelector('.member-slider-container .next')
        },
        publication: {
            container: document.querySelector('.publications-grid'),
            prevBtn: document.querySelector('.publications-container .prev'),
            nextBtn: document.querySelector('.publications-container .next')
        },
        news: {
            container: document.querySelector('.news-grid'),
            prevBtn: document.querySelector('.news-slider-btn.prev'),
            nextBtn: document.querySelector('.news-slider-btn.next')
        }
    };

    Object.values(sliders).forEach(slider => {
        if (slider.container && slider.prevBtn && slider.nextBtn) {
            initializeSlider(slider);
        }
    });
}

function initializeSlider({ container, prevBtn, nextBtn }) {
    let scrollAmount = 0;
    const scrollStep = container.offsetWidth;

    nextBtn.addEventListener('click', () => {
        scrollAmount = Math.min(scrollAmount + scrollStep, container.scrollWidth - container.offsetWidth);
        container.scroll({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    prevBtn.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - scrollStep, 0);
        container.scroll({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}

// 轮播功能
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideInterval;

    // 初始化第一张幻灯片
    slides[0].classList.add('active');

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000); // 每5秒切换一次
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // 点击指示器切换幻灯片
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideshow();
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            startSlideshow();
        });
    });

    // 启动自动播放
    startSlideshow();

    // 鼠标悬停时暂停播放
    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);
}

// publications 筛选功能
function initializePublicationsFilter() {
    const filterButtons = document.querySelectorAll('.publications-page .filter-btn');
    const publicationItems = document.querySelectorAll('.publications-page .pub-item');

    // 为每个筛选按钮添加点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的按钮添加active类
            this.classList.add('active');

            const selectedYear = this.getAttribute('data-year');

            // 显示或隐藏相应的出版物
            publicationItems.forEach(item => {
                if (selectedYear === 'all' || item.getAttribute('data-year') === selectedYear) {
                    item.style.display = 'grid'; // 使用grid布局
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
} 