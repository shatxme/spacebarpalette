import React, { useState } from 'react';
import { LockClosedIcon, LockOpenIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/solid';

interface ColorPaletteProps {
  palette: string[];
  lockedColors: boolean[];
  onToggleLock: (index: number) => void;
  onGenerateNewPalette: () => void;
  onColorClick: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  palette,
  lockedColors,
  onToggleLock,
  onGenerateNewPalette,
  onColorClick,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  };

  const isColorBright = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 200; // Adjust this threshold as needed
  };

  return (
    <div id="color-palette" className="flex-1 flex flex-col sm:flex-row">
      {palette.map((color, index) => {
        const isBright = isColorBright(color);
        return (
          <div
            key={index}
            className="flex-1 flex flex-col justify-between cursor-pointer relative min-h-[120px] sm:min-h-0"
            style={{ backgroundColor: color }}
            onClick={() => onColorClick(color)}
          >
            <button
              className="lock-button absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-white bg-opacity-20 rounded-full transition-colors duration-200 hover:bg-opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(index);
              }}
            >
              {lockedColors[index] ? (
                <LockClosedIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              ) : (
                <LockOpenIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              )}
            </button>
            <div className="mt-auto p-2 sm:p-4">
              <div 
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all duration-200 ${
                  isBright ? 'bg-gray-200 bg-opacity-50' : ''
                } ${
                  copiedIndex === index 
                    ? 'bg-white bg-opacity-20' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(color, index);
                }}
              >
                <p className={`text-lg sm:text-2xl font-bold ${isBright ? 'text-gray-800' : 'text-white'}`}>
                  {color.toUpperCase()}
                </p>
                {copiedIndex === index ? (
                  <CheckIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${isBright ? 'text-gray-800' : 'text-white'}`} />
                ) : (
                  <ClipboardIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${isBright ? 'text-gray-800' : 'text-white'}`} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ColorPalette;
