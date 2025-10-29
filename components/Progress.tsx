
import React from 'react';
import type { Task } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressProps {
  tasks: Task[];
}

const Progress: React.FC<ProgressProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = tasks.length - completedTasks;

  const data = [
    { name: 'Completed', value: completedTasks },
    { name: 'Incomplete', value: incompleteTasks },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="space-y-6">
       <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Completion Progress</h2>
        {tasks.length > 0 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        ) : (
            <p className="text-gray-500 text-center py-10">No tasks available to show progress.</p>
        )}
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary</h3>
        <p className="text-gray-600">You have completed <span className="font-bold text-green-600">{completedTasks}</span> out of <span className="font-bold text-gray-800">{tasks.length}</span> tasks.</p>
        {tasks.length > 0 && completedTasks / tasks.length >= 0.8 && (
            <p className="mt-2 text-green-700">Excellent work! Keep up the great momentum.</p>
        )}
         {tasks.length > 0 && completedTasks / tasks.length < 0.5 && (
            <p className="mt-2 text-yellow-700">You're making progress. Let's try to complete a few more tasks today.</p>
        )}
      </div>
    </div>
  );
};

export default Progress;
