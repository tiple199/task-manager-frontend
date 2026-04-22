'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Task } from '@/types';
import { useCreateTask, useUpdateTask } from '../hooks';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z.string().refine((val) => {
    if (!val) return false;
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, { message: 'Deadline must be today or in the future' }),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ initialData, onSuccess, onCancel }: TaskFormProps) {
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask(initialData?.id?.toString() || '');
  const isEditing = !!initialData;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      deadline: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        priority: initialData.priority,
        deadline: new Date(initialData.deadline).toISOString().split('T')[0],
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: TaskFormValues) => {
    const payload = { ...data, deadline: new Date(data.deadline).toISOString() };
    if (isEditing) {
      updateMutation.mutate(payload, { onSuccess });
    } else {
      createMutation.mutate(payload, { onSuccess });
    }
  };

  const selectCls = cn(
    'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400',
    'hover:border-slate-300 transition-colors cursor-pointer',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50'
  );

  const statusOptions = [
    { value: 'pending',     label: '⏳  Pending' },
    { value: 'in_progress', label: '🔄  In Progress' },
    { value: 'completed',   label: '✅  Completed' },
  ];

  const priorityOptions = [
    { value: 'low',    label: '🔵  Low' },
    { value: 'medium', label: '🟡  Medium' },
    { value: 'high',   label: '🔴  High' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Title <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Finish the report"
          {...register('title')}
          error={errors.title?.message}
          disabled={isPending}
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description <span className="text-slate-400 font-normal text-xs">(optional)</span></Label>
        <textarea
          id="description"
          placeholder="Add more details about this task…"
          className={cn(
            'flex min-h-[88px] w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700',
            'placeholder:text-slate-400 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400',
            'hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50'
          )}
          {...register('description')}
          disabled={isPending}
        />
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select id="status" className={selectCls} {...register('status')} disabled={isPending}>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.status && <p className="text-xs text-rose-500 mt-1">{errors.status.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <select id="priority" className={selectCls} {...register('priority')} disabled={isPending}>
            {priorityOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.priority && <p className="text-xs text-rose-500 mt-1">{errors.priority.message}</p>}
        </div>
      </div>

      {/* Deadline */}
      <div className="space-y-1.5">
        <Label htmlFor="deadline">
          Deadline <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="deadline"
          type="date"
          {...register('deadline')}
          error={errors.deadline?.message}
          disabled={isPending}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
