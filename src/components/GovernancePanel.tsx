
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Proposal {
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

interface GovernancePanelProps {
  proposals: Proposal[];
  onVote: (proposalId: string, vote: 'for' | 'against') => void;
  className?: string;
}

const GovernancePanel: React.FC<GovernancePanelProps> = ({
  proposals,
  onVote,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeProposals = proposals.filter(p => p.status === 'active');
  const completedProposals = proposals.filter(p => p.status !== 'active');

  const getTimeRemaining = (endTime: Date) => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className={cn("bg-pixel-black p-2 pixel-border-special", className)}>
      <h3 className="text-white font-pixel text-sm mb-2 px-2">Governance</h3>
      
      <div className="flex border-b border-pixel-purple-dark mb-2">
        <button
          className={cn(
            "py-1 px-3 text-xs font-medium",
            activeTab === 'active' 
              ? "bg-pixel-purple text-white" 
              : "text-pixel-gray hover:text-white"
          )}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button
          className={cn(
            "py-1 px-3 text-xs font-medium",
            activeTab === 'completed' 
              ? "bg-pixel-purple text-white" 
              : "text-pixel-gray hover:text-white"
          )}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-3 pr-4">
          {activeTab === 'active' ? (
            activeProposals.length > 0 ? (
              activeProposals.map(proposal => (
                <div key={proposal.id} className="bg-pixel-purple-dark p-2">
                  <h4 className="font-medium text-sm mb-1">{proposal.title}</h4>
                  <p className="text-xs text-pixel-gray mb-2">{proposal.description}</p>
                  
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-pixel-gray">{getTimeRemaining(proposal.endTime)}</span>
                    <span>
                      <span className="text-green-400">For: {proposal.votes.for}</span>
                      {' / '}
                      <span className="text-red-400">Against: {proposal.votes.against}</span>
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => onVote(proposal.id, 'for')}
                      className="bg-green-500 text-white py-1 px-3 text-xs font-medium hover:bg-green-600 flex-1"
                    >
                      Vote For
                    </button>
                    <button
                      onClick={() => onVote(proposal.id, 'against')}
                      className="bg-red-500 text-white py-1 px-3 text-xs font-medium hover:bg-red-600 flex-1"
                    >
                      Vote Against
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-pixel-gray text-xs p-2">No active proposals</div>
            )
          ) : (
            completedProposals.length > 0 ? (
              completedProposals.map(proposal => (
                <div 
                  key={proposal.id} 
                  className={cn(
                    "p-2",
                    proposal.status === 'passed' ? 'bg-green-900 bg-opacity-30' : 'bg-red-900 bg-opacity-30'
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">{proposal.title}</h4>
                    <span 
                      className={cn(
                        "text-xs font-medium px-2 py-0.5",
                        proposal.status === 'passed' ? 'bg-green-500' : 'bg-red-500'
                      )}
                    >
                      {proposal.status === 'passed' ? 'Passed' : 'Rejected'}
                    </span>
                  </div>
                  <p className="text-xs text-pixel-gray mb-2">{proposal.description}</p>
                  <div className="text-xs">
                    <span className="text-green-400">For: {proposal.votes.for}</span>
                    {' / '}
                    <span className="text-red-400">Against: {proposal.votes.against}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-pixel-gray text-xs p-2">No completed proposals</div>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GovernancePanel;
