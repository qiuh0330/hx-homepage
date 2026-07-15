/**
 * 核信生物 - 公司主页交互脚本
 * 导航栏和页脚请分别编辑 navbar.html 和 footer.html
 */

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    injectComponents();
    injectSearchOverlay();
    injectWechatPopup();
    initScrollSpy();
    initProductSidebar();
    initScrollAnimation();
    initParticles();
    initSmoothScroll();
});

// ========== 注入共享组件 ==========
function injectComponents() {
    let navbarDone = false;
    let footerDone = false;

    function tryScrollToHash() {
        if (navbarDone && footerDone && window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                setTimeout(() => {
                    const nav = document.getElementById('navbar');
                    const offset = nav ? nav.offsetHeight + 20 : 80;
                    window.scrollTo({ top: target.offsetTop - offset, behavior: 'instant' });
                }, 100);
            }
        }
    }

    // 导航栏
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        const page = document.body.getAttribute('data-page');
        fetch('/navbar.html')
            .then(r => r.text())
            .then(html => {
                navPlaceholder.outerHTML = html;
                if (page && page !== 'index') {
                    const navbar = document.getElementById('navbar');
                    if (navbar) navbar.classList.add('scrolled');
                }
                highlightCurrentPage();
                initNavbar();
                initMobileMenu();
                initSearchOverlay();
                initWechatPopup();
                navbarDone = true;
                tryScrollToHash();
            });
    } else {
        navbarDone = true;
    }

    // 页脚
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('/footer.html')
            .then(r => r.text())
            .then(html => {
                footerPlaceholder.outerHTML = html;
                footerDone = true;
                tryScrollToHash();
            });
    } else {
        footerDone = true;
    }
}

// ========== 当前页面高亮 ==========
function highlightCurrentPage() {
    const page = document.body.getAttribute('data-page');
    if (!page) return;
    const link = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (link) {
        link.classList.add('active');
    }
}

// ========== 导航栏滚动效果（下滑隐藏，上滑显示） ==========
function initNavbar() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const scrollY = window.scrollY;

        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 下滑隐藏，上滑显示
        if (scrollY > lastScrollY && scrollY > 120) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }

        lastScrollY = scrollY;
    });
}

// ========== 移动端菜单 ==========
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    const links = menu.querySelectorAll('.nav-link');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        }
    });
}

// ========== 滚动监听 - 导航高亮 ==========
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ========== 滚动入场动画 (AOS) ==========
function initScrollAnimation() {
    const aosElements = document.querySelectorAll('[data-aos]');

    if (!aosElements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    aosElements.forEach(el => observer.observe(el));
}

// ========== Hero 粒子背景特效 ==========
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        particle.style.left = Math.random() * 100 + '%';

        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = Math.random() * 6 + 6 + 's';

        const colors = ['var(--accent)', 'var(--secondary)'];
        particle.style.background = colors[Math.floor(Math.random() * 2)];

        container.appendChild(particle);
    }
}

// ========== 平滑滚动 ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // 跳过圆点导航链接（由 initProductSidebar 处理）
        if (anchor.classList.contains('dot-link')) return;
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ========== 搜索遮罩层 ==========
const SEARCH_OVERLAY_HTML = `
<div class="search-overlay" id="searchOverlay">
    <div class="search-overlay-bg"></div>
    <div class="search-dialog">
        <div class="search-header">
            <div class="search-input-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" id="searchInput" class="search-input" placeholder="搜索页面内容..." autocomplete="off">
            </div>
            <button class="search-close" id="searchClose">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="search-results" id="searchResults">
            <p class="search-empty">输入关键词开始搜索</p>
        </div>
    </div>
</div>`;

function injectSearchOverlay() {
    const div = document.createElement('div');
    div.innerHTML = SEARCH_OVERLAY_HTML;
    document.body.appendChild(div.firstElementChild);
}

function initSearchOverlay() {
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const closeBtn = document.getElementById('searchClose');
    const searchBtn = document.getElementById('navSearchBtn');
    const bg = overlay ? overlay.querySelector('.search-overlay-bg') : null;

    if (!overlay || !searchBtn) return;

    // 打开搜索
    searchBtn.addEventListener('click', () => {
        overlay.classList.add('active');
        setTimeout(() => input.focus(), 100);
    });

    // 关闭搜索
    function closeSearch() {
        overlay.classList.remove('active');
        input.value = '';
        results.innerHTML = '<p class="search-empty">输入关键词开始搜索</p>';
    }
    closeBtn.addEventListener('click', closeSearch);
    bg.addEventListener('click', closeSearch);

    // ESC 关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeSearch();
        }
    });

    // 搜索
    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            results.innerHTML = '<p class="search-empty">输入关键词开始搜索</p>';
            return;
        }

        // 收集页面中可搜索的文本
        const sections = document.querySelectorAll('section, .product-block, .pipeline-card');
        const matches = [];

        sections.forEach((el, idx) => {
            const text = el.textContent.toLowerCase();
            if (text.includes(query)) {
                const title = el.querySelector('h1, h2, h3, h4')?.textContent || el.querySelector('.product-title')?.textContent || '';
                const snippet = getSnippet(el.textContent, query);
                const href = el.id ? '#' + el.id : '';
                const page = window.location.pathname.split('/').pop() || 'index.html';
                matches.push({ title: title || '无标题', snippet, href: page + href });
            }
        });

        if (matches.length === 0) {
            results.innerHTML = '<p class="search-empty">未找到相关结果</p>';
        } else {
            results.innerHTML = matches.map((m, i) => `
                <a href="${m.href}" class="search-result-item">
                    <span class="search-result-title">${highlightMatch(m.title, query)}</span>
                    <span class="search-result-snippet">${highlightMatch(m.snippet, query)}</span>
                </a>
            `).join('');
        }
    });
}

