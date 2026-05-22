// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initParticles();
    initCursorGlow();
    initNavbar();
    initTypingEffect();
    initCountUp();
    initScrollReveal();
    initExpTabs();
    initCardTilt();
    initMagneticButtons();
    initParallaxOrbs();
    initScrollProgress();
    initBackToTop();
    initButtonRipple();
    initSmoothScroll();
});

// ===== Particle Background (Mouse Reactive) =====
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.baseSpeedX = (Math.random() - 0.5) * 0.4;
            this.baseSpeedY = (Math.random() - 0.5) * 0.4;
            this.speedX = this.baseSpeedX;
            this.speedY = this.baseSpeedY;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 255 : 180;
        }
        update() {
            // Mouse repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.speedX += (dx / dist) * force * 0.8;
                this.speedY += (dy / dist) * force * 0.8;
            }
            // Damping
            this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
            this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.hue}, ${this.hue === 255 ? '155, 254' : '206, 201'}, ${this.opacity})`;
            ctx.fill();
        }
    }
    const count = Math.min(100, Math.floor(window.innerWidth / 12));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${0.1 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== Cursor Glow =====
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth < 768) { if (glow) glow.style.display = 'none'; return; }
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function update() {
        gx += (mx - gx) * 0.06;
        gy += (my - gy) * 0.06;
        glow.style.left = gx + 'px';
        glow.style.top = gy + 'px';
        requestAnimationFrame(update);
    }
    update();
}

// ===== Navbar =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
    });

    navItems.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            links.classList.remove('open');
        });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });
        navItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }
}

// ===== Typing Effect =====
function initTypingEffect() {
    const el = document.getElementById('typedText');
    if (!el) return;
    const phrases = [
        'Agentic AI Platforms',
        'Multi-Agent Orchestration',
        'RAG Pipelines',
        'NLQ-to-SQL Engines',
        'Data Engineering Pipelines',
        'Cloud-Native Solutions',
        'No-Code AI Builders',
        'Oracle Cloud SCP Systems'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
        const current = phrases[phraseIdx];
        el.textContent = current.substring(0, charIdx);

        if (!deleting) {
            charIdx++;
            if (charIdx > current.length) { deleting = true; setTimeout(type, 2000); return; }
            setTimeout(type, 60);
        } else {
            charIdx--;
            if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
            setTimeout(type, 30);
        }
    }
    setTimeout(type, 800);
}

// ===== Count Up Animation =====
function initCountUp() {
    const nums = document.querySelectorAll('.stat-number');
    let triggered = false;
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !triggered) {
            triggered = true;
            nums.forEach(num => {
                const target = parseInt(num.dataset.count);
                let current = 0;
                const step = Math.max(1, Math.floor(target / 40));
                const interval = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(interval); }
                    num.textContent = current;
                }, 40);
            });
        }
    }, { threshold: 0.5 });
    if (nums.length) observer.observe(nums[0].closest('.hero-stats'));
}

// ===== Scroll Reveal =====
function initScrollReveal() {
    const items = document.querySelectorAll(
        '.section-header, .about-grid, .skill-category, .timeline-item, .project-card, .edu-card-premium, .cert-card-premium, .credentials-block, .contact-card'
    );
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    items.forEach((item, i) => {
        item.style.transitionDelay = `${(i % 4) * 0.1}s`;
        observer.observe(item);
    });
}

// ===== Experience Tabs =====
function initExpTabs() {
    const tabs = document.querySelectorAll('.exp-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const parent = tab.closest('.timeline-content');
            parent.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
            parent.querySelectorAll('.exp-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

// ===== Card Tilt Effect =====
function initCardTilt() {
    if (window.innerWidth < 768) return;
    const cards = document.querySelectorAll('.project-card, .highlight-card, .edu-card-premium, .cert-card-premium, .skill-category');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}

// ===== Magnetic Buttons =====
function initMagneticButtons() {
    if (window.innerWidth < 768) return;
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s ease';
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'transform 0.1s ease';
        });
    });
}

// ===== Parallax Floating Orbs =====
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length || window.innerWidth < 768) return;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
            const speed = 0.02 + (i * 0.015);
            orb.style.transform = `translateY(${scrollY * speed * (i % 2 === 0 ? -1 : 1)}px)`;
        });
    });
}

// ===== Preloader =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    });
    // Fallback: hide after 4s even if load event doesn't fire
    setTimeout(() => { preloader.classList.add('hidden'); }, 4000);
}

// ===== Scroll Progress Bar =====
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = progress + '%';
    });
}

// ===== Back to Top =====
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Button Ripple Effect =====
function initButtonRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== Smooth Scroll with Easing =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}
