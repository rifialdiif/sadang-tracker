import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { ExpensesList } from '@/components/ExpensesList';
import { CategoriesList } from '@/components/CategoriesList';
import { ExpenseForm } from '@/components/ExpenseForm';
import { CategoryForm } from '@/components/CategoryForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'categories'>('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">SaDang - Sakuin Dong Kang</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>

          <nav className="flex gap-4 mt-4">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'categories' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </Button>
            <Button
              variant={activeTab === 'expenses' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('expenses')}
            >
              Expenses
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <Dashboard />
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <ExpensesList />
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <CategoriesList />
          </div>
        )}
      </main>

      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Track your spending by adding a new expense.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm
            onSuccess={() => setShowExpenseForm(false)}
            onCancel={() => setShowExpenseForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing your expenses.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSuccess={() => setShowCategoryForm(false)}
            onCancel={() => setShowCategoryForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
