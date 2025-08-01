import { supabase } from '@/integrations/supabase/client';

export const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔' },
  { name: 'Transportation', icon: '🚗' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Bills & Utilities', icon: '💡' },
  { name: 'Healthcare', icon: '💊' },
  { name: 'Education', icon: '📚' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Groceries', icon: '🛒' },
  { name: 'Housing', icon: '🏠' },
  { name: 'Insurance', icon: '🛡️' },
  { name: 'Personal Care', icon: '💅' },
  { name: 'Subscriptions', icon: '📱' },
  { name: 'Gifts & Donations', icon: '🎁' },
  { name: 'Business', icon: '💼' },
  { name: 'Other', icon: '📊' },
];

export class CategorySeeder {
  static async seedCategories(userId: string) {
    try {
      // Check if user already has categories
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('name')
        .eq('user_id', userId);

      const existingNames = new Set(existingCategories?.map(c => c.name) || []);
      
      // Filter out categories that already exist
      const newCategories = DEFAULT_CATEGORIES.filter(
        cat => !existingNames.has(cat.name)
      );

      if (newCategories.length === 0) {
        console.log('All default categories already exist');
        return { success: true, added: 0 };
      }

      // Insert new categories
      const categoriesToInsert = newCategories.map(cat => ({
        ...cat,
        user_id: userId,
      }));

      const { error } = await supabase
        .from('categories')
        .insert(categoriesToInsert);

      if (error) {
        console.error('Error seeding categories:', error);
        return { success: false, error: error.message };
      }

      console.log(`Successfully added ${newCategories.length} categories`);
      return { success: true, added: newCategories.length };
    } catch (error) {
      console.error('Error in seedCategories:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async seedCategoriesForCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return { success: false, error: 'No authenticated user' };
    }
    return this.seedCategories(user.id);
  }
}

// Export for use in components
export default CategorySeeder;