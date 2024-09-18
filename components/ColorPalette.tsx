import { useState } from 'react'
import { toPng } from 'html-to-image'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import ColorDetailsModal from './ColorDetailsModal'

interface ColorPaletteProps {
  palette: string[]
  lockedColors: boolean[]
  onToggleLock: (index: number) => void
  onColorChange: (index: number, newColor: string) => void
}

const LockIcon = ({ isLocked, onClick }: { isLocked: boolean; onClick: (e: React.MouseEvent) => void }) => {
  return (
    <div 
      className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-75 transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      {isLocked ? (
        <LockClosedIcon className="h-4 w-4 text-white" />
      ) : (
        <LockOpenIcon className="h-4 w-4 text-white" />
      )}
    </div>
  );
};

export default function ColorPalette({ palette, lockedColors, onToggleLock, onColorChange }: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null)

  const copyToClipboard = (color: string, index: number) => {
    navigator.clipboard.writeText(color)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const downloadImage = async () => {
    const element = document.getElementById('color-palette')
    if (element) {
      // Temporarily hide lock icons and make background transparent
      const lockIcons = element.querySelectorAll('.absolute.top-2.right-2')
      lockIcons.forEach(icon => (icon as HTMLElement).style.display = 'none')
      const originalBackground = element.style.background
      element.style.background = 'transparent'

      const dataUrl = await toPng(element, { backgroundColor: 'transparent' })

      // Restore lock icons and original background
      lockIcons.forEach(icon => (icon as HTMLElement).style.display = '')
      element.style.background = originalBackground

      const link = document.createElement('a')
      link.download = 'color-palette.png'
      link.href = dataUrl
      link.click()
    }
  }

  const exportJSON = () => {
    const data = JSON.stringify(palette)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'color-palette.json'
    link.href = url
    link.click()
  }

  const openColorDetails = (index: number) => {
    setSelectedColorIndex(index)
  }

  const handleColorChange = (newColor: string) => {
    if (selectedColorIndex !== null) {
      onColorChange(selectedColorIndex, newColor)
    }
  }

  return (
    <div className="w-full">
      <div id="color-palette" className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {palette.map((color, index) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-lg relative">
            <div
              className="w-full h-32 cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => openColorDetails(index)}
            >
              <LockIcon
                isLocked={lockedColors[index]}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(index);
                }}
              />
            </div>
            <button
              className="w-full py-2 bg-gray-800 text-sm font-mono text-white hover:bg-gray-700 transition duration-300 ease-in-out font-semibold tracking-wide"
              onClick={() => copyToClipboard(color, index)}
            >
              {copiedIndex === index ? 'Copied!' : color}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out tracking-wide"
          onClick={downloadImage}
        >
          Export as PNG
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition duration-300 ease-in-out tracking-wide"
          onClick={exportJSON}
        >
          Export as JSON
        </button>
      </div>
      {selectedColorIndex !== null && (
        <ColorDetailsModal
          color={palette[selectedColorIndex]}
          isOpen={selectedColorIndex !== null}
          onClose={() => setSelectedColorIndex(null)}
          onColorChange={handleColorChange}
        />
      )}
    </div>
  )
}