function getSnippet(text, query) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text.slice(0, 80) + '...';
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + query.length + 40);
    return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}

function highlightMatch(text, query) {
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
}

// ========== 微信公众号二维码弹窗 ==========
const WECHAT_POPUP_HTML = `
<div class="wechat-popup" id="wechatPopup">
    <div class="wechat-popup-card">
        <button class="wechat-popup-close" id="wechatClose">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
        <h3>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M8.69 3.46C4.28 3.46.75 6.7.75 10.68c0 2.2 1.22 4.16 3.08 5.44l-.77 2.3 2.65-1.32c.9.25 1.85.4 2.83.4l.3-.01c-.25-.53-.4-1.12-.4-1.75 0-4.05 3.33-7.34 7.42-7.34.31 0 .61.02.9.06-.8-3-4.17-4.8-8.07-4.8z"/>
                <path d="M14.76 12.27c-3.4 0-6.17 2.7-6.17 6.02 0 3.32 2.77 6.02 6.17 6.02 1 0 1.94-.24 2.78-.67l2.38 1.19-.68-2.08c1.56-1.2 2.58-3 2.58-5.03 0-3.32-2.77-5.45-6.17-5.45z"/>
            </svg>
            关注微信公众号
        </h3>
        <div class="wechat-qr-placeholder">
            <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="160" height="160" rx="8" fill="rgba(19,38,68,0.6)" stroke="rgba(74,144,217,0.2)" stroke-width="1"/>
                <rect x="30" y="30" width="40" height="40" rx="4" fill="none" stroke="rgba(0,201,167,0.2)" stroke-width="1.5"/>
                <rect x="90" y="30" width="40" height="40" rx="4" fill="none" stroke="rgba(0,201,167,0.2)" stroke-width="1.5"/>
                <rect x="30" y="90" width="40" height="40" rx="4" fill="none" stroke="rgba(0,201,167,0.2)" stroke-width="1.5"/>
                <rect x="90" y="90" width="40" height="40" rx="4" fill="none" stroke="rgba(0,201,167,0.2)" stroke-width="1.5"/>
                <rect x="35" y="35" width="30" height="30" rx="2" fill="rgba(0,201,167,0.08)"/>
                <rect x="95" y="35" width="30" height="30" rx="2" fill="rgba(0,201,167,0.08)"/>
                <rect x="35" y="95" width="30" height="30" rx="2" fill="rgba(0,201,167,0.08)"/>
                <rect x="95" y="95" width="30" height="30" rx="2" fill="rgba(0,201,167,0.08)"/>
                <text x="80" y="155" text-anchor="middle" fill="rgba(136,153,170,0.4)" font-size="10" font-family="inherit">扫码关注</text>
            </svg>
        </div>
        <p class="wechat-popup-hint">微信扫一扫，关注核信生物</p>
    </div>
</div>`;

function injectWechatPopup() {
    const div = document.createElement('div');
    div.innerHTML = WECHAT_POPUP_HTML;
    document.body.appendChild(div.firstElementChild);
}

function initWechatPopup() {
    const popup = document.getElementById('wechatPopup');
    const btn = document.getElementById('navWechatBtn');
    const closeBtn = document.getElementById('wechatClose');

    if (!popup || !btn) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.classList.add('active');
    });

    function closePopup() {
        popup.classList.remove('active');
    }

    closeBtn.addEventListener('click', closePopup);

    // 点击背景遮罩关闭
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });

    // ESC 关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });
}
// ========== 页面圆点导航滚动监听 ==========
function initProductSidebar() {
    var dots = document.querySelectorAll('.dot-link');
    if (!dots.length) return;

    // 根据所有dot-link的href收集对应的目标区块
    var targets = [];
    dots.forEach(function(d) {
        var id = d.getAttribute('href').replace('#', '');
        var el = document.getElementById(id);
        if (el) targets.push({ id: id, el: el, dot: d });
    });
    if (!targets.length) return;

    window.addEventListener('scroll', function() {
        var scrollY = window.scrollY + window.innerHeight / 3;
        var current = '';
        targets.forEach(function(t) {
            var top = t.el.getBoundingClientRect().top + window.scrollY;
            if (scrollY >= top) {
                current = t.id;
            }
        });
        dots.forEach(function(d) { d.classList.remove('active'); });
        targets.forEach(function(t) {
            if (t.id === current) t.dot.classList.add('active');
        });
    });

    // 点击圆点平滑滚动
    dots.forEach(function(d) {
        d.addEventListener('click', function(e) {
            e.preventDefault();
            var id = this.getAttribute('href').replace('#', '');
            var target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
