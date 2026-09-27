/**
 * OSP ENGENHARIA E CONSULTORIA
 * Módulo de Microinterações Tecnológicas & Feedback Tátil
 */

(function () {
  'use strict';

  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initInteractions() {
    if (prefersReducedMotion) return;

    // 1. Efeito 3D Tilt Sutil em Cards Técnicos (Apenas desktop com cursor preciso)
    if (!isTouchDevice() && typeof gsap !== 'undefined') {
      const cards = document.querySelectorAll('.interactive-card');

      cards.forEach((card) => {
        let bounds;

        function mouseMove(e) {
          if (!bounds) bounds = card.getBoundingClientRect();
          const mouseX = e.clientX - bounds.left;
          const mouseY = e.clientY - bounds.top;

          const xPct = (mouseX / bounds.width - 0.5) * 2; // -1 a 1
          const yPct = (mouseY / bounds.height - 0.5) * 2; // -1 a 1

          // Limite máximo muito discreto de 3.5 graus
          gsap.to(card, {
            rotationY: xPct * 3.5,
            rotationX: -yPct * 3.5,
            transformPerspective: 900,
            duration: 0.35,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        }

        function mouseEnter() {
          bounds = card.getBoundingClientRect();
          document.addEventListener('mousemove', mouseMove);
        }

        function mouseLeave() {
          document.removeEventListener('mousemove', mouseMove);
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.65,
            ease: 'power3.out',
            overwrite: 'auto'
          });
          bounds = null;
        }

        card.addEventListener('mouseenter', mouseEnter);
        card.addEventListener('mouseleave', mouseLeave);
      });
    }

    // 2. Microinteração para Botão Flutuante de WhatsApp
    const waButton = document.querySelector('aside[aria-label="Acesso rápido WhatsApp"] a');
    if (waButton && typeof gsap !== 'undefined' && !prefersReducedMotion) {
      // Pulso sutil de atenção a cada 6 segundos
      gsap.timeline({ repeat: -1, repeatDelay: 6.5 })
        .to(waButton, { scale: 1.08, duration: 0.25, ease: 'power1.out' })
        .to(waButton, { scale: 1.0, duration: 0.35, ease: 'power2.inOut' })
        .to(waButton, { scale: 1.05, duration: 0.2, ease: 'power1.out' })
        .to(waButton, { scale: 1.0, duration: 0.3, ease: 'power2.inOut' });
    }
  }

  // Função utilitária para atualizar ScrollTrigger em mudanças dinâmicas (ex: filtros de projetos)
  window.refreshOSPScroll = function () {
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    }
  };

  window.initOSPInteractions = initInteractions;
})();
