import React, { useState, useRef, useEffect } from 'react';
import { getContrastRatio } from '../app/utils/colorUtils';
import { Switch } from '@headlessui/react';

interface ContrastCheckModalProps {
  colors: string[];
  onClose: () => void;
}

const ContrastCheckModal: React.FC<ContrastCheckModalProps> = ({ colors, onClose }) => {
  const [showValidOnly, setShowValidOnly] = useState(true); // Changed to true
  const [copiedColor, setCopiedColor] = useState<{ color: string; type: 'background' | 'text' } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const calculateContrast = (color1: string, color2: string): number => {
    return getContrastRatio(color1, color2);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const copyToClipboard = (text: string, type: 'background' | 'text') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedColor({ color: text, type });
      setTimeout(() => setCopiedColor(null), 1500); // Reset after 1.5 seconds
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto relative">
        {copiedColor && (
          <div className="absolute top-0 left-0 right-0 bg-black text-white text-sm py-2 text-center font-medium">
            {copiedColor.type === 'background' ? 'Background color copied!' : 'Text color copied!'}
          </div>
        )}
        <div className="pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Check Palette Contrast</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-6 gap-3 mb-6">
            {colors.map((bgColor, i) => (
              <React.Fragment key={i}>
                {colors.map((textColor, j) => {
                  const contrast = calculateContrast(bgColor, textColor);
                  const isValid = contrast >= 4.5;
                  if (showValidOnly && !isValid) return null;
                  const isPlaceholder = i === j;
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`aspect-square flex flex-col justify-center items-center p-2 ${isPlaceholder ? '' : 'cursor-pointer relative group'} rounded-md overflow-hidden`}
                      style={{ backgroundColor: bgColor, color: textColor }}
                    >
                      <div className={`flex flex-col justify-center items-center ${isPlaceholder ? '' : 'group-hover:opacity-0'} transition-opacity duration-200`}>
                        <span className="text-base font-semibold">Sample</span>
                        <span className="text-sm font-medium mt-1" data-testid="contrast-ratio">{contrast.toFixed(2)}</span>
                      </div>
                      {!isPlaceholder && (
                        <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50">
                          <div className="text-sm font-medium hover:underline text-white" onClick={() => copyToClipboard(bgColor, 'background')}>
                            {bgColor}
                          </div>
                          <div className="text-sm font-medium hover:underline mt-2 text-white" onClick={() => copyToClipboard(textColor, 'text')}>
                            {textColor}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="text-sm font-medium text-gray-700">
              Accessible color pairs meet a contrast ratio of 4.5:1 or higher.
            </p>
            <div className="flex items-center self-end">
              <span className="mr-3 text-sm font-medium text-gray-700">
                {showValidOnly ? "Valid colors" : "All colors"}
              </span>
              <Switch
                checked={!showValidOnly}
                onChange={() => setShowValidOnly(!showValidOnly)}
                className={`${
                  !showValidOnly ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <span className="sr-only">Toggle contrast view</span>
                <span
                  className={`${
                    !showValidOnly ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContrastCheckModal;
