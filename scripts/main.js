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

  // Handle feedback form submission
  function handleFeedbackForm(formId, statusId) {
    const feedbackForm = document.getElementById(formId);
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const form = this;
        const submitButton = form.querySelector('button[type="submit"]');
        const statusDiv = document.getElementById(statusId);
        
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        statusDiv.style.display = 'block';
        statusDiv.textContent = 'Submitting...';
        statusDiv.style.color = '#8b7a68';

        const formData = {
          from_name: form.querySelector('[name="from_name"]').value,
          message: form.querySelector('[name="message"]').value,
          language: form.querySelector('[name="language"]').value,
          subject: form.querySelector('[name="subject"]').value
        };

        fetch('https://script.google.com/macros/s/AKfycby2WYqRABpQNUM2xyWJvValAoUjXU_B9bD-Qr3Rzva8VOQpkgfOE3_rOzXNQDs4mA69Fw/exec', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
        .then(() => {
          statusDiv.textContent = 'Thank you for your feedback!';
          statusDiv.style.color = '#4a9b5c';
          form.reset();
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Feedback';
            statusDiv.style.display = 'none';
          }, 3000);
        })
        .catch((error) => {
          statusDiv.textContent = 'Submission failed. Please try again later.';
          statusDiv.style.color = '#c74444';
          submitButton.disabled = false;
          submitButton.textContent = 'Submit Feedback';
          console.error('Error:', error);
        });
      });
    }
  }

  handleFeedbackForm('feedback-form', 'feedback-form-status');
  handleFeedbackForm('feedback-form-zh-simplified', 'feedback-form-status-zh-simplified');
  handleFeedbackForm('feedback-form-zh-traditional', 'feedback-form-status-zh-traditional');

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
