import React, { useState, useCallback, useRef } from 'react';
import { LockClosedIcon, LockOpenIcon, ClipboardIcon, CheckIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { getContrastColor } from '../app/utils/colorUtils';

interface ColorPaletteProps {
  palette: string[];
  lockedColors: boolean[];
  onToggleLock: (index: number) => void;
  onColorClick: (color: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onAddColumn: () => void;
  onRemoveColumn: (index: number) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  palette, 
  lockedColors, 
  onToggleLock, 
  onColorClick,
  onReorder,
  onAddColumn,
  onRemoveColumn
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', index.toString());
      e.dataTransfer.effectAllowed = 'move';
    }
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    
    if (sourceIndex !== targetIndex && sourceIndex >= 0 && sourceIndex < palette.length) {
      onReorder(sourceIndex, targetIndex);
    }
    setDraggedIndex(null);
  }, [palette, lockedColors, onReorder]);

  const handleDragEnd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedIndex(null);
  }, []);

  const handleToggleLock = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onToggleLock(index);
  }, [onToggleLock]);

  const totalColumns = palette.length < 10 ? palette.length + 1 : palette.length;
  const columnWidth = `${100 / totalColumns}%`;

  return (
    <div className="flex-1 flex flex-col h-full" data-testid="color-palette-container">
      <div id="color-palette" ref={containerRef} className="flex-1 flex relative h-full">
        {palette.map((color, index) => (
          <div
            key={`${color}-${index}`}
            data-testid="color-element"
            className="flex flex-col justify-between cursor-move relative h-full"
            style={{ 
              backgroundColor: color, 
              width: columnWidth,
              flexShrink: 0,
              flexGrow: 1
            }}
            onClick={(e) => {
              e.preventDefault();
              onColorClick(color);
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
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
                <p 
                  className="text-base sm:text-xl font-bold tracking-wider" 
                  style={{ 
                    color: getContrastColor(color),
                    letterSpacing: '0.1em'
                  }}
                >
                  {color.toUpperCase()}
                </p>
                {copiedIndex === index ? (
                  <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: getContrastColor(color) }} />
                ) : (
                  <ClipboardIcon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: getContrastColor(color) }} />
                )}
              </div>
            </div>
          </div>
        ))}
        {palette.length < 10 && (
          <div 
            data-testid="add-color-button"
            className="flex flex-col items-center justify-center bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200"
            style={{ 
              width: columnWidth,
              flexShrink: 0,
              flexGrow: 1
            }}
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
};

export default ColorPalette;
