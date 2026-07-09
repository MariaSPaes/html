const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('.form')?.addEventListener('submit', event => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  const original = button.textContent;
  button.textContent = 'Solicitação registrada';
  setTimeout(() => {
    button.textContent = original;
    event.currentTarget.reset();
  }, 1600);
});

const menuBtn = document.querySelector('.menu-button, .botao-menu');
const menuNav = document.querySelector('.nav, .navegacao');

menuBtn?.addEventListener('click', () => {
  menuNav?.classList.toggle('open');
  menuNav?.classList.toggle('aberto');
});

menuNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuNav.classList.remove('open');
    menuNav.classList.remove('aberto');
  });
});

//* CARROSSEL AUTOMÁTICO MOBILE — DEFINITIVO */
const carousels = document.querySelectorAll(
  '.portfolio-grid, .archive-grid, .grade-portfolio, .grade-arquivo, .about-media, .sobre-galeria-final, .retrato-zoe, .fotos-zoe, .dupla-fotos'
);

function mobileAtivo() {
  return window.matchMedia('(max-width: 760px)').matches;
}

carousels.forEach((carousel) => {
  let index = 0;
  let pausado = false;
  let timerPausa;

  const getSlides = () => {
    return Array.from(carousel.children).filter((item) => {
      return item.offsetWidth > 0;
    });
  };

  const irParaSlide = (slideIndex) => {
    const slides = getSlides();
    if (!slides.length) return;

    const slide = slides[slideIndex];

    carousel.scrollTo({
      left: slide.offsetLeft - carousel.offsetLeft,
      behavior: 'smooth'
    });
  };

  const pausar = () => {
    pausado = true;
    clearTimeout(timerPausa);

    timerPausa = setTimeout(() => {
      pausado = false;
    }, 6000);
  };

  carousel.addEventListener('touchstart', pausar, { passive: true });
  carousel.addEventListener('pointerdown', pausar, { passive: true });
  carousel.addEventListener('wheel', pausar, { passive: true });

  setInterval(() => {
    if (!mobileAtivo()) return;
    if (pausado) return;

    const slides = getSlides();
    if (slides.length <= 1) return;

    index = index + 1;

    if (index >= slides.length) {
      index = 0;
    }

    irParaSlide(index);
  }, 3500);
});