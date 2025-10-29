import React from 'react';
import type { Task } from '../types';

interface TasksProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onToggleTask }) => {
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  return (
    <div className="space-y-6">
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
        className="flex items-center p-3 bg-gray-50 rounded-md transition-colors duration-200"
    >
        <span className="mr-3 font-bold text-blue-600">{index + 1}.</span>
        <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.$id)}
            className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className={`ml-4 text-lg flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {task.text}
        </span>
    </li>
);

export default Tasks;