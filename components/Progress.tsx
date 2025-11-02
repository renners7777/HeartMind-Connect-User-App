import React from 'react';
import styled from 'styled-components';
import type { Task } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressProps {
  tasks: Task[];
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

const Subtitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
`;

const SummaryText = styled.p`
  color: #4b5563;
`;

const Highlight = styled.span<{ color?: string }>`
  font-weight: 700;
  color: ${props => props.color || '#1f2937'};
`;

const MotivationalText = styled.p<{ color?: string }>`
  margin-top: 0.5rem;
  color: ${props => props.color || '#16a34a'};
`;

const NoTasksText = styled.p`
  color: #6b7280;
  text-align: center;
  padding: 2.5rem 0;
`;

const Progress: React.FC<ProgressProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = tasks.length - completedTasks;

  const data = [
    { name: 'Completed', value: completedTasks },
    { name: 'Incomplete', value: incompleteTasks },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <Container>
      <Card>
        <Title>Task Completion Progress</Title>
        {tasks.length > 0 ? (
          <ChartContainer>
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
          </ChartContainer>
        ) : (
          <NoTasksText>No tasks available to show progress.</NoTasksText>
        )}
      </Card>
      <Card>
        <Subtitle>Summary</Subtitle>
        <SummaryText>
          You have completed <Highlight color="#10B981">{completedTasks}</Highlight> out of <Highlight>{tasks.length}</Highlight> tasks.
        </SummaryText>
        {tasks.length > 0 && completedTasks / tasks.length >= 0.8 && (
          <MotivationalText>Excellent work! Keep up the great momentum.</MotivationalText>
        )}
        {tasks.length > 0 && completedTasks / tasks.length < 0.5 && (
          <MotivationalText color="#f59e0b">You're making progress. Let's try to complete a few more tasks today.</MotivationalText>
        )}
      </Card>
    </Container>
  );
};

export default Progress;
