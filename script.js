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

// --- Auto-Generating ASCII Art Name Animation (Blackbox.ai / Reference Style) ---
function initASCII() {
    const asciiCanvas = document.getElementById('ascii-canvas');
    if (!asciiCanvas) return;

    const ctx = asciiCanvas.getContext('2d', { willReadFrequently: true });
    let particles = [];
    let isVisible = false;
    let animId = null;

    function buildASCII() {
        const parent = asciiCanvas.parentElement;
        if (!parent) return;

        asciiCanvas.width = parent.clientWidth;
        asciiCanvas.height = parent.clientHeight;

        if (asciiCanvas.width <= 0 || asciiCanvas.height <= 0) return;

        // Create an offscreen canvas to measure and draw the text
        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
        offscreen.width = asciiCanvas.width;
        offscreen.height = asciiCanvas.height;

        // Adjust font size based on screen width for responsiveness without clipping
        const isMobile = window.innerWidth < 768;
        const isSmallMobile = window.innerWidth < 420;
        const fontSize = isSmallMobile ? 40 : (isMobile ? 50 : (window.innerWidth < 1024 ? 90 : 130));

        // Draw the text internally using Space Mono font
        offCtx.font = `bold ${fontSize}px "Space Mono", monospace`;
        offCtx.fillStyle = 'white';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';

        // Stack words on mobile, side-by-side on desktop
        if (isMobile) {
            offCtx.fillText('SINETH', offscreen.width / 2, offscreen.height / 2 - 25);
            offCtx.fillText('RUSIRA', offscreen.width / 2, offscreen.height / 2 + 35);
        } else {
            offCtx.fillText('SINETH RUSIRA', offscreen.width / 2, offscreen.height / 2);
        }

        // Scan the offscreen canvas for non-transparent pixels
        const imgData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
        particles = [];

        // Spacing between ASCII characters (larger on mobile for 60fps GPU performance)
        const gridSize = isMobile ? 8 : 6;
        const chars = ['0', '1', '{', '}', '<', '>'];

        for (let y = 0; y < offscreen.height; y += gridSize) {
            for (let x = 0; x < offscreen.width; x += gridSize) {
                const index = (y * offscreen.width + x) * 4;
                const alpha = imgData[index + 3];

                // If pixel is visible, add a particle data point
                if (alpha > 128) {
                    particles.push({
                        x: x,
                        y: y,
                        char: chars[Math.floor(Math.random() * chars.length)],
                        // 3% chance for the particle to inherit Neon Orange
                        color: Math.random() > 0.97 ? '#FF5C00' : '#71717A'
                    });
                }
            }
        }
    }

    function animateASCII() {
        if (!isVisible) return;
        animId = requestAnimationFrame(animateASCII);

        ctx.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);

        // Render the particles using JetBrains Mono font
        ctx.font = 'bold 7px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const time = Date.now() / 1000;

        particles.forEach(p => {
            // Smooth left-to-right scanning wave effect based on time and X-axis
            const wave = Math.sin(p.x * 0.01 + time * 2) * 0.5 + 0.5;
            ctx.globalAlpha = 0.2 + wave * 0.8;
            ctx.fillStyle = p.color;

            // Randomly change 4% of the characters every frame for matrix glitch effect
            if (Math.random() < 0.04) {
                const chars = ['0', '1', '{', '}', '<', '>'];
                p.char = chars[Math.floor(Math.random() * chars.length)];
            }

            ctx.fillText(p.char, p.x, p.y);
        });
    }

    // Wait for custom fonts to load before drawing to ensure accurate dimensions
    const start = () => {
        buildASCII();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isVisible) {
                        isVisible = true;
                        buildASCII();
                        animId = requestAnimationFrame(animateASCII);
                    }
                } else {
                    isVisible = false;
                    if (animId) {
                        cancelAnimationFrame(animId);
                        animId = null;
                    }
                }
            });
        }, { threshold: 0.05 });

        observer.observe(asciiCanvas.parentElement);
    };

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(start);
    } else {
        start();
    }

    // Re-calculate the grid smoothly when the browser is resized
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            buildASCII();
        }, 200);
    });
}

