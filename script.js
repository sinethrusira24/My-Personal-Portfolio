// --- Navbar Scroll Effect & Active Link ---
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-links a');

let isScrolling = false;

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            // Navbar background
            if (window.scrollY > 50) {
                if (!navbar.classList.contains('scrolled')) navbar.classList.add('scrolled');
            } else {
                if (navbar.classList.contains('scrolled')) navbar.classList.remove('scrolled');
            }
            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

// Active Navigation Highlighting with IntersectionObserver for better performance
const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, navObserverOptions);

sections.forEach(section => {
    navObserver.observe(section);
});

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
if (mobileMenuToggle) {
    const toggleIcon = mobileMenuToggle.querySelector('i');

    function closeMobileMenu() {
        navbar.classList.remove('nav-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        if (toggleIcon) {
            toggleIcon.className = 'fas fa-bars';
        }
    }

    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navbar.classList.toggle('nav-open');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
        if (toggleIcon) {
            toggleIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        }
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('nav-open')) {
                closeMobileMenu();
            }
        });
    });

    // Close when clicking outside navbar
    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('nav-open') && !navbar.contains(e.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navbar.classList.contains('nav-open')) {
            closeMobileMenu();
        }
    });
}

// --- Scroll Reveal Animation ---
const reveals = document.querySelectorAll('.reveal');
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, revealOptions);

reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
});

// --- Typewriter Effect ---
const words = ["Software Engineer.", "Full Stack Developer.", "Problem Solver."];
let i = 0;
let timer;
const typingTextElement = document.querySelector('.typing-text');

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function () {
        if (word.length > 0) {
            typingTextElement.innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000);
            return false;
        }
        timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
}

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function () {
        if (word.length > 0) {
            word.pop();
            typingTextElement.innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            }
            setTimeout(typingEffect, 500);
            return false;
        }
        timer = setTimeout(loopDeleting, 50);
    };
    loopDeleting();
}

// --- Contact Form Handler ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const formMessage = document.getElementById('form-message');
    const submitButton = contactForm.querySelector('.submit-btn');

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!formMessage || !submitButton) return;

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const formData = new FormData(contactForm);
        const endpoint = contactForm.action;

        if (endpoint.includes('YOUR_FORM_ID') || endpoint.includes('yourformid')) {
            formMessage.textContent = 'Please replace YOUR_FORM_ID with your Formspree form ID in index.html.';
            formMessage.className = 'form-message error';
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formMessage.textContent = 'Thanks for reaching out! Redirecting to confirmation...';
                formMessage.className = 'form-message success';
                contactForm.reset();
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 1500);
            } else {
                const data = await response.json();
                let message = 'Oops! Something went wrong. Please try again.';
                if (data && data.error) message = data.error;
                formMessage.textContent = message;
                formMessage.className = 'form-message error';
            }
        } catch (error) {
            formMessage.textContent = 'Network error. Please try again later.';
            formMessage.className = 'form-message error';
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        }
    });
}

// --- Quick Stats Counter Animation ---
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.getElementById('stats');
    if (!statsSection || statNumbers.length === 0) return;

    const animateNumber = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        if (el._animId) {
            cancelAnimationFrame(el._animId);
        }

        const duration = 1600;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * target);

            el.textContent = currentVal;

            if (progress < 1) {
                el._animId = requestAnimationFrame(step);
            } else {
                el.textContent = target;
                el._animId = null;
            }
        };

        el._animId = requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger count-up every time the stats section enters the viewport
                statNumbers.forEach(el => animateNumber(el));
            } else {
                // Reset to 0 when scrolled away so it can animate again when scrolled back
                statNumbers.forEach(el => {
                    if (el._animId) {
                        cancelAnimationFrame(el._animId);
                        el._animId = null;
                    }
                    el.textContent = '0';
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px"
    });

    statsObserver.observe(statsSection);
}

