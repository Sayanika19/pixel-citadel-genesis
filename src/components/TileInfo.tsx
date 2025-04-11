
import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

interface TileInfoProps {
  selectedTile: { x: number; y: number } | null;
  owner: string | null;
  className?: string;
  onClaimTile?: () => void;
}

const TileInfo: React.FC<TileInfoProps> = ({
  selectedTile,
  owner,
  className,
  onClaimTile
}) => {
  if (!selectedTile) {
    return (
      <div className={cn("bg-pixel-black p-4 pixel-border-special text-center", className)}>
        <p className="font-pixel text-xs text-white">Select a tile to see details</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-pixel-black p-4 pixel-border-special", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-pixel-purple" />
          <h3 className="font-pixel text-xs text-white">
            Tile ({selectedTile.x}, {selectedTile.y})
          </h3>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs mb-1 text-pixel-gray">Owner</div>
        <div className="font-medium">
          {owner ? (
            <span className="text-white">{owner}</span>
          ) : (
            <span className="text-pixel-gray italic">Unclaimed</span>
          )}
        </div>
      </div>

      {!owner && (
        <button
          onClick={onClaimTile}
          className="pixel-button w-full"
        >
          Claim This Tile
        </button>
      )}
    </div>
  );
};

export default TileInfo;
