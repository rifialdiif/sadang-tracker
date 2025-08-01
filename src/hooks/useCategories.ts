'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

export type Category = {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
  user_id: string;
};

export const useCategories = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchCategories = async (): Promise<Category[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) throw error;
    return data || [];
  };

  const createCategory = async (category: Omit<TablesInsert<'categories'>, 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...category,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      // Handle foreign key constraint violations specifically
      if (error.code === '23503' || error.message?.includes('foreign key constraint')) {
        const enhancedError = new Error('User authentication issue. Please sign out and sign in again to refresh your session.');
        (enhancedError as any).code = 'AUTH_USER_NOT_FOUND';
        (enhancedError as any).originalError = error;
        throw enhancedError;
      }
      
      // Enhance error with more context
      const enhancedError = new Error(error.message || 'Failed to create category');
      (enhancedError as any).code = error.code;
      (enhancedError as any).details = error.details;
      (enhancedError as any).hint = error.hint;
      throw enhancedError;
    }
    return data;
  };

  const updateCategory = async ({ id, ...category }: TablesUpdate<'categories'> & { id: string }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      // Handle foreign key constraint violations specifically
      if (error.code === '23503' || error.message?.includes('foreign key constraint')) {
        const enhancedError = new Error('User authentication issue. Please sign out and sign in again to refresh your session.');
        (enhancedError as any).code = 'AUTH_USER_NOT_FOUND';
        (enhancedError as any).originalError = error;
        throw enhancedError;
      }
      
      // Enhance error with more context
      const enhancedError = new Error(error.message || 'Failed to update category');
      (enhancedError as any).code = error.code;
      (enhancedError as any).details = error.details;
      (enhancedError as any).hint = error.hint;
      throw enhancedError;
    }
    return data;
  };

  const deleteCategory = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  const categoriesQuery = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: fetchCategories,
    enabled: !!user,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
    onError: (error) => {
      console.error('Create category error:', error);
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
    onError: (error) => {
      console.error('Update category error:', error);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
    onError: (error) => {
      console.error('Delete category error:', error);
    }
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
};