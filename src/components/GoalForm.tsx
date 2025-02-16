import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, ListPlus } from 'lucide-react';
import { useGoalStore } from '../store/useGoalStore';
import { toast } from 'sonner';
import * as Select from '@radix-ui/react-select';

const goalFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  timeFrame: z.number().min(1, 'Time frame must be at least 1 minute'),
  category: z.enum(['fitness', 'work', 'personal', 'education', 'other']),
  priority: z.enum(['high', 'medium', 'low']),
  recurrence: z.enum(['daily', 'weekly', 'monthly', 'none']),
  reminderFrequency: z.enum(['hourly', 'daily', 'weekly'])
});

type GoalFormData = z.infer<typeof goalFormSchema>;

export function GoalForm() {
  const addGoal = useGoalStore((state) => state.addGoal);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      category: 'other',
      priority: 'medium',
      recurrence: 'none',
      reminderFrequency: 'daily'
    }
  });

  const onSubmit = (data: GoalFormData) => {
    addGoal(data);
    toast.success('Goal added successfully!');
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="fitness">Fitness</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            {...register('priority')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="timeFrame" className="block text-sm font-medium text-gray-700">
            Time Frame (minutes)
          </label>
          <input
            type="number"
            {...register('timeFrame', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.timeFrame && (
            <p className="mt-1 text-sm text-red-600">{errors.timeFrame.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700">
            Recurrence
          </label>
          <select
            {...register('recurrence')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="reminderFrequency" className="block text-sm font-medium text-gray-700">
          Reminder Frequency
        </label>
        <select
          {...register('reminderFrequency')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Goal
      </button>
    </form>
  );
}