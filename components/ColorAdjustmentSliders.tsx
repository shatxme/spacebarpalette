import React from 'react';
import { AdjustmentValues } from '../app/utils/colorUtils';

interface ColorAdjustmentSlidersProps {
  onAdjustmentsChange: (adjustments: AdjustmentValues) => void;
  adjustments: AdjustmentValues;
}

export default function ColorAdjustmentSliders({ 
  onAdjustmentsChange,
  adjustments 
}: ColorAdjustmentSlidersProps) {
  const handleSliderChange = (property: keyof AdjustmentValues, value: number) => {
    onAdjustmentsChange({ ...adjustments, [property]: value });
  };

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
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Adjust palette</h3>
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
