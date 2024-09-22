import React, { useState, useCallback } from 'react';
import { LockClosedIcon, LockOpenIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/solid';
import { getContrastColor } from '../app/utils/colorUtils';

interface ColorPaletteProps {
  palette: string[];
  lockedColors: boolean[];
  onToggleLock: (index: number) => void;
  onColorClick: (color: string) => void;
  onReorder: (newPalette: string[], newLockedColors: boolean[]) => void;
}

export default function ColorPalette({ 
  palette, 
  lockedColors, 
  onToggleLock, 
  onColorClick,
  onReorder
}: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    console.log('Drag start:', index);
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    console.log('Drop:', sourceIndex, 'to', targetIndex);
    
    if (sourceIndex !== targetIndex && sourceIndex >= 0 && sourceIndex < palette.length) {
      const newPalette = [...palette];
      const newLockedColors = [...lockedColors];
      const [movedColor] = newPalette.splice(sourceIndex, 1);
      const [movedLock] = newLockedColors.splice(sourceIndex, 1);
      newPalette.splice(targetIndex, 0, movedColor);
      newLockedColors.splice(targetIndex, 0, movedLock);

      console.log('New palette:', newPalette);
      console.log('New locked colors:', newLockedColors);
      onReorder(newPalette, newLockedColors);
    }
    setDraggedIndex(null);
  }, [palette, lockedColors, onReorder]);

  const handleToggleLock = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    console.log('Toggle lock:', index);
    onToggleLock(index);
  }, [onToggleLock]);

  return (
    <div id="color-palette" className="flex-1 flex flex-col sm:flex-row">
      {palette.map((color, index) => (
        <div
          key={`${color}-${index}`}
          data-testid="color-element"
          className={`flex-1 flex flex-col justify-between cursor-move relative min-h-[120px] sm:min-h-0 transition-transform duration-200 ${
            draggedIndex === index ? 'scale-95' : ''
          }`}
          style={{ backgroundColor: color }}
          onClick={(e) => {
            e.preventDefault();
            onColorClick(color);
          }}
          onKeyDown={(e) => {
            if (e.code === 'Space') {
              e.preventDefault();
            }
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <button
            className="lock-button absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-white bg-opacity-20 rounded-full transition-colors duration-200 hover:bg-opacity-30"
            onClick={(e) => handleToggleLock(e, index)}
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
              <p className="text-lg sm:text-2xl font-bold" style={{ color: getContrastColor(color) }}>
                {color.toUpperCase()}
              </p>
              {copiedIndex === index ? (
                <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: getContrastColor(color) }} />
              ) : (
                <ClipboardIcon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: getContrastColor(color) }} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
