import React from 'react';
import { Toaster } from 'sonner';
import { GoalForm } from './components/GoalForm';
import { GoalList } from './components/GoalList';
import { Dashboard } from './components/Dashboard';
import { Target } from 'lucide-react';
import { useEffect } from 'react';
import { useGoalStore } from './store/useGoalStore';

function App() {
  const { getGoalsNeedingReminder, updateLastReminderSent } = useGoalStore();

  useEffect(() => {
    const checkReminders = () => {
      const goalsNeedingReminder = getGoalsNeedingReminder();
      goalsNeedingReminder.forEach((goal) => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Goal Reminder', {
            body: `Don't forget about your goal: ${goal.title}`,
          });
        }
        updateLastReminderSent(goal.id);
      });
    };

    if ('Notification' in window) {
      Notification.requestPermission();
    }

    const intervalId = setInterval(checkReminders, 60000);
    return () => clearInterval(intervalId);
  }, [getGoalsNeedingReminder, updateLastReminderSent]);

  return (
    <div className="min-h-screen bg-dark-900 bg-gradient-radial from-dark-800 to-dark-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A2333',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} 
      />
      
      <header className="bg-dark-800 border-b border-dark-600">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-neon-blue neon-glow floating" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Accountability Buddy
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          <Dashboard />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <GoalForm />
            </div>
            <div className="lg:col-span-2">
              <GoalList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;