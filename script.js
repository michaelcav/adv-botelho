const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const heroBg = document.querySelector('.hero-bg');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (precisePointer.matches && !reducedMotion.matches) {
  let scrollTarget = window.scrollY;
  let scrollFrame = null;

  const animateScroll = () => {
    const distance = scrollTarget - window.scrollY;

    if (Math.abs(distance) < 0.5) {
      window.scrollTo(0, scrollTarget);
      scrollFrame = null;
      return;
    }

    window.scrollTo(0, window.scrollY + distance * 0.14);
    scrollFrame = window.requestAnimationFrame(animateScroll);
  };

  window.addEventListener('wheel', (event) => {
    const overFormControl = event.target instanceof Element &&
      event.target.closest('input, textarea, select');
    if (event.ctrlKey || overFormControl) return;

    event.preventDefault();

    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (!scrollFrame) scrollTarget = window.scrollY;
    scrollTarget = Math.min(maxScroll, Math.max(0, scrollTarget + event.deltaY * unit));

    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(animateScroll);
  }, { passive: false });
}

toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => observer.observe(el));

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const y = window.scrollY;

      if (header) {
        header.style.background =
          y > 36 ? 'rgba(3,14,29,.92)' : 'linear-gradient(180deg,rgba(2,12,24,.88),rgba(2,12,24,.52))';
      }

      if (heroBg && window.innerWidth > 760) {
        /* Hero fixo para preservar o enquadramento. */
      }

      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome")?.value.trim() || "";
      const telefone = document.getElementById("telefone")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const assunto = document.getElementById("assunto")?.value.trim() || "";
      const mensagem = document.getElementById("mensagem")?.value.trim() || "";

      const texto =
        `Olá, Procopio Botelho.%0A%0A` +
        `Nome: ${encodeURIComponent(nome)}%0A` +
        `Telefone: ${encodeURIComponent(telefone)}%0A` +
        `E-mail: ${encodeURIComponent(email)}%0A` +
        `Área: ${encodeURIComponent(assunto)}%0A%0A` +
        `Mensagem:%0A${encodeURIComponent(mensagem)}`;

      if (status) status.textContent = "Abrindo o WhatsApp para enviar sua mensagem...";
      window.open(`https://wa.me/5511999999999?text=${texto}`, "_blank", "noopener");
    });
  }

  const hoverables = document.querySelectorAll(".practice-box-inner,.specialist-card,.contact-form");
  hoverables.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 900) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 1.5).toFixed(2)}deg) rotateY(${(x * 1.5).toFixed(2)}deg)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
});
