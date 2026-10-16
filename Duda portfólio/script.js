const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

const filterButtons = document.querySelectorAll('.project-filters button');
const projectCards = document.querySelectorAll('.project-grid .project-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  projectCards.forEach(card => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
  document.querySelector('.project-grid')?.scrollTo({ left: 0, behavior: 'smooth' });
}));

const projectCarousel = document.querySelector('.project-grid');
const previousProject = document.querySelector('.project-prev');
const nextProject = document.querySelector('.project-next');

function visibleProjectCards() {
  return [...projectCards].filter(card => !card.classList.contains('is-hidden'));
}

function moveProjects(direction) {
  if (!projectCarousel) return;
  const cards = visibleProjectCards();
  if (!cards.length) return;
  const step = cards[0].getBoundingClientRect().width + 28;
  const atEnd = projectCarousel.scrollLeft + projectCarousel.clientWidth >= projectCarousel.scrollWidth - 8;
  const atStart = projectCarousel.scrollLeft <= 8;
  if (direction > 0 && atEnd) projectCarousel.scrollTo({ left: 0, behavior: 'smooth' });
  else if (direction < 0 && atStart) projectCarousel.scrollTo({ left: projectCarousel.scrollWidth, behavior: 'smooth' });
  else projectCarousel.scrollBy({ left: step * direction, behavior: 'smooth' });
}

previousProject?.addEventListener('click', () => moveProjects(-1));
nextProject?.addEventListener('click', () => moveProjects(1));

const academicCarousel = document.querySelector('.academic-list');
const academicCards = [...document.querySelectorAll('.academic-card')];

function moveAcademic(direction) {
  if (!academicCarousel || !academicCards.length) return;
  const step = academicCards[0].getBoundingClientRect().width + 22;
  const atEnd = academicCarousel.scrollLeft + academicCarousel.clientWidth >= academicCarousel.scrollWidth - 8;
  const atStart = academicCarousel.scrollLeft <= 8;
  if (direction > 0 && atEnd) academicCarousel.scrollTo({ left: 0, behavior: 'smooth' });
  else if (direction < 0 && atStart) academicCarousel.scrollTo({ left: academicCarousel.scrollWidth, behavior: 'smooth' });
  else academicCarousel.scrollBy({ left: step * direction, behavior: 'smooth' });
}

document.querySelector('.academic-prev')?.addEventListener('click', () => moveAcademic(-1));
document.querySelector('.academic-next')?.addEventListener('click', () => moveAcademic(1));

const movingPieces = document.querySelectorAll('.hero-flower, .contact-flower, .flower-field');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    movingPieces.forEach((piece, index) => {
      const direction = index % 2 ? -1 : 1;
      piece.style.translate = `0 ${window.scrollY * 0.035 * direction}px`;
    });
    document.documentElement.style.setProperty('--scroll-spin', `${window.scrollY * 0.025}deg`);
    ticking = false;
  });
}, { passive: true });
