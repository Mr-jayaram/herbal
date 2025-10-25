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

 