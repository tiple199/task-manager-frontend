import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi, GetTasksParams } from './api';
import { toast } from 'sonner';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params: GetTasksParams) => [...taskKeys.lists(), params] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export function useTasks(params: GetTasksParams) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: async () => {
      const response = await taskApi.getTasks(params);
      return response.data;
    },
  });
}

export function useTaskDetail(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const response = await taskApi.getTaskById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      toast.success('Task created successfully');
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to create task';
      toast.error(errorMsg);
    },
  });
}

export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => taskApi.updateTask(id, data),
    onSuccess: () => {
      toast.success('Task updated successfully');
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to update task';
      toast.error(errorMsg);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      toast.success('Task deleted successfully');
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to delete task';
      toast.error(errorMsg);
    },
  });
}
