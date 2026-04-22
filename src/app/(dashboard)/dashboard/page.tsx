import { Metadata } from 'next';
import { TaskList } from '@/features/tasks/components/TaskList';

export const metadata: Metadata = {
  title: 'Dashboard | Task Manager',
};

export default function DashboardPage() {
  return (
    <div className="w-full">
      <TaskList />
    </div>
  );
}
