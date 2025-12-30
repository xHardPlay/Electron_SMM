'use client'

import { gsap } from 'gsap'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Hide everything initially to prevent flash
    gsap.set([
      logoRef.current,
      titleRef.current,
      buttonsRef.current?.children || [],
      featuresRef.current?.children || [],
      footerRef.current
    ], {
      opacity: 0
    })

    // Simulate loading time or wait for assets
    const timer = setTimeout(() => {
      setIsLoaded(true)
      startAnimation()
    }, 500) // Small delay to ensure DOM is ready

    return () => clearTimeout(timer)
  }, [])

  const startAnimation = () => {
    const tl = gsap.timeline()

    // Set initial animation states
    gsap.set([logoRef.current, titleRef.current], {
      y: 50
    })

    gsap.set(buttonsRef.current?.children || [], {
      y: 50
    })

    gsap.set(featuresRef.current?.children || [], {
      x: -100,
      rotation: -5
    })

    gsap.set(footerRef.current, {
      y: 30
    })

    // Title animation first
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })

    // Logo animation with bounce
    .to(logoRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)"
    }, "-=0.3")

    // Buttons stagger animation
    tl.to(buttonsRef.current?.children || [], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.3")

    // Features cards animation with stagger from sides
    .to(featuresRef.current?.children || [], {
      opacity: 1,
      x: 0,
      rotation: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=0.2")

    // Footer animation
    .to(footerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.3")

    // Add hover animations for logo
    if (logoRef.current) {
      logoRef.current.addEventListener('mouseenter', () => {
        gsap.to(logoRef.current, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: "power2.out"
        })
      })

      logoRef.current.addEventListener('mouseleave', () => {
        gsap.to(logoRef.current, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        })
      })
    }

    // Add hover animations for feature cards
    const featureCards = featuresRef.current?.children
    if (featureCards) {
      Array.from(featureCards).forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -5,
            duration: 0.3,
            ease: "power2.out"
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          })
        })
      })
    }

    // Add continuous subtle animation for the main container
    gsap.to(heroRef.current, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2
    })
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section - Full height with better spacing */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div ref={heroRef} className="relative flex flex-col items-center text-center max-w-6xl mx-auto">
          <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black mb-6 sm:mb-8 lg:mb-12 leading-tight">
            <span className="text-black">Agency</span>
            <span className="text-red-600"> SMM</span>
            <span className="text-black"> - </span>
            <span className="text-red-600">Marketing </span>
            <span className="text-black">Tool</span>
          </h1>

          <Link
            href="https://clearfuturecs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 sm:mb-12"
          >
            <img
              ref={logoRef}
              src="https://assets.cdn.filesafe.space/jOHIRKxHby1MsnSq2OwP/media/688cc5a00b03e1cc23405f1b.svg"
              alt="Company Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-2 border-black ring-2 ring-red-500 cursor-pointer transition-transform hover:scale-105"
              style={{ transform: 'scale(0.8)' }}
            />
          </Link>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link
              className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-center text-lg"
              href="/register"
            >
              Register →
            </Link>
            <Link
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-center text-lg"
              href="/login"
            >
              Login →
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section - Better spacing and responsive */}
      <div ref={featuresRef} className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        <div className="group rounded-lg border border-slate-200 bg-white px-6 py-6 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold text-slate-800">
            Account
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70 text-slate-600">
            Create your account and get started.
          </p>
        </div>

        <div className="group rounded-lg border border-slate-200 bg-white px-6 py-6 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold text-slate-800">
            Workspaces
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70 text-slate-600">
            Manage your marketing workspaces.
          </p>
        </div>

        <div className="group rounded-lg border border-slate-200 bg-white px-6 py-6 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold text-slate-800">
            Brand Discovery
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70 text-slate-600">
            Analyze brands with AI.
          </p>
        </div>

        <div className="group rounded-lg border border-slate-200 bg-white px-6 py-6 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold text-slate-800">
            Ad Creation
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70 text-slate-600">
            Generate ads using AI characters.
          </p>
        </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <div ref={footerRef} className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>
            Created on 28-12-2025 •{' '}
            <Link
              href="https://clearfuturecs.com/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Clear Future CS
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
