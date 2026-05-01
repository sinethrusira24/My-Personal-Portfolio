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
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Active Navigation Highlighting
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // Adjust the offset value (200) to trigger earlier or later
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });

            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('nav-open');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navbar.classList.contains('nav-open')) {
            navbar.classList.remove('nav-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// --- Scroll Reveal Animation ---
const reveals = document.querySelectorAll('.reveal');
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
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
    var loopTyping = function() {
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
    var loopDeleting = function() {
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

    contactForm.addEventListener('submit', async function(e) {
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

// Start animations when the page loads
document.addEventListener("DOMContentLoaded", () => {
    typingEffect();
    document.getElementById('hero').classList.add('active');
});