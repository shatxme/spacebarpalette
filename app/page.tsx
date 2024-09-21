'use client'
import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import ColorPalette from '../components/ColorPalette';
import ColorDetailsModal from '../components/ColorDetailsModal';
import ColorAdjustmentSliders from '../components/ColorAdjustmentSliders';
import { 
  generatePalette, 
  adjustPaletteHSL, 
  AdjustmentValues, 
  simulatePaletteColorBlindness,
  ColorBlindnessType
} from './utils/colorUtils';
import { PhotoIcon, CodeBracketIcon, ShareIcon, AdjustmentsHorizontalIcon, ChevronDownIcon, SparklesIcon, Bars3Icon, XMarkIcon, DocumentIcon, EyeIcon } from '@heroicons/react/24/outline';
import { exportToPNG, exportToJSON, sharePalette, exportToPDF } from './utils/shareUtils';
import { Menu, Transition } from '@headlessui/react';

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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [adjustments, setAdjustments] = useState<AdjustmentValues>({ h: 0, s: 0, b: 0, t: 0 });
  const [showColorBlindness, setShowColorBlindness] = useState(false);
  const [colorBlindnessType, setColorBlindnessType] = useState<ColorBlindnessType>('protanopia');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const exportRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const generateNewPalette = useCallback(() => {
    const newPalette = generatePalette(
      palette.length || 5,
      50,
      [0, 360],
      [],
      lockedColors
    );

    const adjustedPalette = newPalette.map((color, index) => {
      if (lockedColors[index]) {
        return palette[index];
      } else {
        return adjustPaletteHSL([color], adjustments)[0];
      }
    });

    setPalette(adjustedPalette);
    setIsShareDropdownOpen(false);
    mainRef.current?.focus();
  }, [lockedColors, palette, adjustments]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('s');
    if (stateParam) {
      try {
        const state = JSON.parse(atob(stateParam));
        setPalette(state.palette);
        setLockedColors(state.lockedColors);
        if (state.adjustments) {
          setAdjustments(state.adjustments);
        }
      } catch (error) {
        console.error('Failed to parse shared state:', error);
        generateNewPalette();
      }
    } else if (palette.length === 0) {
      generateNewPalette();
    }
    setIsLoading(false);
  }, [generateNewPalette, palette.length]);

  const toggleLock = useCallback((index: number) => {
    setLockedColors(prev => {
      const newLockedColors = [...prev];
      newLockedColors[index] = !newLockedColors[index];
      return newLockedColors;
    });
  }, []);

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

  const getSimulatedPalette = useCallback(() => {
    return showColorBlindness ? simulatePaletteColorBlindness(palette, colorBlindnessType) : palette;
  }, [palette, showColorBlindness, colorBlindnessType]);

  const colorBlindnessOptions = [
    { value: 'protanopia', label: 'Protanopia' },
    { value: 'deuteranopia', label: 'Deuteranopia' },
    { value: 'tritanopia', label: 'Tritanopia' },
    { value: 'achromatopsia', label: 'Achromatopsia' }
  ];

  const closeDropdowns = useCallback(() => {
    setIsAdjustmentOpen(false);
    setShowColorBlindness(false);
    setIsShareDropdownOpen(false);
  }, []);

  const handleExport = useCallback((exportFunction: Function) => {
    return (event?: React.MouseEvent<HTMLButtonElement>) => {
      if (event) {
        event.preventDefault();
      }
      exportFunction(palette, adjustments);
      setIsShareDropdownOpen(false);
    };
  }, [palette, adjustments]);

  const handleSharePalette = useCallback((event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }
    sharePalette(palette, lockedColors, adjustments);
    setIsShareDropdownOpen(false);
    // Remove focus from the Share button after copying the link
    (document.activeElement as HTMLElement)?.blur();
  }, [palette, lockedColors, adjustments]);

  const shareMenuItems = [
    { label: 'Export PNG', action: handleExport(exportToPNG), icon: PhotoIcon },
    { label: 'Export PDF', action: handleExport(exportToPDF), icon: DocumentIcon },
    { label: 'Export JSON', action: handleExport(exportToJSON), icon: CodeBracketIcon },
    { label: 'Copy Link', action: handleSharePalette, icon: ShareIcon },
  ];

  const menuItems = [
    { 
      icon: ShareIcon, 
      label: 'Share', 
      action: () => {}, 
      dropdown: shareMenuItems 
    },
    { icon: AdjustmentsHorizontalIcon, label: 'Adjust', action: () => {
      closeDropdowns();
      setIsAdjustmentOpen(prev => !prev);
    }},
    { icon: EyeIcon, label: 'Color Blindness', action: () => {
      closeDropdowns();
      setShowColorBlindness(prev => !prev);
    }},
  ];

  const handleAdjustmentsChange = useCallback((newAdjustments: AdjustmentValues) => {
    setAdjustments(newAdjustments);
  }, []);

  const handleShareClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsShareDropdownOpen(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space' && !isModalOpen) {
      event.preventDefault();
      if (isShareDropdownOpen) {
        setIsShareDropdownOpen(false);
        (document.activeElement as HTMLElement)?.blur();
      }
      generateNewPalette();
    }
  }, [generateNewPalette, isModalOpen, isShareDropdownOpen]);

  useEffect(() => {
    const handleKeyDownWithRef = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };

    window.addEventListener('keydown', handleKeyDownWithRef);
    return () => window.removeEventListener('keydown', handleKeyDownWithRef);
  }, [handleKeyDown]);

  return (
    <main ref={mainRef} tabIndex={-1} className="min-h-screen flex flex-col outline-none">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="hidden sm:flex items-center space-x-4">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.label}>
                {item.dropdown ? (
                  <div className="relative z-50">
                    <Menu as="div" className="relative inline-block text-left">
                      {() => (
                        <>
                          <Menu.Button 
                            className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded"
                            onClick={handleShareClick}
                          >
                            <item.icon className="h-5 w-5 text-gray-600" />
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                          </Menu.Button>
                          <Transition
                            show={isShareDropdownOpen}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                            >
                              {shareMenuItems.map((subItem, subIndex) => (
                                <Menu.Item key={subIndex}>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } group flex w-full items-center px-2 py-2 text-sm`}
                                      onClick={subItem.action}
                                    >
                                      <subItem.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                                      {subItem.label}
                                    </button>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                ) : (
                  <button 
                    key={index}
                    onClick={item.action}
                    className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded" 
                    title={item.label}
                  >
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
          <button 
            className="sm:hidden"
            onClick={() => {
              closeDropdowns();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              {item.dropdown ? (
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">{item.label}</p>
                  {item.dropdown.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={(e) => {
                        subItem.action(e);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <subItem.icon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">{subItem.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <button 
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-4 hover:bg-gray-100 border-b border-gray-200"
                >
                  <item.icon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="flex-grow flex flex-col sm:flex-row">
        <div ref={exportRef} className="flex-1 flex flex-col sm:flex-row">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <ColorPalette
              palette={getSimulatedPalette()}
              lockedColors={lockedColors}
              onToggleLock={toggleLock}
              onColorClick={handleColorClick}
            />
          )}
        </div>
        {selectedColor && (
          <ColorDetailsModal 
            color={selectedColor}
            isOpen={isModalOpen}
            onClose={closeModal}
            onColorChange={handleColorChange}
          />
        )}
        {isAdjustmentOpen && (
          <div className="absolute right-4 top-16 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-20">
            <div className="flex justify-between items-center p-2 border-b">
              <h3 className="text-sm font-semibold text-gray-800">Adjust Colors</h3>
              <button onClick={() => setIsAdjustmentOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <ColorAdjustmentSliders
              adjustments={adjustments}
              onAdjustmentsChange={handleAdjustmentsChange}
            />
          </div>
        )}
        {showColorBlindness && (
          <div className="absolute right-4 top-16 w-56 bg-white shadow-lg rounded-lg overflow-hidden z-20 border border-gray-200">
            <div className="flex justify-between items-center p-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Simulate Color Blindness</h3>
              <button onClick={() => setShowColorBlindness(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {colorBlindnessOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setColorBlindnessType(option.value as ColorBlindnessType)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    colorBlindnessType === option.value
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={generateNewPalette}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 sm:hidden"
        aria-label="Generate New Palette"
      >
        <SparklesIcon className="h-6 w-6" />
      </button>
    </main>
  );
}
