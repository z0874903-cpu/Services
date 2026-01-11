// Mobile Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Testimonial Slider
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentTestimonial = 0;

if (testimonials.length > 0) {
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
    }

    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.opacity = '0.7';
            
            // Reset form
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                // Show success notification
                alert('Thank you! Your message has been sent. We will get back to you soon.');
            }, 1500);
        }, 1000);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            
            // Scroll to element
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Image lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

// Pricing tabs (if any on service pages)
const pricingTabs = document.querySelectorAll('.pricing-tab');
if (pricingTabs.length > 0) {
    pricingTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            pricingTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // You can add functionality to switch pricing content here
        });
    });
}

// Add CSS for scroll behavior
const style = document.createElement('style');
style.textContent = `
    .navbar.scrolled {
        padding: 15px 0;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Language Switching Functionality
let currentLanguage = 'en';

// Language data object
let languageData = {};

// Initialize language
async function initLanguage() {
    try {
        // Load language files
        const enResponse = await fetch('lang/en.json');
        const arResponse = await fetch('lang/ar.json');
        
        languageData.en = await enResponse.json();
        languageData.ar = await arResponse.json();
        
        // Get saved language preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
            currentLanguage = savedLang;
        }
        
        // Update language switcher UI
        updateLanguageSwitcherUI();
        
        // Apply current language
        applyLanguage();
        
        // Add language switch event listeners
        setupLanguageSwitcher();
    } catch (error) {
        console.error('Error loading language files:', error);
    }
}

function updateLanguageSwitcherUI() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (lang && lang !== currentLanguage) {
                currentLanguage = lang;
                localStorage.setItem('preferredLanguage', lang);
                updateLanguageSwitcherUI();
                applyLanguage();
                
                // Update direction for Arabic
                if (lang === 'ar') {
                    document.documentElement.dir = 'rtl';
                    document.documentElement.lang = 'ar';
                } else {
                    document.documentElement.dir = 'ltr';
                    document.documentElement.lang = 'en';
                }
            }
        });
    });
}

function applyLanguage() {
    if (!languageData[currentLanguage]) return;
    
    const lang = languageData[currentLanguage];
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (lang[key]) {
            element.textContent = lang[key];
        }
    });
    
    // Update all input placeholders with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (lang[key]) {
            element.placeholder = lang[key];
        }
    });
    
    // Update page title if needed
    const pageTitle = document.querySelector('[data-i18n-title]');
    if (pageTitle && lang[pageTitle.getAttribute('data-i18n-title')]) {
        document.title = lang[pageTitle.getAttribute('data-i18n-title')];
    }
}

// Initialize language when DOM is loaded
document.addEventListener('DOMContentLoaded', initLanguage);

// Detect user's preferred language
function detectUserLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith('ar')) {
        return 'ar';
    }
    return 'en';
}

// Set initial language based on user preference if not already set
if (!localStorage.getItem('preferredLanguage')) {
    const detectedLang = detectUserLanguage();
    localStorage.setItem('preferredLanguage', detectedLang);
    currentLanguage = detectedLang;
    
    // Apply RTL for Arabic immediately
    if (detectedLang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    }
}