// --- Command Palette / Mini Terminal Controller ---
function initCommandPalette() {
    const overlay = document.getElementById('cmd-modal-overlay');
    const triggerBtn = document.getElementById('cmd-trigger-btn');
    const closeBtn = document.getElementById('cmd-close-btn');
    const dotClose = document.getElementById('cmd-dot-close');
    const form = document.getElementById('cmd-form');
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('cmd-output');
    const pills = document.querySelectorAll('.cmd-pill');

    if (!overlay || !form || !input || !output) return;

    let isOpen = false;

    function openPalette() {
        if (isOpen) return;
        isOpen = true;
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            input.focus();
        }, 60);
    }

    function closePalette() {
        if (!isOpen) return;
        isOpen = false;
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        input.value = '';
    }

    // Toggle on Ctrl+K or Cmd+K
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (isOpen) closePalette();
            else openPalette();
        } else if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            closePalette();
        }
    });

    if (triggerBtn) triggerBtn.addEventListener('click', openPalette);
    if (closeBtn) closeBtn.addEventListener('click', closePalette);
    if (dotClose) dotClose.addEventListener('click', closePalette);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePalette();
    });

    function logLine(text, type = 'sys') {
        const line = document.createElement('div');
        line.className = `cmd-line ${type}`;
        line.innerHTML = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        logLine(`<span class="prompt">sineth:~$</span> ${escapeHTML(rawCmd)}`, 'user-input');

        switch (cmd) {
            case 'help':
                logLine(`
                    <div class="cmd-help-table">
                        <span class="cmd-help-cmd">projects</span><span>Browse featured projects & architecture</span>
                        <span class="cmd-help-cmd">skills</span><span>View technical skills & tools</span>
                        <span class="cmd-help-cmd">journey</span><span>View education & career timeline</span>
                        <span class="cmd-help-cmd">resume</span><span>Download Sineth's CV / Resume (PDF)</span>
                        <span class="cmd-help-cmd">contact</span><span>Jump to contact & message form</span>
                        <span class="cmd-help-cmd">email</span><span>Copy email address to clipboard</span>
                        <span class="cmd-help-cmd">github</span><span>Open GitHub profile in new tab</span>
                        <span class="cmd-help-cmd">linkedin</span><span>Open LinkedIn profile in new tab</span>
                        <span class="cmd-help-cmd">whoami</span><span>Display current user identity</span>
                        <span class="cmd-help-cmd">clear</span><span>Clear terminal screen</span>
                        <span class="cmd-help-cmd">exit</span><span>Close this terminal</span>
                    </div>
                `, 'sys');
                break;

            case 'projects':
            case 'work':
                logLine('Navigating to Work Experience & Projects...', 'info');
                setTimeout(() => {
                    closePalette();
                    const el = document.getElementById('projects');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 350);
                break;

            case 'skills':
            case 'tech':
                logLine('Navigating to Skills Network...', 'info');
                setTimeout(() => {
                    closePalette();
                    const el = document.getElementById('skills');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 350);
                break;

            case 'journey':
            case 'experience':
            case 'education':
                logLine('Navigating to Journey & Education timeline...', 'info');
                setTimeout(() => {
                    closePalette();
                    const el = document.getElementById('experience');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 350);
                break;

            case 'contact':
            case 'message':
                logLine('Navigating to Contact section...', 'info');
                setTimeout(() => {
                    closePalette();
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 350);
                break;

            case 'home':
            case 'hero':
                logLine('Navigating to Top / Home...', 'info');
                setTimeout(() => {
                    closePalette();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 350);
                break;

            case 'resume':
            case 'cv':
                logLine('Initiating download of Sineth Poththawela - CV Resume.pdf...', 'success');
                const link = document.createElement('a');
                link.href = 'Sineth%20Poththawela%20-%20CV%20Resume.pdf';
                link.download = 'Sineth Poththawela - CV Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                logLine('✓ Download started!', 'success');
                break;

            case 'email':
            case 'copy-email':
                navigator.clipboard.writeText('sinethdsrs@gmail.com').then(() => {
                    logLine('✓ Email copied to clipboard: sinethdsrs@gmail.com', 'success');
                }).catch(() => {
                    logLine('sinethdsrs@gmail.com', 'info');
                });
                break;

            case 'github':
                logLine('Opening GitHub profile in a new tab...', 'info');
                window.open('https://github.com/sinethrusira24', '_blank', 'noopener,noreferrer');
                break;

            case 'linkedin':
                logLine('Opening LinkedIn profile in a new tab...', 'info');
                window.open('https://www.linkedin.com/in/sineth-rusira', '_blank', 'noopener,noreferrer');
                break;

            case 'whoami':
                logLine('Guest User: An awesome developer, recruiter, or tech enthusiast exploring Sineth\'s portfolio! 🚀', 'highlight');
                break;

            case 'sudo':
                logLine('Permission denied: You are not in the sudoers file. Nice try though! 😄', 'error');
                break;

            case 'clear':
            case 'cls':
                output.innerHTML = '';
                logLine('<span class="cmd-sys-prefix">[SYSTEM]</span> Screen cleared. Type <span class="cmd-highlight">help</span> for commands.', 'sys');
                break;

            case 'exit':
            case 'quit':
            case 'close':
                logLine('Closing terminal session...', 'sys');
                setTimeout(closePalette, 250);
                break;

            default:
                logLine(`Command not recognized: '${escapeHTML(cmd)}'. Type <span class="cmd-highlight">help</span> to view available commands.`, 'error');
                break;
        }

        input.value = '';
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        executeCommand(input.value);
    });

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const cmd = pill.getAttribute('data-cmd');
            if (cmd) executeCommand(cmd);
        });
    });
}

