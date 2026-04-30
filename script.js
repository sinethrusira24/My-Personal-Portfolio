// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

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
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevents the page from refreshing
        
        // Show a success message (you can style this better later if you want)
        alert("Thanks for reaching out! Your message has been sent.");
        
        // Clear the form inputs
        contactForm.reset();
    });
}

// Start animations when the page loads
document.addEventListener("DOMContentLoaded", () => {
    typingEffect();
    document.getElementById('hero').classList.add('active');
});