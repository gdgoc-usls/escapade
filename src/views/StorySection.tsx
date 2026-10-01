import type { CSSProperties } from 'react'
import dashboardBg from '../assets/dashboard_bg.png'
import asset from '../assets/asset.png'
import mascot from '../assets/mascot.png'

function HudCorner({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute w-[calc(var(--u)*35.5)] aspect-[328/96] ${className}`}>
      <img
        src={asset}
        alt=""
        className="absolute left-1/2 top-1/2 w-[29.27%] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-90"
      />
    </div>
  )
}

export function StorySection() {
  return (
    <section
      id="story"
      className="relative h-screen w-full overflow-hidden border-t border-white/10 text-white bg-cover bg-center"
      style={
        {
          backgroundImage: `url(${dashboardBg})`,
          '--nav-h': '100px',
          '--u': 'calc((100svh - var(--nav-h)) / 100)',
        } as CSSProperties
      }
    >
      {/* Stage: the visible area under the navbar */}
      <div className="absolute inset-x-0 bottom-0 top-[var(--nav-h)]">
        {/* HUD corners */}
        <HudCorner className="left-[0.8%] top-[2%]" />
        <HudCorner className="right-[0.9%] top-[2%] -scale-x-100" />
        <HudCorner className="left-[0.8%] bottom-[2%] -scale-y-100" />
        <HudCorner className="right-[0.9%] bottom-[2%] -scale-100" />

        {/* Text */}
        <div className="absolute left-[6.9%] top-[24.5%] z-10 font-orbitron leading-none">
          <h2 className="text-[length:calc(var(--u)*7.2)] font-black">
            M<span className="font-light">|</span>
          </h2>
          <p className="mt-[calc(var(--u)*3.3)] text-[length:calc(var(--u)*3)] font-light">
            A<span className="font-light">|</span>
          </p>
        </div>

        {/* Main mascot */}
        <img
          src={mascot}
          alt="Mascot"
          className="pointer-events-none absolute left-[76.25%] top-[49.6%] w-[calc(var(--u)*134)] max-w-none -translate-x-1/2 -translate-y-1/2"
        />

        {/* Small floating mascots */}
        <img
          src={mascot}
          alt=""
          className="pointer-events-none absolute left-[56.9%] top-[41.8%] w-[calc(var(--u)*23)] max-w-none -translate-x-1/2 -translate-y-1/2"
        />
        <img
          src={mascot}
          alt=""
          className="pointer-events-none absolute left-[94.7%] top-[33.6%] w-[calc(var(--u)*22.8)] max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </section>
  )
}