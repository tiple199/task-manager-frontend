import { Modal } from '@/components/ui/modal';
import { TaskForm } from './TaskForm';
import { Task } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
    >
      <TaskForm
        initialData={task || undefined}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}
