export interface User {
  id: string;
  name: string;
  first_name: string;
  last_name : string;
  telephone: string;
  address: string;
  email: string;
  ccp: string;
  file_url: string | null;
  role: 'admin' | 'stock_manager' | 'user' | 'employees';
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
  category: string;
  quantity: number;
  unit: string;
  description?: string;
  last_restocked: string;
  created_at: string;
}

export interface Store {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  stock: StockItem[];
  loading: boolean;
  error: string | null;
  
  // Auth functions
  login: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  signup: (email: string, password: string, role: User['role']) => Promise<void>;
  
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