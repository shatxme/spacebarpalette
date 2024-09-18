'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ColorPalette from '../components/ColorPalette';
import ColorDetailsModal from '../components/ColorDetailsModal';
import ColorAdjustmentSliders from '../components/ColorAdjustmentSliders';
import { generatePalette, adjustPaletteHSL, AdjustmentValues } from './utils/colorUtils';
import { PhotoIcon, CodeBracketIcon, ShareIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';

const Logo = () => (
  <div className="flex items-center space-x-3">
    <div className="bg-gray-200 p-2 rounded-md">
      <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="14" width="20" height="6" rx="2" fill="currentColor" />
      </svg>
    </div>
    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
      Spacebar Palette
    </span>
  </div>
);

export default function Home() {
  const [palette, setPalette] = useState<string[]>([]);
  const [lockedColors, setLockedColors] = useState<boolean[]>([]);
  const [hueRange, setHueRange] = useState<[number, number]>([0, 360]);
  const [hueInputs, setHueInputs] = useState<[string, string]>(["0", "360"]);
  const exportRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [adjustments, setAdjustments] = useState<AdjustmentValues>({ h: 0, s: 0, b: 0, t: 0 });

  const sharePalette = useCallback(() => {
    const state = {
      palette,
      lockedColors,
      hueRange
    };
    const stateString = btoa(JSON.stringify(state)); // Encode the state to base64
    const url = `${window.location.origin}?s=${stateString}`;
    
    navigator.clipboard.writeText(url).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy share link: ', err);
    });
  }, [palette, lockedColors, hueRange]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('s');
    if (stateParam) {
      try {
        const state = JSON.parse(atob(stateParam));
        setPalette(state.palette);
        setLockedColors(state.lockedColors);
        setHueRange(state.hueRange);
      } catch (error) {
        console.error('Failed to parse shared state:', error);
        generateNewPalette();
      }
    } else {
      generateNewPalette();
    }
  }, []);

  const generateNewPalette = useCallback(() => {
    const newPalette = generatePalette(
      5,
      50,
      [hueRange[0], hueRange[1]],
      palette,
      lockedColors
    );
  
    // Apply adjustments only to unlocked colors
    const adjustedPalette = newPalette.map((color, index) => {
      if (lockedColors[index]) {
        return palette[index]; // Keep the locked color as is
      } else {
        return adjustPaletteHSL([color], adjustments)[0]; // Apply adjustments only to unlocked colors
      }
    });

    setPalette(adjustedPalette);

    // Ensure lockedColors array matches the palette length
    setLockedColors(prev => 
      prev.length !== newPalette.length ? new Array(newPalette.length).fill(false) : prev
    );
  }, [hueRange, lockedColors, palette, adjustments]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isModalOpen) {
        event.preventDefault();
        generateNewPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateNewPalette, isModalOpen]);

  useEffect(() => {
    setHueInputs([hueRange[0].toString(), hueRange[1].toString()]);
  }, [hueRange]);

  const toggleLock = useCallback((index: number) => {
    setLockedColors(prev => {
      const newLockedColors = [...prev];
      newLockedColors[index] = !newLockedColors[index];
      return newLockedColors;
    });
  }, []);

  const exportToPNG = async () => {
    if (exportRef.current) {
      try {
        const canvas = await html2canvas(exportRef.current, {
          backgroundColor: null,
          scale: 2, // Increase resolution
        });

        const link = document.createElement('a');
        link.download = 'color-palette.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Failed to export PNG:', error);
      }
    }
  };

  const exportToJSON = () => {
    const paletteData = {
      colors: palette,
      lockedColors: lockedColors,
      hueRange: hueRange
    };
    const jsonString = JSON.stringify(paletteData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'color-palette.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const handleHueChange = (index: 0 | 1, value: string) => {
    const newInputs = [...hueInputs] as [string, string];
    newInputs[index] = value;
    setHueInputs(newInputs);

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 360) {
      setHueRange(prevRange => {
        const newRange = [...prevRange] as [number, number];
        newRange[index] = numValue;
        return newRange;
      });
    }
  };

  const handleHueBlur = (index: 0 | 1) => {
    const numValue = parseInt(hueInputs[index]);
    if (isNaN(numValue) || numValue < 0) {
      setHueInputs(prev => {
        const newInputs = [...prev] as [string, string];
        newInputs[index] = "0";
        return newInputs;
      });
      setHueRange(prevRange => {
        const newRange = [...prevRange] as [number, number];
        newRange[index] = 0;
        return newRange;
      });
    } else if (numValue > 360) {
      setHueInputs(prev => {
        const newInputs = [...prev] as [string, string];
        newInputs[index] = "360";
        return newInputs;
      });
      setHueRange(prevRange => {
        const newRange = [...prevRange] as [number, number];
        newRange[index] = 360;
        return newRange;
      });
    }
  };

  const handleColorClick = useCallback((color: string) => {
    setSelectedColor(color);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleColorChange = (newColor: string) => {
    setPalette(prevPalette => {
      const newPalette = [...prevPalette];
      const index = newPalette.indexOf(selectedColor!);
      if (index !== -1) {
        newPalette[index] = newColor;
      }
      return newPalette;
    });
    setSelectedColor(newColor);
  };

  const handleAdjustmentsChange = (newAdjustments: AdjustmentValues) => {
    setAdjustments(newAdjustments);
    // Do not apply adjustments to the current palette
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <button 
              onClick={exportToPNG} 
              className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded" 
              title="Export as PNG"
            >
              <PhotoIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600 hidden sm:inline">PNG</span>
            </button>
            <button 
              onClick={exportToJSON} 
              className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded" 
              title="Export as JSON"
            >
              <CodeBracketIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600 hidden sm:inline">JSON</span>
            </button>
            <button 
              onClick={sharePalette} 
              className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded" 
              title="Share Palette"
            >
              <ShareIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600 hidden sm:inline">Share</span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsAdjustmentOpen(!isAdjustmentOpen)}
                className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded" 
                title="Adjust Colors"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">Adjust</span>
              </button>
              {isAdjustmentOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                  <ColorAdjustmentSliders
                    onAdjustmentsChange={handleAdjustmentsChange}
                    adjustments={adjustments}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <ColorPalette
        palette={palette}
        lockedColors={lockedColors}
        onToggleLock={toggleLock}
        onGenerateNewPalette={generateNewPalette}
        onColorClick={handleColorClick}
      />
      {selectedColor && (
        <ColorDetailsModal 
          color={selectedColor}
          isOpen={isModalOpen}
          onClose={closeModal}
          onColorChange={handleColorChange}
        />
      )}
      <div 
        ref={exportRef} 
        className="fixed left-0 top-0 -z-10 w-[1000px] h-[500px] flex"
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px',
          pointerEvents: 'none'
        }}
      >
        {palette.map((color, index) => (
          <div
            key={index}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </main>
  );
}
