// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.custom-cursor-follower');
const links = document.querySelectorAll('a, button');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  // Add a slight delay to the follower for a smoother effect
  setTimeout(() => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  }, 50);
});

// Change cursor style when hovering over links and buttons
links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    cursor.style.width = '30px';
    cursor.style.height = '30px';
    cursor.style.backgroundColor = 'var(--accent)';
    cursorFollower.style.width = '60px';
    cursorFollower.style.height = '60px';
    cursorFollower.style.borderColor = 'var(--accent)';
  });
  
  link.addEventListener('mouseleave', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.backgroundColor = 'var(--secondary)';
    cursorFollower.style.width = '40px';
    cursorFollower.style.height = '40px';
    cursorFollower.style.borderColor = 'var(--primary)';
  });
});

// Hide cursor when mouse leaves the window
document.addEventListener('mouseout', (e) => {
  if (e.relatedTarget === null) {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  }
});

document.addEventListener('mouseover', () => {
  cursor.style.opacity = '1';
  cursorFollower.style.opacity = '0.5';
});

// ===== SPACE BACKGROUND =====
class Star {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.opacity = Math.random();
    this.color = this.getRandomColor();
  }
  
  getRandomColor() {
    const colors = ['#ffffff', '#00d9ff', '#6e00ff', '#ff00e6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  update() {
    this.y += this.speed;
    if (this.y > window.innerHeight) {
      this.y = 0;
      this.x = Math.random() * window.innerWidth;
    }
    this.opacity = Math.sin(Date.now() * 0.001 * this.speed) * 0.5 + 0.5;
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

class SpaceBackground {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.meteors = [];
    this.lastMeteorTime = 0;
    
    document.getElementById('space-background').appendChild(this.canvas);
    
    this.resizeCanvas();
    this.createStars();
    
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.animate();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createStars();
  }
  
  createStars() {
    this.stars = [];
    const numStars = Math.floor(window.innerWidth * window.innerHeight / 1000);
    
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 2 + 0.5;
      const speed = Math.random() * 0.2 + 0.1;
      
      this.stars.push(new Star(x, y, size, speed));
    }
  }
  
  createMeteor() {
    const now = Date.now();
    if (now - this.lastMeteorTime > 5000) { // Create a meteor every 5 seconds
      const x = Math.random() * this.canvas.width;
      const y = 0;
      const size = Math.random() * 3 + 2;
      const speed = Math.random() * 5 + 5;
      const length = Math.random() * 100 + 50;
      
      this.meteors.push({ x, y, size, speed, length, opacity: 1 });
      this.lastMeteorTime = now;
    }
  }
  
  updateMeteors() {
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const meteor = this.meteors[i];
      meteor.x += meteor.speed;
      meteor.y += meteor.speed;
      meteor.opacity -= 0.01;
      
      if (meteor.y > this.canvas.height || meteor.opacity <= 0) {
        this.meteors.splice(i, 1);
      }
    }
  }
  
  drawMeteors() {
    for (const meteor of this.meteors) {
      this.ctx.beginPath();
      this.ctx.moveTo(meteor.x, meteor.y);
      this.ctx.lineTo(meteor.x - meteor.length, meteor.y - meteor.length);
      
      const gradient = this.ctx.createLinearGradient(
        meteor.x, meteor.y,
        meteor.x - meteor.length, meteor.y - meteor.length
      );
      
      gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
      gradient.addColorStop(0.3, `rgba(110, 0, 255, ${meteor.opacity * 0.8})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = meteor.size;
      this.ctx.stroke();
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw stars
    for (const star of this.stars) {
      star.update();
      star.draw(this.ctx);
    }
    
    // Create and update meteors
    this.createMeteor();
    this.updateMeteors();
    this.drawMeteors();
    
    requestAnimationFrame(() => this.animate());
  }
}

// ===== LOADING SCREEN =====
function simulateLoading() {
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingBar = document.querySelector('.loading-bar');
  let width = 0;
  
  // Make sure all assets are loaded before hiding loading screen
  window.addEventListener('load', () => {
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.style.opacity = '0';
          loadingScreen.style.visibility = 'hidden';
          
          setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.classList.add('loaded');
            animateElements();
            
            // Trigger initial section animations
            const homeSection = document.getElementById('home');
            if (homeSection) {
              homeSection.classList.add('in-view');
            }
          }, 1000);
        }, 500);
      } else {
        width += Math.random() * 5 + 1;
        if (width > 100) width = 100;
        loadingBar.style.width = width + '%';
      }
    }, 100);
  });
  
  // Fallback in case the load event doesn't fire
  setTimeout(() => {
    if (loadingScreen.style.display !== 'none') {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.visibility = 'hidden';
      
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        document.body.classList.add('loaded');
        animateElements();
        
        // Trigger initial section animations
        const homeSection = document.getElementById('home');
        if (homeSection) {
          homeSection.classList.add('in-view');
        }
      }, 1000);
    }
  }, 5000);
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // Close menu when clicking on a link
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function animateElements() {
  // Setup scroll animations for all sections
  const sections = document.querySelectorAll('.section');
  
  const observerOptions = {
    root: null,
    rootMargin: '-50px',
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        section.classList.add('in-view');
        
        // Specific animations for different sections
        if (section.id === 'skills') {
          const skillItems = section.querySelectorAll('.skill-item');
          skillItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate');
              const skillLevel = item.getAttribute('data-skill') + '%';
              item.querySelector('.skill-progress').style.width = skillLevel;
            }, index * 200);
          });
        }
        
        if (section.id === 'projects') {
          const projectCards = section.querySelectorAll('.project-card');
          projectCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate');
            }, index * 200);
          });
        }
        
        if (section.id === 'about') {
          // Ensure orbit animations are properly triggered
          const orbitItems = section.querySelectorAll('.orbit-item');
          orbitItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.5}s`;
            item.style.animationPlayState = 'running';
          });
        }
        
        if (section.id === 'home') {
          // Ensure planet animation is properly triggered
          const planet = section.querySelector('.planet');
          if (planet) {
            planet.style.animationPlayState = 'running';
          }
        }
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Initial animations for visible elements
  setTimeout(() => {
    // Animate skill bars that are already visible
    const visibleSkillItems = document.querySelectorAll('.skill-item:not(.animate)');
    visibleSkillItems.forEach((item, index) => {
      if (isElementInViewport(item)) {
        setTimeout(() => {
          item.classList.add('animate');
          const skillLevel = item.getAttribute('data-skill') + '%';
          item.querySelector('.skill-progress').style.width = skillLevel;
        }, index * 200);
      }
    });
    
    // Animate project cards that are already visible
    const visibleProjectCards = document.querySelectorAll('.project-card:not(.animate)');
    visibleProjectCards.forEach((card, index) => {
      if (isElementInViewport(card)) {
        setTimeout(() => {
          card.classList.add('animate');
        }, index * 200);
      }
    });
  }, 500);
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ===== ORBIT ITEMS INTERACTION =====
function setupOrbitInteraction() {
  const orbitItems = document.querySelectorAll('.orbit-item');
  const profileImage = document.querySelector('.profile-image i');
  const bioElement = document.querySelector('.code-property:nth-child(3) + .code-string');
  const profileContainer = document.querySelector('.profile-container');
  
  // Original bio text to restore
  const originalBioText = bioElement.textContent;
  
  // Descriptions for each orbit item
  const descriptions = {
    'Creative': '"I approach problems with creativity, finding innovative solutions where others see obstacles."',
    'Innovative': '"Always looking for new technologies and methods to improve my work and deliver cutting-edge solutions."',
    'Analytical': '"I break down complex problems methodically, analyzing all aspects before implementing the best solution."',
    'Collaborative': '"I thrive in team environments, valuing diverse perspectives and collective problem-solving."',
    'Detail-oriented': '"I pay close attention to the small details that make a big difference in the final product."'
  };
  
  // Icons to change the profile image
  const icons = {
    'Creative': 'fa-lightbulb',
    'Innovative': 'fa-rocket',
    'Analytical': 'fa-brain',
    'Collaborative': 'fa-users',
    'Detail-oriented': 'fa-search'
  };
  
  // Colors for each trait
  const colors = {
    'Creative': '#ff00e6', // accent
    'Innovative': '#6e00ff', // primary
    'Analytical': '#00d9ff', // secondary
    'Collaborative': '#ffcc00', // highlight
    'Detail-oriented': '#00ff88' // new color
  };
  
  // Initialize orbit animations immediately
  function initOrbitAnimations() {
    // Set initial animation state for all orbit items
    document.querySelectorAll('.orbit-item').forEach((item, index) => {
      item.style.animationPlayState = 'running';
      
      // Add click event to each orbit item
      item.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering profile container click
        
        // Display information about the clicked skill
        const skillName = item.getAttribute('title');
        alert(`Skill: ${skillName}\nThis is one of my key professional attributes.`);
      });
    });
    
    // Set initial animation state for orbit path
    const orbitPath = profileContainer.querySelector('.orbit-path');
    if (orbitPath) {
      orbitPath.style.animationPlayState = 'running';
    }
  }
  
  // Initialize immediately
  initOrbitAnimations();
  
  // Also initialize when the about section comes into view (for better performance)
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initOrbitAnimations();
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(aboutSection);
  }
  
  // Add a click event to the profile container to pause/resume all animations
  let allPaused = false;
  profileContainer.addEventListener('click', () => {
    allPaused = !allPaused;
    
    // Make sure all orbit items are selected and their animations are controlled
    document.querySelectorAll('.orbit-item').forEach(item => {
      item.style.animationPlayState = allPaused ? 'paused' : 'running';
    });
    
    // Also control the orbit path animation
    const orbitPath = profileContainer.querySelector('.orbit-path');
    if (orbitPath) {
      orbitPath.style.animationPlayState = allPaused ? 'paused' : 'running';
    }
    
    // Add a visual indicator that animations are paused
    if (allPaused) {
      profileContainer.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.5)';
      if (orbitPath) {
        orbitPath.style.borderColor = 'rgba(255, 0, 0, 0.3)';
      }
    } else {
      profileContainer.style.boxShadow = '';
      if (orbitPath) {
        orbitPath.style.borderColor = '';
      }
    }
  });
  
  // Add cursor trail effect
  document.addEventListener('mousemove', (e) => {
    if (isElementInViewport(document.getElementById('about'))) {
      createCursorParticle(e.clientX, e.clientY);
    }
  });
  
  function createCursorParticle(x, y) {
    // Limit the rate of particle creation
    if (Math.random() > 0.1) return;
    
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // Random color from our theme
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
  
  orbitItems.forEach(item => {
    const trait = item.getAttribute('title');
    
    // Create a particle trail effect for each orbit item
    const createParticleTrail = () => {
      if (item.style.animationPlayState === 'paused' || !isElementInViewport(document.getElementById('about'))) return;
      
      const particle = document.createElement('div');
      particle.className = 'orbit-particle';
      particle.style.left = item.offsetLeft + 'px';
      particle.style.top = item.offsetTop + 'px';
      particle.style.backgroundColor = colors[trait] || 'var(--secondary)';
      profileContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 1000);
    };
    
    // Create particle trail occasionally
    setInterval(createParticleTrail, 300);
    
    item.addEventListener('mouseenter', () => {
      // Pause the animation
      item.style.animationPlayState = 'paused';
      
      // Update the bio text with a typing effect
      if (descriptions[trait]) {
        typeCode(bioElement, descriptions[trait]);
      }
      
      // Change the profile icon temporarily with animation
      if (icons[trait]) {
        profileImage.style.transform = 'scale(0)';
        setTimeout(() => {
          profileImage.className = `fas ${icons[trait]}`;
          profileImage.style.color = colors[trait] || 'var(--accent)';
          profileImage.style.transform = 'scale(1)';
        }, 300);
      }
      
      // Add a highlight effect
      item.style.zIndex = '10';
      item.style.boxShadow = `0 0 25px ${colors[trait] || 'var(--accent)'}`;
    });
    
    item.addEventListener('mouseleave', () => {
      // Resume the animation
      if (!allPaused) {
        item.style.animationPlayState = 'running';
      }
      
      // Restore the original bio text
      typeCode(bioElement, originalBioText);
      
      // Restore the original profile icon with animation
      profileImage.style.transform = 'scale(0)';
      setTimeout(() => {
        profileImage.className = 'fas fa-user-astronaut';
        profileImage.style.color = '';
        profileImage.style.transform = 'scale(1)';
      }, 300);
      
      // Remove the highlight effect
      item.style.zIndex = '';
      item.style.boxShadow = '';
    });
  });
  
  // Function to create typing effect for code
  function typeCode(element, text) {
    // Store the current text
    const currentText = element.textContent;
    
    // If the text is the same, don't retype
    if (currentText === text) return;
    
    // Create a blinking cursor effect
    element.classList.add('typing');
    
    // Clear the text with a backspace effect first
    let backspaceCount = currentText.length;
    const backspaceInterval = setInterval(() => {
      if (backspaceCount > 0) {
        element.textContent = currentText.substring(0, backspaceCount - 1);
        backspaceCount--;
      } else {
        clearInterval(backspaceInterval);
        
        // Now type the new text
        let i = 0;
        const typing = setInterval(() => {
          if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
          } else {
            clearInterval(typing);
            element.classList.remove('typing');
          }
        }, 20);
      }
    }, 10);
  }
  
  // Add CSS for particle effects
  const style = document.createElement('style');
  style.textContent = `
    .orbit-particle {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      opacity: 0.7;
      pointer-events: none;
      z-index: 0;
      animation: fadeOut 1s forwards;
    }
    
    .cursor-particle {
      position: fixed;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9997;
      animation: cursorParticle 1s forwards;
    }
    
    @keyframes fadeOut {
      0% { transform: scale(1); opacity: 0.7; }
      100% { transform: scale(0); opacity: 0; }
    }
    
    @keyframes cursorParticle {
      0% { transform: scale(1) translateY(0); opacity: 0.7; }
      100% { transform: scale(0) translateY(-20px); opacity: 0; }
    }
    
    .typing::after {
      content: '|';
      animation: blink 0.7s infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize space background
  new SpaceBackground();
  
  // Setup mobile menu
  setupMobileMenu();
  
  // Simulate loading
  simulateLoading();
  
  // Setup orbit interaction
  setupOrbitInteraction();
  
  // Form labels animation
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.nextElementSibling.classList.add('active');
    });
    
    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.nextElementSibling.classList.remove('active');
      }
    });
  });
  
  // Prevent form submission (for demo purposes)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Form submission is disabled in this demo.');
    });
  }
});