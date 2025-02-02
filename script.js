document.addEventListener('DOMContentLoaded', () => {
  // Add theme toggle functionality
  const initTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  initTheme();

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', toggleTheme);

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  // Animate statistics
  const statsAnimation = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
447    
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.dataset.value);
      const duration = 2000; // Animation duration in milliseconds
      const steps = 60; // Number of steps in animation
      const stepValue = target / steps;
      let current = 0;
      
      const updateCounter = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          current = target;
          clearInterval(updateCounter);
        }
        stat.textContent = current.toFixed(1).replace(/\.0$/, '');
      }, duration / steps);
    });
  };

  // Intersection Observer for statistics animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statsAnimation();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.stats-container');
  observer.observe(statsContainer);

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const element = document.querySelector(this.getAttribute('href'));
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add hover effect to clay cards
  const clayCards = document.querySelectorAll('.clay');
  clayCards.forEach(card => {
    card.addEventListener('mouseover', () => {
      if (!card.classList.contains('nav') && !card.classList.contains('clay-button')) {
        card.style.transform = 'translateY(-5px)';
        card.style.transition = 'transform 0.3s ease';
      }
    });
    
    card.addEventListener('mouseout', () => {
      if (!card.classList.contains('nav') && !card.classList.contains('clay-button')) {
        card.style.transform = 'translateY(0)';
      }
    });
  });

  // Enhanced dynamic lighting effect
  const handleDynamicLighting = () => {
    const dynamicElements = document.querySelectorAll('.dynamic-light');
    
    dynamicElements.forEach(element => {
      const morphingShape = document.createElement('div');
      morphingShape.classList.add('morphing-shape');
      element.appendChild(morphingShape);
      
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / element.offsetWidth) * 100;
        const y = ((e.clientY - rect.top) / element.offsetHeight) * 100;
        
        element.style.setProperty('--mouse-x', `${x}%`);
        element.style.setProperty('--mouse-y', `${y}%`);
        
        // Morphing shape transformation
        const scaleX = 1 + (Math.abs(x - 50) / 500);
        const scaleY = 1 + (Math.abs(y - 50) / 500);
        const rotate = ((x - 50) * (y - 50)) / 500;
        
        morphingShape.style.transform = `scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`;
      });
    });
  };

  handleDynamicLighting();

  // Tactile feedback
  const addTactileFeedback = () => {
    const buttons = document.querySelectorAll('.clay-button');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  };

  addTactileFeedback();

  // Enhanced hover animations for feature cards
  const initFeatureCards = () => {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
      let bounds = card.getBoundingClientRect();
      let mouseLeaveDelay;

      const mouseMove = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        const center = {
          x: leftX - bounds.width / 2,
          y: topY - bounds.height / 2
        }
        
        const distance = Math.sqrt(center.x**2 + center.y**2);
        
        let rotateX = (center.y / bounds.height) * 30;
        let rotateY = (center.x / bounds.width) * 30;
        
        // Add some smoothing
        card.style.transform = `
          perspective(1000px)
          scale3d(1.07, 1.07, 1.07)
          rotateX(${-rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(0)
        `;
      };

      const mouseEnter = (e) => {
        bounds = card.getBoundingClientRect();
        document.addEventListener('mousemove', mouseMove);
        // Reset any previous transition
        card.style.transition = 'none';
      };

      const mouseLeave = () => {
        document.removeEventListener('mousemove', mouseMove);
        card.style.transition = 'transform 0.5s ease';
        card.style.transform = `
          perspective(1000px)
          rotateX(0deg)
          rotateY(0deg)
          scale3d(1, 1, 1)
          translateZ(0)
        `;
      };

      card.addEventListener('mouseenter', mouseEnter);
      card.addEventListener('mouseleave', mouseLeave);
    });
  };

  initFeatureCards();

  // Add depth transition to price cards
  const priceCards = document.querySelectorAll('.price-card');
  priceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateZ(20px)';
      card.style.zIndex = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateZ(0)';
      card.style.zIndex = '0';
    });
  });

  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Ambient background animation
  const createAmbientBackground = () => {
    const gradient = document.createElement('div');
    gradient.classList.add('ambient-gradient');
    document.body.appendChild(gradient);

    let mouseX = 0;
    let mouseY = 0;
    let gradientX = 0;
    let gradientY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 100;
      mouseY = (e.clientY / window.innerHeight) * 100;
    });

    function updateGradient() {
      gradientX += (mouseX - gradientX) * 0.05;
      gradientY += (mouseY - gradientY) * 0.05;
      
      document.body.style.setProperty('--gradient-x', `${gradientX}%`);
      document.body.style.setProperty('--gradient-y', `${gradientY}%`);
      
      requestAnimationFrame(updateGradient);
    }

    updateGradient();
  };

  createAmbientBackground();
});