import { z } from 'zod';

export const goalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  timeFrame: z.number().min(1, 'Time frame must be at least 1 minute'),
  category: z.enum(['fitness', 'work', 'personal', 'education', 'other']),
  priority: z.enum(['high', 'medium', 'low']),
  recurrence: z.enum(['daily', 'weekly', 'monthly', 'none']),
  subTasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean()
  })),
  dependencies: z.array(z.string()),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'partially_done']),
  reminderFrequency: z.enum(['hourly', 'daily', 'weekly']),
  lastReminderSent: z.date().optional()
});

export type Goal = z.infer<typeof goalSchema>;
export type GoalStatus = Goal['status'];
export type GoalCategory = Goal['category'];
export type GoalPriority = Goal['priority'];
export type GoalRecurrence = Goal['recurrence'];
export type ReminderFrequency = Goal['reminderFrequency'];

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}