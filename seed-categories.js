const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const DEFAULT_CATEGORIES = [
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

async function seedCategories(userId) {
  try {
    console.log(`Seeding categories for user: ${userId}`);

    // Check existing categories
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('name')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Error fetching existing categories:', fetchError);
      return;
    }

    const existingNames = new Set(existingCategories?.map(c => c.name) || []);
    
    // Filter out existing categories
    const newCategories = DEFAULT_CATEGORIES.filter(
      cat => !existingNames.has(cat.name)
    );

    if (newCategories.length === 0) {
      console.log('All default categories already exist');
      return;
    }

    // Insert new categories
    const categoriesToInsert = newCategories.map(cat => ({
      ...cat,
      user_id: userId,
    }));

    const { error: insertError } = await supabase
      .from('categories')
      .insert(categoriesToInsert);

    if (insertError) {
      console.error('Error inserting categories:', insertError);
      return;
    }

    console.log(`Successfully added ${newCategories.length} categories:`);
    newCategories.forEach(cat => console.log(`  - ${cat.name} ${cat.icon}`));

  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

// If userId is provided as argument, seed for that user
if (process.argv[2]) {
  seedCategories(process.argv[2]);
} else {
  console.log('Usage: node seed-categories.js <user_id>');
  console.log('Or run from the app after login');
}