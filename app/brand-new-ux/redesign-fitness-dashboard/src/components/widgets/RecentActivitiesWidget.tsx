import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { ActivityItem } from '../ActivityItem';
import { Button } from '../ui/button';

export function RecentActivitiesWidget() {
  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Recent stuff</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last synced 2min ago</p>
        </div>
        <motion.button
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      </div>
      
      <div className="flex gap-2 mb-5">
        <Button size="sm" className="flex-1 bg-[#10b981] hover:bg-[#059669]">
          Sync Strava
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          Add
        </Button>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
        <ActivityItem 
          title="Quick spin around the park"
          type="Bike"
          duration="7.7km"
          distance="20min"
          date="Yesterday"
          time="6:02 PM"
        />
        <ActivityItem 
          title="Long weekend ride 🚴"
          type="Bike"
          duration="48.6km"
          distance="1h 24min"
          date="Oct 18"
          time="3:18 PM"
        />
        <ActivityItem 
          title="Recovery ride"
          type="Bike"
          duration="40.3km"
          distance="1h 15min"
          date="Oct 17"
          time="9:39 AM"
        />
        <ActivityItem 
          title="Easy morning run"
          type="Run"
          duration="5.2km"
          distance="28min"
          date="Oct 16"
          time="7:15 AM"
        />
        <ActivityItem 
          title="Upper body workout"
          type="Strength"
          duration="45min"
          date="Oct 15"
          time="6:30 PM"
        />
        <ActivityItem 
          title="Hill repeats"
          type="Run"
          duration="8.2km"
          distance="42min"
          date="Oct 14"
          time="6:30 AM"
        />
      </div>
    </div>
  );
}
