import { LazyMotion, MotionConfig } from 'framer-motion'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Band } from './components/Band'
import { Tour } from './components/Tour'
import { Alerts } from './components/Alerts'
import { Ecosystem } from './components/Ecosystem'
import { Download } from './components/Download'

const loadFeatures = () => import('./lib/motion-features').then((r) => r.default)

export default function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
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
    </LazyMotion>
  )
}
