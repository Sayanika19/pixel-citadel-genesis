
import React, { ReactNode } from 'react';
import Logo from './Logo';
import { Github } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, header }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pixel-black to-black text-white">
      <header className="border-b border-pixel-purple-dark">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex gap-4 items-center">
            {header}
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pixel-gray hover:text-white"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-pixel-purple-dark py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-xs text-pixel-gray">
          <p>PixelCitadel - On-Chain Worldbuilder MMO © 2025</p>
          <p className="mt-1">Built on Monad for maximum performance and trustless pixel placement</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
