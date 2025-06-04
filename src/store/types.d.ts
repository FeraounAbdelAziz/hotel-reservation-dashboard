export interface User {
  id: string;
  name?: string;
  role: 'admin' | 'user' | 'stock_manager';
  code: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  unit: string;
  description?: string;
  lastUpdated: string;
}

export interface Reservation {
  id: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface Store {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  stock: StockItem[];
  loading: boolean;
  error: string | null;

  // Auth functions
  login: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, role: User['role']) => Promise<void>;

  // User management
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Task management
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Stock management
  addStockItem: (item: Omit<StockItem, 'id' | 'lastUpdated'>) => Promise<void>;
  updateStockItem: (id: string, item: Partial<StockItem>) => Promise<void>;
  deleteStockItem: (id: string) => Promise<void>;
} 