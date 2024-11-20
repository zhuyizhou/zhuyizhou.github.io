document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timeline = document.querySelector('.timeline');

    // 排序函数
    function sortByDate() {
        const items = Array.from(timelineItems);
        items.sort((a, b) => {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            return dateB - dateA; // 降序排列，最新的在前
        });

        // 重新添加排序后的元素
        items.forEach(item => timeline.appendChild(item));
    }

    // 初始排序
    sortByDate();

    // 筛选功能
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            timelineItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    // 重新触发动画
                    item.style.animation = 'none';
                    item.offsetHeight;
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 图片加载动画
    const images = document.querySelectorAll('.gallery-image img');
    images.forEach(img => {
        if (img.complete) {
            img.parentElement.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.parentElement.classList.add('loaded');
            });
        }
    });

    // 添加多图片展示功能
    const imageStacks = document.querySelectorAll('.gallery-image-stack');
    
    // 创建展开视图容器
    const expandedView = document.createElement('div');
    expandedView.className = 'gallery-images-expanded';
    document.body.appendChild(expandedView);

    imageStacks.forEach(stack => {
        const images = stack.querySelectorAll('img');
        if (images.length > 1) {
            // 为多图片添加点击事件
            stack.addEventListener('click', () => {
                showExpandedView(images);
            });
        }
    });

    function showExpandedView(images) {
        let currentIndex = 0;
        
        // 创建展开视图的HTML
        expandedView.innerHTML = `
            <div class="expanded-images-container">
                ${Array.from(images).map((img, i) => `
                    <div class="expanded-image ${i === 0 ? 'active' : ''}">
                        <img src="${img.src}" alt="${img.alt}">
                    </div>
                `).join('')}
                <button class="image-nav-btn prev">←</button>
                <button class="image-nav-btn next">→</button>
                <div class="image-counter">1/${images.length}</div>
            </div>
        `;

        // 显示展开视图
        expandedView.style.display = 'flex';

        // 添加导航功能
        const prevBtn = expandedView.querySelector('.prev');
        const nextBtn = expandedView.querySelector('.next');
        const counter = expandedView.querySelector('.image-counter');
        const expandedImages = expandedView.querySelectorAll('.expanded-image');

        function showImage(index) {
            expandedImages.forEach(img => img.classList.remove('active'));
            expandedImages[index].classList.add('active');
            counter.textContent = `${index + 1}/${images.length}`;
        }

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });

        // 点击背景关闭展开视图
        expandedView.addEventListener('click', (e) => {
            if (e.target === expandedView) {
                expandedView.style.display = 'none';
            }
        });

        // 添加键盘导航
        document.addEventListener('keydown', (e) => {
            if (expandedView.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    prevBtn.click();
                } else if (e.key === 'ArrowRight') {
                    nextBtn.click();
                } else if (e.key === 'Escape') {
                    expandedView.style.display = 'none';
                }
            }
        });
    }
}); 