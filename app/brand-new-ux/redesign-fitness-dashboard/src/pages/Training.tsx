import { motion, AnimatePresence } from 'framer-motion';
import { Bike, Footprints, Dumbbell, Zap, Clock, TrendingUp, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

export function Training() {
  const workouts = [
    {
      id: 1,
      title: 'Endurance Base Ride',
      sport: 'Cycling',
      icon: Bike,
      duration: '90 min',
      load: 320,
      zone: 'Z2',
      color: '#3b82f6',
      description: 'Long steady ride in Zone 2, focus on cadence 85-95rpm',
      completed: false,
      scheduled: 'Today • 6:00 PM'
    },
    {
      id: 2,
      title: 'Recovery Run',
      sport: 'Running',
      icon: Footprints,
      duration: '30 min',
      load: 150,
      zone: 'Z1',
      color: '#10b981',
      description: 'Easy recovery jog, keep heart rate low',
      completed: true,
      scheduled: 'Yesterday • 7:00 AM'
    },
    {
      id: 3,
      title: 'Interval Training',
      sport: 'Cycling',
      icon: Bike,
      duration: '60 min',
      load: 420,
      zone: 'Z4-Z5',
      color: '#ef4444',
      description: '8x3min @ FTP, 2min rest between intervals',
      completed: false,
      scheduled: 'Tomorrow • 6:30 AM'
    },
    {
      id: 4,
      title: 'Strength Training',
      sport: 'Gym',
      icon: Dumbbell,
      duration: '45 min',
      load: 180,
      zone: 'Core',
      color: '#8b5cf6',
      description: 'Upper body + core work',
      completed: false,
      scheduled: 'Wednesday • 5:00 PM'
    },
  ];

  const trainingPlans = [
    { name: 'Base Building Phase', weeks: 8, current: 4, workouts: 32 },
    { name: 'Build Phase', weeks: 6, current: 0, workouts: 24 },
    { name: 'Peak Phase', weeks: 4, current: 0, workouts: 16 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-semibold text-foreground">Training</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your workouts and training plans</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            AI Suggest
          </Button>
          <Button size="sm" className="bg-[#3b82f6] hover:bg-[#2563eb]">
            Create workout
          </Button>
        </div>
      </motion.div>

      {/* Training Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {trainingPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-5 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl ${
              plan.current > 0 ? 'bg-[#3b82f6]/20' : 'bg-muted/20'
            }`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.current > 0 ? `Week ${plan.current} of ${plan.weeks}` : 'Not started'}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] uppercase font-medium tracking-wider ${
                  plan.current > 0 ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 'bg-muted text-muted-foreground'
                }`}>
                  {plan.current > 0 ? 'Active' : 'Upcoming'}
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={(plan.current / plan.weeks) * 100} className="h-1.5" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{plan.workouts} workouts</span>
                  <span className="text-foreground font-medium">{plan.weeks} weeks</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Workouts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-foreground">Upcoming workouts</h2>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        
        <div className="space-y-3">
          {workouts.map((workout, index) => {
            const Icon = workout.icon;
            return (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative rounded-xl border p-4 transition-all
                  ${workout.completed 
                    ? 'bg-secondary/50 border-border opacity-60' 
                    : 'bg-gradient-to-br from-card to-transparent border-border hover:border-info/30'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${workout.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: workout.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-medium text-foreground">{workout.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{workout.scheduled}</p>
                      </div>
                      {workout.completed && (
                        <CheckCircle2 className="w-5 h-5 text-[#10b981] flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{workout.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-foreground">{workout.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-foreground">{workout.load} kJ</span>
                      </div>
                      <div className="px-2 py-0.5 rounded-md bg-secondary text-foreground">
                        {workout.zone}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!workout.completed && (
                    <Button 
                      size="sm" 
                      className="flex-shrink-0"
                      style={{ backgroundColor: workout.color }}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Training Zones Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Power Zones</h3>
            <Button variant="ghost" size="sm">Edit FTP</Button>
          </div>
          <div className="space-y-2.5">
            {[
              { zone: 'Z1 - Recovery', range: '< 143W', color: '#94a3b8' },
              { zone: 'Z2 - Endurance', range: '143-199W', color: '#10b981' },
              { zone: 'Z3 - Tempo', range: '200-227W', color: '#f59e0b' },
              { zone: 'Z4 - Threshold', range: '228-256W', color: '#ef4444' },
              { zone: 'Z5 - VO2 Max', range: '257-313W', color: '#dc2626' },
            ].map((zone) => (
              <div key={zone.zone} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-sm text-foreground flex-1">{zone.zone}</span>
                <span className="text-sm text-muted-foreground">{zone.range}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Weekly Progress</h3>
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Workouts completed</span>
                <span className="text-sm font-medium text-foreground">4 / 5</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Training load</span>
                <span className="text-sm font-medium text-foreground">1,230 / 1,400 kJ</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Training time</span>
                <span className="text-sm font-medium text-foreground">6h 45m / 8h</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
