import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi, GetTasksParams } from './api';
import { Task } from '@/types';
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

/**
 * Hook cập nhật status với Optimistic Update:
 * 1. onMutate  → cập nhật cache ngay lập tức (UI phản hồi tức thì)
 * 2. mutationFn → gọi API ngầm
 * 3. onError   → rollback về data cũ nếu API thất bại
 * 4. onSettled → luôn refetch để đảm bảo đồng bộ với server
 */
export function useQuickStatusUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      taskApi.updateTask(id, { status }),

    onMutate: async ({ id, status }) => {
      // Hủy các query đang fetch để tránh ghi đè data optimistic
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      // Snapshot toàn bộ list cache (nhiều page/filter khác nhau)
      const previousEntries = queryClient.getQueriesData<{
        tasks: Task[];
        count: number;
      }>({ queryKey: taskKeys.lists() });

      // Cập nhật optimistic: thay status trong TẤT CẢ list cache hiện có
      queryClient.setQueriesData<{ tasks: Task[]; count: number }>(
        { queryKey: taskKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            tasks: old.tasks.map((t) =>
              t.id.toString() === id ? { ...t, status } : t
            ),
          };
        }
      );

      // Trả về snapshot để dùng trong onError khi cần rollback
      return { previousEntries };
    },

    onError: (_err, _vars, context) => {
      // Rollback: khôi phục toàn bộ cache về trạng thái trước khi mutate
      if (context?.previousEntries) {
        context.previousEntries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update status. Please try again.');
    },

    onSettled: () => {
      // Luôn refetch sau khi API hoàn tất để đồng bộ chính xác với server
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
