// ============================================================
// MONEY TIME WITH REE — main.js v3.0 (Seamless & Premium)
// ============================================================

// Global helper: Bind slider and number inputs together
function bindSliderAndInput(inputId, sliderId, onUpdate) {
    const inputEl = document.getElementById(inputId);
    const sliderEl = document.getElementById(sliderId);
    if (!inputEl || !sliderEl) return;
    
    // On numeric input change, sync slider
    inputEl.addEventListener('input', () => {
        sliderEl.value = inputEl.value;
        if (onUpdate) onUpdate();
    });
    
    // On slider change, sync numeric input
    sliderEl.addEventListener('input', () => {
        inputEl.value = sliderEl.value;
        if (onUpdate) onUpdate();
    });
}

// Global page initializer called on load & after dynamic transitions
function initPageFeatures() {
    // ---- PRELOADER ----
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('hidden')) {
        if (window.lenis) window.lenis.stop();
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        }, 1600);
        document.body.style.overflow = 'hidden';
    }

    // ---- NAVBAR SCROLL BEHAVIOR ----
    const navbar = document.getElementById('navbar');
    if (navbar && !navbar.dataset.bound) {
        navbar.dataset.bound = "true";
        const handleScroll = () => {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                // Keep scrolled state active on subpages
                if (!document.body.classList.contains('blog-post-page') &&
                    !document.body.classList.contains('about-page') &&
                    !document.body.classList.contains('blog-page')) {
                    navbar.classList.remove('scrolled');
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ---- MOBILE MENU ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    const mobileClose = document.getElementById('mobile-close');

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        if (mobileBackdrop) mobileBackdrop.classList.add('open');
        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = 'hidden';
        // Animate hamburger → X
        if (hamburger) {
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[1].style.transform = 'scaleX(0)';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        if (mobileBackdrop) mobileBackdrop.classList.remove('open');
        if (window.lenis) window.lenis.start();
        document.body.style.overflow = '';
        // Reset hamburger icon
        if (hamburger) {
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    }

    if (hamburger && mobileMenu && !hamburger.dataset.bound) {
        hamburger.dataset.bound = "true";
        hamburger.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close button inside the drawer
        if (mobileClose) {
            mobileClose.addEventListener('click', closeMobileMenu);
        }

        // Close on backdrop click
        if (mobileBackdrop) {
            mobileBackdrop.addEventListener('click', closeMobileMenu);
        }

        // Close on nav link click (but not on non-navigating buttons like social icons)
        mobileMenu.querySelectorAll('a').forEach(el => {
            el.addEventListener('click', () => {
                // Small delay so the transition overlay can fire first if needed
                setTimeout(closeMobileMenu, 50);
            });
        });
    }

    // ---- SCROLL ANIMATIONS ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-up class to animatable elements
    const animatables = document.querySelectorAll(
        '.tool-card, .lgp-card, .guide-card, .story-card-new, .library-item, .dashboard-card, .calculator-card, .stat-item'
    );

    animatables.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
        observer.observe(el);
    });

    // Inject animate-in style once if not present
    if (!document.getElementById('animate-in-styles')) {
        const style = document.createElement('style');
        style.id = 'animate-in-styles';
        style.textContent = '.animate-in { opacity: 1 !important; transform: none !important; }';
        document.head.appendChild(style);
    }

    // ---- NAVBAR SCROLLED STATE FOR OTHER PAGES ----
    if (document.body.classList.contains('blog-post-page') ||
        document.body.classList.contains('about-page') ||
        document.body.classList.contains('blog-page')) {
        if (navbar) navbar.classList.add('scrolled');
    }

    // ---- MANIFESTO SCROLL REVEAL (about/blog pages) ----
    const revealTexts = document.querySelectorAll('.reveal-text');
    if (revealTexts.length > 0) {
        const manifestoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.backgroundSize = '100% 100%';
                    entry.target.style.webkitTextFillColor = '';
                }
            });
        }, { threshold: 0.5 });
        revealTexts.forEach(el => manifestoObserver.observe(el));
    }

    // ---- CALCULATOR SLIDER SYNC BINDINGS ----
    bindSliderAndInput('ci-principal', 'ci-principal-slider', calcCompound);
    bindSliderAndInput('ci-monthly', 'ci-monthly-slider', calcCompound);
    bindSliderAndInput('ci-rate', 'ci-rate-slider', calcCompound);
    bindSliderAndInput('ci-years', 'ci-years-slider', calcCompound);

    bindSliderAndInput('wg-goal', 'wg-goal-slider', calcGoal);
    bindSliderAndInput('wg-current', 'wg-current-slider', calcGoal);
    bindSliderAndInput('wg-monthly', 'wg-monthly-slider', calcGoal);
    bindSliderAndInput('wg-rate', 'wg-rate-slider', calcGoal);

    bindSliderAndInput('bp-income', 'bp-income-slider', calcBudget);
    bindSliderAndInput('sh-hours', 'sh-hours-slider', calcHustle);

    const shTypeSelect = document.getElementById('sh-type');
    if (shTypeSelect) {
        shTypeSelect.addEventListener('change', calcHustle);
    }

    // ---- CALCULATOR TAB SWITCHER ----
    const tabButtons = document.querySelectorAll('.calc-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetId = btn.getAttribute('data-calc');
            const cards = document.querySelectorAll('.calculator-card');
            cards.forEach(card => {
                if (card.id === targetId) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Re-run the active calculator calculations
            if (targetId === 'compound-calc') calcCompound();
            if (targetId === 'goal-calc') calcGoal();
            if (targetId === 'budget-calc') calcBudget();
            if (targetId === 'hustle-calc') calcHustle();
        });
    });

    // ---- RUN DEFAULT CALCULATIONS ----
    if (document.getElementById('ci-principal')) calcCompound();
    if (document.getElementById('wg-goal')) calcGoal();
    if (document.getElementById('bp-income')) calcBudget();
    if (document.getElementById('sh-hours')) calcHustle();
}

