
import React from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  className
}) => {
  const colors = [
    '#e11d48', // Red
    '#ea580c', // Orange
    '#eab308', // Yellow
    '#16a34a', // Green
    '#0ea5e9', // Light Blue
    '#2563eb', // Blue
    '#8b5cf6', // Purple
    '#d946ef', // Pink
    '#ffffff', // White
    '#94a3b8', // Grey
    '#1e293b', // Dark Grey
    '#000000', // Black
  ];

  return (
    <div className={cn("p-2 bg-pixel-black flex flex-wrap gap-2 pixel-border-special", className)}>
      {colors.map((color) => (
        <div
          key={color}
          className={cn(
            "w-8 h-8 rounded-none cursor-pointer border-2",
            color === selectedColor ? 'border-white' : 'border-pixel-black'
          )}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
