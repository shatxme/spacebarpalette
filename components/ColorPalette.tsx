import React from 'react';
import { LockClosedIcon, LockOpenIcon, ClipboardIcon } from '@heroicons/react/24/solid';
import { getColorName } from '../app/utils/colorUtils';

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
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div id="color-palette" className="flex-1 flex">
      {palette.map((color, index) => (
        <div
          key={index}
          className="flex-1 flex flex-col justify-between cursor-pointer relative"
          style={{ backgroundColor: color }}
          onClick={() => onColorClick(color)}
        >
          <button
            className="lock-button absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full transition-colors duration-200 hover:bg-opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock(index);
            }}
          >
            {lockedColors[index] ? (
              <LockClosedIcon className="h-6 w-6 text-white" />
            ) : (
              <LockOpenIcon className="h-6 w-6 text-white" />
            )}
          </button>
          <div className="mt-auto p-4 bg-black bg-opacity-20">
            <div 
              className="flex items-center justify-between p-2 bg-gray-900 rounded cursor-pointer transition-colors duration-200 hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(color);
              }}
            >
              <p className="text-2xl font-bold text-white">{color.toUpperCase()}</p>
              <ClipboardIcon className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm text-white mt-2">{getColorName(color)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorPalette;
