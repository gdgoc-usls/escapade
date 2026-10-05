import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLandingController } from './controllers/useLandingController'
import { LandingOverlay } from './views/LandingOverlay'
import { Navbar } from './views/Navbar'
import { HeroSection } from './views/HeroSection'
import { StorySection } from './views/StorySection'
import { MissionSection } from './views/MissionSection'
import { TicketsSection } from './views/TicketsSection'
import { LeaderboardSection } from './views/LeaderboardSection'
import { Footer } from './views/Footer'
import AdminLoginModal from './components/AdminLoginModal'

interface AppProps {
  adminLogin?: boolean
}

// Module-level flag: resets on every full page refresh, persists through SPA navigation
let landingSeen = false

export default function App({ adminLogin = false }: AppProps) {
  const navigate = useNavigate()
  const controller = useLandingController()
  const [showLanding, setShowLanding] = useState(() => !adminLogin && !landingSeen)

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans selection:bg-white/30 selection:text-white">
      {/* Landing Page Overlay */}
      {showLanding && (
        <LandingOverlay onEnter={() => { landingSeen = true; setShowLanding(false) }} />
      )}
      {/* View: Navbar with Tab Typewriter Animation */}
      <Navbar
        navSections={controller.navSections}
        activeSection={controller.activeSection}
        mobileMenuOpen={controller.mobileMenuOpen}
        onToggleMobileMenu={controller.toggleMobileMenu}
        onCloseMobileMenu={controller.closeMobileMenu}
      />

      {/* View: Hero Section */}
      <HeroSection />

      {/* View: Story Section */}
      <StorySection />

      {/* View: Mission Section */}
      <MissionSection />


      {/* View: Tickets Section */}
      <TicketsSection />

      {/* View: Leaderboard Section */}
      <LeaderboardSection />

      {/* View: Footer */}
      <Footer />

      {adminLogin && (
        <AdminLoginModal
          onClose={() => {
            navigate('/', { replace: true })
          }}
        />
      )}
    </div>
  )
}