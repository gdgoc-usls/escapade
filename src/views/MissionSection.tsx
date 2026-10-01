import type { CSSProperties } from 'react'
import { ScrollReveal } from '../components/ScrollReveal'
import boothPromotion from '../assets/BoothPromotion.png'

export function MissionSection() {
  return (
    <section
      id="mission"
      className="relative w-full scroll-mt-[var(--nav-h)] border-t border-white/10 text-white text-center"
      style={{ '--nav-h': '100px' } as CSSProperties}
    >
      {/* Wrapper takes the image's own height, so nothing is cropped */}
      <div className="relative w-full">
        <img
          src={boothPromotion}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="block h-auto w-full select-none"
        />

        {/* Content layered over the image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-orbitron font-black text-white uppercase tracking-widest">
              Mission
            </h2>
          </ScrollReveal>
          <ScrollReveal delay="150ms">
            <p className="mt-6 text-white text-xs sm:text-sm md:text-lg lg:text-2xl font-orbitron font-bold tracking-wider">
              [ Mission Section Placeholder ]
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}