'use client'

import React, { useEffect, useRef, useState } from 'react'

type AnimatedLogoProps = {
  darkSrc: string
  lightSrc: string
  alt?: string
  href?: string
  className?: string
}

function isColorDark(rgbString: string | null): boolean | null {
  if (!rgbString) return null

  const match = rgbString
    .replace(/\s+/g, '')
    .match(/^rgba?\((\d+),(\d+),(\d+)(?:,(0|0?\.\d+|1))?\)$/i)

  if (!match) return null

  const r = parseInt(match[1], 10) / 255
  const g = parseInt(match[2], 10) / 255
  const b = parseInt(match[3], 10) / 255

  const [rl, gl, bl] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  )

  const luminance = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl

  return luminance < 0.5
}

export function AnimatedLogo({
  darkSrc,
  lightSrc,
  alt = 'Kiosco',
  href = '/',
  className = '',
}: AnimatedLogoProps) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null)
  const [useLightVariant, setUseLightVariant] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateFromBackground = () => {
      if (!anchorRef.current) return

      const header =
        anchorRef.current.closest('header') ?? anchorRef.current.parentElement

      if (!header) return

      const style = window.getComputedStyle(header)
      const bgColor = style.backgroundColor

      const dark = isColorDark(bgColor)

      if (dark === null) {
        setUseLightVariant(false)
        return
      }

      setUseLightVariant(dark)
    }

    const handleScroll = () => {
      window.requestAnimationFrame(updateFromBackground)
    }

    updateFromBackground()

    window.addEventListener('scroll', handleScroll, { passive: true })

    const observerTarget = anchorRef.current?.closest('header')

    let observer: IntersectionObserver | null = null

    if (observerTarget && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(() => {
        updateFromBackground()
      })

      observer.observe(observerTarget)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (observer && observerTarget) {
        observer.unobserve(observerTarget)
        observer.disconnect()
      }
    }
  }, [])

  return (
    <a
      ref={anchorRef}
      href={href}
      className={`relative inline-block h-5 md:h-6 anim-cursor-scale hover:text-stone-100 transition-colors ${className}`}
      aria-label={alt}
    >
      <span className="relative inline-flex h-full items-center">
        <img
          src={darkSrc}
          alt={alt}
          className={`pointer-events-none absolute inset-0 h-full w-auto object-contain transition-opacity duration-300 ${
            useLightVariant ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={lightSrc}
          alt={alt}
          className={`pointer-events-none absolute inset-0 h-full w-auto object-contain transition-opacity duration-300 ${
            useLightVariant ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </span>
    </a>
  )
}

