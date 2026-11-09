(function () {
    'use strict';

    var root = document.documentElement;
    var menu = document.getElementById('navbarNav');
    var menuToggle = document.getElementById('menuToggle');
    var desktop = window.matchMedia('(min-width: 992px)');

    function closeMenu() {
        menu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !desktop.matches && menu.classList.contains('is-open')) {
            closeMenu();
            menuToggle.focus();
        }
    });
    desktop.addEventListener('change', closeMenu);
    menuToggle.hidden = false;
    root.setAttribute('data-navigation-ready', 'true');

    var themeToggle = document.getElementById('themeToggle');
    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    function isDark() {
        var theme = root.getAttribute('data-theme');
        return theme === 'dark' || (!theme && systemTheme.matches);
    }

    function updateThemeToggle() {
        var dark = isDark();
        var label = dark ? 'Switch to light mode' : 'Switch to dark mode';
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('aria-pressed', String(dark));
        themeToggle.title = label;
    }

    themeToggle.addEventListener('click', function () {
        var next = isDark() ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        // A blocked or full storage area must not disable the current theme.
        try {
            localStorage.setItem('theme', next);
        } catch (error) {
            // The selected theme still applies for this page.
        }
        updateThemeToggle();
    });
    systemTheme.addEventListener('change', updateThemeToggle);
    updateThemeToggle();
    themeToggle.hidden = false;

    var backToTop = document.getElementById('backToTop');
    function updateBackToTop() {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
    backToTop.addEventListener('click', function () {
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
})();