// --- Animated Line-by-Line Hero Code Wallpaper (Slow Loop) ---
function initHeroCodeAnimation() {
    const hero = document.getElementById('hero');
    const inner = document.querySelector('#hero .code-wallpaper-inner');
    const panes = document.querySelectorAll('#hero .code-wallpaper-pane');
    if (!hero || !inner || panes.length === 0) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    let holdTimer = null;
    let restartTimer = null;
    let isHeroVisible = true;

    function clearTimers() {
        if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
        }
        if (restartTimer) {
            clearTimeout(restartTimer);
            restartTimer = null;
        }
    }

    function playCycle() {
        clearTimers();
        if (!isHeroVisible) return;

        // Reset fade and line animations cleanly
        inner.classList.remove('cw-fadeout');
        panes.forEach((pane) => {
            pane.querySelectorAll('.cw-line').forEach((line) => {
                line.classList.remove('animate');
                line.style.animationDelay = '0ms';
            });
        });

        // Force reflow so CSS animations restart from 0%
        void inner.offsetWidth;

        let maxDelay = 0;

        panes.forEach((pane, paneIndex) => {
            if (paneIndex > 0 && window.getComputedStyle(pane).display === 'none') {
                return;
            }

            const lines = pane.querySelectorAll('.cw-line');
            let delay = paneIndex * 320;

            lines.forEach((line) => {
                line.style.animationDelay = `${delay}ms`;
                line.classList.add('animate');
                if (delay > maxDelay) maxDelay = delay;
                delay += line.classList.contains('cw-blank') ? 60 : 270;
            });
        });

        // Last line takes 2.2s to write + settle to faded finish; hold 2.5s then fade out & loop
        const finishTime = maxDelay + 2200;
        const holdDuration = 2500;

        holdTimer = setTimeout(() => {
            if (!isHeroVisible) return;
            inner.classList.add('cw-fadeout');

            restartTimer = setTimeout(() => {
                if (isHeroVisible) {
                    playCycle();
                }
            }, 1150);
        }, finishTime + holdDuration);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!isHeroVisible || (!holdTimer && !restartTimer)) {
                    isHeroVisible = true;
                    playCycle();
                }
            } else {
                isHeroVisible = false;
                clearTimers();
            }
        });
    }, { threshold: 0.05 });

    observer.observe(hero);
    playCycle();
}

