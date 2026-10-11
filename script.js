document.addEventListener('DOMContentLoaded', function() {
    // 将所有的初始化代码放在这里
    initializeSliders();
    initializeStats();
    initializeHeroSlider();
    
    // 添加 gallery 的初始化
    initializeGallery();
});

// 优化统计数字的动画
function initializeStats() {
    const stats = document.querySelectorAll('.stat-number:not([data-target-publications])');
    
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
    function getScrollStep() {
        const firstCard = container.firstElementChild;
        if (!firstCard) return container.clientWidth;

        const styles = window.getComputedStyle(container);
        const gap = parseFloat(styles.columnGap || styles.gap) || 0;
        return firstCard.getBoundingClientRect().width + gap;
    }

    function scrollByCard(direction) {
        const maxScroll = Math.max(container.scrollWidth - container.clientWidth, 0);
        const nextScroll = Math.min(
            Math.max(container.scrollLeft + direction * getScrollStep(), 0),
            maxScroll
        );

        container.scroll({
            left: nextScroll,
            behavior: 'smooth'
        });
    }

    nextBtn.addEventListener('click', () => scrollByCard(1));

    prevBtn.addEventListener('click', () => scrollByCard(-1));
}

// 轮播功能
function initializeHeroSlider() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    if (!slides.length || !indicators.length) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');

        indicators.forEach((indicator, indicatorIndex) => {
            const isActive = indicatorIndex === currentSlide;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-current', String(isActive));
        });
    }

    // 初始化第一张幻灯片
    slides[0].classList.add('active');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
        indicator.setAttribute('aria-current', String(index === currentSlide));
    });

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function startSlideshow() {
        stopSlideshow();
        slideInterval = setInterval(nextSlide, 5000); // 每5秒切换一次
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // 点击指示器切换幻灯片
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideshow();
            showSlide(index);
            startSlideshow();
        });
    });

    // 启动自动播放
    startSlideshow();

    // 鼠标悬停时暂停播放
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);
}

// 添加 Gallery 初始化函数
function initializeGallery() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return; // 如果不在 gallery 页面则返回

    // 获取所有 timeline items 并转换为数组
    const items = Array.from(timeline.children);
    
    // 在显示之前先隐藏所有内容
    items.forEach(item => {
        item.style.opacity = '0';
        item.style.display = 'none';
    });

    // 按日期排序（从新到旧）
    items.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-date'));
        const dateB = new Date(b.getAttribute('data-date'));
        return dateB - dateA;
    });

    // 重新排序并添加回 DOM
    items.forEach(item => {
        timeline.appendChild(item);
    });

    // 使用 setTimeout 确保排序完成后再显示内容
    setTimeout(() => {
        items.forEach(item => {
            item.style.display = '';
            // 使用 requestAnimationFrame 来平滑显示内容
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transition = 'opacity 0.3s ease-in';
            });
        });
    }, 0);
}
