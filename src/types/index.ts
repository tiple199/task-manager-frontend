export type User = {
  userId: string;
  email: string;
};

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: number | string; // Matches backend id
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string; // ISO date string
  createdAt?: string;
  updatedAt?: string;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: { field: string; message: string }[] | null;
};

export type ApiResponse<T> = {
  success: true;
  message?: string;
  data: T;
};
