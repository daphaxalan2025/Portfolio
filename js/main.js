(function () {
    if (sessionStorage.getItem('daphne_logged_in') !== 'yes') {
        window.location.replace('login.html');
    }
})();


document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       THEME SWITCHER  (ocean · rose · forest · earth)
       ========================================================= */

    const themeButtons = document.querySelectorAll('.theme-btn');
    const switcher = document.querySelector('.theme-switcher');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'earth';

    // small label showing the active theme name (created here, styled in CSS)
    const themeLabel = document.createElement('span');
    themeLabel.className = 'theme-label';
    if (switcher) switcher.appendChild(themeLabel);

    // profile picture per theme — one picture for each theme
    const profileImg = document.querySelector('.profile-container img');
    const themePics = {
        earth: 'earthpic.jpg',
        ocean: 'oceanpic.png',
        rose: 'rosepic.jpg',
        forest: 'forestpic.jpg'
    };
    // reuse the existing <img> path (../images/...) so this works
    // no matter how deep the html files sit in the project
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

        // swap the profile picture to match the theme
        if (profileImg && themePics[theme]) {
            profileImg.src = imgBase + themePics[theme];
        }

        // rebuild the themed background particles (birds, waves, leaves...)
        spawnEffects(theme);
    }

    /* =========================================================
       THEME BACKGROUND EFFECTS  (particles created here)
       ---------------------------------------------------------
       Each theme gets its own living background:
       earth = flying birds + falling rocks
       ocean = rising bubbles + wave bands
       forest = falling leaves (windy)
       rose  = petals blown by the wind
       The shapes and their animations live in style.css;
       this only creates them. Solid colors — no gradients.
       ========================================================= */

    const fxContainer = document.createElement('div');
    fxContainer.id = 'bg-effects';
    document.body.appendChild(fxContainer);

    function spawnEffects(theme) {
        fxContainer.innerHTML = '';

        // respect the visitor's "reduce motion" preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const defs = {
            ocean: {
                cls: 'fx-bubble',
                count: 14,
                palette: ['rgba(255, 255, 255, 0.60)', 'rgba(255, 255, 255, 0.35)', '#bfeefc', '#8fe0f5', '#5cc4e2', '#37b6d6']
            },
            forest: {
                cls: 'fx-leaf',
                count: 14,
                palette: ['#b5e6a2', '#8cd67c', '#5fc16f', '#3f9b4f', '#2c7a3d', '#9bc24a']
            },
            rose: {
                cls: 'fx-petal',
                count: 14,
                palette: ['#ffd0dc', '#ffb3c1', '#ff8fa3', '#ff6b8b', '#e23a6e', '#c94466']
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
            p.style.setProperty('--fx-sway', ((Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 90)) + 'px');
            p.style.animationDuration = (7 + Math.random() * 9) + 's';
            p.style.animationDelay = (-Math.random() * 12) + 's';

            if (def.cls === 'fx-bird') {
                // birds fly horizontally at random heights
                p.style.width = '26px';
                p.style.height = '12px';
                p.style.left = '-60px';
                p.style.top = (8 + Math.random() * 55) + '%';
                p.style.animationDuration = (18 + Math.random() * 14) + 's';
            } else {
                const size = 8 + Math.random() * 12;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
            }
            fxContainer.appendChild(p);
        }

        // ocean extra: two wave bands at the bottom (a bit faster now)
        if (theme === 'ocean') {
            for (let i = 0; i < 2; i++) {
                const w = document.createElement('span');
                w.className = 'fx-wave';
                w.style.setProperty('--fx-color', i === 0 ? 'rgba(5, 63, 92, 0.22)' : 'rgba(26, 138, 154, 0.30)');
                w.style.bottom = (i === 0 ? -30 : -70) + 'px';
                w.style.height = (i === 0 ? 110 : 90) + 'px';
                w.style.animationDuration = (i === 0 ? 6 : 8) + 's';
                w.style.animationDelay = (i * 2) + 's';
                fxContainer.appendChild(w);
            }
        }
    }

    // restore the saved theme (default: earth)
    applyTheme(savedTheme);

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
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
       ACHIEVEMENTS GALLERY
       ---------------------------------------------------------
       First picture appears, fades out, next appears — looping.
       Clicking a picture advances to the next one manually.
       ========================================================= */

    document.querySelectorAll('[data-gallery]').forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        if (!images.length) return;

        let index = 0;
        let timer = null;

        // "n / total" badge (created here, styled in CSS)
        const badge = document.createElement('span');
        badge.className = 'gallery-count';
        gallery.appendChild(badge);

        function paint() {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            badge.textContent = (index + 1) + ' / ' + images.length;
        }

        function next() {
            index = (index + 1) % images.length;
            paint();
        }

        function start() {
            if (images.length > 1) {
                timer = setInterval(next, 3200);
            }
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        // click on a picture -> show the next one, keep looping
        gallery.addEventListener('click', function (e) {
            if (e.target.tagName === 'IMG') {
                stop();
                next();
                start();
            }
        });

        // pause while hovering, resume after
        gallery.addEventListener('mouseenter', stop);
        gallery.addEventListener('mouseleave', start);

        paint();
        start();
    });


    /* =========================================================
       SCROLL REVEAL  (cards fade in as you scroll)
       ========================================================= */

    const revealTargets = document.querySelectorAll(
        '.profile-container, .background, .info-box, .about-card, .project-btn, ' +
        '.interest-list li, .achievement-group, .experiences-lists li, ' +
        '.contacts-list li, .contact-form, .projects-section'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(function (el) {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    } else {
        // fallback: show everything right away
        revealTargets.forEach(function (el) {
            el.classList.add('in-view');
        });
    }


    /* =========================================================
       SCROLLSPY  (highlight the nav link of the visible section)
       ========================================================= */

    const navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));

    const spySections = navAnchors
        .map(function (a) {
            const href = a.getAttribute('href');
            return href && href.charAt(0) === '#' ? document.querySelector(href) : null;
        })
        .filter(Boolean);

    if ('IntersectionObserver' in window && spySections.length) {
        const spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = '#' + entry.target.id;
                    navAnchors.forEach(function (a) {
                        a.classList.toggle('active', a.getAttribute('href') === id);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        spySections.forEach(function (section) {
            spyObserver.observe(section);
        });
    }

});