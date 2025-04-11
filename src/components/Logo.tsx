
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 bg-pixel-purple grid grid-cols-2 grid-rows-2 pixel-border">
        <div className="bg-pixel-accent"></div>
        <div className="bg-pixel-purple-dark"></div>
        <div className="bg-pixel-purple-light"></div>
        <div className="bg-pixel-black"></div>
      </div>
      <div>
        <h1 className="font-pixel text-xl leading-none text-white">
          Pixel<span className="text-pixel-purple">Citadel</span>
        </h1>
        <div className="text-[8px] text-pixel-gray mt-1 tracking-wider">ON-CHAIN WORLDBUILDER</div>
      </div>
    </div>
  );
};

export default Logo;
