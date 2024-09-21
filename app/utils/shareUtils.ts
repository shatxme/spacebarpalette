export function generateShareableUrl(palette: string[], lockedColors: boolean[]): string {
  const paletteData = palette.map((color, index) => ({
    color,
    locked: lockedColors[index]
  }));
  const encodedData = btoa(JSON.stringify(paletteData));
  return `${window.location.origin}?shared=${encodedData}`;
}

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (palette: string[]) => {
  // Create a temporary div to render the palette
  const tempDiv = document.createElement('div');
  tempDiv.style.display = 'flex';
  tempDiv.style.width = '1000px';
  tempDiv.style.height = '500px';

  palette.forEach((color) => {
    const colorDiv = document.createElement('div');
    colorDiv.style.flex = '1';
    colorDiv.style.backgroundColor = color;
    colorDiv.style.display = 'flex';
    colorDiv.style.flexDirection = 'column';
    colorDiv.style.justifyContent = 'flex-end';
    colorDiv.style.alignItems = 'center';
    colorDiv.style.padding = '0 0 20px 0';

    const hexCode = document.createElement('div');
    hexCode.textContent = color.toUpperCase();
    hexCode.style.color = getContrastColor(color);
    hexCode.style.padding = '5px 10px';
    hexCode.style.borderRadius = '4px';
    hexCode.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
    hexCode.style.fontSize = '18px';  // Increased font size to match UI better
    hexCode.style.fontWeight = 'bold';  // Changed to bold to match UI
    hexCode.style.letterSpacing = '0.05em';  // Adjusted letter spacing

    colorDiv.appendChild(hexCode);
    tempDiv.appendChild(colorDiv);
  });

  // Append the temporary div to the body
  document.body.appendChild(tempDiv);

  try {
    // Use html2canvas to create an image of the palette
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // Increase resolution
    });

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    // Add the image to the PDF
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);

    // Save the PDF
    pdf.save('color-palette.pdf');
  } catch (error) {
    console.error('Failed to export PDF:', error);
  } finally {
    // Remove the temporary div
    document.body.removeChild(tempDiv);
  }
};

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 200 ? '#000000' : '#FFFFFF';
}
