import React, { useState, useEffect, useRef } from 'react';
import { hexToRgb, hexToHsl, hexToCmyk } from '../app/utils/colorUtils';
import { XMarkIcon, ClipboardDocumentIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

interface ColorDetailsModalProps {
  color: string;
  isOpen: boolean;
  onClose: () => void;
  onColorChange: (color: string) => void;
}

export default function ColorDetailsModal({ color, isOpen, onClose, onColorChange }: ColorDetailsModalProps) {
  const [localColor, setLocalColor] = useState(color);
  const colorPickerRef = useRef<HTMLInputElement>(null);

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

  const openColorPicker = () => {
    colorPickerRef.current?.click();
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
        <div className="mb-4 relative">
          <div 
            className="w-full h-32 rounded-md mb-2"
            style={{ backgroundColor: localColor }}
          ></div>
          <button 
            onClick={openColorPicker}
            className="absolute bottom-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-full p-2 flex items-center"
          >
            <PaintBrushIcon className="h-5 w-5 text-white mr-2" />
            <span className="text-white font-semibold">Change Color</span>
          </button>
          <input
            ref={colorPickerRef}
            type="color"
            value={localColor}
            onChange={handleColorChange}
            className="sr-only"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="hexInput" className="block text-sm font-medium mb-1 text-gray-300">Hex</label>
          <input
            id="hexInput"
            type="text"
            value={localColor}
            onChange={(e) => {
              setLocalColor(e.target.value);
              onColorChange(e.target.value);
            }}
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
