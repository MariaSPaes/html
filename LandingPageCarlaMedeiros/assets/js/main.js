const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");

menuButton?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const carousel = document.querySelector("[data-testimonials]");

if (carousel) {
  const track = carousel.querySelector(".testimonial-track");
  const cards = Array.from(track.children);
  const previous = carousel.querySelector("[data-prev]");
  const next = carousel.querySelector("[data-next]");
  const current = carousel.querySelector("[data-current]");
  let index = 0;

  const visibleCards = () => {
    if (window.innerWidth <= 760) return 1;
    if (window.innerWidth <= 1080) return 2;
    return 3;
  };

  const maximumIndex = () => Math.max(0, cards.length - visibleCards());

  const update = () => {
    index = Math.min(index, maximumIndex());

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;

    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    current.textContent = String(index + 1).padStart(2, "0");
  };

  const move = (direction) => {
    index += direction;

    if (index > maximumIndex()) index = 0;
    if (index < 0) index = maximumIndex();

    update();
  };

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  window.addEventListener("resize", update);

  let touchStart = 0;

  track.addEventListener("touchstart", (event) => {
    touchStart = event.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
  }, { passive: true });

  update();
}

document.querySelector("#year").textContent = new Date().getFullYear();
