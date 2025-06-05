import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Store, User } from './types'

const useStore = create<Store>((set, get) => ({
  currentUser: null,
  users: [],
  tasks: [],
  stock: [],
  loading: false,
  error: null,

  // Auth functions
  checkSession: async () => {
    const { currentUser } = get();
    return !!currentUser;
  },

  login: async (code: string) => {
    set({ loading: true, error: null })
    try {
      // Check the code in profiles table first
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('code', code)
        .single()
        // console.log(profile,profileError)

      if (profile) {
        set({ currentUser: profile, loading: false })
        return true
      }

      // If not found, check reservation_employees table
      const { data: reservationEmployee, error: employeeError } = await supabase
        .from('reservation_employees')
        .select('*')
        .eq('code', code)
        .single()
        console.log(reservationEmployee,employeeError)

      if (reservationEmployee) {
        set({ currentUser: { ...reservationEmployee, role: 'reservation_employee' }, loading: false })
        return true
      }

      // If not found in either, set error
      set({ error: 'Invalid code', loading: false })
      return false
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      return false
    }
  },

  logout: async () => {
    set({ loading: true })
    try {
      set({ currentUser: null, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  signup: async (email: string, password: string, role: User['role']) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, role }])

        if (profileError) throw profileError
        set({ loading: false })
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  // User management
  addUser: async (user) => {
    set({ loading: true, error: null });
    try {
      // Just insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          name: user.name,
          role: user.role,
          code: user.code
        }]);

      if (profileError) throw profileError;
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateUser: async (id, user) => {
    set({ loading: true, error: null });
    try {
      // Just update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: user.name,
          role: user.role,
          code: user.code
        })
        .eq('id', id);

      if (profileError) throw profileError;
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      // Just delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileError) throw profileError;
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  // Task management
  addTask: async (task) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{ ...task, createdAt: new Date().toISOString() }])
      if (error) throw error
      set({ loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  updateTask: async (id, task) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id)
      if (error) throw error
      set({ loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      if (error) throw error
      set({ loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  // Stock management
  addStockItem: async (item) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('stock')
        .insert([{ ...item, lastUpdated: new Date().toISOString() }])
      if (error) throw error
      set({ loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  updateStockItem: async (id, item) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('stock')
        .update({ ...item, lastUpdated: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      set({ loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  deleteStockItem: async (id) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('stock')
        .delete()
        .eq('id', id)
      if (error) throw error
      set({ loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },
}))

export default useStore 