import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Store, User, Task, StockItem } from './types';

const useStore = create<Store>((set): Store => ({
  currentUser: null,
  loading: false,
  error: null,

  login: async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('code', code)
        .single();

      if (error || !data) {
        set({ error: 'Invalid code', currentUser: null });
        return false;
      }

      set({ currentUser: data, error: null });
      return true;
    } catch (err) {
      console.error('Login error:', err);
      set({ error: (err as Error).message, currentUser: null });
      return false;
    }
  },

  logout: () => {
    set({ currentUser: null, error: null });
  },

  addUser: async (user: Omit<User, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([user]);

      if (error) throw error;
    } catch (err) {
      console.error('Add user error:', err);
      throw err;
    }
  },

  updateUser: async (id: string, user: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(user)
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Update user error:', err);
      throw err;
    }
  },

  deleteUser: async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Delete user error:', err);
      throw err;
    }
  },

  addTask: async (task: Omit<Task, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([task]);

      if (error) throw error;
    } catch (err) {
      console.error('Add task error:', err);
      throw err;
    }
  },

  updateTask: async (id: string, task: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Update task error:', err);
      throw err;
    }
  },

  deleteTask: async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Delete task error:', err);
      throw err;
    }
  },

  addStockItem: async (item: Omit<StockItem, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('stock')
        .insert([item]);

      if (error) throw error;
    } catch (err) {
      console.error('Add stock item error:', err);
      throw err;
    }
  },

  updateStockItem: async (id: string, item: Partial<StockItem>) => {
    try {
      const { error } = await supabase
        .from('stock')
        .update(item)
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Update stock item error:', err);
      throw err;
    }
  },

  deleteStockItem: async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Delete stock item error:', err);
      throw err;
    }
  },
}));

export default useStore; 