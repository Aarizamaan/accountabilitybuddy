import React from 'react';
import { Trophy, Target, Calendar, TrendingUp, Award } from 'lucide-react';
import { useGoalStore } from '../store/useGoalStore';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

export function Dashboard() {
  const { goals, streak } = useGoalStore();

  const totalGoals = goals.length;
  const completedGoals = goals.filter((goal) => goal.status === 'completed').length;
  const completionRate = totalGoals ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Calculate completion data for the past 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dayGoals = goals.filter(
      (goal) => format(new Date(goal.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const dayCompletedGoals = dayGoals.filter((goal) => goal.status === 'completed').length;
    const dayCompletionRate = dayGoals.length ? (dayCompletedGoals / dayGoals.length) * 100 : 0;

    return {
      date: format(date, 'MMM d'),
      completionRate: Math.round(dayCompletionRate),
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-semibold">{streak} days</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-semibold">{totalGoals}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-semibold">{completionRate}%</p>
            </div>
            <div className="w-12 h-12">
              <CircularProgressbar
                value={completionRate}
                text={`${completionRate}%`}
                styles={buildStyles({
                  textSize: '24px',
                  pathColor: `rgba(62, 152, 199, ${completionRate / 100})`,
                  textColor: '#2563eb',
                  trailColor: '#d1d5db',
                })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-semibold">
                {goals.filter((goal) => goal.status !== 'completed').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Completion Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Goal Categories</h3>
          <div className="space-y-4">
            {['fitness', 'work', 'personal', 'education', 'other'].map((category) => {
              const categoryGoals = goals.filter((goal) => goal.category === category);
              const categoryCompletion = categoryGoals.length
                ? Math.round(
                    (categoryGoals.filter((goal) => goal.status === 'completed').length /
                      categoryGoals.length) *
                      100
                  )
                : 0;

              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="capitalize">{category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{categoryGoals.length} goals</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${categoryCompletion}%` }}
                      />
                    </div>
                    <span>{categoryCompletion}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}