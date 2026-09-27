/**
 * OSP ENGENHARIA E CONSULTORIA
 * Módulo de Scroll Suave (Lenis) & Sincronização com GSAP ScrollTrigger
 */

(function () {
  'use strict';

  // Verifica preferência de acessibilidade do usuário
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lenisInstance = null;

  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') {
      initSmartHeader(null);
      return null;
    }

    try {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 1.5,
        infinite: false
      });

      // Sincronização perfeita com GSAP ScrollTrigger se disponível
      if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        lenisInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } else {
        // Fallback para loop de animação nativo
        function raf(time) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      // Exposição global para chamadas de ancoragem ou atualização
      window.ospLenis = lenisInstance;

      // Suporte para cliques em links âncora internos
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              e.preventDefault();
              lenisInstance.scrollTo(targetEl, { offset: -70 });
            }
          }
        });
      });

      initSmartHeader(lenisInstance);
      return lenisInstance;
    } catch (err) {
      console.warn('Erro ao inicializar Lenis Smooth Scroll:', err);
      initSmartHeader(null);
      return null;
    }
  }

  /**
   * Smart Header sincronizado
   * Esconde suavemente ao rolar para baixo, reaparece ao rolar para cima
   */
  function initSmartHeader(lenis) {
    const header = document.getElementById('main-header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    function handleScroll(currentY) {
      // Se o menu mobile estiver aberto, NUNCA esconde o header ao rolar ou deslizar
      const menu = document.getElementById('mobile-menu');
      if (menu && !menu.classList.contains('hidden')) {
        header.style.transform = 'translate3d(0, 0, 0)';
        return;
      }

      if (currentY > lastScrollY && currentY > 120) {
        header.style.transform = 'translate3d(0, -100%, 0)';
      } else {
        header.style.transform = 'translate3d(0, 0, 0)';
      }
      lastScrollY = currentY;
    }

    if (lenis) {
      lenis.on('scroll', (e) => {
        handleScroll(e.scroll);
      });
    } else {
      window.addEventListener('scroll', () => {
        handleScroll(window.scrollY);
      }, { passive: true });
    }
  }

  // Registra no escopo global
  window.initOSPScroll = initSmoothScroll;
})();
