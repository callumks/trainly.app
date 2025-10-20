import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, MapPin, Edit, Settings, Bell, Shield, Bike, Footprints, Mountain } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';

export function Profile() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>
      </motion.div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 ring-4 ring-border">
              <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-2xl font-medium">
                CS
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#3b82f6] hover:bg-[#2563eb]"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-foreground mb-1">Callum Smith</h2>
            <p className="text-sm text-muted-foreground mb-4">Amateur cyclist & triathlete</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>callum.smith@trainify.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Boulder, CO</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined March 2024</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>32 years old</span>
              </div>
            </div>
          </div>

          <Button variant="outline">
            Edit profile
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total workouts', value: '248', icon: Calendar },
          { label: 'Total time', value: '312h', icon: Calendar },
          { label: 'Total distance', value: '4,820km', icon: MapPin },
          { label: 'Current streak', value: '12 days', icon: User },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <Icon className="w-5 h-5 text-[#3b82f6] mb-3" />
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Sports & Equipment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Your sports</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center">
                <Bike className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Cycling</p>
                <p className="text-xs text-muted-foreground">Primary sport • 156 activities</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                <Footprints className="w-5 h-5 text-[#10b981]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Running</p>
                <p className="text-xs text-muted-foreground">62 activities</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                <Mountain className="w-5 h-5 text-[#8b5cf6]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Climbing</p>
                <p className="text-xs text-muted-foreground">30 activities</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Equipment</h3>
            <Button variant="ghost" size="sm">Add</Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Trek Émonda SL 6</p>
                <p className="text-xs text-muted-foreground">Road bike • 2,840 km</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Specialized Tarmac</p>
                <p className="text-xs text-muted-foreground">Road bike • 1,520 km</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Nike Pegasus 40</p>
                <p className="text-xs text-muted-foreground">Running shoes • 460 km</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-foreground">Account settings</h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue="Callum Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="callum.smith@trainify.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="Boulder, CO" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" defaultValue="72" />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button className="bg-[#3b82f6] hover:bg-[#2563eb]">
              Save changes
            </Button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { label: 'Workout reminders', description: 'Get notified before scheduled workouts' },
            { label: 'Weekly summary', description: 'Receive a weekly training summary email' },
            { label: 'Plan updates', description: 'Notifications for AI-suggested plan changes' },
            { label: 'Achievement badges', description: 'Celebrate when you hit milestones' },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between py-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{setting.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-foreground">Privacy & security</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Activity privacy</p>
              <p className="text-xs text-muted-foreground mt-0.5">Make your activities visible to followers</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Profile visibility</p>
              <p className="text-xs text-muted-foreground mt-0.5">Allow others to find your profile</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="pt-3 border-t border-border">
            <Button variant="outline">Change password</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
