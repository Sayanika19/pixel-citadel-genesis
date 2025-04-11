
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import PixelGrid from '@/components/PixelGrid';
import ColorPicker from '@/components/ColorPicker';
import WalletButton from '@/components/WalletButton';
import ActivityFeed from '@/components/ActivityFeed';
import TileInfo from '@/components/TileInfo';
import GovernancePanel from '@/components/GovernancePanel';
import { 
  connectWallet, 
  getConnectedWallet, 
  claimTile, 
  getTileOwner, 
  placePixel,
  getActivities,
  getProposals,
  voteOnProposal
} from '@/services/mockBlockchain';
import { Activity } from '@/components/ActivityFeed';
import { Proposal } from '@/services/mockBlockchain';

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#8b5cf6');
  const [tileOwner, setTileOwner] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Initialize and load data
  useEffect(() => {
    const loadInitialData = async () => {
      // Check if wallet is already connected
      const wallet = getConnectedWallet();
      if (wallet) {
        setWalletAddress(wallet);
      }
      
      // Load activities
      setActivities(getActivities());
      
      // Load proposals
      setProposals(getProposals());
    };
    
    loadInitialData();
    
    // Set up polling for activities and proposals
    const interval = setInterval(() => {
      setActivities(getActivities());
      setProposals(getProposals());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  // Update tile owner when selected tile changes
  useEffect(() => {
    if (selectedTile) {
      const owner = getTileOwner(selectedTile.x, selectedTile.y);
      setTileOwner(owner);
    } else {
      setTileOwner(null);
    }
  }, [selectedTile]);

  // Handle tile selection
  const handleTileSelect = (x: number, y: number) => {
    setSelectedTile({ x, y });
  };

  // Handle pixel placement
  const handlePixelPlace = async (x: number, y: number, color: string) => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      const success = await placePixel(x, y, color);
      if (success) {
        toast.success('Pixel placed successfully!');
        // Refresh activities
        setActivities(getActivities());
      } else {
        toast.error('Failed to place pixel. You might not own this tile.');
      }
    } catch (error) {
      console.error('Failed to place pixel:', error);
      toast.error('Failed to place pixel. Please try again.');
    }
  };

  // Handle tile claiming
  const handleClaimTile = async () => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!selectedTile) {
      toast.error('Please select a tile first');
      return;
    }
    
    try {
      const success = await claimTile(selectedTile.x, selectedTile.y);
      if (success) {
        toast.success('Tile claimed successfully!');
        // Update tile owner
        setTileOwner(walletAddress);
        // Refresh activities
        setActivities(getActivities());
      } else {
        toast.error('Failed to claim tile. It might already be owned.');
      }
    } catch (error) {
      console.error('Failed to claim tile:', error);
      toast.error('Failed to claim tile. Please try again.');
    }
  };

  // Handle proposal voting
  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      const success = await voteOnProposal(proposalId, vote);
      if (success) {
        toast.success(`Voted ${vote} successfully!`);
        // Refresh activities and proposals
        setActivities(getActivities());
        setProposals(getProposals());
      } else {
        toast.error('Failed to vote. The proposal might be inactive.');
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      toast.error('Failed to vote. Please try again.');
    }
  };

  return (
    <Layout header={
      <WalletButton
        onConnect={handleConnectWallet}
        isConnected={!!walletAddress}
        walletAddress={walletAddress || undefined}
      />
    }>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-pixel-black p-4 pixel-border-special">
            <div className="mb-4">
              <h2 className="font-pixel text-lg mb-2">PixelCitadel World</h2>
              <p className="text-sm text-pixel-gray">
                Claim land, place pixels, and build together in this on-chain world. 
                Every pixel is stored on the blockchain.
              </p>
            </div>
            
            <PixelGrid
              selectedTile={selectedTile}
              selectedColor={selectedColor}
              onTileSelect={handleTileSelect}
              onPixelPlace={handlePixelPlace}
              className="mb-4"
            />
            
            <ColorPicker 
              selectedColor={selectedColor} 
              onColorSelect={setSelectedColor} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <TileInfo
            selectedTile={selectedTile}
            owner={tileOwner}
            onClaimTile={handleClaimTile}
          />
          
          <ActivityFeed activities={activities} />
          
          <GovernancePanel 
            proposals={proposals}
            onVote={handleVote}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
