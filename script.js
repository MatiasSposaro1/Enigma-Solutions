/* ═══════════════════════════════════════════
   Enigma Solutions — JavaScript Principal
   ═══════════════════════════════════════════ */
import { ContactFormController } from './assets/js/contact-form.js'

;(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // ─── Referencias del DOM ───────────────────
    const navbar = document.getElementById('navbar')
    const sidebarToggle = document.getElementById('sidebarToggle')
    const sidebar = document.getElementById('sidebar')
    const sidebarClose = document.getElementById('sidebarClose')
    const sidebarOverlay = document.getElementById('sidebarOverlay')
    const sidebarLinks = document.querySelectorAll('.sidebar-link')
    const navLinks = document.querySelectorAll('.nav-link')
    const backToTop = document.getElementById('backToTop')
    const contactForm = document.getElementById('contactForm')
    const particlesContainer = document.getElementById('particles')
    const preloader = document.getElementById('preloader')

    // ─── Preloader ─────────────────────────────
    window.addEventListener('load', () => {
      if (preloader) {
        setTimeout(() => {
          preloader.classList.add('hidden')
          document.body.classList.remove('loading')
        }, 1200)
      }
    })

    // ─── Sidebar Izquierdo ─────────────────────
    function openSidebar() {
      sidebar.classList.add('active')
      sidebarOverlay.classList.add('active')
      sidebarToggle.classList.add('active')
      document.body.classList.add('sidebar-open')
    }

    function closeSidebar() {
      sidebar.classList.remove('active')
      sidebarOverlay.classList.remove('active')
      sidebarToggle.classList.remove('active')
      document.body.classList.remove('sidebar-open')
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
          closeSidebar()
        } else {
          openSidebar()
        }
      })
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar)
    }

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeSidebar)
    }

    // Cerrar sidebar al hacer clic en un enlace
    sidebarLinks.forEach((link) => {
      link.addEventListener('click', closeSidebar)
    })

    // Cerrar sidebar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebar()
      }
    })

    // ─── Hero Slider ───────────────────────────
    const slides = document.querySelectorAll('.hero-slide')
    const dots = document.querySelectorAll('.slider-dot')
    const bgImgs = document.querySelectorAll('.hero-bg-img')
    const progressBar = document.querySelector('.slider-progress-bar')
    let currentSlide = 0
    let slideInterval
    const SLIDE_DURATION = 6000
    let slideStartTime

    function goToSlide(index) {
      slides.forEach((s) => s.classList.remove('active'))
      dots.forEach((d) => d.classList.remove('active'))
      bgImgs.forEach((b) => b.classList.remove('active'))
      currentSlide = index
      slides[currentSlide].classList.add('active')
      dots[currentSlide].classList.add('active')
      if (bgImgs[currentSlide]) bgImgs[currentSlide].classList.add('active')
      slideStartTime = Date.now()
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length)
    }

    function startSlider() {
      slideStartTime = Date.now()
      slideInterval = setInterval(nextSlide, SLIDE_DURATION)
    }

    function updateProgress() {
      if (!progressBar || slides.length === 0) return
      const elapsed = Date.now() - slideStartTime
      const progress = Math.min((elapsed / SLIDE_DURATION) * 100, 100)
      progressBar.style.width = progress + '%'
      requestAnimationFrame(updateProgress)
    }

    if (slides.length > 0) {
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          clearInterval(slideInterval)
          goToSlide(index)
          startSlider()
        })
      })

      startSlider()
      requestAnimationFrame(updateProgress)
    }

    // ─── Carrusel de Servicios ─────────────────
    const servicesTrack = document.getElementById('servicesTrack')
    const servicesPrev = document.getElementById('servicesPrev')
    const servicesNext = document.getElementById('servicesNext')
    const servicesDots = document.querySelectorAll('.services-dot')

    if (servicesTrack) {
      const cards = servicesTrack.querySelectorAll('.service-card')
      const CARDS_VISIBLE =
        window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1
      const totalCards = cards.length // 6
      const maxIndex = totalCards - CARDS_VISIBLE // cuánto se puede desplazar
      const AUTO_DELAY = 5000 // 5 segundos
      let currentIndex = 0
      let autoInterval

      // Calcula el ancho de una card + gap y devuelve el offset en px
      function getOffset(index) {
        const card = cards[0]
        const gap = parseInt(getComputedStyle(servicesTrack).gap) || 24
        return index * (card.offsetWidth + gap)
      }

      // Mueve el track al index indicado y actualiza los dots
      function goToService(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex))
        servicesTrack.style.transform = `translateX(-${getOffset(currentIndex)}px)`

        servicesDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex)
        })
      }

      // Avanza al siguiente (loop al inicio cuando llega al final)
      function nextService() {
        goToService(currentIndex >= maxIndex ? 0 : currentIndex + 1)
      }

      // Retrocede al anterior (loop al final cuando está al inicio)
      function prevService() {
        goToService(currentIndex <= 0 ? maxIndex : currentIndex - 1)
      }

      // Inicia el auto-avance
      function startServicesAuto() {
        autoInterval = setInterval(nextService, AUTO_DELAY)
      }

      // Reinicia el auto-avance tras interacción manual
      function resetServicesAuto() {
        clearInterval(autoInterval)
        startServicesAuto()
      }

      // Eventos de flechas
      if (servicesPrev) {
        servicesPrev.addEventListener('click', () => {
          prevService()
          resetServicesAuto()
        })
      }
      if (servicesNext) {
        servicesNext.addEventListener('click', () => {
          nextService()
          resetServicesAuto()
        })
      }

      // Eventos de dots
      servicesDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          goToService(i)
          resetServicesAuto()
        })
      })

      // Pausa al pasar el mouse por encima
      servicesTrack.addEventListener('mouseenter', () =>
        clearInterval(autoInterval),
      )
      servicesTrack.addEventListener('mouseleave', startServicesAuto)

      startServicesAuto()
    }

    // ─── Navbar Scroll ─────────────────────────
    function handleNavScroll() {
      const currentScroll = window.scrollY

      if (currentScroll > 50) {
        navbar.classList.add('scrolled')
      } else {
        navbar.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true })

    // ─── Enlace Activo según Scroll ────────────
    const sections = document.querySelectorAll('section[id]')
    const allNavItems = [...navLinks, ...sidebarLinks]

    function updateActiveLink() {
      const scrollPos = window.scrollY + 120

      sections.forEach((section) => {
        const top = section.offsetTop
        const height = section.offsetHeight
        const id = section.getAttribute('id')

        if (scrollPos >= top && scrollPos < top + height) {
          allNavItems.forEach((link) => {
            link.classList.remove('active')
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active')
            }
          })
        }
      })
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true })

    // ─── Botón Volver Arriba ───────────────────
    function handleBackToTop() {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible')
      } else {
        backToTop.classList.remove('visible')
      }
    }

    window.addEventListener('scroll', handleBackToTop, { passive: true })

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }

    // ─── Animaciones al Scroll (Intersection Observer) ───
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })

    // ─── Process Line Animation ────────────────
    const processLine = document.getElementById('processLine')
    if (processLine) {
      const lineAfter = processLine
      const processTimeline = processLine.closest('.process-timeline')

      function updateProcessLine() {
        if (!processTimeline) return
        const rect = processTimeline.getBoundingClientRect()
        const timelineTop = rect.top
        const timelineHeight = rect.height
        const windowHeight = window.innerHeight

        if (timelineTop < windowHeight && timelineTop + timelineHeight > 0) {
          const visible = Math.min(windowHeight - timelineTop, timelineHeight)
          const percent = Math.max(0, Math.min(1, visible / timelineHeight))
          lineAfter.style.setProperty('--line-height', percent * 100 + '%')
        }
      }

      // Use CSS custom property for the line height
      const style = document.createElement('style')
      style.textContent = `
            #processLine::after {
                height: var(--line-height, 0%) !important;
            }
        `
      document.head.appendChild(style)

      window.addEventListener('scroll', updateProcessLine, { passive: true })
    }

    // ─── Contador Animado (Stats Banner) ───────
    function animateCounters() {
      const counters = document.querySelectorAll('.stat-number[data-target]')

      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10)
        const duration = 2000
        const startTime = performance.now()

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Easing out cubic
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = Math.round(eased * target)

          counter.textContent = current

          if (progress < 1) {
            requestAnimationFrame(updateCounter)
          }
        }

        requestAnimationFrame(updateCounter)
      })
    }

    // Activar contadores cuando stats-banner sea visible
    const statsBanner = document.querySelector('.stats-banner')
    if (statsBanner) {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounters()
              statsObserver.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.3 },
      )

      statsObserver.observe(statsBanner)
    }

    // ─── Partículas del Hero ───────────────────
    function createParticles() {
      if (!particlesContainer) return

      // Menos partículas en mobile para rendimiento
      const isMobile = window.innerWidth < 768
      const count = isMobile ? 15 : 40

      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div')
        particle.classList.add('particle')

        const size = Math.random() * 4 + 1
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`
        particle.style.left = `${Math.random() * 100}%`
        particle.style.animationDuration = `${Math.random() * 8 + 6}s`
        particle.style.animationDelay = `${Math.random() * 5}s`
        particle.style.opacity = Math.random() * 0.6 + 0.1

        const colors = [
          'rgba(59, 130, 246, 0.5)',
          'rgba(6, 182, 212, 0.4)',
          'rgba(99, 102, 241, 0.4)',
          'rgba(139, 92, 246, 0.3)',
        ]
        particle.style.background =
          colors[Math.floor(Math.random() * colors.length)]

        particlesContainer.appendChild(particle)
      }
    }

    createParticles()

    // ─── Contact Form ──────────────────────────
    if (contactForm) {
      new ContactFormController(contactForm)
    }

    // ─── Newsletter Form ───────────────────────
    const newsletterForm = document.getElementById('newsletterForm')
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const emailInput = newsletterForm.querySelector('input[type="email"]')
        if (emailInput && isValidEmail(emailInput.value.trim())) {
          const btn = newsletterForm.querySelector('button')
          const original = btn.innerHTML
          btn.innerHTML = '<i class="fas fa-check"></i> ¡Suscripto!'
          btn.disabled = true
          emailInput.value = ''
          setTimeout(() => {
            btn.innerHTML = original
            btn.disabled = false
          }, 3000)
        }
      })
    }

    // ─── Smooth Scroll para enlaces internos ───
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href')
        if (targetId === '#') return

        const target = document.querySelector(targetId)
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: 'smooth' })
        }
      })
    })
  })
})()
