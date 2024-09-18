import React, { useState, useEffect } from 'react';
import { hexToRgb, hexToHsl, hexToCmyk, getContrastColor } from '../app/utils/colorUtils';
import { XMarkIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface ColorDetailsModalProps {
  color: string;
  isOpen: boolean;
  onClose: () => void;
  onColorChange: (newColor: string) => void;
}

export default function ColorDetailsModal({ color, isOpen, onClose, onColorChange }: ColorDetailsModalProps) {
  const [localColor, setLocalColor] = useState(color);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  const rgb = hexToRgb(localColor);
  const hsl = hexToHsl(localColor);
  const cmyk = hexToCmyk(localColor);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLocalColor(newColor);
    onColorChange(newColor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-[320px] max-w-full text-white shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Color Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <div 
            className="w-full h-20 rounded-md"
            style={{ backgroundColor: localColor }}
          ></div>
        </div>
        <div className="mb-4">
          <label htmlFor="hexInput" className="block text-sm font-medium mb-1 text-gray-300">Hex</label>
          <input
            id="hexInput"
            type="text"
            value={localColor}
            onChange={handleColorChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>
        <div className="space-y-2">
          {[
            { label: 'RGB', value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
            { label: 'HSL', value: `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` },
            { label: 'CMYK', value: `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%` }
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-300">{item.label}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono">{item.value}</span>
                <button
                  onClick={() => copyToClipboard(item.value)}
                  className="text-gray-400 hover:text-white"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
