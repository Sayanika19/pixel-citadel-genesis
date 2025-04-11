
import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletButtonProps {
  onConnect: () => void;
  isConnected: boolean;
  walletAddress?: string;
  className?: string;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  onConnect,
  isConnected,
  walletAddress,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (isConnected) return;
    
    setIsLoading(true);
    try {
      await onConnect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayAddress = walletAddress 
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : 'Connect Wallet';

  return (
    <button
      className={cn(
        "pixel-button flex items-center gap-2",
        isConnected && "bg-pixel-accent text-pixel-black",
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      onClick={handleConnect}
      disabled={isLoading}
    >
      <Wallet size={16} />
      <span>{isLoading ? 'Connecting...' : isConnected ? displayAddress : 'Connect Wallet'}</span>
    </button>
  );
};

export default WalletButton;
