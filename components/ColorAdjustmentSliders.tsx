import React, { useCallback } from 'react';
import { AdjustmentValues } from '../app/utils/colorUtils';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface ColorAdjustmentSlidersProps {
  adjustments: AdjustmentValues;
  onAdjustmentsChange: (adjustments: AdjustmentValues) => void;
}

const defaultAdjustments: AdjustmentValues = { h: 0, s: 0, b: 0, t: 0 };

export default function ColorAdjustmentSliders({ 
  adjustments,
  onAdjustmentsChange
}: ColorAdjustmentSlidersProps) {
  const handleSliderChange = useCallback((property: keyof AdjustmentValues, value: number) => {
    const newAdjustments = { ...adjustments, [property]: value };
    onAdjustmentsChange(newAdjustments);
  }, [adjustments, onAdjustmentsChange]);

  const handleReset = useCallback(() => {
    onAdjustmentsChange(defaultAdjustments);
  }, [onAdjustmentsChange]);

  const sliders = [
    { name: 'Hue', property: 'h', min: -180, max: 180, default: 0,
      style: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' },
    { name: 'Saturation', property: 's', min: -100, max: 100, default: 0,
      style: 'bg-gradient-to-r from-gray-300 to-red-500' },
    { name: 'Brightness', property: 'b', min: -100, max: 100, default: 0,
      style: 'bg-gradient-to-r from-black via-gray-500 to-white' },
    { name: 'Temperature', property: 't', min: -100, max: 100, default: 0,
      style: 'bg-gradient-to-r from-blue-500 via-white to-yellow-500' },
  ];

  return (
    <div className="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Adjust palette</h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          title="Reset adjustments"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Reset
        </button>
      </div>
      <div className="space-y-4">
        {sliders.map((slider) => (
          <div key={slider.name} className="space-y-1">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">{slider.name}</label>
              <span className="text-sm text-gray-500">
                {adjustments[slider.property as keyof AdjustmentValues]}
              </span>
            </div>
            <div className={`h-2 rounded-full ${slider.style} relative`}>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                value={adjustments[slider.property as keyof AdjustmentValues]}
                onChange={(e) => handleSliderChange(slider.property as keyof AdjustmentValues, Number(e.target.value))}
                className="w-full h-2 appearance-none bg-transparent absolute top-0 left-0"
                style={{
                  WebkitAppearance: 'none',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
