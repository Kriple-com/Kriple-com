// ===== Mobile Menu Toggle =====
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== Navbar Shadow on Scroll =====
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// ===== Animate Elements on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Add stagger effect for grid items
            const delay = entry.target.dataset.delay || 0;
            entry.target.style.transitionDelay = `${delay}s`;
        }
    });
}, observerOptions);

// Observe sections and elements with stagger delays
document.querySelectorAll('.section-title, .section-description, .pricing-card, .testimonial-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Feature items with stagger
document.querySelectorAll('.feature-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.dataset.delay = index * 0.1;
    observer.observe(el);
});

// Stat items with stagger
document.querySelectorAll('.stat-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.9)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.dataset.delay = index * 0.15;
    observer.observe(el);
});

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
    }
`;
document.head.appendChild(style);

// ===== Tab Labels Interaction =====
const tabLabels = document.querySelectorAll('.tab-label');

tabLabels.forEach(tab => {
    tab.addEventListener('click', () => {
        tabLabels.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});


// ===== Bypass Button Interaction =====
const bypassBtn = document.querySelector('.bypass-btn');

if (bypassBtn) {
    bypassBtn.addEventListener('click', () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ===== Hero Character Magnetic Proximity Effect =====
document.addEventListener('DOMContentLoaded', () => {
    
    const heroChars = document.querySelectorAll('.hero-char');
    const maxDistance = 150; // RAGGIO D'AZIONE del mouse
    
    //make letter entry in cascade
    heroChars.forEach((char, index) => {
        setTimeout(() => {
            char.classList.add('is-visible');
        }, 300 + index * 80); 
    });

    //zoom effect when mouse cursor passes
    let mouseX = 0;
    let mouseY = 0;
    let isTicking = false;

    document.addEventListener('mousemove', (e) => {
        // Ignoriamo l'effetto su mobile (dove non c'è il mouse)
        if (window.innerWidth <= 768) return; 

        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isTicking) {
            window.requestAnimationFrame(updateCharacters);
            isTicking = true;
        }
    });

    function updateCharacters() {
        heroChars.forEach(char => {
            const rect = char.getBoundingClientRect();
            const charCenterX = rect.left + (rect.width / 2);
            const charCenterY = rect.top + (rect.height / 2);

            const deltaX = mouseX - charCenterX;
            const deltaY = mouseY - charCenterY;
            const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

            let proximity = 1 - (distance / maxDistance);
            if (proximity < 0) proximity = 0;

            char.style.setProperty('--proximity', proximity.toFixed(3));
        });
        
        isTicking = false;
    }
});

// ===== Timeline Scroll Ball Effect =====
const timeline = document.querySelector('.timeline');
const timelineBall = document.getElementById('timelineBall');
const timelineProgressBar = document.querySelector('.timeline-progress-bar');
const timelineItemsAll = document.querySelectorAll('.timeline-item');

let ticking = false;

//la funzione è stata riscritta per muovere l'animazione sulla GPU per renderla più smooth 
//necessaria è stata anche l'aggiunta di un comando in css e la rimozione di alcune righe che parlavano di transizioni
//l'animazione della timeline è quindi ora interamente gestita dalla gpu 
function updateTimelineProgress() {
    if (!timeline || !timelineBall || !timelineProgressBar) {
        ticking = false;
        return;
    }
    
    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top;
    const timelineHeight = timelineRect.height;
    const windowHeight = window.innerHeight;
    
    // Calcola quanto siamo andati avanti
    const scrollStart = windowHeight * 0.6; 
    const scrollProgress = (scrollStart - timelineTop) / timelineHeight;
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    
    //aggiorna la posizione della palla utilizzando il trasform al centro
    const ballPosition = clampedProgress * (timelineHeight - 20);
    timelineBall.style.transform = `translate(-50%, ${ballPosition}px)`;
    
    // aggiorna e scala l'altezza della barra
    timelineProgressBar.style.height = `${clampedProgress * 100}%`;
    
    // UPDATE ITEMS
    timelineItemsAll.forEach((item) => {
        // Nota: questo getBoundingClientRect nel loop è ancora un po' pesante, 
        // ma gestito con requestAnimationFrame andrà già molto meglio.
        const itemRect = item.getBoundingClientRect();
        const itemTop = itemRect.top - timelineRect.top;
        const itemProgress = itemTop / timelineHeight;
        
        if (clampedProgress >= itemProgress - 0.1) {
            // Aggiungiamo la classe solo se non c'è già (evita ricalcoli inutili)
            if (!item.classList.contains('visible')) {
                item.classList.add('visible');
            }
        }
    });

    // Indichiamo che il frame è finito e possiamo calcolarne un altro
    ticking = false;
}

// L'event listener ottimizzato
window.addEventListener('scroll', () => {
    if (!ticking) {
        // Aspetta il momento perfetto per disegnare il frame
        window.requestAnimationFrame(updateTimelineProgress);
        ticking = true;
    }
});

window.addEventListener('scroll', updateTimelineProgress);
window.addEventListener('resize', updateTimelineProgress);
updateTimelineProgress(); // Initial call

// ===== Pricing Card Hover Effect =====
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        pricingCards.forEach(c => {
            if (c !== card && !c.classList.contains('featured')) {
                c.style.opacity = '0.6';
                c.style.transform = 'scale(0.98)';
            }
        });
    });
    
    card.addEventListener('mouseleave', () => {
        pricingCards.forEach(c => {
            c.style.opacity = '1';
            if (!c.classList.contains('featured')) {
                c.style.transform = '';
            }
        });
    });
});

// ===== Magnetic Button Effect =====
document.querySelectorAll('.btn-buy, .btn-buy-large, .pricing-btn, .style-link, .waitlist-submit').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ===== Parallax Effect on Scroll =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Hero parallax
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
    
    // Section titles slight parallax
    document.querySelectorAll('.section-title').forEach(title => {
        const rect = title.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            title.style.transform = `translateY(${(1 - progress) * 20}px)`;
        }
    });
});

// ===== Feature Icon Float Animation =====
document.querySelectorAll('.feature-icon').forEach((icon, index) => {
    icon.style.animation = `float 3s ease-in-out infinite`;
    icon.style.animationDelay = `${index * 0.2}s`;
});

// ===== Intro Text Reveal =====
const introText = document.querySelector('.intro-text');
if (introText) {
    const introObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                introObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    introText.style.opacity = '0';
    introText.style.transform = 'translateY(40px)';
    introText.style.transition = 'opacity 1s ease, transform 1s ease';
    introObserver.observe(introText);
}

// ===== Cookie Consent Banner =====
const cookieBanner = document.getElementById('cookie-banner');

function acceptCookies() {
    localStorage.setItem('kriple_cookie_consent', 'accepted');
    if (cookieBanner) cookieBanner.classList.add('hidden');
}

function declineCookies() {
    localStorage.setItem('kriple_cookie_consent', 'declined');
    if (cookieBanner) cookieBanner.classList.add('hidden');
}

// Auto-hide if already answered
if (cookieBanner) {
    const consent = localStorage.getItem('kriple_cookie_consent');
    if (consent) {
        cookieBanner.classList.add('hidden');
    }
}

// ===== Waitlist Form =====
const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
  waitlistForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = waitlistForm.querySelector('.waitlist-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(waitlistForm.action, {
        method: 'POST',
        body: new FormData(waitlistForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        btn.textContent = "You're on the list! ✓";
        btn.style.background = '#16425b';
        waitlistForm.querySelectorAll('.waitlist-input').forEach(i => i.disabled = true);
      } else {
        btn.textContent = 'Something went wrong. Try again.';
        btn.disabled = false;
      }
    } catch (err) {
      btn.textContent = 'Network error. Try again.';
      btn.disabled = false;
    }
  });
}


// ===== Console Easter Egg =====
console.log(`
%cKriple
%cModern Cryptocurrency Payment API for Merchants

https://kriple.com
`, 
'font-size: 32px; font-weight: 700; color: #16425b;',
'font-size: 14px; color: #7a6f6d;'
);
