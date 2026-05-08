export interface User {
  id: number;
  username: string;
  status?: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'editor' | 'viewer';
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UserUpdate = Partial<UserCreate>;
