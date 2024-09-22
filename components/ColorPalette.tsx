import React, { useState, useCallback } from 'react';
import { LockClosedIcon, LockOpenIcon, ClipboardIcon, CheckIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { getContrastColor } from '../app/utils/colorUtils';

interface ColorPaletteProps {
  palette: string[];
  lockedColors: boolean[];
  onToggleLock: (index: number) => void;
  onColorClick: (color: string) => void;
  onReorder: (newPalette: string[], newLockedColors: boolean[]) => void;
  onAddColumn: () => void;
  onRemoveColumn: (index: number) => void;
}

export default function ColorPalette({ 
  palette, 
  lockedColors, 
  onToggleLock, 
  onColorClick,
  onReorder,
  onAddColumn,
  onRemoveColumn
}: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
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
    
    if (sourceIndex !== targetIndex && sourceIndex >= 0 && sourceIndex < palette.length) {
      const newPalette = [...palette];
      const newLockedColors = [...lockedColors];
      const [movedColor] = newPalette.splice(sourceIndex, 1);
      const [movedLock] = newLockedColors.splice(sourceIndex, 1);
      newPalette.splice(targetIndex, 0, movedColor);
      newLockedColors.splice(targetIndex, 0, movedLock);

      onReorder(newPalette, newLockedColors);
    }
    setDraggedIndex(null);
  }, [palette, lockedColors, onReorder]);

  const handleToggleLock = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onToggleLock(index);
  }, [onToggleLock]);

  return (
    <div className="flex-1 flex flex-col">
      <div id="color-palette" className="flex-1 flex flex-wrap">
        {palette.map((color, index) => (
          <div
            key={`${color}-${index}`}
            data-testid="color-element"
            className={`flex-1 flex flex-col justify-between cursor-move relative transition-transform duration-200 min-h-[120px] ${
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
            <div className="flex justify-between items-start p-2">
              <button
                className="lock-button p-2 bg-white bg-opacity-20 rounded-full transition-colors duration-200 hover:bg-opacity-30"
                onClick={(e) => handleToggleLock(e, index)}
                aria-label={lockedColors[index] ? "Unlock color" : "Lock color"}
              >
                {lockedColors[index] ? (
                  <LockClosedIcon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: getContrastColor(color) }} />
                ) : (
                  <LockOpenIcon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: getContrastColor(color) }} />
                )}
              </button>
              {palette.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveColumn(index);
                  }}
                  className="p-2 bg-white bg-opacity-20 rounded-full transition-colors duration-200 hover:bg-opacity-30"
                  aria-label="Remove Column"
                >
                  <MinusIcon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: getContrastColor(color) }} />
                </button>
              )}
            </div>
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
                <p className="text-sm sm:text-lg font-bold" style={{ color: getContrastColor(color) }}>
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
        {palette.length < 10 && (
          <div 
            className="flex-1 flex items-center justify-center bg-gray-100 min-h-[120px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200"
            onClick={onAddColumn}
          >
            <div className="flex flex-col items-center text-gray-600 group">
              <PlusIcon className="h-10 w-10 sm:h-12 sm:w-12 mb-2 transition-transform duration-300 ease-in-out group-hover:scale-110" />
              <span className="text-sm sm:text-base font-medium transition-all duration-300 ease-in-out group-hover:font-bold">Add Color</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
