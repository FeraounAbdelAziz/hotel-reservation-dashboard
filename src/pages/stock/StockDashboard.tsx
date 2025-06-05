import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useStore from '../../store/useStore';
import type { StockItem } from '../../store/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface StockFormData {
  name: string;
  category: string;
  quantity: number;
  price: number;
  unit: string;
  description?: string;
}

function StockDashboard() {
  const { stock, addStockItem, updateStockItem, deleteStockItem } = useStore();
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StockFormData>();

  const onSubmit = (data: StockFormData) => {
    if (editingItem) {
      updateStockItem(editingItem.id, data);
      setEditingItem(null);
    } else {
      addStockItem({
        ...data,
        last_restocked: new Date().toISOString()
      });
    }
    reset();
  };

  const handleEdit = (item: StockItem) => {
    setEditingItem(item);
    reset(item);
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteStockItem(itemId);
    }
  };

  const getStockStatusColor = (quantity: number) => {
    if (quantity <= 0) return 'bg-red-100 text-red-800';
    if (quantity < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-primary-500">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-primary-500">
                  Item Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Item name is required' })}
                  className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-200 focus:ring-primary-200 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-500">
                  Category
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-200 focus:ring-primary-200 sm:text-sm"
                >
                  <option value="">Select Category</option>
                  <option value="Room Supplies">Room Supplies</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-primary-500">
                  Quantity
                </label>
                <input
                  type="number"
                  {...register('quantity', {
                    required: 'Quantity is required',
                    min: { value: 0, message: 'Quantity cannot be negative' }
                  })}
                  className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-200 focus:ring-primary-200 sm:text-sm"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-500">
                  Unit
                </label>
                <select
                  {...register('unit', { required: 'Unit is required' })}
                  className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-200 focus:ring-primary-200 sm:text-sm"
                >
                  <option value="">Select Unit</option>
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="l">Liters</option>
                  <option value="box">Box</option>
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-500">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-200 focus:ring-primary-200 sm:text-sm"
                placeholder="Item description or notes"
              />
            </div>

            <div className="flex justify-end space-x-3">
              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    reset();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary-500 bg-white hover:bg-primary-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-300 hover:bg-primary-400"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-primary-500 mb-4">
            Inventory List
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-200">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {stock.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusColor(item.quantity)}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-primary-300 hover:text-primary-400 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDashboard; 