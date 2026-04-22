import { apiClient } from '@/lib/api';
import { ApiResponse, Task } from '@/types';

// Matching backend contract
export type GetTasksParams = {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

export const taskApi = {
  getTasks: async (params: GetTasksParams) => {
    // Clean empty strings from params so backend doesn't complain
    const cleanParams: Record<string, any> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        cleanParams[key] = value;
      }
    });
    
    const res = await apiClient.get<ApiResponse<{ tasks: Task[]; count: number }>>('/tasks', { params: cleanParams });
    return res.data;
  },

  getTaskById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return res.data;
  },

  createTask: async (data: Partial<Task>) => {
    const res = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return res.data;
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    const res = await apiClient.put<ApiResponse<null>>(`/tasks/${id}`, data);
    return res.data;
  },

  deleteTask: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/tasks/${id}`);
    return res.data;
  },
};
