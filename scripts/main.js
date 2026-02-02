// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  
  // Mobile hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const menuOverlay = document.querySelector('.menu-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
  }
  
  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }
  
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }
  
  // Close menu when nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('.nav-link, .cta-button').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          // On mobile (width <= 768px), nav is hidden in hamburger menu so no offset needed
          // On desktop, account for sticky nav height
          const isMobile = window.innerWidth <= 768;
          let targetPosition;
          
          if (isMobile) {
            // On mobile, scroll directly to the section with just a small offset
            targetPosition = target.offsetTop - 20;
          } else {
            // On desktop, account for the sticky nav menu height
            const navHeight = document.querySelector('.nav-menu').offsetHeight;
            targetPosition = target.offsetTop - navHeight - 20;
          }
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Testimonial modal functionality
  const modal = document.getElementById('testimonialModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.querySelector('.modal-close');
  
  console.log('Modal element:', modal);
  console.log('Modal body:', modalBody);
  console.log('Close button:', closeBtn);
  
  const testimonialButtons = document.querySelectorAll('.testimonial-toggle');
  console.log('Found testimonial buttons:', testimonialButtons.length);
  
  testimonialButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      console.log('Button clicked!');
      const testimonial = this.closest('.testimonial');
      const fullContent = testimonial.querySelector('.testimonial-full');
      const attribution = testimonial.querySelector('.testimonial-attribution');
      
      console.log('Testimonial:', testimonial);
      console.log('Full content:', fullContent);
      
      // Copy full content to modal
      if (fullContent && modal && modalBody) {
        modalBody.innerHTML = fullContent.innerHTML + '<p class="testimonial-attribution" style="margin-top: 2rem; text-align: left;">' + attribution.textContent + '</p>';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Modal should be visible now');
      } else {
        console.log('Missing elements:', {fullContent, modal, modalBody});
      }
    });
  });
  
  // Close modal when clicking X button
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Close modal when clicking outside the modal content
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Testimonial carousel functionality
  const container = document.querySelector('.testimonials-container');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const indicators = document.querySelectorAll('.indicator');
  
  if (container && prevBtn && nextBtn) {
    let currentIndex = 0;
    const testimonials = container.querySelectorAll('.testimonial');
    let hideTimeout;
    
    // Check if device is mobile/touch
    const isMobile = () => window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    function updateButtonVisibility() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === testimonials.length - 1;
    }
    
    function showArrows() {
      if (isMobile()) {
        prevBtn.classList.add('visible');
        nextBtn.classList.add('visible');
        
        // Clear existing timeout
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }
        
        // Hide arrows after 3 seconds of no interaction
        hideTimeout = setTimeout(() => {
          prevBtn.classList.remove('visible');
          nextBtn.classList.remove('visible');
        }, 3000);
      }
    }
    
    function hideArrows() {
      if (isMobile()) {
        prevBtn.classList.remove('visible');
        nextBtn.classList.remove('visible');
      }
    }
    
    // Touch/click handlers for mobile
    if (isTouchDevice) {
      const carousel = document.querySelector('.testimonials-carousel');
      
      carousel.addEventListener('touchstart', showArrows);
      carousel.addEventListener('click', showArrows);
      
      // Hide arrows when scrolling
      container.addEventListener('touchmove', () => {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }
      });
      
      container.addEventListener('touchend', showArrows);
    }
    
    function scrollToTestimonial(index) {
      if (testimonials[index]) {
        testimonials[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        currentIndex = index;
        updateIndicators();
        updateButtonVisibility();
      }
    }
    
    function updateIndicators() {
      indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === currentIndex);
      });
    }
    
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        scrollToTestimonial(currentIndex - 1);
        showArrows();
      }
    });
    
    nextBtn.addEventListener('click', () => {
      if (currentIndex < testimonials.length - 1) {
        scrollToTestimonial(currentIndex + 1);
        showArrows();
      }
    });
    
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        scrollToTestimonial(index);
      });
    });
    
    // Update current index on scroll
    container.addEventListener('scroll', () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      
      testimonials.forEach((testimonial, index) => {
        const testimonialLeft = testimonial.offsetLeft - container.offsetLeft;
        if (Math.abs(scrollLeft - testimonialLeft) < containerWidth / 2) {
          if (currentIndex !== index) {
            currentIndex = index;
            updateIndicators();
            updateButtonVisibility();
          }
        }
      });
    });
    
    // Initialize button visibility
    updateButtonVisibility();
    
    // On window resize, update button state
    window.addEventListener('resize', () => {
      if (!isMobile()) {
        prevBtn.classList.remove('visible');
        nextBtn.classList.remove('visible');
      }
    });
  }

  // Highlight active section in navigation
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navMenu) return;
    
    const navHeight = navMenu.offsetHeight;
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 100;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Google Apps Script Form Submission with Countdown
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const form = this;
      const submitButton = form.querySelector('button[type="submit"]');
      const statusDiv = document.getElementById('form-status');
      
      // Disable button and show countdown
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      statusDiv.style.display = 'block';
      statusDiv.style.color = '#8b7a68';
      
      let countdown = 3;
      statusDiv.textContent = 'Sending your message... ' + countdown;
      
      const countdownInterval = setInterval(function() {
        countdown--;
        if (countdown >= 0) {
          statusDiv.textContent = 'Sending your message... ' + countdown;
        }
      }, 1000);
      
      // Collect form data
      const formData = {
        from_name: form.querySelector('[name="from_name"]').value,
        reply_to: form.querySelector('[name="reply_to"]').value,
        phone: form.querySelector('[name="phone"]').value,
        subject: form.querySelector('[name="subject"]').value,
        message: form.querySelector('[name="message"]').value,
        language: form.querySelector('[name="language"]').value
      };
      
      // Send to Google Apps Script
      fetch('https://script.google.com/macros/s/AKfycby2WYqRABpQNUM2xyWJvValAoUjXU_B9bD-Qr3Rzva8VOQpkgfOE3_rOzXNQDs4mA69Fw/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      .then(function() {
        clearInterval(countdownInterval);
        statusDiv.textContent = 'Sent! I will get back to you soon.';
        statusDiv.style.color = '#4a9b5c';
        form.reset();
        
        // Reset button after 3 seconds
        setTimeout(function() {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
          statusDiv.style.display = 'none';
        }, 3000);
      })
      .catch(function(error) {
        clearInterval(countdownInterval);
        statusDiv.textContent = 'Failed to send message. Please try emailing directly.';
        statusDiv.style.color = '#c74444';
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        console.error('Error:', error);
      });
    });
  }

  // FAQ Accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.closest('.faq-item');
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
        }
      });

      // Toggle current item
      if (isActive) {
        faqItem.classList.remove('active');
      } else {
        faqItem.classList.add('active');
      }
    });
  });
});
