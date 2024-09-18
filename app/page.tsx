'use client'
import { useState, useEffect } from 'react'
import ColorPalette from '../components/ColorPalette'
import Controls from '../components/Controls'
import { generatePalette } from './utils/colorUtils'

export default function Home() {
  const [palette, setPalette] = useState<string[]>([])
  const [lockedColors, setLockedColors] = useState<boolean[]>([])
  const [colorCount, setColorCount] = useState(5)
  const [brightness, setBrightness] = useState(50)
  const [hueRange, setHueRange] = useState([0, 360])

  useEffect(() => {
    generateNewPalette()
  }, [])

  const generateNewPalette = () => {
    const newPalette = generatePalette(colorCount, brightness, hueRange, palette, lockedColors)
    setPalette(newPalette)
    if (lockedColors.length !== newPalette.length) {
      setLockedColors(new Array(newPalette.length).fill(false))
    }
    localStorage.setItem('palette', JSON.stringify(newPalette))
  }

  const toggleLock = (index: number) => {
    const newLockedColors = [...lockedColors]
    newLockedColors[index] = !newLockedColors[index]
    setLockedColors(newLockedColors)
  }

  const handleColorChange = (index: number, newColor: string) => {
    const newPalette = [...palette];
    newPalette[index] = newColor;
    setPalette(newPalette);
    localStorage.setItem('palette', JSON.stringify(newPalette));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-16">maPal - Color Palette Generator</h1>
      <div className="w-full max-w-6xl"> {/* Increased max-width */}
        <Controls
          colorCount={colorCount}
          setColorCount={setColorCount}
          brightness={brightness}
          setBrightness={setBrightness}
          hueRange={hueRange}
          setHueRange={setHueRange}
          onGenerateNewPalette={generateNewPalette}
          currentPalette={palette}
          lockedColors={lockedColors}
        />
        <ColorPalette 
          palette={palette} 
          lockedColors={lockedColors} 
          onToggleLock={toggleLock}
          onColorChange={handleColorChange}
        />
      </div>
    </main>
  )
}
