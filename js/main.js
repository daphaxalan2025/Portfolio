/* =========================================================
   DAPHNE B. AXALAN — MAIN SCRIPT
   Auth gate · theme switcher · background particles ·
   logout · gallery · scroll reveal · scrollspy · dividers
   ========================================================= */

/* ---------- AUTH GATE ---------- */
(function() {
    if (sessionStorage.getItem('daphne_logged_in') !== 'yes') {
        window.location.replace('login.html');
    }
})();

document.addEventListener('DOMContentLoaded', function() {

    /* =========================================================
       THEME SWITCHER + PROFILE PICTURE
       ========================================================= */
    const themeButtons = document.querySelectorAll('.theme-btn');
    const switcher = document.querySelector('.theme-switcher');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'ocean';

    const themeLabel = document.createElement('span');
    themeLabel.className = 'theme-label';
    if (switcher) switcher.appendChild(themeLabel);

    const profileImg = document.querySelector('.profile-container img');
    const themePics = {
        earth: 'earthpic.jpg',
        ocean: 'oceanpic.png',
        rose: 'rosepic.jpg',
        forest: 'forestpic.jpg'
    };

    const imgSrc = profileImg ? profileImg.getAttribute('src') : '';
    const imgBase = imgSrc.slice(0, imgSrc.lastIndexOf('/') + 1) || '../images/';

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);

        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        if (themeLabel) {
            themeLabel.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        }

        if (profileImg && themePics[theme]) {
            profileImg.src = imgBase + themePics[theme];
        }

        spawnEffects(theme);
    }

    /* =========================================================
       THEME BACKGROUND PARTICLES
       ========================================================= */
    const fxContainer = document.createElement('div');
    fxContainer.id = 'bg-effects';
    document.body.appendChild(fxContainer);

    function spawnEffects(theme) {
        fxContainer.innerHTML = '';

        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const defs = {
            ocean: {
                cls: 'fx-bubble',
                count: 18,
                palette: ['rgba(255,255,255,0.70)', 'rgba(255,255,255,0.40)', '#a5e3ff', '#5cc4e2', '#37b6d6', '#1f8fb5']
            },
            rose: {
                cls: 'fx-petal',
                count: 16,
                palette: ['#ffd0dc', '#ffb3c1', '#ff8fa3', '#ff6b8b', '#e23a6e', '#c94466']
            },
            forest: {
                cls: 'fx-leaf',
                count: 16,
                palette: ['#b5e6a2', '#8cd67c', '#5fc16f', '#3f9b4f', '#2c7a3d', '#9bc24a']
            },
            earth: {
                cls: 'fx-rock',
                count: 12,
                palette: ['#c98d5a', '#a97142', '#8a5a33', '#7a4a21', '#6b4226']
            }
        };

        const def = defs[theme];
        if (!def) return;

        for (let i = 0; i < def.count; i++) {
            const p = document.createElement('span');
            p.className = def.cls;
            p.style.setProperty('--fx-color', def.palette[Math.floor(Math.random() * def.palette.length)]);
            p.style.left = (Math.random() * 100) + '%';
            p.style.setProperty('--fx-sway', ((Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 100)) + 'px');
            p.style.animationDuration = (6 + Math.random() * 10) + 's';
            p.style.animationDelay = (-Math.random() * 14) + 's';

            if (def.cls === 'fx-rock') {
                p.style.top = (-20 - Math.random() * 30) + 'px';
                const s = 6 + Math.random() * 10;
                p.style.width = s + 'px';
                p.style.height = s + 'px';
            } else {
                const size = 8 + Math.random() * 14;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
            }
            fxContainer.appendChild(p);
        }

        // Ocean: wave bands
        if (theme === 'ocean') {
            for (let i = 0; i < 2; i++) {
                const w = document.createElement('span');
                w.className = 'fx-wave';
                w.style.setProperty('--fx-color', i === 0 ? 'rgba(5, 63, 92, 0.20)' : 'rgba(26, 138, 154, 0.28)');
                w.style.bottom = (i === 0 ? -30 : -70) + 'px';
                w.style.height = (i === 0 ? 110 : 90) + 'px';
                w.style.animationDuration = (i === 0 ? 5.5 : 7.5) + 's';
                w.style.animationDelay = (i * 2) + 's';
                fxContainer.appendChild(w);
            }
        }

        // Earth: dust particles
        if (theme === 'earth') {
            for (let i = 0; i < 8; i++) {
                const d = document.createElement('span');
                d.className = 'fx-dust';
                d.style.setProperty('--fx-color', 'rgba(139, 111, 71, 0.55)');
                d.style.left = (Math.random() * 100) + '%';
                d.style.top = (10 + Math.random() * 80) + '%';
                const s = 3 + Math.random() * 4;
                d.style.width = s + 'px';
                d.style.height = s + 'px';
                d.style.animationDuration = (10 + Math.random() * 10) + 's';
                d.style.animationDelay = (-Math.random() * 12) + 's';
                fxContainer.appendChild(d);
            }
        }
    }

    /* =========================================================
       THEME BUTTON EVENT LISTENERS
       ========================================================= */
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            applyTheme(theme);
        });
    });

    // Apply saved theme on load
    applyTheme(savedTheme);

    /* =========================================================
       LOGOUT
       ========================================================= */
    document.querySelectorAll('.logout-btn-header, .logout-btn').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('daphne_logged_in');
            window.location.href = 'login.html';
        });
    });

    /* =========================================================
       HEADER SCROLL EFFECT
       ========================================================= */
    const header = document.querySelector('.site-header');

    function onHeaderScroll() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 15);
    }

    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll();

    /* =========================================================
       SECTION DIVIDERS
       ========================================================= */
    ['about', 'interest', 'achievements', 'contacts'].forEach(function(id) {
        const section = document.getElementById(id);
        if (!section) return;
        const divider = document.createElement('div');
        divider.className = 'section-divider';
        section.insertAdjacentElement('beforebegin', divider);
    });

    /* =========================================================
       STATISTICS — auto-count achievement photos
       ========================================================= */
    const achStat = document.getElementById('stat-achievements');
    if (achStat) {
        achStat.textContent = document.querySelectorAll('.achievement-group img').length;
    }

    /* =========================================================
       CYCLERS  (achievements gallery + facts/favorites sliders)
       One item visible at a time · click to advance ·
       auto-loop 3.2s · hover pauses · "n / m" badge
       ========================================================= */
    function setupCycler(root, itemSel) {
        const items = root.querySelectorAll(itemSel);
        if (!items.length) return;

        let index = 0;
        let timer = null;

        const badge = document.createElement('span');
        badge.className = 'gallery-count';
        root.appendChild(badge);

        function paint() {
            items.forEach((el, i) => {
                el.classList.toggle('active', i === index);
            });
            badge.textContent = (index + 1) + ' / ' + items.length;
        }

        function next() {
            index = (index + 1) % items.length;
            paint();
        }

        function start() {
            if (items.length > 1) timer = setInterval(next, 3200);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        root.addEventListener('click', function(e) {
            if (e.target.closest(itemSel)) {
                stop();
                next();
                start();
            }
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);

        paint();
        start();
    }

    document.querySelectorAll('[data-gallery]').forEach(function(gallery) {
        setupCycler(gallery, 'img');
    });

    document.querySelectorAll('[data-slider]').forEach(function(slider) {
        setupCycler(slider, '.slider-item');
    });

    /* =========================================================
       SCROLL REVEAL
       ========================================================= */
    const revealTargets = document.querySelectorAll(
        '.profile-container, .background, .info-box, .about-card, .project-card, ' +
        '.interest-list li, .achievement-group, .experiences-lists li, ' +
        '.contacts-list li, .contact-form, .projects-section, .stat-box'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // animate skill/talent progress bars to their --pct value
                    entry.target.querySelectorAll('.bar-fill').forEach(function(bar) {
                        bar.style.width = bar.style.getPropertyValue('--pct') || '0%';
                    });
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(function(el) {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    } else {
        revealTargets.forEach(function(el) {
            el.classList.add('in-view');
        });
    }

    /* =========================================================
       SCROLLSPY
       ========================================================= */
    const navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));

    const spySections = navAnchors
        .map(function(a) {
            const href = a.getAttribute('href');
            return href && href.charAt(0) === '#' ? document.querySelector(href) : null;
        })
        .filter(Boolean);

    if ('IntersectionObserver' in window && spySections.length) {
        const spyObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const id = '#' + entry.target.id;
                    navAnchors.forEach(function(a) {
                        a.classList.toggle('active', a.getAttribute('href') === id);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        spySections.forEach(function(section) {
            spyObserver.observe(section);
        });
    }
});
