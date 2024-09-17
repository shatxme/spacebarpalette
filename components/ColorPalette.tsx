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
    <div className="w-full max-w-3xl">
      <div id="color-palette" className="flex flex-wrap justify-center gap-4 mb-8">
        {palette.map((color, index) => (
          <div key={index} className="w-32 h-32 rounded-lg shadow-md">
            <div
              className="w-full h-24 rounded-t-lg"
              style={{ backgroundColor: color }}
            ></div>
            <button
              className="w-full h-8 bg-gray-100 text-sm font-mono"
              onClick={() => copyToClipboard(color, index)}
            >
              {copiedIndex === index ? 'Copied!' : color}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={downloadImage}
        >
          Download Image
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={exportJSON}
        >
          Export JSON
        </button>
      </div>
    </div>
  )
}
