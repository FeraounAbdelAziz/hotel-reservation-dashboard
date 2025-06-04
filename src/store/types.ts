export interface User {
  id: string;
  name: string;
  role: 'admin' | 'stock_manager' | 'user';
  code: string;
  created_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to: string;
  created_at: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  last_restocked: string;
  created_at: string;
}

export interface Store {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'created_at'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addStockItem: (item: Omit<StockItem, 'id' | 'created_at'>) => Promise<void>;
  updateStockItem: (id: string, item: Partial<StockItem>) => Promise<void>;
  deleteStockItem: (id: string) => Promise<void>;
} 