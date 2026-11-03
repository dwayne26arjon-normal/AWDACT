// Portfolio scripts: plain JavaScript, no libraries.
// Each feature is a separate block so it can be explained one at a time.

// MOTION PREFERENCE: follows the device setting, but the Motion button can override it
let savedMotion = null;
try { savedMotion = localStorage.getItem('motion'); } catch (e) { /* storage blocked */ }
const reducedMotion = savedMotion ? savedMotion === 'off' : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.toggle('reduce-motion', reducedMotion);
const motionToggle = document.getElementById('motion-toggle');
motionToggle.setAttribute('aria-pressed', String(!reducedMotion));
document.getElementById('motion-state').textContent = reducedMotion ? 'Off' : 'On';
motionToggle.addEventListener('click', () => {
  try { localStorage.setItem('motion', reducedMotion ? 'on' : 'off'); } catch (e) { /* ignore */ }
  location.reload(); // simplest way to restart every animation with the new setting
});

// 1. MOBILE MENU: toggle the hidden class and keep aria-expanded in sync
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.classList.toggle('hidden');
});
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => { // close the menu after choosing a section
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// 2. THEME TOGGLE: switches between two DARK themes (Midnight and Charcoal) and remembers the choice
const themeToggle = document.getElementById('theme-toggle');
const themeState = document.getElementById('theme-state');
function applyTheme(theme) {
  document.documentElement.classList.toggle('theme-charcoal', theme === 'charcoal');
  const label = theme === 'charcoal' ? 'Charcoal' : 'Midnight';
  themeState.textContent = label;
  themeToggle.setAttribute('aria-label', 'Switch color theme (current: ' + label + ')');
}
let savedTheme = 'midnight';
try { savedTheme = localStorage.getItem('theme') || 'midnight'; } catch (e) { /* storage blocked */ }
applyTheme(savedTheme);
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.classList.contains('theme-charcoal') ? 'midnight' : 'charcoal';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});

// 3. ACTIVE NAV LINK: IntersectionObserver reports which section is on screen
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.setAttribute('aria-current', String(link.getAttribute('href') === '#' + entry.target.id));
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }); // a section counts when it crosses the middle of the screen
document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

// 3b. SCROLL PROGRESS + TIMECODE: the page is treated like a 3-minute edit
const progressBar = document.getElementById('progress-bar');
const timecode = document.getElementById('timecode');
function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  progressBar.style.width = (progress * 100) + '%';
  const totalSeconds = Math.round(progress * 180); // 180 seconds = 3:00
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  const ff = String(Math.floor((progress * 180 * 30) % 30)).padStart(2, '0'); // frames at 30 fps
  timecode.textContent = mm + ':' + ss + ':' + ff;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// 4. PROJECT FILTER / CRUD logic moved to project-manager.js so the page stays modular.

// 5. DEVELOPER JOURNEY: clicking a stage shows its panel and hides the others
const stageButtons = document.querySelectorAll('.stage-btn');
const stagePanels = document.querySelectorAll('.stage-panel');
const stageHint = document.getElementById('stage-hint');
const journeyFill = document.getElementById('journey-fill');
stageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('aria-controls');
    stageHint.classList.add('hidden');
    journeyFill.style.width = (Array.from(stageButtons).indexOf(button) / 4 * 100) + '%'; // move the playhead
    stageButtons.forEach((b) => b.setAttribute('aria-expanded', String(b === button)));
    stagePanels.forEach((p) => p.classList.toggle('hidden', p.id !== targetId));
  });
});

// 6. CONTACT FORM: front-end validation only. Nothing is sent anywhere.
const form = document.getElementById('contact-form');
const successBox = document.getElementById('form-success');
function setError(fieldId, message) {
  document.getElementById(fieldId + '-error').textContent = message; // textContent = safe
  document.getElementById(fieldId).setAttribute('aria-invalid', message ? 'true' : 'false');
  return message === '';
}
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const okName = setError('name', name.length < 2 ? 'Please enter your name (at least 2 characters).' : '');
  const okEmail = setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email, like name@example.com.');
  const okMessage = setError('message', message.length < 10 ? 'Please write a message of at least 10 characters.' : '');
  if (okName && okEmail && okMessage) {
    successBox.textContent = 'Thanks, ' + name + '. Your message passed validation. (This demo form does not send messages.)';
    successBox.classList.remove('hidden');
    form.reset();
  } else {
    successBox.classList.add('hidden');
  }
});

// 7. SCROLL REVEAL: cards start hidden, then fade in when they scroll into view.
// The hiding is done with Tailwind classes that JavaScript adds and removes (no custom CSS).
const hiddenClasses = ['opacity-0', '[translate:0_14px]'];
const motionClasses = ['![transition-property:opacity,translate,transform,border-color,box-shadow,background-color,color]', '!duration-700'];
let revealObserver = null;
function setupRevealObserver() {
  if (reducedMotion || typeof IntersectionObserver === 'undefined') return;
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const position = Array.from(el.parentElement.children).indexOf(el);
        el.style.transitionDelay = Math.min(position, 4) * 90 + 'ms';
        el.classList.remove(...hiddenClasses);
        setTimeout(() => {
          el.classList.remove(...motionClasses);
          el.style.transitionDelay = '';
        }, 1200);
        observer.unobserve(el);
      });
    }, { threshold: 0.15 });
  }

  document.querySelectorAll('.reveal').forEach((el) => {
    if (el.dataset.revealBound === 'true') return;
    el.dataset.revealBound = 'true';
    el.classList.add(...hiddenClasses, ...motionClasses);
    revealObserver.observe(el);
  });
}
setupRevealObserver();

// 8. FOOTER YEAR
document.getElementById('year').textContent = new Date().getFullYear();

// 9. COUNT-UP NUMBERS: numbers in the About stats count up when they scroll into view
const counters = document.querySelectorAll('.count');
counters.forEach((el) => { if (!reducedMotion) el.textContent = '0'; });
const countObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    observer.unobserve(el);
    if (reducedMotion) { el.textContent = target; return; }
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, Math.max(1000 / target, 15)); // about one second in total
  });
}, { threshold: 0.6 });
counters.forEach((el) => countObserver.observe(el));

// 10. CUSTOM CURSOR (desktop only): a ring follows the mouse and grows over links and buttons
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
  cursor.classList.remove('hidden');
  let targetX = 0, targetY = 0, x = 0, y = 0;
  document.addEventListener('mousemove', (e) => { targetX = e.clientX; targetY = e.clientY; });
  document.addEventListener('mouseover', (e) => {
    const overClickable = e.target.closest('a, button, input, textarea');
    cursorRing.classList.toggle('scale-150', Boolean(overClickable));
    cursorRing.classList.toggle('bg-brand/20', Boolean(overClickable));
  });
  (function follow() { // move 20% of the way to the mouse each frame for a smooth trail
    x += (targetX - x) * 0.2;
    y += (targetY - y) * 0.2;
    cursor.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    requestAnimationFrame(follow);
  })();
}
