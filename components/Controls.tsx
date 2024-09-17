interface ControlsProps {
  colorCount: number
  setColorCount: (count: number) => void
  brightness: number
  setBrightness: (brightness: number) => void
  hueRange: number[]
  setHueRange: (range: number[]) => void
  generateNewPalette: () => void
}

export default function Controls({
  colorCount,
  setColorCount,
  brightness,
  setBrightness,
  hueRange,
  setHueRange,
  generateNewPalette,
}: ControlsProps) {
  return (
    <div className="w-full max-w-3xl mb-8">
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label htmlFor="colorCount" className="block text-sm font-medium text-gray-700">
            Number of Colors
          </label>
          <input
            type="number"
            id="colorCount"
            min="1"
            max="10"
            value={colorCount}
            onChange={(e) => setColorCount(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="brightness" className="block text-sm font-medium text-gray-700">
            Brightness
          </label>
          <input
            type="range"
            id="brightness"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="hueRange" className="block text-sm font-medium text-gray-700">
            Hue Range
          </label>
          <input
            type="range"
            id="hueRange"
            min="0"
            max="360"
            value={hueRange[1]}
            onChange={(e) => setHueRange([hueRange[0], parseInt(e.target.value)])}
            className="mt-1 block w-full"
          />
        </div>
      </div>
      <button
        onClick={generateNewPalette}
        className="w-full px-4 py-2 bg-indigo-500 text-white rounded"
      >
        Generate New Palette
      </button>
    </div>
  )
}
