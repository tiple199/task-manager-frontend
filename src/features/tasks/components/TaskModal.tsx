import { Modal } from '@/components/ui/modal';
import { TaskForm } from './TaskForm';
import { Task } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSuccess?: () => void;
}

export function TaskModal({ isOpen, onClose, task, onSuccess }: TaskModalProps) {
  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
    >
      <TaskForm
        initialData={task || undefined}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
}
