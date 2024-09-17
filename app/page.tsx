'use client'

import { useState, useEffect } from 'react'
import ColorPalette from './components/ColorPalette'
import Controls from './components/Controls'
import { generatePalette } from './utils/colorUtils'

export default function Home() {
  const [palette, setPalette] = useState<string[]>([])
  const [colorCount, setColorCount] = useState(5)
  const [brightness, setBrightness] = useState(50)
  const [hueRange, setHueRange] = useState([0, 360])

  useEffect(() => {
    generateNewPalette()
  }, [])

  const generateNewPalette = () => {
    const newPalette = generatePalette(colorCount, brightness, hueRange)
    setPalette(newPalette)
    localStorage.setItem('palette', JSON.stringify(newPalette))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Color Palette Generator</h1>
      <Controls
        colorCount={colorCount}
        setColorCount={setColorCount}
        brightness={brightness}
        setBrightness={setBrightness}
        hueRange={hueRange}
        setHueRange={setHueRange}
        generateNewPalette={generateNewPalette}
      />
      <ColorPalette palette={palette} />
    </main>
  )
}
