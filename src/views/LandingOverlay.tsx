import { useState, useEffect } from 'react'
import spaceBg3 from '../assets/green_planet.png'

interface LandingOverlayProps {
  onEnter: () => void
}

export function LandingOverlay({ onEnter }: LandingOverlayProps) {
  const [typedButtonText, setTypedButtonText] = useState('')
  const [isExiting, setIsExiting] = useState(false)
  const [bgLoaded, setBgLoaded] = useState(false)
  const fullButtonText = 'BEGIN MISSION'

  // Preload the background image immediately so it's ready before content fades in
  useEffect(() => {
    const img = new Image()
    img.src = spaceBg3
    if (img.complete) {
      setBgLoaded(true)
    } else {
      img.onload = () => setBgLoaded(true)
      img.onerror = () => setBgLoaded(true) // still reveal on error
    }
  }, [])

  // Typewriter animation for the button text
  useEffect(() => {
    let currentIndex = 0
    let isDeleting = false
    let timeout: ReturnType<typeof setTimeout>

    const typeLoop = () => {
      if (!isDeleting) {
        if (currentIndex <= fullButtonText.length) {
          setTypedButtonText(fullButtonText.slice(0, currentIndex))
          currentIndex++
          timeout = setTimeout(typeLoop, 110)
        } else {
          // Pause at full text before lingering
          timeout = setTimeout(() => {
            // Keep full text visible with blinking cursor
            setTypedButtonText(fullButtonText)
          }, 3000)
        }
      }
    }

    // Initial start delay
    timeout = setTimeout(typeLoop, 400)

    return () => clearTimeout(timeout)
  }, [])

  // Prevent page scrolling while landing overlay is active
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [])

  const handleBeginMission = () => {
    setIsExiting(true)
    setTimeout(() => {
      onEnter()
      const homeEl = document.getElementById('home')
      if (homeEl) {
        homeEl.scrollIntoView({ behavior: 'smooth' })
      }
    }, 850) // matches slide-to-left animation duration
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden ${
        isExiting ? 'landing-slide-left-exit pointer-events-none' : ''
      }`}
      style={{
        backgroundColor: '#07090e',
        backgroundImage: bgLoaded
          ? `linear-gradient(180deg, rgba(5,7,12,0.45) 0%, rgba(5,7,12,0.7) 60%, rgba(5,7,12,0.85) 100%), url(${spaceBg3})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <style>{`
        /* Continuous Looping Multi-Palette Animated Gradient:
           Palette 1: #FFFDEE, #CEDFFB, #2684EF, #071466
           Palette 2: #076653, #E2FBCE, #8AEF26, #FFFDEE
           Palette 3: #FFFDEE, #FBF6CE, #662D07, #EF6226
           Palette 4: #FFFDEE, #616607, #EFD826, #DCD286
        */
        .landing-looping-gradient {
          display: inline-block;
          background: linear-gradient(
            90deg,
            /* ── Cycle 1: Wide Colors & Seamless Transitions ── */
            /* Palette 1 */
            #FFFDEE 0%,
            #CEDFFB 3.125%,
            #2684EF 6.25%,
            #071466 9.375%,
            /* Palette 1 -> Palette 2 Transition */
            #076653 12.5%,
            /* Palette 2 */
            #E2FBCE 15.625%,
            #8AEF26 18.75%,
            #FFFDEE 21.875%,
            /* Palette 2 -> Palette 3 Transition */
            #FBF6CE 25%,
            /* Palette 3 */
            #662D07 28.125%,
            #EF6226 31.25%,
            /* Palette 3 -> Palette 4 Transition */
            #FFFDEE 34.375%,
            /* Palette 4 */
            #616607 37.5%,
            #EFD826 40.625%,
            #DCD286 43.75%,
            /* Palette 4 -> Cycle 2 Transition */
            #FFFDEE 46.875%,

            /* ── Cycle 2: Exact Repeat for Seamless 100% Loop ── */
            /* Palette 1 Repeat */
            #FFFDEE 50%,
            #CEDFFB 53.125%,
            #2684EF 56.25%,
            #071466 59.375%,
            /* Palette 1 -> Palette 2 Transition */
            #076653 62.5%,
            /* Palette 2 */
            #E2FBCE 65.625%,
            #8AEF26 68.75%,
            #FFFDEE 71.875%,
            /* Palette 2 -> Palette 3 Transition */
            #FBF6CE 75%,
            /* Palette 3 */
            #662D07 78.125%,
            #EF6226 81.25%,
            /* Palette 3 -> Palette 4 Transition */
            #FFFDEE 84.375%,
            /* Palette 4 */
            #616607 87.5%,
            #EFD826 90.625%,
            #DCD286 93.75%,
            /* Loop Closure back to Start */
            #FFFDEE 96.875%,
            #FFFDEE 100%
          );
          background-size: 1600% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: landing-palette-loop 240s linear infinite;
        }

        @keyframes landing-palette-loop {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: -800% 0%;
          }
        }

        /* Subtle glowing backdrop for title */
        .landing-title-glow {
          filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.2))
                  drop-shadow(0 0 50px rgba(255, 253, 238, 0.15));
        }

        @keyframes landing-cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        .landing-btn-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background-color: #ffffff;
          margin-left: 3px;
          vertical-align: middle;
          animation: landing-cursor-blink 0.9s steps(1) infinite;
        }

        /* ── Entrance Animations ── */
        .landing-float-eyebrow {
          animation: landing-float-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
        }

        .landing-float-title {
          animation: landing-float-in 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards;
        }

        .landing-float-button {
          animation: landing-float-in 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.8s backwards;
        }

        @keyframes landing-float-in {
          0% {
            opacity: 0;
            transform: translateY(35px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Slide-to-left exit animation */
        .landing-slide-left-exit {
          animation: landing-slide-out-left 0.85s cubic-bezier(0.77, 0, 0.175, 1) forwards !important;
          will-change: transform;
        }

        @keyframes landing-slide-out-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100vw);
          }
        }
      `}</style>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full my-auto">
        {/* Eyebrow / Subtitle */}
        <div className="landing-float-eyebrow w-full flex justify-center">
          <h2 className="landing-looping-gradient font-orbitron font-extrabold text-base sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-[0.25em] sm:tracking-[0.35em] mb-2 sm:mb-3 landing-title-glow leading-tight">
            AGAINST ALL ODDS:
          </h2>
        </div>

        {/* Main Title: ESCAPADE */}
        <div className="landing-float-title w-full flex justify-center">
          <h1 className="landing-looping-gradient font-orbitron font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-[0.18em] sm:tracking-[0.25em] mb-10 sm:mb-12 landing-title-glow leading-none">
            ESCAPADE
          </h1>
        </div>

        {/* BEGIN MISSION Action Button with Typewriter Text */}
        <div className="landing-float-button">
          <button
            type="button"
            onClick={handleBeginMission}
            className="group relative inline-flex items-center justify-center min-w-[170px] sm:min-w-[210px] px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-transparent border border-white/80 text-white font-orbitron font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] active:scale-95 cursor-pointer"
          >
            <span className="whitespace-nowrap">
              {typedButtonText}
              <span className="landing-btn-cursor" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
