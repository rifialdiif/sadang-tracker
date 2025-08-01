import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCategories } from '@/hooks/useCategories';
import { useExpenses } from '@/hooks/useExpenses';
import { useEffect } from 'react';

const expenseFormSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.date({
    required_error: 'Date is required',
  }),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { createExpense, updateExpense, isCreating, isUpdating } = useExpenses();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: expense?.amount || 0,
      description: expense?.description || '',
      category: expense?.category || '',
      date: expense?.date ? new Date(expense.date) : new Date(),
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        amount: expense.amount,
        description: expense.description || '',
        category: expense.category,
        date: new Date(expense.date),
      });
    }
  }, [expense, form]);

  const onSubmit = async (values: ExpenseFormValues) => {
    try {
      // Format date as YYYY-MM-DD to avoid timezone issues
      const formattedDate = format(values.date, 'yyyy-MM-dd');

      if (expense) {
        await updateExpense({
          id: expense.id,
          ...values,
          date: formattedDate,
        });
      } else {
        await createExpense({
          ...values,
          date: formattedDate,
        });
      }
      onSuccess?.();
    } catch (error: unknown) {
      console.error('Error saving expense:', error);

      const errorMessage = error.message || 'An unexpected error occurred';
      const errorCode = error.code || '';

      // Handle authentication issues
      if (errorCode === 'AUTH_USER_NOT_FOUND' || errorMessage.includes('foreign key constraint')) {
        form.setError('root', {
          type: 'manual',
          message: 'Authentication issue detected. Please sign out and sign in again to continue.'
        });
        return;
      }

      // Handle validation errors (400 Bad Request)
      if (error.code === '23514' || errorMessage.includes('check constraint') || error.code === '22P02') {
        form.setError('root', {
          type: 'manual',
          message: 'Invalid data provided. Please check your input and try again.'
        });
        return;
      }

      // Handle any other errors
      form.setError('root', {
        type: 'manual',
        message: `Error: ${errorMessage}`
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Rp 0"
                  value={field.value > 0 ? `Rp ${field.value.toLocaleString('id-ID')}` : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    field.onChange(value ? parseFloat(value) : 0);
                  }}
                  onFocus={(e) => {
                    e.target.value = field.value > 0 ? field.value.toString() : '';
                  }}
                  onBlur={(e) => {
                    if (field.value > 0) {
                      e.target.value = `Rp ${field.value.toLocaleString('id-ID')}`;
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={categoriesLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-sm text-red-500 p-3 bg-red-50 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isCreating || isUpdating}
            className="flex-1"
          >
            {isCreating || isUpdating ? 'Saving...' : expense ? 'Update' : 'Create'}
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