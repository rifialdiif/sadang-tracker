import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/useCategories';
import { useEffect } from 'react';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;


import type { Category } from '@/hooks/useCategories';

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const { createCategory, updateCategory, isCreating, isUpdating, categories } = useCategories();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      icon: category?.icon || '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        icon: category.icon || '',
      });
    }
  }, [category, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      // Check for duplicate name (case-insensitive)
      const existingCategories = categories || [];
      const isDuplicate = existingCategories.some(
        (cat: Category) => 
          cat.name.toLowerCase() === values.name.toLowerCase() && 
          (!category || cat.id !== category.id)
      );
      
      if (isDuplicate) {
        form.setError('name', {
          message: 'A category with this name already exists. Please choose a different name.',
        });
        return;
      }

      if (category) {
        await updateCategory({
          id: category.id,
          ...values,
        });
      } else {
        await createCategory(values);
      }
      onSuccess?.();
    } catch (error: any) {
      console.error('Full error details:', error);
      
      // Log all possible error properties for debugging
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      const errorMessage = error.message || error.error_description || error.details || '';
      const errorCode = error.code || error.status || '';
      
      // Handle authentication issues
      if (errorCode === 'AUTH_USER_NOT_FOUND' || errorMessage.includes('foreign key constraint')) {
        form.setError('root', {
          message: 'Authentication issue detected. Please sign out and sign in again to continue.',
        });
        return;
      }
      
      // Handle unique constraint violation (409 conflict)
      const isUniqueViolation = 
        errorCode === '23505' || 
        errorCode === 409 || 
        errorMessage.toLowerCase().includes('duplicate') || 
        errorMessage.toLowerCase().includes('unique') ||
        errorMessage.toLowerCase().includes('conflict') ||
        errorMessage.includes('already exists') ||
        (error.details && error.details.toLowerCase().includes('unique'));
      
      if (isUniqueViolation) {
        form.setError('name', {
          message: 'A category with this name already exists. Please choose a different name.',
        });
      } else {
        form.setError('root', {
          message: errorMessage || 'An error occurred while saving the category. Please try again.',
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon (emoji or text)</FormLabel>
              <FormControl>
                <Input placeholder="💰 or any emoji..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isCreating || isUpdating}
            className="flex-1"
          >
            {isCreating || isUpdating ? 'Saving...' : category ? 'Update' : 'Create'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}