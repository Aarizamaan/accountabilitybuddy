import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, GoalStatus, SubTask } from '../types/goal';

interface GoalStore {
  goals: Goal[];
  streak: number;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status' | 'subTasks' | 'dependencies'>) => void;
  updateGoalStatus: (id: string, status: GoalStatus) => void;
  deleteGoal: (id: string) => void;
  calculateStreak: () => void;
  addSubTask: (goalId: string, title: string) => void;
  toggleSubTask: (goalId: string, subTaskId: string) => void;
  addDependency: (goalId: string, dependencyId: string) => void;
  removeDependency: (goalId: string, dependencyId: string) => void;
  getGoalsByCategory: (category: Goal['category']) => Goal[];
  getGoalsByPriority: (priority: Goal['priority']) => Goal[];
  updateLastReminderSent: (id: string) => void;
  getGoalsNeedingReminder: () => Goal[];
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],
      streak: 0,

      addGoal: (goalData) => {
        const newGoal: Goal = {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          status: 'not_started',
          subTasks: [],
          dependencies: [],
          ...goalData,
        };

        set((state) => ({
          goals: [...state.goals, newGoal],
        }));
      },

      updateGoalStatus: (id, status) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  status,
                  completedAt: status === 'completed' ? new Date() : goal.completedAt,
                }
              : goal
          ),
        }));
        get().calculateStreak();
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      calculateStreak: () => {
        const { goals } = get();
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);

          const dayGoals = goals.filter((goal) => {
            const goalDate = new Date(goal.createdAt);
            goalDate.setHours(0, 0, 0, 0);
            return goalDate.getTime() === date.getTime();
          });

          if (dayGoals.length === 0) break;

          const allCompleted = dayGoals.every((goal) => goal.status === 'completed');
          if (!allCompleted) break;

          currentStreak++;
        }

        set({ streak: currentStreak });
      },

      addSubTask: (goalId, title) => {
        const newSubTask: SubTask = {
          id: crypto.randomUUID(),
          title,
          completed: false,
        };

        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? { ...goal, subTasks: [...goal.subTasks, newSubTask] }
              : goal
          ),
        }));
      },

      toggleSubTask: (goalId, subTaskId) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  subTasks: goal.subTasks.map((subTask) =>
                    subTask.id === subTaskId
                      ? { ...subTask, completed: !subTask.completed }
                      : subTask
                  ),
                }
              : goal
          ),
        }));
      },

      addDependency: (goalId, dependencyId) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? { ...goal, dependencies: [...goal.dependencies, dependencyId] }
              : goal
          ),
        }));
      },

      removeDependency: (goalId, dependencyId) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  dependencies: goal.dependencies.filter((id) => id !== dependencyId),
                }
              : goal
          ),
        }));
      },

      getGoalsByCategory: (category) => {
        return get().goals.filter((goal) => goal.category === category);
      },

      getGoalsByPriority: (priority) => {
        return get().goals.filter((goal) => goal.priority === priority);
      },

      updateLastReminderSent: (id) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, lastReminderSent: new Date() }
              : goal
          ),
        }));
      },

      getGoalsNeedingReminder: () => {
        const now = new Date();
        return get().goals.filter((goal) => {
          if (!goal.lastReminderSent) return true;
          
          const timeSinceLastReminder = now.getTime() - goal.lastReminderSent.getTime();
          const reminderInterval = {
            hourly: 60 * 60 * 1000,
            daily: 24 * 60 * 60 * 1000,
            weekly: 7 * 24 * 60 * 60 * 1000,
          }[goal.reminderFrequency];

          return timeSinceLastReminder >= reminderInterval;
        });
      },
    }),
    {
      name: 'goal-storage',
    }
  )
);