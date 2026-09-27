import { MotionConfig } from 'framer-motion'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { CloudFilter } from './components/Sky'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CloudFilter />
      <Nav />
      <main>
        <Hero />
      </main>
    </MotionConfig>
  )
}
