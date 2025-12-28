'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const primaryButtonRef = useRef<HTMLAnchorElement>(null)
  const secondaryButtonRef = useRef<HTMLButtonElement>(null)
  const bgElementsRef = useRef<HTMLDivElement>(null)
  const mouseFollowerRef = useRef<HTMLDivElement>(null)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Mouse follower effect
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
        if (mouseFollowerRef.current) {
          gsap.to(mouseFollowerRef.current, {
            x: e.clientX - 50,
            y: e.clientY - 50,
            duration: 0.5,
            ease: "power2.out"
          })
        }
      }
      window.addEventListener('mousemove', handleMouseMove)

      // Set initial states
      gsap.set([badgeRef.current, titleRef.current, subtitleRef.current, descriptionRef.current, statsRef.current, primaryButtonRef.current, secondaryButtonRef.current], {
        opacity: 0,
        y: 60
      })

      gsap.set(bgElementsRef.current?.children || [], {
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 360
      })

      // Create main timeline with shorter delay
      const tl = gsap.timeline({ delay: 0.2 })

      // Background elements with faster animation
      tl.to(bgElementsRef.current?.children || [], {
        opacity: 0.08,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "elastic.out(1, 0.3)"
      })

      // Badge animation - faster
      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      })

      // Title with letter animation effect - even faster
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power4.out"
      }, "-=0.1")

      // Subtitle with slide effect - faster
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out"
      }, "-=0.8")

      // Description with fade effect - faster
      tl.to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.6")

      // Stats animation - faster
      tl.to(statsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.4")

      // Buttons with staggered entrance - faster
      tl.to(primaryButtonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=0.3")

      tl.to(secondaryButtonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=0.3")

      // Continuous background animations
      gsap.to(bgElementsRef.current?.children || [], {
        rotation: '+=360',
        duration: 25,
        ease: "none",
        repeat: -1,
        stagger: 1
      })

      // Floating animation with different patterns
      Array.from(bgElementsRef.current?.children || []).forEach((element, index) => {
        gsap.to(element, {
          y: `+=${20 + index * 10}`,
          duration: 3 + index * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.2
        })
      })

      // Pulse effect for some elements
      const thirdElement = bgElementsRef.current?.children[2]
      if (thirdElement) {
        gsap.to(thirdElement, {
          scale: 1.2,
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        })
      }

      // Interactive button animations
      const primaryButton = primaryButtonRef.current
      const secondaryButton = secondaryButtonRef.current

      if (primaryButton) {
        primaryButton.addEventListener('mouseenter', () => {
          gsap.to(primaryButton, {
            scale: 1.05,
            y: -2,
            duration: 0.3,
            ease: "power2.out"
          })
          gsap.to(primaryButton.querySelector('.button-glow'), {
            opacity: 1,
            scale: 1.2,
            duration: 0.3
          })
        })

        primaryButton.addEventListener('mouseleave', () => {
          gsap.to(primaryButton, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          })
          gsap.to(primaryButton.querySelector('.button-glow'), {
            opacity: 0,
            scale: 1,
            duration: 0.3
          })
        })
      }

      if (secondaryButton) {
        secondaryButton.addEventListener('mouseenter', () => {
          gsap.to(secondaryButton, {
            scale: 1.03,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            duration: 0.3,
            ease: "power2.out"
          })
        })

        secondaryButton.addEventListener('mouseleave', () => {
          gsap.to(secondaryButton, {
            scale: 1,
            backgroundColor: 'transparent',
            duration: 0.3,
            ease: "power2.out"
          })
        })
      }

      // Text reveal animation for the main title
      const titleText = titleRef.current?.textContent || ''
      if (titleRef.current) {
        const letters = titleText.split('')
        titleRef.current.innerHTML = letters.map(letter =>
          letter === ' ' ? '<span>&nbsp;</span>' : `<span class="letter">${letter}</span>`
        ).join('')

        gsap.fromTo('.letter', {
          opacity: 0,
          y: 20,
          rotateY: -90
        }, {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "back.out(1.7)",
          delay: 1
        })
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={heroRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Mouse Follower */}
      <div
        ref={mouseFollowerRef}
        className="fixed w-24 h-24 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl pointer-events-none z-0"
        style={{ transform: 'translate(-50%, -50%)' }}
      ></div>

      {/* Animated Background Elements */}
      <div ref={bgElementsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-pink-400/25 to-indigo-400/25 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-r from-indigo-400/25 to-pink-400/25 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-lg"></div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">

          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-indigo-300 text-sm font-medium">✨ IA de Última Generación</span>
          </div>

          {/* Main Title */}
          <h1
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-tight"
          >
            PopKorn AI
          </h1>

          {/* Subtitle */}
          <h2
            ref={subtitleRef}
            className="text-3xl md:text-5xl lg:text-6xl font-light bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent mb-8"
          >
            Revoluciona Tu Marketing Digital
          </h2>

          {/* Description */}
          <p
            ref={descriptionRef}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Crea campañas publicitarias que convierten con Inteligencia Artificial avanzada.
            Automatiza tu presencia en redes sociales y escala tu negocio de manera inteligente.
          </p>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">10x</div>
              <div className="text-indigo-300 text-sm">Más Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</div>
              <div className="text-indigo-300 text-sm">Automatización</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">∞</div>
              <div className="text-indigo-300 text-sm">Creatividad</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              ref={primaryButtonRef}
              href="/campaign"
              className="group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-5 px-10 rounded-2xl text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">🚀 Comenzar Ahora</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 button-glow"></div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
            </Link>

            <button
              ref={secondaryButtonRef}
              className="group relative border-2 border-indigo-400/50 text-indigo-300 font-semibold py-5 px-10 rounded-2xl text-xl backdrop-blur-sm hover:border-indigo-400 transition-all duration-300"
            >
              <span className="relative z-10">Ver Demo Interactiva</span>
            </button>
          </div>

          

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-6">Confían en nosotros las mejores marcas</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-white font-bold text-lg">🏢 Enterprise</div>
              <div className="text-white font-bold text-lg">🚀 Startups</div>
              <div className="text-white font-bold text-lg">💼 Freelancers</div>
              <div className="text-white font-bold text-lg">🏪 E-commerce</div>
            </div>
          </div>

        </div>
      </div>

      
    </main>
  )
}
