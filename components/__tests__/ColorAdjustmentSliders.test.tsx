import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ColorAdjustmentSliders from '../ColorAdjustmentSliders';

describe('ColorAdjustmentSliders', () => {
  const mockAdjustments = { h: 0, s: 0, b: 0, t: 0 };
  const mockOnAdjustmentsChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sliders', () => {
    render(
      <ColorAdjustmentSliders
        adjustments={mockAdjustments}
        onAdjustmentsChange={mockOnAdjustmentsChange}
      />
    );

    expect(screen.getByLabelText('Hue')).toBeInTheDocument();
    expect(screen.getByLabelText('Saturation')).toBeInTheDocument();
    expect(screen.getByLabelText('Brightness')).toBeInTheDocument();
    expect(screen.getByLabelText('Temperature')).toBeInTheDocument();
  });

  it('calls onAdjustmentsChange when sliders are moved', () => {
    render(
      <ColorAdjustmentSliders
        adjustments={mockAdjustments}
        onAdjustmentsChange={mockOnAdjustmentsChange}
      />
    );

    fireEvent.change(screen.getByLabelText('Hue'), { target: { value: '50' } });
    expect(mockOnAdjustmentsChange).toHaveBeenCalledWith({ ...mockAdjustments, h: 50 });

    fireEvent.change(screen.getByLabelText('Saturation'), { target: { value: '25' } });
    expect(mockOnAdjustmentsChange).toHaveBeenCalledWith({ ...mockAdjustments, s: 25 });
  });

  it('resets adjustments when reset button is clicked', () => {
    render(
      <ColorAdjustmentSliders
        adjustments={mockAdjustments}
        onAdjustmentsChange={mockOnAdjustmentsChange}
      />
    );

    fireEvent.click(screen.getByText('Reset'));
    expect(mockOnAdjustmentsChange).toHaveBeenCalledWith({ h: 0, s: 0, b: 0, t: 0 });
  });

  it('displays current adjustment values', () => {
    const currentAdjustments = { h: 10, s: 20, b: 30, t: 40 };
    render(
      <ColorAdjustmentSliders
        adjustments={currentAdjustments}
        onAdjustmentsChange={mockOnAdjustmentsChange}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument(); // Hue value
    expect(screen.getByText('20')).toBeInTheDocument(); // Saturation value
    expect(screen.getByText('30')).toBeInTheDocument(); // Brightness value
    expect(screen.getByText('40')).toBeInTheDocument(); // Temperature value
  });
});