'use client'

import React from 'react'

type AnimatedLogoProps = {
  lightSrc: string
  alt?: string
  href?: string
  className?: string
}

export function AnimatedLogo({
  lightSrc,
  alt = 'Kiosco',
  href = '/',
  className = '',
}: AnimatedLogoProps) {
  return (
    <a
      href={href}
      className={`relative inline-block h-6 md:h-8 anim-cursor-scale transition-transform ${className}`}
      aria-label={alt}
    >
      <span className="relative inline-flex h-full items-center">
        <img
          src={lightSrc}
          alt={alt}
          className="pointer-events-none block h-full w-auto object-contain"
        />
      </span>
    </a>
  )
}

