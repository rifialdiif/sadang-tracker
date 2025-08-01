'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

export type Expense = {
  id: string;
  amount: number;
  description: string | null;
  category: string;
  date: string;
  created_at: string;
  user_id: string;
};

export const useExpenses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchExpenses = async (): Promise<Expense[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .select(`
        id,
        amount,
        description,
        category,
        date,
        created_at,
        user_id
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;

    if (!data) return [];

    return data as Expense[];
  };

  const createExpense = async (expense: Omit<TablesInsert<'expenses'>, 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expense,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      // Handle foreign key constraint violations specifically
      if ((error as { code?: string; message?: string }).code === '23503' || (error as { message?: string }).message?.includes('foreign key constraint')) {
        const enhancedError = new Error('User authentication issue. Please sign out and sign in again to refresh your session.') as Error & { code?: string; originalError?: unknown };
        enhancedError.code = 'AUTH_USER_NOT_FOUND';
        enhancedError.originalError = error;
        throw enhancedError;
      }
      throw error;
    }
    return data;
  };

  const updateExpense = async ({ id, ...expense }: TablesUpdate<'expenses'> & { id: string }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      // Handle foreign key constraint violations specifically
    if ((error as { code?: string; message?: string }).code === '23503' || (error as { message?: string }).message?.includes('foreign key constraint')) {
      const enhancedError = new Error('User authentication issue. Please sign out and sign in again to refresh your session.') as Error & { code?: string; originalError?: unknown };
      enhancedError.code = 'AUTH_USER_NOT_FOUND';
      enhancedError.originalError = error;
      throw enhancedError;
    }
    throw error;
    }
    return data;
  };

  const deleteExpense = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  const expensesQuery = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: fetchExpenses,
    enabled: !!user,
  });

  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
    },
    onError: (error) => {
      console.error('Create expense error:', error);
    }
  });

  const updateExpenseMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
    },
    onError: (error) => {
      console.error('Update expense error:', error);
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
    },
    onError: (error) => {
      console.error('Delete expense error:', error);
    }
  });

  return {
    expenses: expensesQuery.data || [],
    isLoading: expensesQuery.isLoading,
    error: expensesQuery.error,
    createExpense: createExpenseMutation.mutateAsync,
    updateExpense: updateExpenseMutation.mutateAsync,
    deleteExpense: deleteExpenseMutation.mutateAsync,
    isCreating: createExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,
  };
};