
import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Pixel {
  color: string;
  owner?: string;
}

interface PixelGridProps {
  gridSize?: number;
  selectedTile?: { x: number; y: number } | null;
  selectedColor?: string;
  onTileSelect?: (x: number, y: number) => void;
  onPixelPlace?: (x: number, y: number, color: string) => void;
  className?: string;
}

const PixelGrid: React.FC<PixelGridProps> = ({
  gridSize = 32,
  selectedTile,
  selectedColor = '#9b87f5',
  onTileSelect,
  onPixelPlace,
  className
}) => {
  // Initialize empty grid
  const [grid, setGrid] = useState<Pixel[][]>([]);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);
  
  // Create initial empty grid
  useEffect(() => {
    const initialGrid: Pixel[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: Pixel[] = [];
      for (let x = 0; x < gridSize; x++) {
        row.push({ color: '#333333' });
      }
      initialGrid.push(row);
    }
    setGrid(initialGrid);
  }, [gridSize]);

  // Handle pixel placement
  const handlePixelClick = (x: number, y: number) => {
    if (onTileSelect) {
      onTileSelect(x, y);
    }
    
    if (selectedTile && selectedTile.x === x && selectedTile.y === y && selectedColor && onPixelPlace) {
      const newGrid = [...grid];
      newGrid[y][x] = { color: selectedColor, owner: 'current-user' };
      setGrid(newGrid);
      onPixelPlace(x, y, selectedColor);
    }
  };

  // Default tiles with a pattern
  useEffect(() => {
    if (grid.length > 0) {
      const patternGrid = [...grid];
      
      // Create some default buildings and terrain
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          // Green terrain
          if ((x + y) % 4 === 0) {
            patternGrid[y][x] = { color: '#4ade80' };
          }
          
          // Water patches
          if ((x * y) % 47 === 0) {
            patternGrid[y][x] = { color: '#38bdf8' };
          }
          
          // Stone/buildings
          if ((x * y) % 23 === 0) {
            patternGrid[y][x] = { color: '#94a3b8' };
          }
        }
      }
      
      setGrid(patternGrid);
    }
  }, [grid.length, gridSize]);

  // Calculate pixel size based on container
  const pixelSize = useMemo(() => {
    return `calc(100% / ${gridSize})`;
  }, [gridSize]);

  return (
    <div 
      className={cn(
        "w-full aspect-square border-4 border-pixel-black bg-black overflow-hidden pixel-grid relative",
        className
      )}
    >
      <div className="absolute inset-0 grid" style={{ 
        gridTemplateColumns: `repeat(${gridSize}, ${pixelSize})`,
        gridTemplateRows: `repeat(${gridSize}, ${pixelSize})`
      }}>
        {grid.map((row, y) => 
          row.map((pixel, x) => {
            const isSelectedTile = selectedTile?.x === x && selectedTile?.y === y;
            const isHoveredTile = hoveredTile?.x === x && hoveredTile?.y === y;
            
            return (
              <div 
                key={`${x}-${y}`}
                className={cn(
                  "w-full h-full cursor-pointer relative",
                  isSelectedTile && "ring-2 ring-white ring-inset"
                )}
                style={{ backgroundColor: pixel.color }}
                onClick={() => handlePixelClick(x, y)}
                onMouseEnter={() => setHoveredTile({ x, y })}
                onMouseLeave={() => setHoveredTile(null)}
              >
                {isHoveredTile && !isSelectedTile && (
                  <div className="absolute inset-0 bg-white bg-opacity-20" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PixelGrid;
