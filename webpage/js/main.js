document.addEventListener("DOMContentLoaded", () => {
    // ---- Navbar Scroll Effect ----
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // Force glass effect to stay for very clean transition, or remove it for diff styling
            if(window.scrollY === 0) {
                 navbar.classList.remove('scrolled');
            }
        }
    });

    // ---- Smooth Scrolling for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // ---- Intersection Observer for fade-in animations ----
    const faders = document.querySelectorAll('.fade-in-up');
    
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // ---- Video Modal Logic ----
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    const closeBtn = document.getElementById('closeModalBtn');
    const openBtns = document.querySelectorAll('.btn-watch-video');
    
    // Link de Vimeo proporcionado
    const videoUrl = "https://player.vimeo.com/video/1184673576?autoplay=1";
    
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            iframe.src = videoUrl;
            modal.classList.add('open');
        });
    });

    const closeModal = () => {
        modal.classList.remove('open');
        iframe.src = ""; // Stop video playback
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            closeModal();
        }
    });

    // ---- WhatsApp Chat Widget ----
    const waFloatBtn = document.getElementById('wa-float-btn');
    const waChatWindow = document.getElementById('wa-chat-window');
    const waCloseBtn = document.getElementById('wa-close-btn');

    if (waFloatBtn && waChatWindow) {
        waFloatBtn.addEventListener('click', () => {
            waChatWindow.classList.toggle('open');
        });

        waCloseBtn.addEventListener('click', () => {
            waChatWindow.classList.remove('open');
        });
    }

    // ---- Promo Bar Logic ----
    const promoBar = document.getElementById('promoBar');
    const promoClose = document.getElementById('promoClose');

    if (promoBar && promoClose) {
        promoClose.addEventListener('click', () => {
            promoBar.classList.add('hidden');
        });
    }

    // ---- Showcase Gallery Logic ----
    const mainShowcaseImg = document.getElementById('mainShowcaseImg');
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    
    if(mainShowcaseImg && galleryThumbs.length > 0) {
        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update active classes
                galleryThumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update main image
                mainShowcaseImg.src = this.src;
            });
        });
    }

    // ---- Demo Form Captcha & Submit Handling ----
    const demoForm = document.getElementById('demoForm');
    const captchaQuestion = document.getElementById('captchaQuestion');
    const captchaInput = document.getElementById('captchaInput');
    let currentCaptchaAnswer = 0;

    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        currentCaptchaAnswer = num1 + num2;
        if(captchaQuestion) {
            captchaQuestion.innerText = `¿Cuánto es ${num1} + ${num2}? (Por seguridad) *`;
        }
    }

    if(demoForm) {
        generateCaptcha(); // Initialize

        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate Captcha
            if (parseInt(captchaInput.value) !== currentCaptchaAnswer) {
                alert("La respuesta de seguridad (suma) es incorrecta. Inténtalo de nuevo.");
                captchaInput.style.borderColor = "red";
                generateCaptcha(); // Generate new one
                captchaInput.value = '';
                return;
            }
            captchaInput.style.borderColor = "";

            // Basic UI feedback for submission (no backend connected)
            const btn = demoForm.querySelector('.submit-btn');
            const originalText = btn.innerText;
            btn.innerHTML = "<i class='bx bx-check'></i> ¡Datos recibidos exitosamente!";
            btn.style.backgroundColor = "#10b981"; // Success green

            setTimeout(() => {
                demoForm.reset();
                generateCaptcha(); // Reset captcha for future
                btn.innerText = originalText;
                btn.style.backgroundColor = ""; // Reset inline
            }, 3000);
        });
    }

});