// Programmatic Scroll Helper leveraging Lenis or falling back to native smooth scroll
function smoothScrollTo(target) {
    const navbar = document.getElementById('navbar');
    const offset = navbar ? navbar.offsetHeight + 16 : 80;
    
    if (window.lenis) {
        window.lenis.scrollTo(target, { offset: -offset, duration: 1.2 });
    } else {
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

// Global Lenis smooth scrolling initialization
function initLenisSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false,
        });

        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
        }

        const animateRaf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(animateRaf);
        };
        requestAnimationFrame(animateRaf);

        window.lenis = lenis;
        console.log("Lenis Scroll Initialized Successfully.");
    }
}

// Global dynamic SPA routing system
function initDynamicRouter() {
    const isLocalFile = window.location.protocol === 'file:';
    if (isLocalFile) {
        console.warn('Money Time With Ree Router: Local preview mode. Fallback to native loading with transition effect due to file:// protocol CORS rules.');
        
        // Native fallbacks for anchor scroll clicks and page transition overlays
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            // Ignore secondary target links
            if (link.target === '_blank' || 
                link.hasAttribute('download') || 
                link.getAttribute('href').startsWith('mailto:') || 
                link.getAttribute('href').startsWith('tel:')) {
                return;
            }

            const href = link.getAttribute('href');
            if (!href) return;

            // Case 1: Same-page hash tag anchor
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    smoothScrollTo(target);
                }
                return;
            }

            // Case 2: Link pointing to same-page anchor via index.html prefix
            const currentPath = window.location.pathname.replace('index.html', '').replace(/\/$/, '');
            const targetPath = link.pathname.replace('index.html', '').replace(/\/$/, '');
            if (currentPath === targetPath && link.hash) {
                const target = document.querySelector(link.hash);
                if (target) {
                    e.preventDefault();
                    smoothScrollTo(target);
                    return;
                }
            }

            // Case 3: Complete page transition load
            // Only transition for local/internal html files to avoid page hanging
            const isInternal = href.endsWith('.html') || !href.includes(':');
            if (isInternal) {
                e.preventDefault();
                const overlay = document.getElementById('transition-overlay');
                if (overlay) {
                    overlay.classList.remove('transitioning-out');
                    overlay.classList.add('active');
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 600);
                } else {
                    window.location.href = link.href;
                }
            }
        });
        return;
    }

    const overlay = document.getElementById('transition-overlay');
    if (!overlay) return;

    // Intercept clicks on links
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Ignore secondary target links
        if (link.target === '_blank' || 
            link.hostname !== window.location.hostname || 
            link.hasAttribute('download') || 
            link.getAttribute('href').startsWith('mailto:') || 
            link.getAttribute('href').startsWith('tel:')) {
            return;
        }

        const href = link.getAttribute('href');
        if (!href) return;

        // Case 1: Clicked same-page hash tag anchor
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                smoothScrollTo(target);
            }
            return;
        }

        // Case 2: Link pointing to same-page anchor via index.html prefix
        const currentPath = window.location.pathname.replace('index.html', '').replace(/\/$/, '');
        const targetPath = link.pathname.replace('index.html', '').replace(/\/$/, '');
        if (currentPath === targetPath && link.hash) {
            const target = document.querySelector(link.hash);
            if (target) {
                e.preventDefault();
                smoothScrollTo(target);
                history.pushState(null, '', link.hash);
                return;
            }
        }

        // Case 3: Complete page transition load
        e.preventDefault();
        loadPageDynamically(link.href, true);
    });

    // Handle back / forward buttons
    window.addEventListener('popstate', () => {
        loadPageDynamically(window.location.href, false);
    });
}

