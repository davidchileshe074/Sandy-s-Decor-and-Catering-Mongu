document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Preloader & Typewriter
    const preloader = document.getElementById('preloader');
    const typeTarget = document.querySelector('.typewriter-text');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                if (typeTarget) startTypewriter(typeTarget);
            }, 500);
        }, 1000);
    });

    const startTypewriter = (el) => {
        const words = JSON.parse(el.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                el.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                el.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Wait before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };
        type();
    };

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Outline with a slight delay for smooth effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect for cursor
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .gallery-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });

    // 3. Header Scroll Effect
    const header = document.querySelector('.header');
    const backToTop = document.querySelector('.back-to-top');
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top Button
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }

        // Scroll Progress
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    // 4. Back to Top Click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 5. Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 6. Stats Counter
    const stats = document.querySelectorAll('.stat-number');
    let counted = false;

    const countStats = () => {
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;
        
        const sectionTop = statsSection.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight - 100 && !counted) {
            stats.forEach(stat => {
                const target = +stat.getAttribute('data-target');
                const increment = target / 100;
                let current = 0;
                
                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        stat.innerText = Math.ceil(current);
                        setTimeout(updateCount, 20);
                    } else {
                        stat.innerText = target + (target === 10 ? '+' : '');
                    }
                };
                updateCount();
            });
            counted = true;
        }
    };
    window.addEventListener('scroll', countStats);

    // 7. Testimonials Slider
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    const showSlide = (n) => {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        testimonials[n].classList.add('active');
        dots[n].classList.add('active');
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000);

    // 8. Gold Particles Canvas
    const canvas = document.getElementById('gold-particles');
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = 'rgba(212, 175, 55, ' + (Math.random() * 0.3 + 0.1) + ')';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // 9. Button Ripple Effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // 10. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // 11. Card Parallax Effect
    const cards = document.querySelectorAll('.service-card, .about-image, .gallery-item');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
});
