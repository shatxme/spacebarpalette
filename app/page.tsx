'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ColorPalette from '../components/ColorPalette'
import Controls from '../components/Controls'
import { generatePalette } from './utils/colorUtils'

function PaletteContent() {
  const [palette, setPalette] = useState<string[]>([])
  const [lockedColors, setLockedColors] = useState<boolean[]>([])
  const [colorCount, setColorCount] = useState(5)
  const [brightness, setBrightness] = useState(50)
  const [hueRange, setHueRange] = useState([0, 360])
  const searchParams = useSearchParams();

  useEffect(() => {
    const shared = searchParams?.get('shared');
    if (shared) {
      try {
        const decodedData = JSON.parse(atob(shared));
        setPalette(decodedData.map((item: { color: string }) => item.color));
        setLockedColors(decodedData.map((item: { locked: boolean }) => item.locked));
      } catch (error) {
        console.error('Failed to parse shared data:', error);
        // Fallback to generating a new palette
        generateNewPalette();
      }
    } else {
      generateNewPalette();
    }
  }, [searchParams]);

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
    <>
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
    </>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-16">maPal - Color Palette Generator</h1>
      <div className="w-full max-w-6xl"> {/* Increased max-width */}
        <Suspense fallback={<div>Loading...</div>}>
          <PaletteContent />
        </Suspense>
      </div>
    </main>
  )
}
