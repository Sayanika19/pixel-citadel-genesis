
import { Activity } from '@/components/ActivityFeed';

// Mock wallet data
let connectedWallet: string | null = null;
let ownedTiles: Record<string, { x: number; y: number }> = {};

// Mock land data
let landTiles: Record<string, { owner: string; lastUpdate: Date }> = {};

// Mock activity feed data
let activities: Activity[] = [
  {
    id: '1',
    type: 'claim',
    user: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    details: {
      tileId: '15-23',
    },
  },
  {
    id: '2',
    type: 'pixel',
    user: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    details: {
      x: 15,
      y: 23,
      color: '#8b5cf6',
    },
  },
  {
    id: '3',
    type: 'vote',
    user: '0x8dC847Af872947Ac18d4a6E6ea1E9Bf80F7f3e8C',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    details: {
      vote: 'for',
      proposal: 'Allow pixel rate limit increase',
    },
  },
];

// Mock governance proposals
export interface Proposal {
  id: string;
  title: string;
  description: string;
  votes: {
    for: number;
    against: number;
  };
  status: 'active' | 'passed' | 'rejected';
  endTime: Date;
}

let proposals: Proposal[] = [
  {
    id: 'prop-1',
    title: 'Allow pixel rate limit increase',
    description: 'Increase the pixel placement rate from 10 to 20 pixels per day',
    votes: {
      for: 156,
      against: 23,
    },
    status: 'active',
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
  },
  {
    id: 'prop-2',
    title: 'Add new color palette',
    description: 'Add 10 new colors to the available pixel palette',
    votes: {
      for: 89,
      against: 102,
    },
    status: 'rejected',
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'prop-3',
    title: 'Create common area in center',
    description: 'Create a tax-free common area in the center of the map',
    votes: {
      for: 203,
      against: 18,
    },
    status: 'passed',
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  },
];

// Mock wallet connection
export const connectWallet = async (): Promise<string> => {
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random wallet address
  connectedWallet = `0x${Math.random().toString(16).substring(2, 14)}`;
  
  return connectedWallet;
};

export const getConnectedWallet = (): string | null => {
  return connectedWallet;
};

// Mock land claiming
export const claimTile = async (x: number, y: number): Promise<boolean> => {
  if (!connectedWallet) return false;
  
  const tileId = `${x}-${y}`;
  
  // Check if tile is already claimed
  if (landTiles[tileId]) {
    return false;
  }
  
  // Claim the tile
  landTiles[tileId] = {
    owner: connectedWallet,
    lastUpdate: new Date(),
  };
  
  // Add to owned tiles
  ownedTiles[tileId] = { x, y };
  
  // Add activity
  const activity: Activity = {
    id: `claim-${Date.now()}`,
    type: 'claim',
    user: connectedWallet,
    timestamp: new Date(),
    details: {
      tileId,
    },
  };
  
  activities.unshift(activity);
  
  return true;
};

// Check if a tile is owned by the current user
export const isTileOwnedByUser = (x: number, y: number): boolean => {
  if (!connectedWallet) return false;
  
  const tileId = `${x}-${y}`;
  return landTiles[tileId]?.owner === connectedWallet;
};

// Get the owner of a tile
export const getTileOwner = (x: number, y: number): string | null => {
  const tileId = `${x}-${y}`;
  return landTiles[tileId]?.owner || null;
};

// Mock pixel placement
export const placePixel = async (x: number, y: number, color: string): Promise<boolean> => {
  if (!connectedWallet) return false;
  
  // Check if user owns the tile or it's unclaimed
  const tileId = `${x}-${y}`;
  if (landTiles[tileId] && landTiles[tileId].owner !== connectedWallet) {
    return false;
  }
  
  // Add activity
  const activity: Activity = {
    id: `pixel-${Date.now()}`,
    type: 'pixel',
    user: connectedWallet,
    timestamp: new Date(),
    details: {
      x,
      y,
      color,
    },
  };
  
  activities.unshift(activity);
  
  return true;
};

// Get activities
export const getActivities = (): Activity[] => {
  return [...activities];
};

// Get governance proposals
export const getProposals = (): Proposal[] => {
  return [...proposals];
};

// Vote on a proposal
export const voteOnProposal = async (proposalId: string, vote: 'for' | 'against'): Promise<boolean> => {
  if (!connectedWallet) return false;
  
  const proposalIndex = proposals.findIndex(p => p.id === proposalId);
  if (proposalIndex === -1 || proposals[proposalIndex].status !== 'active') {
    return false;
  }
  
  // Update votes
  proposals[proposalIndex].votes[vote]++;
  
  // Add activity
  const activity: Activity = {
    id: `vote-${Date.now()}`,
    type: 'vote',
    user: connectedWallet,
    timestamp: new Date(),
    details: {
      vote,
      proposal: proposals[proposalIndex].title,
    },
  };
  
  activities.unshift(activity);
  
  return true;
};
