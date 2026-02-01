// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('.nav-link, .cta-button').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = document.querySelector('.nav-menu').offsetHeight;
          const targetPosition = target.offsetTop - navHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Testimonial toggle functionality
  document.querySelectorAll('.testimonial-toggle').forEach(button => {
    button.addEventListener('click', function() {
      const testimonial = this.closest('.testimonial');
      const snapshot = testimonial.querySelector('.testimonial-snapshot');
      const fullContent = testimonial.querySelector('.testimonial-full');
      
      if (fullContent.style.display === 'none') {
        // Show full content, hide snapshot
        snapshot.style.display = 'none';
        fullContent.style.display = 'block';
        this.textContent = this.textContent.includes('Read full story') ? 'Show less' : 
                          this.textContent.includes('阅读完整故事') ? '收起' :
                          this.textContent.includes('閱讀完整故事') ? '收起' :
                          '收起';
      } else {
        // Show snapshot, hide full content
        snapshot.style.display = 'block';
        fullContent.style.display = 'none';
        this.textContent = this.textContent.includes('Show less') ? 'Read full story' : 
                          this.textContent.includes('收起') ? 
                          (document.documentElement.lang === 'zh-CN' ? '阅读完整故事' : '閱讀完整故事') :
                          'Read full story';
      }
    });
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
        message: form.querySelector('[name="message"]').value
      };
      
      // Send to Google Apps Script
      fetch('https://script.google.com/macros/s/AKfycbyFJsHWzGDmfCUakE-hE5N_-zziuCUhI75VdCnIbI4whR8BgRADSjXJUoxuqgZB7vfQuA/exec', {
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
});
