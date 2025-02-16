import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clock, Trash2, Plus, AlertCircle } from 'lucide-react';
import { useGoalStore } from '../store/useGoalStore';
import { GoalStatus, Goal } from '../types/goal';
import * as Tabs from '@radix-ui/react-tabs';

export function GoalList() {
  const { goals, updateGoalStatus, deleteGoal, addSubTask, toggleSubTask } = useGoalStore();
  const [newSubTask, setNewSubTask] = useState<string>('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const handleStatusUpdate = (id: string, status: GoalStatus) => {
    updateGoalStatus(id, status);
  };

  const handleAddSubTask = (goalId: string) => {
    if (newSubTask.trim()) {
      addSubTask(goalId, newSubTask.trim());
      setNewSubTask('');
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Tabs.Root defaultValue="all" className="space-y-4">
      <Tabs.List className="flex space-x-2 mb-4">
        <Tabs.Trigger
          value="all"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          All Goals
        </Tabs.Trigger>
        <Tabs.Trigger
          value="active"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Active
        </Tabs.Trigger>
        <Tabs.Trigger
          value="completed"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Completed
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="all" className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">{goal.title}</h3>
                  <span className={`text-sm ${getPriorityColor(goal.priority)}`}>
                    {goal.priority}
                  </span>
                </div>
                <p className="text-gray-600">{goal.description}</p>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {goal.timeFrame} minutes
              </div>
              <div>
                Created: {format(new Date(goal.createdAt), 'MMM d, yyyy')}
              </div>
              <div className="px-2 py-1 rounded-full bg-gray-100">
                {goal.category}
              </div>
              {goal.recurrence !== 'none' && (
                <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {goal.recurrence}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Sub-tasks</h4>
                <button
                  onClick={() => setSelectedGoalId(goal.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {selectedGoalId === goal.id && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Add a sub-task"
                  />
                  <button
                    onClick={() => handleAddSubTask(goal.id)}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}
              <ul className="space-y-2">
                {goal.subTasks.map((subTask) => (
                  <li
                    key={subTask.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={subTask.completed}
                      onChange={() => toggleSubTask(goal.id, subTask.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className={subTask.completed ? 'line-through text-gray-400' : ''}>
                      {subTask.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={goal.status}
                onChange={(e) => handleStatusUpdate(goal.id, e.target.value as GoalStatus)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="partially_done">Partially Done</option>
                <option value="completed">Completed</option>
              </select>
              {goal.status === 'completed' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
        ))}
      </Tabs.Content>

      <Tabs.Content value="active" className="space-y-4">
        {goals.filter((goal) => goal.status !== 'completed').map((goal) => (
          // Render active goals
          <div key={goal.id}>...</div>
        ))}
      </Tabs.Content>

      <Tabs.Content value="completed" className="space-y-4">
        {goals.filter((goal) => goal.status === 'completed').map((goal) => (
          // Render completed goals
          <div key={goal.id}>...</div>
        ))}
      </Tabs.Content>
    </Tabs.Root>
  );
}