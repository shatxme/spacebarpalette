'use client'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ColorPalette from '../components/ColorPalette';
import ColorDetailsModal from '../components/ColorDetailsModal';
import { generatePalette } from './utils/colorUtils';
import { SunIcon, SwatchIcon, ArrowDownTrayIcon, ShareIcon, PhotoIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
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
  const [brightness, setBrightness] = useState(50);
  const [hueRange, setHueRange] = useState<[number, number]>([0, 360]);
  const [hueInputs, setHueInputs] = useState<[string, string]>(["0", "360"]);
  const exportRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generateNewPalette = useCallback(() => {
    setPalette(prevPalette => {
      const newPalette = generatePalette(5, brightness, hueRange, prevPalette, lockedColors);
      if (lockedColors.length !== newPalette.length) {
        setLockedColors(new Array(newPalette.length).fill(false));
      }
      return newPalette;
    });
  }, [brightness, hueRange, lockedColors]);

  useEffect(() => {
    generateNewPalette();
  }, []);

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
      brightness: brightness,
      hueRange: hueRange
    };
    const jsonString = JSON.stringify(paletteData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'color-palette.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const sharePalette = useCallback(() => {
    const paletteString = palette.join('-');
    const url = `${window.location.origin}?p=${paletteString}`;
    
    navigator.clipboard.writeText(url).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy share link: ', err);
    });
  }, [palette]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paletteParam = params.get('p');
    if (paletteParam) {
      const loadedPalette = paletteParam.split('-');
      if (loadedPalette.length === palette.length) {
        setPalette(loadedPalette);
      }
    } else {
      generateNewPalette();
    }
  }, []);

  const handleHueChange = (index: 0 | 1, value: string) => {
    const newInputs = [...hueInputs] as [string, string];
    newInputs[index] = value;
    setHueInputs(newInputs);

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 360) {
      const newHueRange = [...hueRange] as [number, number];
      newHueRange[index] = numValue;
      setHueRange(newHueRange);
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
      const newHueRange = [...hueRange] as [number, number];
      newHueRange[index] = 0;
      setHueRange(newHueRange);
    } else if (numValue > 360) {
      setHueInputs(prev => {
        const newInputs = [...prev] as [string, string];
        newInputs[index] = "360";
        return newInputs;
      });
      const newHueRange = [...hueRange] as [number, number];
      newHueRange[index] = 360;
      setHueRange(newHueRange);
    }
  };

  const handleColorClick = useCallback((color: string) => {
    setSelectedColor(color);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleColorChange = useCallback((newColor: string) => {
    setPalette(prevPalette => {
      const index = prevPalette.indexOf(selectedColor!);
      if (index !== -1) {
        const newPalette = [...prevPalette];
        newPalette[index] = newColor;
        return newPalette;
      }
      return prevPalette;
    });
  }, [selectedColor]);

  const memoizedColorPalette = useMemo(() => (
    <ColorPalette
      palette={palette}
      lockedColors={lockedColors}
      onToggleLock={toggleLock}
      onGenerateNewPalette={generateNewPalette}
      onColorClick={handleColorClick}
    />
  ), [palette, lockedColors, toggleLock, generateNewPalette, handleColorClick]);

  return (
    <main className="h-screen flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SunIcon className="h-5 w-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex items-center space-x-2">
              <SwatchIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={hueInputs[0]}
                onChange={(e) => handleHueChange(0, e.target.value)}
                onBlur={() => handleHueBlur(0)}
                className="w-14 p-1 bg-gray-100 rounded text-sm text-gray-700"
                placeholder="Min"
              />
              <input
                type="text"
                value={hueInputs[1]}
                onChange={(e) => handleHueChange(1, e.target.value)}
                onBlur={() => handleHueBlur(1)}
                className="w-14 p-1 bg-gray-100 rounded text-sm text-gray-700"
                placeholder="Max"
              />
            </div>
            <button 
              onClick={exportToPNG} 
              className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded" 
              title="Export as PNG"
            >
              <PhotoIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">PNG</span>
            </button>
            <button 
              onClick={exportToJSON} 
              className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded" 
              title="Export as JSON"
            >
              <CodeBracketIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">JSON</span>
            </button>
            <button 
              onClick={sharePalette} 
              className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded" 
              title="Share Palette"
            >
              <ShareIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">Share</span>
            </button>
          </div>
        </div>
      </header>
      {memoizedColorPalette}
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
