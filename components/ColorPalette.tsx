import { useState } from 'react'
import { toPng } from 'html-to-image'

interface ColorPaletteProps {
  palette: string[]
}

export default function ColorPalette({ palette }: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (color: string, index: number) => {
    navigator.clipboard.writeText(color)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const downloadImage = async () => {
    const element = document.getElementById('color-palette')
    if (element) {
      const dataUrl = await toPng(element)
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

  return (
    <div className="w-full">
      <div id="color-palette" className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {palette.map((color, index) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-lg">
            <div
              className="w-full h-32"
              style={{ backgroundColor: color }}
            ></div>
            <button
              className="w-full py-2 bg-gray-800 text-sm font-mono text-white hover:bg-gray-700 transition duration-300 ease-in-out"
              onClick={() => copyToClipboard(color, index)}
            >
              {copiedIndex === index ? 'Copied!' : color}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300 ease-in-out"
          onClick={downloadImage}
        >
          Export as PNG
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition duration-300 ease-in-out"
          onClick={exportJSON}
        >
          Export as JSON
        </button>
      </div>
    </div>
  )
}