// Fetch and load target page dynamically
function loadPageDynamically(url, pushState = true) {
    const overlay = document.getElementById('transition-overlay');
    if (!overlay) {
        window.location.href = url;
        return;
    }

    // Trigger full-screen wipe transition (swipe in)
    overlay.classList.remove('transitioning-out');
    overlay.classList.add('active');

    const startTime = Date.now();
    const urlObj = new URL(url);
    const hash = urlObj.hash;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch page');
            return response.text();
        })
        .then(html => {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, 600 - elapsed); // Ensure swipe cover animation (600ms) completes first
            
            setTimeout(() => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Swap main content
                const newMain = doc.querySelector('main');
                const currentMain = document.querySelector('main');
                if (newMain && currentMain) {
                    currentMain.innerHTML = newMain.innerHTML;
                }

                // Swap document title
                document.title = doc.title;

                // Sync body classes
                document.body.className = doc.body.className;

                // Update navbar states dynamically from target page
                const currentNav = document.getElementById('navbar');
                const newNav = doc.getElementById('navbar');
                if (currentNav && newNav) {
                    currentNav.className = newNav.className;
                    const currentNavInner = currentNav.querySelector('.nav-inner');
                    const newNavInner = newNav.querySelector('.nav-inner');
                    if (currentNavInner && newNavInner) {
                        currentNavInner.innerHTML = newNavInner.innerHTML;
                    }
                }

                // Save to history
                if (pushState) {
                    history.pushState(null, '', url);
                }

                // Resolve scrolling position
                if (hash) {
                    const targetEl = document.querySelector(hash);
                    if (targetEl) {
                        smoothScrollTo(targetEl);
                    } else {
                        window.scrollTo(0, 0);
                    }
                } else {
                    window.scrollTo(0, 0);
                }

                // Re-initialize dynamic page interactive features
                initPageFeatures();

                // Resize Lenis scroll container bounds for the new page layout
                if (window.lenis) {
                    window.lenis.resize();
                }

                // Swipe overlay out
                overlay.classList.remove('active');
                overlay.classList.add('transitioning-out');

                // Clean up classes after animations slide up finishes (600ms)
                setTimeout(() => {
                    overlay.classList.remove('transitioning-out');
                }, 600);

            }, remainingTime);
        })
        .catch(err => {
            console.error('Dynamic Routing Error: ', err);
            // Dynamic routing fallback
            window.location.href = url;
        });
}

// ============================================================
// CALCULATIONS INTERACTIVITY & EQUATIONS
// ============================================================

function calcCompound() {
    const principal = parseFloat(document.getElementById('ci-principal').value) || 0;
    const monthly   = parseFloat(document.getElementById('ci-monthly').value) || 0;
    const rate      = parseFloat(document.getElementById('ci-rate').value) / 100 / 12 || 0;
    const months    = (parseFloat(document.getElementById('ci-years').value) || 0) * 12;

    let total = principal;
    let totalContrib = principal + monthly * months;

    if (rate === 0) {
        total = totalContrib;
    } else {
        total = principal * Math.pow(1 + rate, months)
              + monthly * ((Math.pow(1 + rate, months) - 1) / rate);
    }

    const interest = total - totalContrib;

    animateValue('ci-value', total, (v) => '$' + formatNum(v));
    document.getElementById('ci-princ-out').textContent = '$' + formatNum(totalContrib);
    document.getElementById('ci-int-out').textContent   = '$' + formatNum(Math.max(0, interest));
}

