window.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.liquid-title');
  const noise = document.getElementById('coffeeNoise');
  const displace = document.getElementById('coffeeDisplace');
  const spark = document.querySelector('.hero__title-spark');
  const container = document.querySelector('.hero__particles');

  if (title && noise && displace) {
    animateCoffeeDistortion(noise, displace);
  }

  if (title && spark) {
    addPointerSpark(title, spark);
  }

  if (container) {
    setInterval(() => createParticle(container), 180);
  }

  setupContactForm();
});

function animateCoffeeDistortion(noise, displace) {
  let start = null;

  function frame(timestamp) {
    if (!start) start = timestamp;
    const t = (timestamp - start) / 1000;

    const baseX = 0.008 + Math.sin(t * 0.7) * 0.0015;
    const baseY = 0.03 + Math.cos(t * 0.9) * 0.003;
    const scale = 4 + Math.sin(t * 1.4) * 1.2;

    noise.setAttribute('baseFrequency', `${baseX} ${baseY}`);
    displace.setAttribute('scale', `${scale}`);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function addPointerSpark(title, spark) {
  let raf = null;

  const moveSpark = (event) => {
    const rect = title.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    if (raf) cancelAnimationFrame(raf);

    raf = requestAnimationFrame(() => {
      spark.style.left = `${Math.max(4, Math.min(96, x))}%`;
      spark.style.top = `${Math.max(10, Math.min(86, y))}%`;
    });
  };

  const resetSpark = () => {
    spark.style.left = '';
    spark.style.top = '';
  };

  title.addEventListener('pointermove', moveSpark);
  title.addEventListener('pointerleave', resetSpark);
}

function createParticle(container) {
  const p = document.createElement('span');
  p.className = 'hero__particle';

  const x = Math.random() * window.innerWidth;
  const y = window.innerHeight * 0.6 + Math.random() * 200;

  const size = Math.random() * 3 + 2;
  const duration = Math.random() * 7 + 7;

  p.style.left = `${x}px`;
  p.style.top = `${y}px`;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.animationDuration = `${duration}s`;

  container.appendChild(p);

  setTimeout(() => {
    p.remove();
  }, duration * 1000);
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const button = document.getElementById('contact-btn');
  const messageBox = document.getElementById('contact-message');

  if (!form || !button || !messageBox) return;
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS nincs betöltve.');
    return;
  }

  emailjs.init({
    publicKey: 'YOUR_PUBLIC_KEY',
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    messageBox.textContent = '';
    messageBox.classList.remove('is-success', 'is-error');

    const originalButtonText = button.textContent;
    button.textContent = 'SENDING...';
    button.classList.add('is-loading');

    try {
      await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form);

      messageBox.textContent = 'Your message has been sent successfully.';
      messageBox.classList.add('is-success');
      form.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      messageBox.textContent = 'Something went wrong. Please try again.';
      messageBox.classList.add('is-error');
    } finally {
      button.textContent = originalButtonText;
      button.classList.remove('is-loading');
    }
  });
}
