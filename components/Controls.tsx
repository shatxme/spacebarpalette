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
    <div className="w-full mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <label htmlFor="colorCount" className="block text-sm font-medium text-gray-300 mb-2">
            Number of Colors
          </label>
          <input
            type="number"
            id="colorCount"
            min="1"
            max="10"
            value={colorCount}
            onChange={(e) => setColorCount(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="brightness" className="block text-sm font-medium text-gray-300 mb-2">
            Brightness
          </label>
          <input
            type="range"
            id="brightness"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="hueRange" className="block text-sm font-medium text-gray-300 mb-2">
            Hue Range
          </label>
          <input
            type="range"
            id="hueRange"
            min="0"
            max="360"
            value={hueRange[1]}
            onChange={(e) => setHueRange([hueRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <button
        onClick={generateNewPalette}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Generate New Palette
      </button>
    </div>
  )
}
