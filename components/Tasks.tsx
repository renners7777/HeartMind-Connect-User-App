import React, { useState } from 'react';
import type { Task } from '../types';

interface TasksProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (text: string) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add a New Task</h2>
        <form onSubmit={handleAddTask} className="flex items-center gap-2">
            <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="e.g., Take medication at 10 AM"
                className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                disabled={!newTaskText.trim()}
            >
                Add
            </button>
        </form>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Tasks</h2>
        {incompleteTasks.length > 0 ? (
          <ul className="space-y-3">
            {incompleteTasks.map((task, index) => (
              <TaskItem key={task.$id} task={task} onToggleTask={onToggleTask} index={index}/>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You've completed all your tasks for today. Great job!</p>
        )}
      </div>

      {completedTasks.length > 0 && (
         <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Tasks</h2>
            <ul className="space-y-3">
                {completedTasks.map((task, index) => (
                <TaskItem key={task.$id} task={task} onToggleTask={onToggleTask} index={index} />
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};

interface TaskItemProps {
    task: Task;
    onToggleTask: (id: string) => void;
    index: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleTask, index }) => (
    <li
        className="flex items-start p-3 bg-gray-50 rounded-md transition-colors duration-200"
    >
        <div className="flex items-center flex-shrink-0 mt-1">
            <span className="mr-3 font-bold text-blue-600">{index + 1}.</span>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.$id)}
                className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
        </div>
        <div className="ml-4 flex-1">
            <span className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.text}
            </span>
            {task.creator_name && (
                <p className="text-xs text-gray-500 mt-1">
                    Added by {task.creator_name}
                </p>
            )}
        </div>
    </li>
);

export default Tasks;