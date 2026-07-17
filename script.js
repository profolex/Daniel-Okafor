/* ==========================================================================
   DANIEL OKAFOR - PORTFOLIO INTERACTIVITY & SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* --------------------------------------------------------------------------
     1. Sticky Navigation & Scroll States
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 50;

  const checkScroll = () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once on startup in case page loaded scrolled down

  /* --------------------------------------------------------------------------
     2. Mobile Toggle Menu Navigation
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinksList = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isOpen);
    mobileToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open'); // Prevent scrolling behind overlay
  };

  const closeMenu = () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  mobileToggle.addEventListener('click', toggleMenu);

  // Close menu when navigation links are clicked
  navLinksList.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* --------------------------------------------------------------------------
     3. Active Nav Link Tracking on Scroll
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200; // Offset for headers

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightNav);
  highlightNav(); // Run on startup

  /* --------------------------------------------------------------------------
     4. Intersection Observer for Scroll Reveals
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep layout performant
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Slight delay on trigger
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* --------------------------------------------------------------------------
     5. Intersection Observer for Skills Progress Animation
     -------------------------------------------------------------------------- */
  const skillsSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.skill-progress-item');

  const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressBars.forEach(item => {
          const bar = item.querySelector('.progress-bar');
          const targetLevel = item.getAttribute('data-level');
          if (bar) {
            bar.style.width = `${targetLevel}%`;
          }
        });
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  };

  const skillsObserver = new IntersectionObserver(animateSkills, {
    threshold: 0.2
  });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  /* --------------------------------------------------------------------------
     6. Contact Form Validation & Mock Submission
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitButton = contactForm.querySelector('.btn-submit');
  const submitButtonText = submitButton.querySelector('span');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showError = (inputElement, errorElement) => {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.add('invalid');
  };

  const removeError = (inputElement) => {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.remove('invalid');
  };

  // Real-time input validation cleanup
  const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        if (input.type === 'email') {
          if (validateEmail(input.value.trim())) {
            removeError(input);
          }
        } else {
          removeError(input);
        }
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validate Name
    const nameInput = document.getElementById('name');
    if (nameInput.value.trim() === '') {
      showError(nameInput);
      isValid = false;
    } else {
      removeError(nameInput);
    }
    
    // Validate Email
    const emailInput = document.getElementById('email');
    if (emailInput.value.trim() === '' || !validateEmail(emailInput.value.trim())) {
      showError(emailInput);
      isValid = false;
    } else {
      removeError(emailInput);
    }
    
    // Validate Message
    const messageInput = document.getElementById('message');
    if (messageInput.value.trim() === '') {
      showError(messageInput);
      isValid = false;
    } else {
      removeError(messageInput);
    }
    
    if (!isValid) {
      return; // Do not submit if validation fails
    }

    // Enter Loading State
    submitButton.disabled = true;
    const originalBtnText = submitButtonText.textContent;
    submitButtonText.textContent = 'Securing Message Connection...';
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    // Mock API Submission (Simulates network latency)
    setTimeout(() => {
      // Restore Button State
      submitButton.disabled = false;
      submitButtonText.textContent = originalBtnText;
      
      // Simulate Successful Submission
      formStatus.classList.add('success');
      formStatus.textContent = 'Message secure transmission complete! Daniel will contact you shortly.';
      
      // Reset Form
      contactForm.reset();
      
      // Clear success notification after 5 seconds
      setTimeout(() => {
        formStatus.classList.remove('success');
        formStatus.textContent = '';
      }, 5000);
      
    }, 2000);
  });
});
