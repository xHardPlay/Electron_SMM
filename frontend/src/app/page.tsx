'use client'

import { gsap } from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const welcomeRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states for hero elements
    gsap.set([logoRef.current, titleRef.current, welcomeRef.current], {
      opacity: 0,
      y: 50
    })

    // Set initial states for buttons (individual elements)
    gsap.set(buttonsRef.current?.children || [], {
      opacity: 0,
      y: 50
    })

    // Set initial states for features and footer
    gsap.set(featuresRef.current?.children || [], {
      opacity: 0,
      x: -100,
      rotation: -5
    })
    gsap.set(footerRef.current, {
      opacity: 0,
      y: 30
    })

    // Welcome message animation
    tl.to(welcomeRef.current, {
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

    // Title slide up with stagger
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5")

    // Buttons stagger animation
    .to(buttonsRef.current?.children || [], {
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

  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p
          ref={welcomeRef}
          className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-in-200/30 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
        >
          Welcome to AgencySMM
        </p>
      </div>

      <div ref={heroRef} className="relative flex place-items-center flex-col">
        <Link
          href="https://clearfuturecs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            ref={logoRef}
            src="https://assets.cdn.filesafe.space/jOHIRKxHby1MsnSq2OwP/media/688cc5a00b03e1cc23405f1b.svg"
            alt="Company Logo"
            className="w-32 h-32 mb-4 border-2 border-black ring-2 ring-red-500 cursor-pointer"
            style={{ transform: 'scale(0.8)' }}
          />
        </Link>
        <h1 ref={titleRef} className="text-4xl font-bold mb-8">
          AgencySMM - Marketing Tool
        </h1>
        <div ref={buttonsRef} className="flex gap-4">
          <Link
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            href="/register"
          >
            Register →
          </Link>
          <Link
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            href="/login"
          >
            Login →
          </Link>
        </div>
      </div>

      <div ref={featuresRef} className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Account
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Create your account and get started.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Workspaces
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Manage your marketing workspaces.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Brand Discovery
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Analyze brands with AI.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Ad Creation
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Generate ads using AI characters.
          </p>
        </div>
      </div>

      <div ref={footerRef} className="text-center text-sm text-gray-500">
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
    </main>
  )
}
