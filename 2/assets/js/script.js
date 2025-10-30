document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            try {
                const target = document.querySelector(targetId);
                if (target) {
                    const headerOffset = document.getElementById('navbar').offsetHeight + 20;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                }
            } catch(error) {
                console.warn('Smooth scroll target not found:', targetId);
            }
        });
    });
    
    // --- Mobile Menu Toggle ---
    const navToggleBtn = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-nav-menu');
    const menuOverlayEl = document.getElementById('menu-overlay');
    const navCloseBtn = document.getElementById('nav-close');

    function openMobileMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlayEl) menuOverlayEl.classList.add('active');
        if (navToggleBtn) navToggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlayEl) menuOverlayEl.classList.remove('active');
        if (navToggleBtn) navToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (navToggleBtn && mobileMenu && menuOverlayEl && navCloseBtn) {
        
        // *** THIS IS THE FIX ***
        // Change the hamburger button to be a true toggle
        navToggleBtn.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // These listeners are for closing the menu
        navCloseBtn.addEventListener('click', closeMobileMenu);
        menuOverlayEl.addEventListener('click', closeMobileMenu);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // --- Profile Dropdown Toggle ---
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileIcon && profileDropdown) {
        
        const toggleDropdown = (e) => {
            e.stopPropagation(); // Prevent window click listener from firing immediately
            const isActive = profileDropdown.classList.toggle('active');
            profileIcon.setAttribute('aria-expanded', isActive);
        };

        profileIcon.addEventListener('click', toggleDropdown);
        
        // Accessibility: Toggle with Enter/Space key
        profileIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown(e);
            }
        });

        // Close dropdown if clicking outside
        window.addEventListener('click', (e) => {
            if (profileDropdown.classList.contains('active') && 
                !profileIcon.contains(e.target) && 
                !profileDropdown.contains(e.target)) 
            {
                profileDropdown.classList.remove('active');
                profileIcon.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Accessibility: Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && profileDropdown.classList.contains('active')) {
                profileDropdown.classList.remove('active');
                profileIcon.setAttribute('aria-expanded', 'false');
                profileIcon.focus(); // Return focus to the icon
            }
        });
    }

    // --- Scroll to Top Button ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- On-Scroll Reveal Animation Logic ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- Testimonial Slider Logic ---
    const slider = document.getElementById('testimonial-slider');
    if (slider) {
        const slides = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const dotsContainer = document.getElementById('slider-dots');
        const sliderWrapper = document.querySelector('.testimonial-slider-wrapper'); 

        if (slides.length > 0 && prevBtn && nextBtn && dotsContainer && sliderWrapper) {
            let currentIndex = 0;
            let slideInterval;
            const slideDuration = 7000; // 7 seconds

            // Create dots
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });

            const dots = document.querySelectorAll('.slider-dots .dot');

            function updateDots() {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            }

            function goToSlide(index) {
                if (index < 0) {
                    index = slides.length - 1;
                } else if (index >= slides.length) {
                    index = 0;
                }
                
                slider.style.transform = `translateX(-${index * 100}%)`;
                currentIndex = index;
                updateDots();
            }

            function nextSlide() {
                goToSlide(currentIndex + 1);
            }

            function prevSlide() {
                goToSlide(currentIndex - 1);
            }

            function startInterval() {
                const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
                if (!mediaQuery || !mediaQuery.matches) {
                    slideInterval = setInterval(nextSlide, slideDuration);
                }
            }

            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }
            
            // Event Listeners
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });

            sliderWrapper.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            sliderWrapper.addEventListener('mouseleave', () => {
                resetInterval();
            });

            // Initialize
            startInterval();
        }
    }
});


        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerOffset = document.getElementById('navbar').offsetHeight + 20;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                }
            });
        });
        
        // --- Mobile Navigation Toggle ---
        const navToggle = document.getElementById('nav-toggle');
        // *** BUG FIX: The ID in your HTML is 'mobile-nav-menu', not 'nav-menu' ***
        const navMenu = document.getElementById('mobile-nav-menu'); 
        const navClose = document.getElementById('nav-close'); // Get close button
        const menuOverlay = document.getElementById('menu-overlay');

        // Get search popup elements for interaction
        const searchPopup = document.getElementById('search-popup');

        function openMobileMenu() {
            // Close search popup if it's open
            if (searchPopup.classList.contains('active')) {
                closeSearchPopup();
            }
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (navToggle && navMenu && menuOverlay && navClose) {
            navToggle.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });
            
            navClose.addEventListener('click', closeMobileMenu); // Add click to close button
            menuOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // --- START: New Search Popup Logic ---
        const searchOpenBtn = document.querySelector('.nav-search');
        const searchCloseBtn = document.getElementById('search-close');
        const searchInput = document.getElementById('search-input');
        const allProducts = document.querySelectorAll('.product-card'); // Get all product cards

        function openSearchPopup() {
            // Close mobile menu if it's open
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            searchPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
            searchInput.focus(); // Auto-focus the input field
        }

        function closeSearchPopup() {
            searchPopup.classList.remove('active');
            document.body.style.overflow = '';
            
            // Clear input and show all products when closing
            searchInput.value = '';
            allProducts.forEach(product => {
                product.style.display = 'block';
            });
        }

        // Filter products on keyup
        function filterProducts() {
            const searchTerm = searchInput.value.toLowerCase().trim();

            allProducts.forEach(product => {
                const productNameElement = product.querySelector('h3');
                if (productNameElement) {
                    const productName = productNameElement.textContent.toLowerCase();
                    if (productName.includes(searchTerm)) {
                        product.style.display = 'block'; // Show product
                    } else {
                        product.style.display = 'none'; // Hide product
                    }
                }
            });
        }

        if (searchOpenBtn && searchPopup && searchCloseBtn && searchInput) {
            searchOpenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openSearchPopup();
            });
            
            searchCloseBtn.addEventListener('click', closeSearchPopup);
            
            // Add keyup listener to the input field
            searchInput.addEventListener('keyup', filterProducts);
            
            // Optional: Close popup with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchPopup.classList.contains('active')) {
                    closeSearchPopup();
                }
            });
        }
        // --- END: New Search Popup Logic ---
        
        // --- Scroll to Top Button ---
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // --- On-Scroll Reveal Animation Logic ---
        const revealElements = document.querySelectorAll('.reveal');

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });

        // --- Testimonial Slider Logic ---
        document.addEventListener('DOMContentLoaded', () => {
            const slider = document.getElementById('testimonial-slider');
            if (!slider) return;

            const slides = document.querySelectorAll('.testimonial-card');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const dotsContainer = document.getElementById('slider-dots');
            
            const sliderWrapper = document.querySelector('.testimonial-slider-wrapper'); 

            let currentIndex = 0;
            let slideInterval;
            const slideDuration = 7000; // 7 seconds

            // Create dots
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });

            const dots = document.querySelectorAll('.slider-dots .dot');

            function updateDots() {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            }

            function goToSlide(index) {
                if (index < 0) {
                    index = slides.length - 1;
                } else if (index >= slides.length) {
                    index = 0;
                }
                
                slider.style.transform = `translateX(-${index * 100}%)`;
                currentIndex = index;
                updateDots();
            }

            function nextSlide() {
                goToSlide(currentIndex + 1);
            }

            function prevSlide() {
                goToSlide(currentIndex - 1);
            }

            function startInterval() {
                const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
                if (!mediaQuery || !mediaQuery.matches) {
                    slideInterval = setInterval(nextSlide, slideDuration);
                }
            }

            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }
            
            // Event Listeners
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    resetInterval();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    resetInterval();
                });
            }

            if (sliderWrapper) {
                sliderWrapper.addEventListener('mouseenter', () => {
                    clearInterval(slideInterval);
                });

                sliderWrapper.addEventListener('mouseleave', () => {
                    resetInterval();
                });
            }

            // Initialize
            startInterval();
        });