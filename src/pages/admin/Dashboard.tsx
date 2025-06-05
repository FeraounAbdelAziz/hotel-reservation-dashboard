import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import type { Task, StockItem } from '../../store/types';
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

function AdminDashboard() {
  const { currentUser } = useStore();
  const [employees, setEmployees] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: employeesData } = await supabase.from('reservation_employees').select('*');
      const { data: tasksData } = await supabase.from('tasks').select('*');
      const { data: stockData } = await supabase.from('stock').select('*');

      setEmployees(employeesData || []);
      setTasks(tasksData || []);
      setStock(stockData || []);
    };

    fetchData();
  }, []);

  const stats = [
    {
      name: 'Total Employees',
      value: employees.length,
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Tasks',
      value: tasks.length,
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Completed Tasks',
      value: tasks.filter(task => task.status === 'completed').length,
      icon: CheckCircleIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'In Progress Tasks',
      value: tasks.filter(task => task.status === 'in_progress').length,
      icon: ClockIcon,
      color: 'bg-purple-500',
    },
  ];

  const recentTasks = tasks
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-200';
      case 'in_progress':
        return 'bg-blue-900 text-blue-200';
      case 'pending':
        return 'bg-yellow-900 text-yellow-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-200">{employees?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-200">{tasks?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-200">{stock?.length || 0}</p>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-300 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-semibold text-gray-200">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 shadow sm:rounded-lg border border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-200 mb-4">
              Recent Tasks
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {recentTasks.map((task) => {
                    return (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {task.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {task.assigned_to || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(task.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 