"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search,
  Bell,
  PlusCircle,
  Layout,
  Grid3x3,
  User
} from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Training } from './pages/Training';
import { Calendar } from './pages/Calendar';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import { WidgetLibrary } from './components/WidgetLibrary';
import { ThemeToggle } from './components/ThemeToggle';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback } from './components/ui/avatar';

type Page = 'dashboard' | 'training' | 'calendar' | 'progress' | 'profile';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [activeWidgets, setActiveWidgets] = useState<string[]>([
    'daily-plan',
    'recent-activities',
    'weekly-stats',
    'readiness',
    'goal-tracker',
    'plan-updates'
  ]);

  const handleAddWidget = (widgetType: string) => {
    if (!activeWidgets.includes(widgetType)) {
      setActiveWidgets([...activeWidgets, widgetType]);
      setIsLibraryOpen(false);
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    setActiveWidgets(activeWidgets.filter(id => id !== widgetId));
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    setIsEditMode(false); // Exit edit mode when navigating
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'dark' : ''} ${isEditMode ? 'edit-mode-active' : ''}`}>
      {/* Background with texture */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#0a0f1a] to-[#050812]' : 'bg-gradient-to-b from-[#fafbfc] to-[#f4f5f7]'}`} />
        
        {/* Subtle noise texture */}
        <div 
          className={`absolute inset-0 ${isDark ? 'opacity-[0.015]' : 'opacity-[0.02]'}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
        
        {/* Vignette effect */}
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]' : 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)]'}`} />
        
        {/* Subtle route pattern - top right */}
        <svg className={`absolute top-0 right-0 w-[800px] h-[800px] ${isDark ? 'opacity-[0.015]' : 'opacity-[0.025]'}`} viewBox="0 0 800 800" fill="none">
          <path d="M 100 200 Q 200 100 300 150 T 500 200 Q 600 250 700 200" stroke="currentColor" strokeWidth="2" className="text-foreground" fill="none" />
          <path d="M 150 300 Q 250 200 350 250 T 550 300 Q 650 350 750 300" stroke="currentColor" strokeWidth="2" className="text-foreground" fill="none" />
          <path d="M 50 400 Q 150 300 250 350 T 450 400 Q 550 450 650 400" stroke="currentColor" strokeWidth="2" className="text-foreground" fill="none" />
          <circle cx="300" cy="150" r="4" fill="currentColor" className="text-foreground" />
          <circle cx="500" cy="200" r="4" fill="currentColor" className="text-foreground" />
          <circle cx="350" cy="250" r="4" fill="currentColor" className="text-foreground" />
        </svg>
        
        {/* Subtle grid pattern - bottom left */}
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] ${isDark ? 'opacity-[0.01]' : 'opacity-[0.02]'}`}>
          <svg className="w-full h-full" viewBox="0 0 600 600">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground"/>
              </pattern>
            </defs>
            <rect width="600" height="600" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Subtle topographic lines - center */}
        <svg className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] ${isDark ? 'opacity-[0.008]' : 'opacity-[0.015]'}`} viewBox="0 0 1000 600" fill="none">
          <ellipse cx="500" cy="300" rx="400" ry="250" stroke="currentColor" strokeWidth="1" className="text-foreground" fill="none" />
          <ellipse cx="500" cy="300" rx="350" ry="210" stroke="currentColor" strokeWidth="1" className="text-foreground" fill="none" />
          <ellipse cx="500" cy="300" rx="300" ry="170" stroke="currentColor" strokeWidth="1" className="text-foreground" fill="none" />
          <ellipse cx="500" cy="300" rx="250" ry="140" stroke="currentColor" strokeWidth="1" className="text-foreground" fill="none" />
        </svg>
        
        {/* Subtle elevation/route markers */}
        <div className={`absolute top-20 right-1/4 ${isDark ? 'opacity-[0.01]' : 'opacity-[0.02]'}`}>
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            <path d="M 20 180 L 40 160 L 60 140 L 80 110 L 100 80 L 120 100 L 140 70 L 160 50 L 180 30" stroke="currentColor" strokeWidth="2" className="text-foreground" fill="none" strokeDasharray="4 4" />
          </svg>
        </div>
        
        {/* Bike chain pattern - subtle decoration */}
        <div className={`absolute bottom-32 left-1/4 ${isDark ? 'opacity-[0.008]' : 'opacity-[0.012]'}`}>
          <svg width="150" height="40" viewBox="0 0 150 40" fill="none">
            <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" className="text-foreground" fill="none" />
            <circle cx="50" cy="20" r="8" stroke="currentColor" strokeWidth="2" className="text-foreground" fill="none" />
            <circle cx="80" cy="20" r="8" stroke="currentColor" strokeWidth="2" className="text-foreground" fill="none" />
            <circle cx="110" cy="20" r="8" stroke="currentColor" strokeWidth="2" className="text-foreground" fill="none" />
            <line x1="28" y1="20" x2="42" y2="20" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
            <line x1="58" y1="20" x2="72" y2="20" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
            <line x1="88" y1="20" x2="102" y2="20" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
          </svg>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-semibold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent"
              >
                trainify
              </motion.h1>
              <div className="hidden lg:flex items-center gap-1">
                <button 
                  onClick={() => navigateToPage('dashboard')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 'dashboard' 
                      ? 'text-foreground bg-secondary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigateToPage('training')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 'training' 
                      ? 'text-foreground bg-secondary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  Training
                </button>
                <button 
                  onClick={() => navigateToPage('calendar')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 'calendar' 
                      ? 'text-foreground bg-secondary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  Calendar
                </button>
                <button 
                  onClick={() => navigateToPage('progress')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 'progress' 
                      ? 'text-foreground bg-secondary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  Progress
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentPage === 'dashboard' && (
                <Button
                  variant={isEditMode ? "default" : "ghost"}
                  size="icon"
                  className={isEditMode ? "bg-info hover:bg-info/90" : "hover:bg-secondary"}
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? <Grid3x3 className="w-4 h-4" /> : <Layout className="w-4 h-4 text-foreground" />}
                </Button>
              )}
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <Search className="w-4 h-4 text-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <Bell className="w-4 h-4 text-foreground" />
              </Button>
              {currentPage === 'dashboard' && (
                <Button 
                  size="sm" 
                  className="gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                  onClick={() => setIsLibraryOpen(true)}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Add widget</span>
                </Button>
              )}
              <button onClick={() => navigateToPage('profile')}>
                <Avatar className="w-8 h-8 ml-1 cursor-pointer hover:ring-2 hover:ring-info/30 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white text-xs font-medium">CS</AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {isEditMode && currentPage === 'dashboard' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-info/10 border-b border-info/20 overflow-hidden"
          >
            <div className="max-w-[1920px] mx-auto px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-info animate-pulse" />
                  <p className="text-sm text-foreground">
                    Edit mode is active. Click <strong>×</strong> to remove widgets or add new ones from the library.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditMode(false)}
                >
                  Done editing
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="max-w-[1920px] mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 'dashboard' && (
              <Dashboard 
                isEditMode={isEditMode}
                activeWidgets={activeWidgets}
                onRemoveWidget={handleRemoveWidget}
              />
            )}
            {currentPage === 'training' && <Training />}
            {currentPage === 'calendar' && <Calendar />}
            {currentPage === 'progress' && <Progress />}
            {currentPage === 'profile' && <Profile />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Widget Library Drawer */}
      <WidgetLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onAddWidget={handleAddWidget}
        activeWidgets={activeWidgets}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        
        /* Prevent text selection during drag in edit mode */
        .edit-mode-active {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
    </div>
  );
}