// --- Animated ASCII Name Banner ---
function initAsciiName() {
    const canvas = document.getElementById('ascii-name-canvas');
    const container = document.getElementById('ascii-name-section');
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const FONT = {
        S: [' ###### ', '###  ###', '###     ', '###     ', ' ###### ', '  ######', '     ###', '     ###', '###  ###', ' ###### '],
        I: ['#######', '  ###  ', '  ###  ', '  ###  ', '  ###  ', '  ###  ', '  ###  ', '  ###  ', '  ###  ', '#######'],
        N: ['###   ###', '####  ###', '##### ###', '## ######', '## ######', '##  #####', '##   ####', '##    ###', '##     ##', '##     ##'],
        E: ['########', '###     ', '###     ', '###     ', '####### ', '####### ', '###     ', '###     ', '###     ', '########'],
        T: ['#########', '   ###   ', '   ###   ', '   ###   ', '   ###   ', '   ###   ', '   ###   ', '   ###   ', '   ###   ', '   ###   '],
        H: ['###   ###', '###   ###', '###   ###', '###   ###', '#########', '#########', '###   ###', '###   ###', '###   ###', '###   ###'],
        R: ['######## ', '###   ###', '###   ###', '###   ###', '######## ', '#######  ', '###  ### ', '###   ###', '###   ###', '###   ###'],
        U: ['###   ###', '###   ###', '###   ###', '###   ###', '###   ###', '###   ###', '###   ###', '###   ###', ' ####### ', '  #####  '],
        A: ['  #####  ', ' ####### ', ' ### ### ', ' ### ### ', '###   ###', '#########', '#########', '###   ###', '###   ###', '###   ###']
    };

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*+-=<>{}[]/?!~;:|^_';
    const accentColors = ['#f97316', '#ea580c', '#fb923c', '#d97706', '#fdba74'];

    let grid = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let cellW = 7;
    let cellH = 11;
    let isVisible = false;
    let animId = null;
    let mouse = { x: -1000, y: -1000, active: false };

    function buildGrid() {
        const rect = container.getBoundingClientRect();
        width = Math.floor(rect.width) || window.innerWidth;
        const isMobile = width < 720;
        height = canvas.clientHeight || (isMobile ? (width < 420 ? 165 : 180) : 140);
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        const words = [['S', 'I', 'N', 'E', 'T', 'H'], ['R', 'U', 'S', 'I', 'R', 'A']];
        const letterGap = 2;
        const wordGap = 6;
        const lineGap = 3;
        const letterHeight = 10;

        grid = [];

        if (!isMobile) {
            let totalCols = 0;
            words.forEach((w, wIdx) => {
                w.forEach((ch, cIdx) => {
                    totalCols += FONT[ch][0].length;
                    if (cIdx < w.length - 1) totalCols += letterGap;
                });
                if (wIdx < words.length - 1) totalCols += wordGap;
            });

            cellW = Math.min(8.5, Math.max(5, (width - 40) / totalCols));
            cellH = cellW * 1.5;
            const totalW = totalCols * cellW;
            const totalH = letterHeight * cellH;
            const startX = (width - totalW) / 2;
            const startY = (height - totalH) / 2;

            let curCol = 0;
            words.forEach((w) => {
                w.forEach((ch, cIdx) => {
                    const matrix = FONT[ch];
                    const wLen = matrix[0].length;
                    for (let r = 0; r < letterHeight; r++) {
                        for (let c = 0; c < wLen; c++) {
                            if (matrix[r][c] === '#') {
                                const isAccent = Math.random() < 0.022;
                                grid.push({
                                    x: startX + (curCol + c) * cellW + cellW / 2,
                                    y: startY + r * cellH + cellH / 2,
                                    char: chars[Math.floor(Math.random() * chars.length)],
                                    timer: Math.floor(Math.random() * 25),
                                    interval: 16 + Math.floor(Math.random() * 32),
                                    isAccent: isAccent,
                                    accentColor: accentColors[Math.floor(Math.random() * accentColors.length)],
                                    baseAlpha: (curCol + c + r) % 3 === 0 ? 0.22 : 0.28
                                });
                            }
                        }
                    }
                    curCol += wLen + (cIdx < w.length - 1 ? letterGap : 0);
                });
                curCol += wordGap;
            });
        } else {
            // Mobile: 2 lines
            const line0Cols = words[0].reduce((acc, ch, i) => acc + FONT[ch][0].length + (i < words[0].length - 1 ? letterGap : 0), 0);
            const line1Cols = words[1].reduce((acc, ch, i) => acc + FONT[ch][0].length + (i < words[1].length - 1 ? letterGap : 0), 0);
            const maxCols = Math.max(line0Cols, line1Cols);

            cellW = Math.min(7.5, Math.max(4.2, (width - 24) / maxCols));
            cellH = cellW * 1.5;
            const totalH = (letterHeight * 2 + lineGap) * cellH;
            const startY = (height - totalH) / 2;

            [words[0], words[1]].forEach((w, lineIdx) => {
                const lineCols = lineIdx === 0 ? line0Cols : line1Cols;
                const startX = (width - lineCols * cellW) / 2;
                const lineStartY = startY + lineIdx * (letterHeight + lineGap) * cellH;
                let curCol = 0;
                w.forEach((ch, cIdx) => {
                    const matrix = FONT[ch];
                    const wLen = matrix[0].length;
                    for (let r = 0; r < letterHeight; r++) {
                        for (let c = 0; c < wLen; c++) {
                            if (matrix[r][c] === '#') {
                                const isAccent = Math.random() < 0.022;
                                grid.push({
                                    x: startX + (curCol + c) * cellW + cellW / 2,
                                    y: lineStartY + r * cellH + cellH / 2,
                                    char: chars[Math.floor(Math.random() * chars.length)],
                                    timer: Math.floor(Math.random() * 25),
                                    interval: 16 + Math.floor(Math.random() * 32),
                                    isAccent: isAccent,
                                    accentColor: accentColors[Math.floor(Math.random() * accentColors.length)],
                                    baseAlpha: (curCol + c + r) % 3 === 0 ? 0.22 : 0.28
                                });
                            }
                        }
                    }
                    curCol += wLen + (cIdx < w.length - 1 ? letterGap : 0);
                });
            });
        }
    }

    let lastDraw = 0;
    const fpsInterval = 1000 / 22; // Calm 22 FPS matrix cadence

    function render(now) {
        if (!isVisible) return;
        animId = requestAnimationFrame(render);

        const elapsed = now - lastDraw;
        if (elapsed < fpsInterval) return;
        lastDraw = now - (elapsed % fpsInterval);

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const fontSize = Math.max(7.5, Math.floor(cellH * 0.95));
        ctx.font = `700 ${fontSize}px "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < grid.length; i++) {
            const cell = grid[i];

            cell.timer++;
            if (cell.timer >= cell.interval) {
                cell.timer = 0;
                cell.char = chars[Math.floor(Math.random() * chars.length)];
                if (Math.random() < 0.03) {
                    cell.isAccent = !cell.isAccent;
                }
            }

            // Check mouse interaction
            let isHovered = false;
            if (mouse.active) {
                const dx = cell.x - mouse.x;
                const dy = cell.y - mouse.y;
                if (dx * dx + dy * dy < 1800) { // ~42px radius
                    isHovered = true;
                    if (Math.random() < 0.3) {
                        cell.char = chars[Math.floor(Math.random() * chars.length)];
                    }
                }
            }

            if (isHovered) {
                ctx.fillStyle = '#ffedd5';
                ctx.shadowColor = 'rgba(249, 115, 22, 0.7)';
                ctx.shadowBlur = 6;
                ctx.fillText(cell.char, cell.x, cell.y);
                ctx.shadowBlur = 0;
            } else if (cell.isAccent) {
                ctx.fillStyle = cell.accentColor;
                ctx.shadowColor = 'rgba(234, 88, 12, 0.6)';
                ctx.shadowBlur = 4;
                ctx.fillText(cell.char, cell.x, cell.y);
                ctx.shadowBlur = 0;
            } else {
                ctx.fillStyle = `rgba(215, 220, 235, ${cell.baseAlpha})`;
                ctx.fillText(cell.char, cell.x, cell.y);
            }
        }

        ctx.restore();
    }

    // Mouse movement interaction
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Touch interaction for mobile
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
            mouse.active = true;
        }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Resize handling with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (isVisible) {
                buildGrid();
            }
        }, 150);
    });

    // IntersectionObserver to only animate when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isVisible) {
                    isVisible = true;
                    buildGrid();
                    lastDraw = performance.now();
                    animId = requestAnimationFrame(render);
                }
            } else {
                isVisible = false;
                if (animId) {
                    cancelAnimationFrame(animId);
                    animId = null;
                }
            }
        });
    }, {
        threshold: 0.05
    });

    observer.observe(container);
}

// Start animations when the page loads
document.addEventListener("DOMContentLoaded", () => {
    typingEffect();
    initStatsCounter();
    initAsciiName();
    const hero = document.getElementById('hero');
    if (hero) hero.classList.add('active');
});
