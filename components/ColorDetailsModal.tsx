import React, { useState, useEffect } from 'react';
import { hexToRgb, hexToHsl, hexToCmyk, getContrastColor } from '../app/utils/colorUtils';

interface ColorDetailsModalProps {
  color: string;
  isOpen: boolean;
  onClose: () => void;
  onColorChange: (newColor: string) => void;
}

export default function ColorDetailsModal({ color, isOpen, onClose, onColorChange }: ColorDetailsModalProps) {
  const [localColor, setLocalColor] = useState(color);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 1500);
    });
  };

  if (!isOpen) return null;

  const rgb = hexToRgb(localColor);
  const hsl = hexToHsl(localColor);
  const cmyk = hexToCmyk(localColor);
  const contrastColor = getContrastColor(localColor);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLocalColor(newColor);
    onColorChange(newColor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[420px] max-w-full text-white">
        <h2 className="text-2xl font-bold mb-4">Color Details</h2>
        <div className="mb-4">
          <div 
            className="w-full h-24 rounded"
            style={{ 
              backgroundColor: localColor,
              border: `2px solid ${contrastColor}`
            }}
          ></div>
        </div>
        <div className="mb-4">
          <label htmlFor="hexInput" className="block text-sm font-medium mb-1">Hex</label>
          <input
            id="hexInput"
            type="text"
            value={localColor}
            onChange={handleColorChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div 
            className="bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-300 hover:bg-gray-600"
            onClick={() => copyToClipboard(`${rgb.r}, ${rgb.g}, ${rgb.b}`, 'RGB')}
          >
            <label className="block text-sm font-medium mb-1 text-blue-300">RGB</label>
            <p className="text-lg font-mono">
              <span className="text-red-400">{rgb.r}</span>,{' '}
              <span className="text-green-400">{rgb.g}</span>,{' '}
              <span className="text-blue-400">{rgb.b}</span>
            </p>
            {copiedFormat === 'RGB' && <span className="text-xs text-green-400">Copied!</span>}
          </div>
          <div 
            className="bg-gray-700 p-3 rounded-lg cursor-pointer transition duration-300 hover:bg-gray-600"
            onClick={() => copyToClipboard(`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`, 'HSL')}
          >
            <label className="block text-sm font-medium mb-1 text-blue-300">HSL</label>
            <p className="text-lg font-mono">
              <span className="text-purple-400">{hsl.h}°</span>,{' '}
              <span className="text-yellow-400">{hsl.s}%</span>,{' '}
              <span className="text-gray-400">{hsl.l}%</span>
            </p>
            {copiedFormat === 'HSL' && <span className="text-xs text-green-400">Copied!</span>}
          </div>
        </div>
        <div 
          className="bg-gray-700 p-3 rounded-lg mb-4 cursor-pointer transition duration-300 hover:bg-gray-600"
          onClick={() => copyToClipboard(`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`, 'CMYK')}
        >
          <label className="block text-sm font-medium mb-1 text-blue-300">CMYK</label>
          <p className="text-lg font-mono">
            <span className="text-cyan-400">{cmyk.c}%</span>,{' '}
            <span className="text-pink-400">{cmyk.m}%</span>,{' '}
            <span className="text-yellow-400">{cmyk.y}%</span>,{' '}
            <span className="text-gray-400">{cmyk.k}%</span>
          </p>
          {copiedFormat === 'CMYK' && <span className="text-xs text-green-400">Copied!</span>}
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
