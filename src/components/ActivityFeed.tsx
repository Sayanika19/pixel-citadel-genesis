
import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Activity {
  id: string;
  type: 'pixel' | 'claim' | 'vote';
  user: string;
  timestamp: Date;
  details: {
    x?: number;
    y?: number;
    color?: string;
    tileId?: string;
    vote?: 'for' | 'against';
    proposal?: string;
  };
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, className }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'pixel':
        return '🎨';
      case 'claim':
        return '🏡';
      case 'vote':
        return '🗳️';
      default:
        return '📝';
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'pixel':
        return `placed a pixel at (${activity.details.x}, ${activity.details.y})`;
      case 'claim':
        return `claimed tile #${activity.details.tileId}`;
      case 'vote':
        return `voted ${activity.details.vote} on "${activity.details.proposal}"`;
      default:
        return 'performed an action';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={cn("bg-pixel-black p-2 pixel-border-special", className)}>
      <h3 className="text-white font-pixel text-sm mb-2 px-2">World Activity</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-4">
          {activities.length === 0 ? (
            <div className="text-pixel-gray text-xs p-2">No recent activity</div>
          ) : (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className="bg-pixel-purple-dark p-2 text-xs flex gap-2 items-start"
              >
                <span className="text-lg leading-none">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold truncate">{activity.user}</span>
                    <span className="text-pixel-gray">{formatTime(activity.timestamp)}</span>
                  </div>
                  <p className="text-white">{getActivityText(activity)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActivityFeed;
