/**
 * OSP ENGENHARIA E CONSULTORIA
 * Motor de Animações GSAP & ScrollTrigger Reutilizável
 * Suporte a data-animate="fade-up | reveal | stagger | image-reveal | scale-up | line-draw"
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initAnimations() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP não encontrado. Conteúdo mantido visível.');
      document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-animated'));
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const easeExpo = 'power3.out';
    const easeSmooth = 'power2.out';

    const dedicatedSectionsSelector = '#sobre, #servicos, #segmentos-atendidos, #diferenciais, #projetos, #estatisticas';

    // 1. ANIMAÇÃO: Fade Up (Seções, Parágrafos, Blocos)
    gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
      if (el.closest(dedicatedSectionsSelector)) return;
      const delay = parseFloat(el.getAttribute('data-delay') || 0);
      const duration = parseFloat(el.getAttribute('data-duration') || 0.85);

      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: duration,
          delay: delay,
          ease: easeExpo,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
            onComplete: () => el.classList.add('is-animated')
          }
        }
      );
    });

    // 2. ANIMAÇÃO: Fade In simples
    gsap.utils.toArray('[data-animate="fade-in"]').forEach((el) => {
      if (el.closest(dedicatedSectionsSelector)) return;
      const delay = parseFloat(el.getAttribute('data-delay') || 0);
      const duration = parseFloat(el.getAttribute('data-duration') || 0.75);

      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: duration,
          delay: delay,
          ease: easeSmooth,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
            onComplete: () => el.classList.add('is-animated')
          }
        }
      );
    });

    // 3. ANIMAÇÃO: Reveal de Títulos com Máscara de Corte (Clip Path)
    gsap.utils.toArray('[data-animate="reveal"]').forEach((el) => {
      if (el.closest(dedicatedSectionsSelector)) return;
      const delay = parseFloat(el.getAttribute('data-delay') || 0);
      const duration = parseFloat(el.getAttribute('data-duration') || 0.9);

      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 24,
          clipPath: 'inset(0% 0% 100% 0%)'
        },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: duration,
          delay: delay,
          ease: easeExpo,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
            onComplete: () => el.classList.add('is-animated')
          }
        }
      );
    });

    // 4. ANIMAÇÃO: Stagger (Grupos de Cards, Badges, Indicadores)
    gsap.utils.toArray('[data-animate="stagger"]').forEach((container) => {
      if (container.closest(dedicatedSectionsSelector)) return;
      const children = container.children;
      if (!children || children.length === 0) return;

      const staggerTime = parseFloat(container.getAttribute('data-stagger') || 0.12);
      const duration = parseFloat(container.getAttribute('data-duration') || 0.8);

      gsap.fromTo(
        children,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: duration,
          stagger: staggerTime,
          ease: easeExpo,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            once: true,
            onComplete: () => {
              container.classList.add('is-animated');
              Array.from(children).forEach(c => c.classList.add('is-animated'));
            }
          }
        }
      );
    });

    // 5. ANIMAÇÃO: Revelação de Imagem Técnica (Scale Sutil + Fade)
    gsap.utils.toArray('[data-animate="image-reveal"]').forEach((wrapper) => {
      if (wrapper.closest(dedicatedSectionsSelector)) return;
      const img = wrapper.querySelector('img');
      if (!img) return;

      const duration = parseFloat(wrapper.getAttribute('data-duration') || 1.1);

      gsap.fromTo(
        img,
        { opacity: 0, scale: 1.08 },
        {
          opacity: 1,
          scale: 1,
          duration: duration,
          ease: easeExpo,
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            once: true,
            onComplete: () => {
              wrapper.classList.add('is-animated');
              img.classList.add('is-animated');
            }
          }
        }
      );
    });

    // 6. ANIMAÇÃO: Desenho de Linhas Técnicas de Blueprint
    gsap.utils.toArray('[data-animate="line-draw"]').forEach((line) => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.0,
          ease: easeExpo,
          scrollTrigger: {
            trigger: line,
            start: 'top 90%',
            once: true,
            onComplete: () => line.classList.add('is-animated')
          }
        }
      );
    });

    // 7. Microinteração do Hero na Entrada Inicial
    const heroContent = document.querySelector('#inicio .max-w-3xl') || document.querySelector('.hero-content');
    if (heroContent) {
      gsap.fromTo(
        heroContent.children,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: easeExpo,
          delay: 0.15
        }
      );
    }

    // 8. ANIMAÇÃO EXCLUSIVA: Seção 02 - Experiência e Confiança (#sobre)
    function initSobreAnimation() {
      const section = document.getElementById('sobre');
      if (!section) return;

      const textCol = section.querySelector('.lg\\:col-span-6:first-child');
      const mediaCol = section.querySelector('.lg\\:col-span-6:last-child');
      if (!textCol || !mediaCol) return;

      const badge = textCol.querySelector('.flex.items-center');
      const h2 = textCol.querySelector('h2');
      const h3 = textCol.querySelector('h3');
      const p = textCol.querySelector('p');
      const phone = textCol.querySelector('a[href^="tel"]');

      const imgCard = mediaCol.querySelector('.rounded-2xl.overflow-hidden');
      const img = mediaCol.querySelector('img');
      const frame = mediaCol.querySelector('.border-2.border-brand-blue');

      // Estado inicial preparado
      const textElements = [badge, h2, h3, p].filter(Boolean);
      gsap.set(textElements, { opacity: 0, y: 30, x: -20 });
      if (phone) gsap.set(phone, { opacity: 0, y: 20, scale: 0.94 });
      if (imgCard) gsap.set(imgCard, { opacity: 0, x: 45 });
      if (img) gsap.set(img, { opacity: 0, scale: 1.06 });
      if (frame) gsap.set(frame, { opacity: 0, scale: 0.88, x: 15, y: -15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          once: true
        },
        onComplete: () => {
          gsap.set([...textElements, phone, imgCard, img, frame].filter(Boolean), { clearProps: 'all' });
          section.classList.add('is-animated');
        }
      });

      tl.to(textElements, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out'
      });

      if (phone) {
        tl.to(phone, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: 'back.out(1.4)'
        }, '-=0.55');
      }

      if (imgCard) {
        tl.to(imgCard, {
          opacity: 1,
          x: 0,
          duration: 0.95,
          ease: 'power3.out'
        }, 0.2);
      }

      if (img) {
        tl.to(img, {
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: 'power3.out'
        }, 0.2);
      }

      if (frame) {
        tl.to(frame, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.85,
          ease: 'power2.out'
        }, 0.35);
      }
    }

    // 9. ANIMAÇÃO EXCLUSIVA: Seção 04 - Nossas Especialidades Técnicas (#servicos)
    function initEspecialidadesAnimation() {
      const section = document.getElementById('servicos');
      if (!section) return;

      const mediaCol = section.querySelector('.lg\\:col-span-5');
      const contentCol = section.querySelector('.lg\\:col-span-7');
      if (!contentCol) return;

      const imgCard = mediaCol ? mediaCol.querySelector('.rounded-2xl.overflow-hidden') : null;
      const img = mediaCol ? mediaCol.querySelector('img') : null;
      const frame = mediaCol ? mediaCol.querySelector('.border-2.border-brand-blue') : null;

      const headerBadge = contentCol.querySelector('.flex.items-center');
      const h2 = contentCol.querySelector('h2');
      const pDesc = contentCol.querySelector('p:not(.text-xs)');
      const headerElements = [headerBadge, h2, pDesc].filter(Boolean);

      const cards = contentCol.querySelectorAll('.interactive-card');

      // Estado inicial
      if (imgCard) gsap.set(imgCard, { opacity: 0, x: -45 });
      if (img) gsap.set(img, { opacity: 0, scale: 1.06 });
      if (frame) gsap.set(frame, { opacity: 0, scale: 0.88, x: -15, y: -15 });
      gsap.set(headerElements, { opacity: 0, y: 28 });
      gsap.set(cards, { opacity: 0, y: 35, scale: 0.93 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          once: true
        },
        onComplete: () => {
          gsap.set([imgCard, img, frame, ...headerElements, ...cards].filter(Boolean), { clearProps: 'all' });
          section.classList.add('is-animated');
        }
      });

      if (imgCard) {
        tl.to(imgCard, {
          opacity: 1,
          x: 0,
          duration: 0.95,
          ease: 'power3.out'
        }, 0);
      }

      if (img) {
        tl.to(img, {
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: 'power3.out'
        }, 0);
      }

      if (frame) {
        tl.to(frame, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.85,
          ease: 'power2.out'
        }, 0.15);
      }

      tl.to(headerElements, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out'
      }, 0.1);

      tl.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.09,
        ease: 'power3.out'
      }, 0.35);
    }

    // 10. ANIMAÇÃO EXCLUSIVA: Seção 05 - Distribuição de Cartas dos Projetos em Destaque
    // Os 3 cards partem geometricamente de debaixo do campo de texto e são distribuídos para seus slots
    function initCardDealingAnimation() {
      const section = document.getElementById('projetos');
      const grid = document.getElementById('featured-projects-grid');
      const header = document.getElementById('featured-projects-header');
      const cards = document.querySelectorAll('.deal-card');

      if (!grid || !header || cards.length !== 3) return;

      // Rotações orgânicas simulando cartas físicas empilhadas no baralho
      const initialRotations = [-5, 4, -3];
      let cachedDeltas = null;

      // Mede a distância geométrica real entre o header e cada card (sem transforms interferindo)
      function measureDeltas() {
        const previousTransforms = Array.from(cards).map((c) => c.style.transform);
        cards.forEach((c) => {
          c.style.transform = 'none';
        });

        const hRect = header.getBoundingClientRect();
        cachedDeltas = Array.from(cards).map((card) => {
          const cRect = card.getBoundingClientRect();
          return {
            x: hRect.left - cRect.left,
            y: hRect.top - cRect.top
          };
        });

        cards.forEach((c, i) => {
          c.style.transform = previousTransforms[i];
        });
        return cachedDeltas;
      }

      // Mede os deltas iniciais puros
      measureDeltas();

      // Prepara as cartas no monte sob o bloco de texto (invisíveis até a chegada na seção)
      gsap.set(cards, {
        x: (i) => (cachedDeltas ? cachedDeltas[i].x : -400),
        y: (i) => (cachedDeltas ? cachedDeltas[i].y : -200),
        rotation: (i) => initialRotations[i],
        scale: 0.9,
        opacity: 0
      });

      // Recalcula deltas em resize antes do disparo
      let hasTriggered = false;
      window.addEventListener('resize', () => {
        if (!hasTriggered) {
          measureDeltas();
          gsap.set(cards, {
            x: (i) => (cachedDeltas ? cachedDeltas[i].x : -400),
            y: (i) => (cachedDeltas ? cachedDeltas[i].y : -200)
          });
        }
      });

      // Timeline vinculada ao ScrollTrigger
      // Dispara SOMENTE quando o usuário chega na seção (topo da seção atinge 55% da viewport)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section || grid,
          start: 'top 55%',
          once: true,
          onEnter: () => {
            hasTriggered = true;
          }
        },
        onComplete: () => {
          // Limpa inline styles para liberar hover 3D e tilt
          gsap.set(cards, { clearProps: 'all' });
          gsap.set(header, { clearProps: 'all' });
          cards.forEach((c) => c.classList.add('is-animated'));
          header.classList.add('is-animated');
        }
      });

      // O campo de texto realiza um fade-up suave sincronizado na chegada
      tl.fromTo(
        header,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', clearProps: 'all' },
        0
      );

      // Distribui cada uma das 3 cartas saindo de baixo do texto
      cards.forEach((card, index) => {
        tl.to(
          card,
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'power3.out',
            onStart: () => {
              card.style.zIndex = 20 + (3 - index);
            }
          },
          index * 0.28 // Cadência nítida de 280ms entre cartas
        );
      });
    }

    // 11. ANIMAÇÃO EXCLUSIVA: Seção 06 - Segmentos Atendidos (#segmentos-atendidos)
    function initSegmentosAnimation() {
      const section = document.getElementById('segmentos-atendidos');
      if (!section) return;

      const header = section.querySelector('.max-w-4xl');
      const marqueeWrapper = section.querySelector('.sectors-marquee-wrapper');

      if (header) gsap.set(header.children, { opacity: 0, y: 28 });
      if (marqueeWrapper) gsap.set(marqueeWrapper, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true
        },
        onComplete: () => {
          gsap.set([header ? header.children : [], marqueeWrapper ? [marqueeWrapper] : []], { clearProps: 'opacity,visibility' });
          section.classList.add('is-animated');
        }
      });

      if (header) {
        tl.to(header.children, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out'
        }, 0);
      }

      if (marqueeWrapper) {
        tl.to(marqueeWrapper, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out'
        }, 0.2);
      }
    }

    // 12. ANIMAÇÃO EXCLUSIVA: Seção 07 - Diferenciais Estratégicos (#diferenciais)
    function initDiferenciaisAnimation() {
      const section = document.getElementById('diferenciais');
      if (!section) return;

      const header = section.querySelector('.max-w-2xl');
      const cards = section.querySelectorAll('.interactive-card');
      const floatingIcons = section.querySelectorAll('.interactive-card .absolute.-top-7');

      if (header) gsap.set(header.children, { opacity: 0, y: 28 });
      const initialRotations = [-3, 0, 3];
      cards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 55, scale: 0.92, rotation: initialRotations[i] || 0 });
      });
      gsap.set(floatingIcons, { opacity: 0, scale: 0, rotation: -15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          once: true
        },
        onComplete: () => {
          gsap.set([header ? header.children : [], ...cards, ...floatingIcons], { clearProps: 'all' });
          section.classList.add('is-animated');
        }
      });

      if (header) {
        tl.to(header.children, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out'
        }, 0);
      }

      cards.forEach((card, i) => {
        tl.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1.05,
          ease: 'power3.out'
        }, 0.2 + (i * 0.16));
      });

      floatingIcons.forEach((icon, i) => {
        tl.to(icon, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.75,
          ease: 'back.out(1.8)'
        }, 0.45 + (i * 0.16));
      });
    }

    // 13. ANIMAÇÃO EXCLUSIVA: Seção de Estatísticas e Métricas (#estatisticas) - Count-Up Dinâmico
    function initEstatisticasAnimation() {
      const section = document.getElementById('estatisticas');
      if (!section) return;

      const statNumbers = section.querySelectorAll('.stat-number');
      const statItems = section.querySelectorAll('.stat-item');
      if (!statNumbers.length) return;

      // Inicializa os números com zero
      statNumbers.forEach((el) => {
        const prefix = el.getAttribute('data-prefix') || '';
        el.textContent = prefix + '0';
      });

      // Configura animação de entrada sutil dos itens com fade/slide
      if (statItems.length) {
        gsap.set(statItems, { opacity: 0, y: 30 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true
        },
        onComplete: () => {
          if (statItems.length) {
            gsap.set(statItems, { clearProps: 'transform,opacity' });
          }
          section.classList.add('is-animated');
        }
      });

      if (statItems.length) {
        tl.to(statItems, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out'
        }, 0);
      }

      // Animação dos contadores numéricos (Count-Up de 0 até o valor final)
      statNumbers.forEach((el, index) => {
        const prefix = el.getAttribute('data-prefix') || '';
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const counter = { val: 0 };

        tl.to(counter, {
          val: target,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix + Math.floor(counter.val);
          },
          onComplete: () => {
            el.textContent = prefix + target;
          }
        }, 0.15 + (index * 0.08));
      });
    }

    // Inicialização orquestrada de cada seção principal da Home
    initSobreAnimation();
    initEspecialidadesAnimation();
    initCardDealingAnimation();
    initSegmentosAnimation();
    initDiferenciaisAnimation();
    initEstatisticasAnimation();

    // Sincroniza e atualiza posições dos triggers
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // Registra globalmente
  window.initOSPAnimations = initAnimations;
})();
