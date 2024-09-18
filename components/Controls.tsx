import React from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { generatePalette } from '../app/utils/colorUtils';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';

interface ControlsProps {
  colorCount: number;
  setColorCount: (count: number) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;
  hueRange: number[];
  setHueRange: (range: number[]) => void;
  onGenerateNewPalette: (palette: string[]) => void;
  currentPalette: string[];
  lockedColors: boolean[];
}

const Controls: React.FC<ControlsProps> = ({
  colorCount,
  setColorCount,
  brightness,
  setBrightness,
  hueRange,
  setHueRange,
  onGenerateNewPalette,
  currentPalette,
  lockedColors,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const incrementCount = () => {
    setColorCount(Math.min(colorCount + 1, 10));
  };

  const decrementCount = () => {
    setColorCount(Math.max(colorCount - 1, 1));
  };

  const handleGenerateNewPalette = () => {
    const newPalette = generatePalette(
      colorCount,
      brightness,
      hueRange,
      currentPalette,
      lockedColors
    );
    onGenerateNewPalette(newPalette);
  };

  return (
    <div className="w-full mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <label htmlFor="colorCount" className="block text-sm font-medium text-gray-300 mb-2">
            Number of Colors
          </label>
          <div className={`relative flex items-center bg-gray-800 rounded-md ${isFocused ? 'ring-2 ring-blue-500' : 'border border-gray-700'}`}>
            <button
              onClick={decrementCount}
              className="px-3 py-2 text-gray-400 hover:text-white focus:outline-none"
            >
              -
            </button>
            <input
              type="number"
              id="colorCount"
              min="1"
              max="10"
              value={colorCount}
              onChange={(e) => setColorCount(parseInt(e.target.value, 10))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent text-center text-white focus:outline-none"
            />
            <button
              onClick={incrementCount}
              className="px-3 py-2 text-gray-400 hover:text-white focus:outline-none"
            >
              +
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="brightness" className="block text-sm font-medium text-gray-300 mb-2">
            Brightness
          </label>
          <div className="relative w-full h-12 bg-gray-700 rounded-full">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-gray-800 to-yellow-400 rounded-full pointer-events-none"
              style={{ width: `${brightness}%` }}
            ></div>
            <input
              id="brightness"
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
              <MoonIcon className="h-6 w-6 text-gray-400" />
              <SunIcon className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-400">
            {brightness}%
          </div>
        </div>
        <div>
          <label htmlFor="hueRange" className="block text-sm font-medium text-gray-300 mb-2">
            Hue Range
          </label>
          <div className="relative w-full h-12 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-full">
            <div 
              className="absolute top-0 h-full bg-white bg-opacity-30 rounded-full pointer-events-none"
              style={{ 
                left: `${(hueRange[0] / 360) * 100}%`, 
                width: `${((hueRange[1] - hueRange[0]) / 360) * 100}%` 
              }}
            ></div>
            <input
              id="hueRangeStart"
              type="range"
              min="0"
              max="360"
              value={hueRange[0]}
              onChange={(e) => setHueRange([parseInt(e.target.value, 10), hueRange[1]])}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
            <input
              id="hueRangeEnd"
              type="range"
              min="0"
              max="360"
              value={hueRange[1]}
              onChange={(e) => setHueRange([hueRange[0], parseInt(e.target.value, 10)])}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
          <div className="mt-2 text-center text-sm text-gray-400">
            {hueRange[0]}° - {hueRange[1]}°
          </div>
        </div>
      </div>
      <button
        onClick={handleGenerateNewPalette}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out tracking-wide"
      >
        Generate New Palette
      </button>
    </div>
  );
}

export default Controls;
