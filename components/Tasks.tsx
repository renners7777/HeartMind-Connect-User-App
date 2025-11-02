import React, { useState } from 'react';
import styled from 'styled-components';
import type { Task } from '../types';

interface TasksProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string) => void;
}

const Container = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const AddTaskForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TaskInput = styled.input`
  flex-grow: 1;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

const AddButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 600;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  &:hover {
    background-color: #1d4ed8;
  }
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px #3b82f6;
  }
  &:disabled {
    background-color: #93c5fd;
  }
`;

const TaskList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TaskListItem = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
`;

const TaskCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

const TaskIndex = styled.span`
  margin-right: 0.75rem;
  font-weight: 700;
  color: #2563eb;
`;

const TaskCheckbox = styled.input`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 0.25rem;
  border-color: #d1d5db;
  color: #2563eb;
  &:focus {
    ring: #2563eb;
  }
  cursor: pointer;
`;

const TaskTextContainer = styled.div`
  margin-left: 1rem;
  flex: 1;
`;

const TaskText = styled.span<{ completed: boolean }>`
  font-size: 1.125rem;
  color: ${props => (props.completed ? '#9ca3af' : '#374151')};
  text-decoration: ${props => (props.completed ? 'line-through' : 'none')};
`;

const CreatorText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const NoTasksText = styled.p`
  color: #6b7280;
`;

const Tasks: React.FC<TasksProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const incompleteTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  return (
    <Container>
      <Card>
        <Title>Add a New Task</Title>
        <AddTaskForm onSubmit={handleAddTask}>
            <TaskInput
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g., Take medication at 10 AM"
            />
            <AddButton
                type="submit"
                disabled={!newTaskTitle.trim()}
            >
                Add
            </AddButton>
        </AddTaskForm>
      </Card>

      <Card>
        <Title>Today's Tasks</Title>
        {incompleteTasks.length > 0 ? (
          <TaskList>
            {incompleteTasks.map((task, index) => (
              <TaskItem key={task.$id} task={task} onToggleTask={onToggleTask} index={index}/>
            ))}
          </TaskList>
        ) : (
          <NoTasksText>You've completed all your tasks for today. Great job!</NoTasksText>
        )}
      </Card>

      {completedTasks.length > 0 && (
         <Card>
            <Title>Completed Tasks</Title>
            <TaskList>
                {completedTasks.map((task, index) => (
                <TaskItem key={task.$id} task={task} onToggleTask={onToggleTask} index={index} />
                ))}
            </TaskList>
        </Card>
      )}
    </Container>
  );
};

interface TaskItemProps {
    task: Task;
    onToggleTask: (id: string) => void;
    index: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleTask, index }) => {
    const isCompleted = task.status === 'completed';

    return (
        <TaskListItem>
            <TaskCheckboxContainer>
                <TaskIndex>{index + 1}.</TaskIndex>
                <TaskCheckbox
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleTask(task.$id)}
                />
            </TaskCheckboxContainer>
            <TaskTextContainer>
                <TaskText completed={isCompleted}>
                    {task.title}
                </TaskText>
                {task.creator_name && (
                    <CreatorText>
                        Added by {task.creator_name}
                    </CreatorText>
                )}
            </TaskTextContainer>
        </TaskListItem>
    );
};

export default Tasks;