function calcGoal() {
    const goal    = parseFloat(document.getElementById('wg-goal').value) || 0;
    const current = parseFloat(document.getElementById('wg-current').value) || 0;
    const monthly = parseFloat(document.getElementById('wg-monthly').value) || 0;
    const rate    = parseFloat(document.getElementById('wg-rate').value) / 100 / 12 || 0;

    if (current >= goal) {
        document.getElementById('wg-value').textContent = 'Goal Reached!';
        document.getElementById('wg-result').querySelector('.result-breakdown span').innerHTML =
            `You'll reach <strong>$${formatNum(goal)}</strong> with consistency.`;
        return;
    }

    let balance = current;
    let months = 0;
    const maxMonths = 600;

    if (rate === 0) {
        if (monthly <= 0) {
            document.getElementById('wg-value').textContent = 'Never (no savings)';
            return;
        }
        months = Math.ceil((goal - current) / monthly);
    } else {
        while (balance < goal && months < maxMonths) {
            balance = balance * (1 + rate) + monthly;
            months++;
        }
        if (months >= maxMonths) {
            document.getElementById('wg-value').textContent = '50+ Years';
            return;
        }
    }

    const years = months / 12;
    const display = years < 1
        ? `~${months} months`
        : `~${years.toFixed(1)} Years`;

    document.getElementById('wg-value').textContent = display;
    document.getElementById('wg-result').querySelector('.result-breakdown span').innerHTML =
        `You'll reach <strong>$${formatNum(goal)}</strong> with consistency.`;
}

function calcBudget() {
    const income = parseFloat(document.getElementById('bp-income').value) || 0;

    const needs = income * 0.50;
    const wants = income * 0.30;
    const savings = income * 0.20;

    animateValue('bp-value', income, (v) => '$' + formatNum(v));
    document.getElementById('bp-needs-out').textContent = '$' + formatNum(needs);
    document.getElementById('bp-wants-out').textContent = '$' + formatNum(wants);
    document.getElementById('bp-savings-out').textContent = '$' + formatNum(savings);
}

function calcHustle() {
    const hours = parseFloat(document.getElementById('sh-hours').value) || 0;
    const type = document.getElementById('sh-type').value;

    let rate = 40; // Default copywriting rate
    if (type === 'freelance-dev') rate = 60;
    else if (type === 'video-editing') rate = 45;
    else if (type === 'ui-ux-design') rate = 50;
    else if (type === 'consulting') rate = 75;

    const monthly = rate * hours * 4.33;
    const yearly = rate * hours * 52;

    animateValue('sh-value', monthly, (v) => '$' + formatNum(v));
    document.getElementById('sh-yearly-out').textContent = '$' + formatNum(yearly);
}

function handleSubscribe(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]');
    const btn = e.target.querySelector('button');
    if (email && email.value) {
        const originalText = btn.innerHTML;
        btn.textContent = '✓ Subscribed!';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            email.value = '';
        }, 3000);
    }
}

// Expose calculation functions globally for inline HTML trigger buttons
window.calcCompound = calcCompound;
window.calcGoal = calcGoal;
window.calcBudget = calcBudget;
window.calcHustle = calcHustle;
window.handleSubscribe = handleSubscribe;

// ---- FORMATTING & TRANSITIONS HELPERS ----
function formatNum(n) {
    return Math.round(n).toLocaleString('en-US');
}

function animateValue(id, target, formatter) {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Parse current value from text to avoid resetting to 0 when sliding
    const currentText = el.textContent.replace(/[^0-9.]/g, '');
    const start = parseFloat(currentText) || 0;
    
    const duration = 400; // Animation timing in milliseconds
    const startTime = performance.now();
    
    const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = formatter(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

// DOM ready entry point
document.addEventListener('DOMContentLoaded', () => {
    initLenisSmoothScroll();
    initDynamicRouter();
    initPageFeatures();
});
