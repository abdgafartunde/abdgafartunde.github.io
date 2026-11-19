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
        // Keep the toggle's name stable; its pressed state means dark mode is on.
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

    var blogControls = document.getElementById('blogControls');
    if (blogControls) {
        var search = document.getElementById('blogSearch');
        var topicButtons = Array.from(blogControls.querySelectorAll('[data-topic]'));
        var entries = Array.from(document.querySelectorAll('[data-blog-entry]'));
        var resultCount = document.getElementById('blogResultCount');
        var noResults = document.getElementById('blogNoResults');
        var activeTopic = 'all';

        function normalizeSearch(value) {
            return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
        }

        var searchIndex = entries.map(function (entry) {
            return normalizeSearch(entry.getAttribute('data-search'));
        });

        function filterEssays(updateUrl) {
            var terms = normalizeSearch(search.value).trim().split(/\s+/).filter(Boolean);
            var count = 0;
            entries.forEach(function (entry, index) {
                var topics = entry.getAttribute('data-topics').split(/\s+/);
                var matches = (activeTopic === 'all' || topics.indexOf(activeTopic) !== -1) &&
                    terms.every(function (term) { return searchIndex[index].indexOf(term) !== -1; });
                entry.hidden = !matches;
                if (matches) count += 1;
            });
            topicButtons.forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.getAttribute('data-topic') === activeTopic));
            });
            resultCount.textContent = count + (count === 1 ? ' essay' : ' essays');
            noResults.hidden = count !== 0;

            if (updateUrl) {
                var url = new URL(window.location.href);
                if (activeTopic === 'all') url.searchParams.delete('topic');
                else url.searchParams.set('topic', activeTopic);
                if (search.value.trim()) url.searchParams.set('q', search.value.trim());
                else url.searchParams.delete('q');
                // Filtering remains usable when history updates are restricted.
                try { window.history.replaceState(null, '', url); } catch (error) {}
            }
        }

        function readFiltersFromUrl() {
            var parameters = new URL(window.location.href).searchParams;
            var requestedTopic = parameters.get('topic');
            activeTopic = topicButtons.some(function (button) {
                return button.getAttribute('data-topic') === requestedTopic;
            }) ? requestedTopic : 'all';
            search.value = parameters.get('q') || '';
            filterEssays(false);
        }

        topicButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeTopic = button.getAttribute('data-topic');
                filterEssays(true);
            });
        });
        search.addEventListener('input', function () { filterEssays(true); });
        document.getElementById('blogReset').addEventListener('click', function () {
            search.value = '';
            activeTopic = 'all';
            filterEssays(true);
            search.focus();
        });
        window.addEventListener('popstate', readFiltersFromUrl);
        readFiltersFromUrl();
        blogControls.hidden = false;
    }

    var contents = document.getElementById('postToc');
    if (contents) {
        var headings = Array.from(document.querySelectorAll('.post-content h2[id]'));
        if (headings.length >= 4) {
            var contentsList = contents.querySelector('ol');
            headings.forEach(function (heading) {
                var item = document.createElement('li');
                var link = document.createElement('a');
                link.href = '#' + encodeURIComponent(heading.id);
                link.textContent = heading.textContent;
                item.appendChild(link);
                contentsList.appendChild(item);
            });
            contents.open = !window.matchMedia('(max-width: 620px)').matches;
            contents.hidden = false;
        }
    }

    var backToTop = document.getElementById('backToTop');
    function updateBackToTop() {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
    backToTop.addEventListener('click', function () {
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById('main-content').focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
})();
