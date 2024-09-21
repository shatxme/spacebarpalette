import React, { useState } from 'react';
import { LockClosedIcon, LockOpenIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/solid';
import { getContrastColor } from '../app/utils/colorUtils';

interface ColorPaletteProps {
  palette: string[];
  lockedColors: boolean[];
  onToggleLock: (index: number) => void;
  onColorClick: (color: string) => void;
}

export default function ColorPalette({ 
  palette, 
  lockedColors, 
  onToggleLock, 
  onColorClick
}: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="color-palette" className="flex-1 flex flex-col sm:flex-row">
      {palette.map((color, index) => (
        <div
          key={index}
          data-testid="color-element"
          className="flex-1 flex flex-col justify-between cursor-pointer relative min-h-[120px] sm:min-h-0"
          style={{ backgroundColor: color }}
          onClick={(e) => {
            e.preventDefault(); // Prevent default to avoid issues with spacebar
            onColorClick(color);
          }}
          onKeyDown={(e) => {
            if (e.code === 'Space') {
              e.preventDefault(); // Prevent spacebar from triggering click
            }
          }}
        >
          <button
            className="lock-button absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-white bg-opacity-20 rounded-full transition-colors duration-200 hover:bg-opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock(index);
            }}
            aria-label={lockedColors[index] ? "Unlock color" : "Lock color"}
          >
            {lockedColors[index] ? (
              <LockClosedIcon className="h-4 w-4 sm:h-6 sm:w-6" style={{ color: getContrastColor(color) }} />
            ) : (
              <LockOpenIcon className="h-4 w-4 sm:h-6 sm:w-6" style={{ color: getContrastColor(color) }} />
            )}
          </button>
          <div className="mt-auto p-2 sm:p-4">
            <div 
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all duration-200 ${
                copiedIndex === index 
                  ? 'bg-white bg-opacity-20' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(color, index);
              }}
            >
              <p className={`text-lg sm:text-2xl font-bold`} style={{ color: getContrastColor(color) }}>
                {color.toUpperCase()}
              </p>
              {copiedIndex === index ? (
                <CheckIcon className={`h-4 w-4 sm:h-5 sm:w-5`} style={{ color: getContrastColor(color) }} />
              ) : (
                <ClipboardIcon className={`h-4 w-4 sm:h-5 sm:w-5`} style={{ color: getContrastColor(color) }} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
