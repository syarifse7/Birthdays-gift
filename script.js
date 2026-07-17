
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Check if device supports hover (desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Follower has slight delay
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });
    }

    // --- 2. Background Stars Generator ---
    const starsContainer = document.getElementById('stars-container');
    for (let i = 0; i < 50; i++) {
        let star = document.createElement('div');
        star.classList.add('star');
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDuration = (Math.random() * 2 + 1) + 's';
        starsContainer.appendChild(star);
    }

    // --- 3. Screen Navigation & Interactions ---
    const btnOpen = document.getElementById('btn-open');
    const openingScreen = document.getElementById('opening');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');

    btnOpen.addEventListener('click', () => {
        // Optional: Play music
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Audio autoplay blocked by browser"));

        // Throw initial confetti
        fireConfetti();

        // Screen transition
        openingScreen.classList.remove('active');
        openingScreen.classList.add('hidden');
        
        setTimeout(() => {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('active');
            
            // Start typewriter and observer after transition
            typeMessage();
            observeSections();
        }, 1000);
    });

    // --- 4. Typewriter Effect ---
    const message = "Halo! Akhirnya hari yang spesial ini datang juga ya. Selamat bertambah umur! 🎉 Nggak kerasa waktu cepat banget berlalu. Makasih ya udah selalu jadi versi terbaik dari diri kamu. Di umur yang baru ini, aku cuma berharap kamu selalu dikelilingi kebahagiaan, dijauhkan dari hal-hal sedih, dan selalu sehat. Pokoknya enjoy the day, you deserve all the love today! ❤️";
    const typingText = document.getElementById('typing-text');
    let charIndex = 0;

    function typeMessage() {
        if (charIndex < message.length) {
            typingText.innerHTML += message.charAt(charIndex);
            charIndex++;
            setTimeout(typeMessage, 40); // Kecepatan ketik
        }
    }

    // --- 5. Scroll Animation (Intersection Observer) ---
    function observeSections() {
        const sections = document.querySelectorAll('.section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(sec => observer.observe(sec));
    }

    // --- 6. Gallery Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightboxImg.src = item.src;
            lightbox.classList.remove('hidden');
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.classList.add('hidden');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.add('hidden');
    });

    // --- 7. Countdown Timer (Set to Tomorrow/Fake Target) ---
    // For demo purposes, we'll set it to 2 hours from now
    let countdownDate = new Date().getTime() + (2 * 60 * 60 * 1000);

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(timer);
            document.getElementById("countdown").innerHTML = "Waktunya Merayakan! 🎉";
        }
    }, 1000);

    // --- 8. Blow Candle & Final Screen ---
    const btnBlow = document.getElementById('btn-blow');
    const flame = document.getElementById('flame');
    const finalScreen = document.getElementById('final-screen');
    const btnReplay = document.getElementById('btn-replay');

    btnBlow.addEventListener('click', () => {
        // Matikan lilin
        flame.classList.add('out');
        
        // Mulai kembang api terus menerus
        startFireworks();

        setTimeout(() => {
            mainContent.classList.remove('active');
            mainContent.classList.add('hidden');
            
            setTimeout(() => {
                finalScreen.classList.remove('hidden');
                finalScreen.classList.add('active');
            }, 1000);
        }, 1500);
    });

    btnReplay.addEventListener('click', () => {
        location.reload(); // Reset semua ulang
    });

    // --- 9. Particle System (Canvas Confetti / Fireworks) ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    let isFireworks = false;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    class Particle {
        constructor(x, y, color, velocity, size, type) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = velocity;
            this.size = size;
            this.type = type; // 'confetti' or 'firework'
            this.alpha = 1;
            this.friction = 0.98;
            this.gravity = 0.05;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            if (this.type === 'confetti') {
                ctx.rect(this.x, this.y, this.size, this.size * 2);
            } else {
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            }
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.y += this.gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.01;
        }
    }

    const colors = ['#ff6a00', '#ff0055', '#00ffaa', '#0088ff', '#ffd500', '#c56aff'];

    function createParticles(x, y, amount, type) {
        for (let i = 0; i < amount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (type === 'firework' ? 6 : 4) + 1;
            const velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
            const size = Math.random() * 4 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            particlesArray.push(new Particle(x, y, color, velocity, size, type));
        }
    }

    function fireConfetti() {
        createParticles(canvas.width / 2, canvas.height / 2, 100, 'confetti');
    }

    function startFireworks() {
        isFireworks = true;
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Random fireworks generator
        if (isFireworks && Math.random() < 0.05) {
            createParticles(
                Math.random() * canvas.width,
                Math.random() * (canvas.height / 2),
                50, 
                'firework'
            );
        }

        particlesArray.forEach((particle, index) => {
            if (particle.alpha <= 0) {
                particlesArray.splice(index, 1);
            } else {
                particle.update();
                particle.draw();
            }
        });
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
});

