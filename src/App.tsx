import { MotionConfig } from 'framer-motion'
import { useState } from 'react'
import { CoupleSection } from './components/CoupleSection'
import { CountdownSection } from './components/CountdownSection'
import { CustomCursor } from './components/CustomCursor'
import { FamilySection } from './components/FamilySection'
import { FloatingDecorations } from './components/FloatingDecorations'
import { Footer } from './components/Footer'
import { HeroSection } from './components/HeroSection'
import { InvitationSection } from './components/InvitationSection'
import { LanguageToggle, MusicPlayer, MusicProvider } from './components/MusicPlayer'
import { OpeningGate } from './components/OpeningGate'
import { VenueSection } from './components/VenueSection'
import { WeddingDetails } from './components/WeddingDetails'
import { LanguageProvider } from './i18n/LanguageContext'

export default function App() {
  const [opening, setOpening] = useState(false)
  const [gateGone, setGateGone] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <MusicProvider>
          {!gateGone && <OpeningGate onOpening={() => setOpening(true)} onDone={() => setGateGone(true)} />}
          <main>
            <HeroSection started={opening} />
            <InvitationSection />
            <CoupleSection />
            <CountdownSection />
            <WeddingDetails />
            <VenueSection />
            <FamilySection />
          </main>
          <Footer />
          <FloatingDecorations />
          <CustomCursor />
          <div
            className="fixed z-50 flex items-center gap-2"
            style={{
              right: 'max(14px, env(safe-area-inset-right, 0px))',
              bottom: 'max(14px, env(safe-area-inset-bottom, 0px))',
            }}
          >
            <LanguageToggle />
            <MusicPlayer />
          </div>
        </MusicProvider>
      </LanguageProvider>
    </MotionConfig>
  )
}
