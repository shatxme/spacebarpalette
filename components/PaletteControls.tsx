import React, { useState, useRef, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { HarmonyStyle } from '../app/utils/colorUtils';

interface PaletteControlsProps {
  harmonyStyle: HarmonyStyle;
  onHarmonyStyleChange: (style: HarmonyStyle) => void;
}

export default function PaletteControls({
  harmonyStyle,
  onHarmonyStyleChange,
}: PaletteControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const harmonyOptions: { value: HarmonyStyle; label: string }[] = [
    { value: 'complementary', label: 'Complementary' },
    { value: 'analogous', label: 'Analogous' },
    { value: 'triadic', label: 'Triadic' },
    { value: 'split-complementary', label: 'Split Complementary' },
    { value: 'random', label: 'Random' },
  ];

  const handleHarmonyChange = (style: HarmonyStyle) => {
    onHarmonyStyleChange(style);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
      >
        Harmony: {harmonyOptions.find(option => option.value === harmonyStyle)?.label}
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {harmonyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleHarmonyChange(option.value)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}