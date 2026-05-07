export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  createdAt: Date;
  dueDate?: Date;
}

export type TaskCreate = Omit<Task, 'id' | 'createdAt'>;
export type TaskUpdate = Partial<TaskCreate>;
