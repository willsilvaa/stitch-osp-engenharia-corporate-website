/**
 * OSP ENGENHARIA E CONSULTORIA
 * Orquestrador Principal do Sistema de Animações & Interações
 */

(function () {
  'use strict';

  // Marca documento com suporte ativo a JS para Progressive Enhancement
  document.documentElement.classList.add('has-js');

  function initApp() {
    // 1. Inicializa Scroll Suave (Lenis) & Smart Header
    try {
      if (typeof window.initOSPScroll === 'function') {
        window.initOSPScroll();
      }
    } catch (e) {
      console.warn('Scroll init skipped:', e);
    }

    // 2. Inicializa Animações GSAP & ScrollTrigger
    try {
      if (typeof window.initOSPAnimations === 'function') {
        window.initOSPAnimations();
      }
    } catch (e) {
      console.warn('Animations init skipped:', e);
    }

    // 3. Inicializa Microinterações
    try {
      if (typeof window.initOSPInteractions === 'function') {
        window.initOSPInteractions();
      }
    } catch (e) {
      console.warn('Interactions init skipped:', e);
    }

    // 4. Lógica: Vídeo de Fundo dos Heros (Home e Contato) em Loop Contínuo
    const setupHeroVideo = (selector) => {
      const video = document.querySelector(selector);
      if (video) {
        video.muted = true;
        video.playsInline = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            const startPlay = () => {
              video.play().catch(() => {});
            };
            window.addEventListener('click', startPlay, { once: true });
            window.addEventListener('scroll', startPlay, { once: true });
          });
        }
      }
    };
    setupHeroVideo('#inicio video');
    setupHeroVideo('#hero-contato video');
    setupHeroVideo('#hero-projetos video');
    setupHeroVideo('#hero-servicos video');
    setupHeroVideo('#hero-sobre video');

    // 5. Lógica Preservada: Filtros Dinâmicos de Projetos (projetos.html)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
      filterBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
          filterBtns.forEach((b) => {
            b.classList.remove('bg-brand-blue', 'text-white', 'shadow-sm');
            b.classList.add('bg-black/35', 'text-slate-100');
          });
          this.classList.remove('bg-black/35', 'text-slate-100');
          this.classList.add('bg-brand-blue', 'text-white', 'shadow-sm');

          const filter = this.getAttribute('data-filter');

          projectCards.forEach((card) => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.style.display = 'flex';
              if (typeof gsap !== 'undefined') {
                gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
              }
            } else {
              card.style.display = 'none';
            }
          });

          // Atualiza o ScrollTrigger após filtrar
          if (typeof window.refreshOSPScroll === 'function') {
            window.refreshOSPScroll();
          }
        });
      });
    }

    // 6. Lógica Preservada: Formulário de Contato WhatsApp (contato.html)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = document.getElementById('nome')?.value || '';
        const empresa = document.getElementById('empresa')?.value || '';
        const servico = document.getElementById('servico')?.value || '';
        const mensagem = document.getElementById('mensagem')?.value || '';
        const feedback = document.getElementById('form-feedback');

        if (feedback) {
          feedback.classList.remove('hidden');
        }

        const waText = encodeURIComponent(
          `*Demanda enviada pelo Site OSP:*\n` +
          `*Nome:* ${nome}\n` +
          (empresa ? `*Empresa:* ${empresa}\n` : '') +
          `*Serviço:* ${servico}\n` +
          `*Mensagem:* ${mensagem}`
        );

        setTimeout(function () {
          window.open(`https://wa.me/5591993623933?text=${waText}`, '_blank');
        }, 600);
      });
    }

    // 7. Lógica: Menu Hambúrguer Mobile e Dropdown
    const initMobileMenu = () => {
      const btn = document.getElementById('mobile-menu-btn');
      const menu = document.getElementById('mobile-menu');

      if (!btn || !menu) return;

      const toggleMenu = (open) => {
        if (typeof window.toggleOSPMenu === 'function') {
          window.toggleOSPMenu(open);
          return;
        }
        const isOpen = open !== undefined ? open : menu.classList.contains('hidden');
        const iconOpen = document.getElementById('hamburger-icon-open');
        const iconClose = document.getElementById('hamburger-icon-close');
        if (isOpen) {
          menu.classList.remove('hidden');
          btn.setAttribute('aria-expanded', 'true');
          if (iconOpen) iconOpen.classList.add('hidden');
          if (iconClose) iconClose.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          if (window.ospLenis) window.ospLenis.stop();
        } else {
          menu.classList.add('hidden');
          btn.setAttribute('aria-expanded', 'false');
          if (iconOpen) iconOpen.classList.remove('hidden');
          if (iconClose) iconClose.classList.add('hidden');
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          if (window.ospLenis) window.ospLenis.start();
        }
      };

      // Se o botão não possuir onclick nativo, anexa o listener
      if (!btn.getAttribute('onclick')) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMenu();
          btn.blur();
        });
      }

      // Fechar ao clicar em qualquer link interno do menu para navegação
      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          toggleMenu(false);
        });
      });

      // Fechar exclusivamente com tecla Escape (apenas teclado em desktop)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
          toggleMenu(false);
        }
      });
    };
    initMobileMenu();
  }

  // Execução após carregamento do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
