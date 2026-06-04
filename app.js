(() => {
  const config = window.CLINIC_CONFIG || {};
  const toast = document.querySelector('[data-toast]');
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  };

  const createWhatsUrl = (message) => {
    const text = encodeURIComponent(message);
    return config.whatsappNumber
      ? `https://wa.me/${config.whatsappNumber}?text=${text}`
      : `https://wa.me/?text=${text}`;
  };

  document.querySelectorAll('[data-hours]').forEach(el => {
    el.textContent = config.hours || 'Horários sob consulta';
  });
  document.querySelectorAll('[data-map-link]').forEach(el => {
    el.href = config.mapUrl || 'https://www.google.com/maps/search/?api=1&query=Pinheiros%2C+S%C3%A3o+Paulo%2C+SP';
  });
  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    const message = el.dataset.message || 'Olá! Gostaria de agendar uma avaliação na Maison Or Estética.';
    el.href = createWhatsUrl(message);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  const menuButton = document.querySelector('[data-mobile-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const slides = [...document.querySelectorAll('.hero-slide')];
  const dotsContainer = document.querySelector('[data-dots]');
  let currentSlide = 0;
  let slideTimer;
  if (slides.length && dotsContainer) {
    slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `hero-dot${index === 0 ? ' active' : ''}`;
      button.setAttribute('aria-label', `Mostrar destaque ${index + 1}`);
      button.addEventListener('click', () => setSlide(index));
      dotsContainer.appendChild(button);
    });
    const dots = [...dotsContainer.querySelectorAll('.hero-dot')];
    const setSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, itemIndex) => slide.classList.toggle('active', itemIndex === currentSlide));
      dots.forEach((dot, itemIndex) => dot.classList.toggle('active', itemIndex === currentSlide));
      window.clearInterval(slideTimer);
      slideTimer = window.setInterval(() => setSlide(currentSlide + 1), 6500);
    };
    document.querySelector('[data-prev]')?.addEventListener('click', () => setSlide(currentSlide - 1));
    document.querySelector('[data-next]')?.addEventListener('click', () => setSlide(currentSlide + 1));
    setSlide(0);
  }

  const procedure = document.getElementById('procedure');
  const contactSection = document.getElementById('contato');
  document.querySelectorAll('[data-select]').forEach(button => {
    button.addEventListener('click', () => {
      if (procedure) {
        procedure.value = button.dataset.select;
        procedure.dispatchEvent(new Event('change', { bubbles: true }));
      }
      contactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast(`${button.dataset.select} selecionado. Complete seus dados.`);
    });
  });

  const phone = document.getElementById('phone');
  phone?.addEventListener('input', (event) => {
    let value = event.target.value.replace(/\D/g, '').slice(0, 11);
    if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (value.length > 6) value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else if (value.length > 2) value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    else if (value.length) value = value.replace(/(\d{0,2})/, '($1');
    event.target.value = value;
  });

  const form = document.querySelector('[data-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const phoneDigits = String(data.get('telefone') || '').replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      phone?.focus();
      showToast('Informe um WhatsApp válido para continuar.');
      return;
    }
    const message = [
      'Olá! Vim pelo site da Maison Or Estética e gostaria de solicitar uma avaliação.',
      '',
      `Nome: ${data.get('nome') || '-'}`,
      `WhatsApp: ${data.get('telefone') || '-'}`,
      `Tratamento de interesse: ${data.get('procedimento') || '-'}`,
      `Observações: ${data.get('mensagem') || 'Não informado.'}`
    ].join('\n');
    window.open(createWhatsUrl(message), '_blank', 'noopener');
    showToast('Sua mensagem foi preparada no WhatsApp.');
  });
})();
