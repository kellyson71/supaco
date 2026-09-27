import { MotionConfig } from 'framer-motion'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Band } from './components/Band'
import { Tour } from './components/Tour'
import { Alerts } from './components/Alerts'
import { Ecosystem } from './components/Ecosystem'
import { Download } from './components/Download'
import { CloudFilter } from './components/Sky'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CloudFilter />
      <Nav />
      <main>
        <Hero />
        <Band />
        <Tour />
        <Alerts />
        <Ecosystem />
        <Download />
      </main>
    </MotionConfig>
  )
}