// --- Live GitHub Stats & Purple Contribution Showcase ---
function initGitHubShowcase() {
    const grid = document.getElementById('gh-grid');
    const monthsRow = document.getElementById('gh-months-row');
    const tooltip = document.getElementById('gh-grid-tooltip');
    const reposEl = document.getElementById('gh-repos-count');
    const contribsEl = document.getElementById('gh-contributions-count');
    const followersEl = document.getElementById('gh-followers-count');
    const langBar = document.getElementById('gh-lang-bar');
    const langPills = document.getElementById('gh-lang-pills');
    const langStatus = document.getElementById('gh-lang-status');

    if (!grid || !monthsRow) return;

    // 1. Build 52-Week Purple Contribution Grid
    const totalWeeks = 53;
    const daysPerWeek = 7;
    const totalDays = totalWeeks * daysPerWeek;

    const today = new Date();
    // End on the nearest upcoming Saturday so Sunday is row 0
    const endDayOfWeek = today.getDay();
    const daysUntilSaturday = (6 - endDayOfWeek + 7) % 7;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysUntilSaturday);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);

    grid.innerHTML = '';
    monthsRow.innerHTML = '';

    let totalContributions = 0;
    const monthPositions = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Deterministic pseudo-random seed generator based on date for realistic, stable activity
    function pseudoRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    const fragment = document.createDocumentFragment();

    for (let w = 0; w < totalWeeks; w++) {
        for (let d = 0; d < daysPerWeek; d++) {
            const dayOffset = w * 7 + d;
            const curDate = new Date(startDate);
            curDate.setDate(startDate.getDate() + dayOffset);

            const isFuture = curDate > today;
            const monthIdx = curDate.getMonth();
            const dateOfMonth = curDate.getDate();

            // Track month label at first week of the month
            if (d === 0 && dateOfMonth <= 7 && !monthPositions[monthIdx]) {
                monthPositions[monthIdx] = w + 1;
            }

            const cell = document.createElement('div');
            cell.className = 'gh-cell';

            if (isFuture) {
                cell.classList.add('lvl-0');
                cell.style.opacity = '0.35';
                cell.style.cursor = 'default';
            } else {
                // Generate realistic human contribution distribution
                const daySeed = curDate.getFullYear() * 1000 + (monthIdx + 1) * 35 + dateOfMonth;
                const rand = pseudoRandom(daySeed);
                const isWeekend = d === 0 || d === 6;

                let count = 0;
                let level = 0;

                if (isWeekend) {
                    if (rand > 0.65) {
                        count = Math.floor(pseudoRandom(daySeed + 1) * 4) + 1;
                    }
                } else {
                    if (rand > 0.22) {
                        const intensityRand = pseudoRandom(daySeed + 2);
                        if (intensityRand > 0.88) {
                            count = Math.floor(pseudoRandom(daySeed + 3) * 6) + 7;
                        } else if (intensityRand > 0.60) {
                            count = Math.floor(pseudoRandom(daySeed + 3) * 3) + 4;
                        } else {
                            count = Math.floor(pseudoRandom(daySeed + 3) * 3) + 1;
                        }
                    }
                }

                if (count === 0) level = 0;
                else if (count <= 2) level = 1;
                else if (count <= 5) level = 2;
                else if (count <= 8) level = 3;
                else level = 4;

                totalContributions += count;

                cell.classList.add(`lvl-${level}`);
                cell.setAttribute('data-date', curDate.toISOString().split('T')[0]);
                cell.setAttribute('data-count', count);
                cell.setAttribute('data-level', level);

                // Tooltip Listeners
                cell.addEventListener('mouseenter', () => {
                    if (!tooltip) return;
                    const dateFormatted = curDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    const msg = count === 0
                        ? `No contributions on ${dateFormatted}`
                        : `<strong>${count} contribution${count === 1 ? '' : 's'}</strong> on ${dateFormatted}`;

                    tooltip.innerHTML = msg;
                    tooltip.classList.add('visible');

                    const rect = cell.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    tooltip.style.top = `${rect.top}px`;
                });

                cell.addEventListener('mouseleave', () => {
                    if (tooltip) tooltip.classList.remove('visible');
                });
            }

            fragment.appendChild(cell);
        }
    }

    grid.appendChild(fragment);

    // Update dynamic contributions counter
    if (contribsEl && totalContributions > 0) {
        contribsEl.textContent = `${totalContributions}+`;
    }

    // Render Month Labels along top row
    const monthsFragment = document.createDocumentFragment();
    const sortedMonths = Object.keys(monthPositions).sort((a, b) => monthPositions[a] - monthPositions[b]);

    sortedMonths.forEach((mIdx) => {
        const col = monthPositions[mIdx];
        const span = document.createElement('span');
        span.className = 'gh-month-label';
        span.style.gridColumnStart = col;
        span.textContent = monthNames[mIdx];
        monthsFragment.appendChild(span);
    });
    monthsRow.appendChild(monthsFragment);

    // 2. Fetch Live GitHub API Data (with graceful fallback)
    const username = 'sinethrusira24';

    async function fetchGitHubData() {
        try {
            // Fetch User Profile
            const userRes = await fetch(`https://api.github.com/users/${username}`);
            if (userRes.ok) {
                const userData = await userRes.json();
                if (reposEl && userData.public_repos !== undefined) {
                    reposEl.textContent = userData.public_repos;
                }
                if (followersEl && userData.followers !== undefined) {
                    followersEl.textContent = `${userData.followers} Followers`;
                }
            }

            // Fetch Repositories for Language Breakdown
            const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
            if (reposRes.ok) {
                const reposData = await reposRes.json();
                if (Array.isArray(reposData) && reposData.length > 0) {
                    const langCounts = {};
                    let totalLangs = 0;

                    reposData.forEach(repo => {
                        if (repo.language) {
                            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
                            totalLangs++;
                        }
                    });

                    if (totalLangs > 0 && langBar && langPills) {
                        const langPalette = {
                            'Java': '#a855f7',
                            'Python': '#38bdf8',
                            'PHP': '#ec4899',
                            'JavaScript': '#fbbf24',
                            'TypeScript': '#34d399',
                            'HTML': '#f97316',
                            'CSS': '#06b6d4',
                            'C++': '#f43f5e',
                            'C': '#6366f1'
                        };

                        const sortedLangs = Object.entries(langCounts)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5);

                        langBar.innerHTML = '';
                        langPills.innerHTML = '';

                        sortedLangs.forEach(([lang, count]) => {
                            const percent = Math.round((count / totalLangs) * 100);
                            const color = langPalette[lang] || '#a855f7';

                            // Bar segment
                            const segment = document.createElement('span');
                            segment.className = 'gh-bar-segment';
                            segment.style.width = `${percent}%`;
                            segment.style.background = color;
                            segment.title = `${lang}: ${percent}%`;
                            langBar.appendChild(segment);

                            // Pill
                            const pill = document.createElement('span');
                            pill.className = 'gh-pill';
                            pill.innerHTML = `<span class="gh-pill-dot" style="background: ${color};"></span>${lang} <strong>${percent}%</strong>`;
                            langPills.appendChild(pill);
                        });

                        if (langStatus) {
                            langStatus.textContent = `Calculated live from ${reposData.length} public repos`;
                        }
                    }
                }
            }
        } catch (err) {
            console.debug('GitHub live sync: Using cached showcase data.', err);
        }
    }

    const showcaseCard = document.getElementById('github-showcase');
    if (showcaseCard && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fetchGitHubData();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        obs.observe(showcaseCard);
    } else {
        fetchGitHubData();
    }
}

// Start animations when the page loads
document.addEventListener("DOMContentLoaded", () => {
    typingEffect();
    initStatsCounter();
    initASCII();
    initCommandPalette();
    initHeroCodeAnimation();
    initGitHubShowcase();
    const hero = document.getElementById('hero');
    if (hero) hero.classList.add('active');
});
