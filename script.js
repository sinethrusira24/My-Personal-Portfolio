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

// Start animations when the page loads
document.addEventListener("DOMContentLoaded", () => {
    typingEffect();
    initStatsCounter();
    initASCII();
    const hero = document.getElementById('hero');
    if (hero) hero.classList.add('active');
});
