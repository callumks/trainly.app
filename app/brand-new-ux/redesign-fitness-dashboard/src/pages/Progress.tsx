import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap, Heart, Trophy } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Progress() {
  const fitnessData = [
    { date: 'Sep 1', fitness: 42, fatigue: 38, form: 4 },
    { date: 'Sep 8', fitness: 45, fatigue: 40, form: 5 },
    { date: 'Sep 15', fitness: 48, fatigue: 42, form: 6 },
    { date: 'Sep 22', fitness: 52, fatigue: 45, form: 7 },
    { date: 'Sep 29', fitness: 55, fatigue: 47, form: 8 },
    { date: 'Oct 6', fitness: 58, fatigue: 50, form: 8 },
    { date: 'Oct 13', fitness: 62, fatigue: 52, form: 10 },
    { date: 'Oct 20', fitness: 65, fatigue: 54, form: 11 },
  ];

  const powerData = [
    { week: 'W1', ftp: 265, avg: 220 },
    { week: 'W2', ftp: 268, avg: 225 },
    { week: 'W3', ftp: 270, avg: 228 },
    { week: 'W4', ftp: 272, avg: 230 },
    { week: 'W5', ftp: 275, avg: 235 },
    { week: 'W6', ftp: 278, avg: 238 },
    { week: 'W7', ftp: 282, avg: 242 },
    { week: 'W8', ftp: 285, avg: 245 },
  ];

  const weeklyLoadData = [
    { day: 'Mon', load: 250 },
    { day: 'Tue', load: 180 },
    { day: 'Wed', load: 0 },
    { day: 'Thu', load: 320 },
    { day: 'Fri', load: 200 },
    { day: 'Sat', load: 280 },
    { day: 'Sun', load: 0 },
  ];

  const metrics = [
    {
      label: 'FTP',
      value: '285W',
      change: '+12W',
      trend: 'up',
      icon: Zap,
      color: '#3b82f6'
    },
    {
      label: 'VO₂ Max',
      value: '56',
      change: '+2',
      trend: 'up',
      icon: Heart,
      color: '#ef4444'
    },
    {
      label: 'Training Load',
      value: '1,230 kJ',
      change: '-150 kJ',
      trend: 'down',
      icon: Activity,
      color: '#10b981'
    },
    {
      label: 'Readiness',
      value: '84/100',
      change: '+6',
      trend: 'up',
      icon: Trophy,
      color: '#8b5cf6'
    },
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
          <h1 className="font-semibold text-foreground">Progress</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your fitness and performance metrics</p>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 relative overflow-hidden"
            >
              <div 
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl"
                style={{ backgroundColor: `${metric.color}20` }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5" style={{ color: metric.color }} />
                  <div className={`flex items-center gap-1 text-xs ${
                    metric.trend === 'up' ? 'text-[#10b981]' : 'text-[#ef4444]'
                  }`}>
                    <TrendIcon className="w-3 h-3" />
                    <span>{metric.change}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fitness Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-1">Fitness, Fatigue & Form</h2>
          <p className="text-xs text-muted-foreground">Track your Training Stress Balance over time</p>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fitnessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="fitness" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                name="Fitness"
              />
              <Line 
                type="monotone" 
                dataKey="fatigue" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                name="Fatigue"
              />
              <Line 
                type="monotone" 
                dataKey="form" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                name="Form"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
            <span className="text-xs text-muted-foreground">Fitness</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className="text-xs text-muted-foreground">Fatigue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]" />
            <span className="text-xs text-muted-foreground">Form</span>
          </div>
        </div>
      </div>

      {/* Power Progress & Weekly Load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FTP Progress */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h2 className="font-semibold text-foreground mb-1">FTP Progress</h2>
            <p className="text-xs text-muted-foreground">8-week power improvement</p>
          </div>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerData}>
                <defs>
                  <linearGradient id="ftpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="week" 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                  domain={[260, 290]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ftp" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#ftpGradient)"
                  name="FTP"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Load */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h2 className="font-semibold text-foreground mb-1">Weekly Load</h2>
            <p className="text-xs text-muted-foreground">Training stress distribution</p>
          </div>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="day" 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="load" 
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  name="Load (kJ)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Personal Records */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-4">Personal Records</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '5 min power', value: '325W', date: 'Oct 12, 2025' },
            { label: '20 min power', value: '285W', date: 'Oct 18, 2025' },
            { label: '1 hour power', value: '245W', date: 'Oct 10, 2025' },
            { label: 'Longest ride', value: '120km', date: 'Oct 5, 2025' },
          ].map((record) => (
            <div key={record.label} className="p-4 bg-secondary/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">{record.label}</p>
              <p className="text-xl font-semibold text-foreground mb-0.5">{record.value}</p>
              <p className="text-xs text-muted-foreground">{record.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
