# Expense Tracker

A modern, responsive expense tracking application built with Next.js, TypeScript, and Supabase. Track your daily expenses with beautiful charts and intuitive categorization.

## Features

- **📊 Interactive Dashboard**: Visualize your spending with pie charts and line charts
- **📝 Expense Management**: Add, edit, and delete expenses with categories
- **📈 Data Visualization**: Real-time charts showing spending patterns and category breakdown
- **🔐 Secure Authentication**: User authentication with Supabase Auth
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **💰 Currency Formatting**: Indonesian Rupiah (IDR) formatting throughout
- **📅 Monthly Filtering**: Filter expenses by month with calendar picker
- **🎯 Category Management**: Organize expenses with customizable categories

## Tech Stack

- **Frontend**: Next.js 15.4.5 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **Backend**: Supabase (Database + Authentication)
- **Database**: PostgreSQL
- **Development**: Vite, ESLint, PostCSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Run the database migrations:
   ```bash
   npm run db:push
   ```
   
   Or seed categories (optional):
   ```bash
   npm run seed:categories
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Dashboard.tsx     # Main dashboard with charts
│   ├── ExpenseForm.tsx   # Add/edit expense form
│   ├── ExpensesList.tsx  # Expenses listing
│   ├── CategoriesList.tsx # Categories management
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useExpenses.ts   # Expenses data hook
│   └── useCategories.ts # Categories data hook
├── lib/                 # Utilities and helpers
└── integrations/        # External service integrations
    └── supabase/       # Supabase client setup
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:categories` - Seed default categories

## Features in Detail

### Dashboard
- **Pie Chart**: Shows expense distribution by category with percentage labels
- **Line Chart**: Displays daily spending trends over selected month
- **Key Metrics**: Total expenses, category count, and daily average
- **Month Filter**: Calendar popover for selecting specific months

### Expense Management
- **Add Expenses**: Quick form with amount, category, and description
- **Edit/Delete**: Full CRUD operations on expenses
- **Real-time Updates**: Changes reflect immediately in charts
- **Validation**: Input validation with user-friendly error messages

### Categories
- **Default Categories**: Pre-loaded with common expense categories
- **Custom Categories**: Add your own categories
- **Color Coding**: Each category has a unique color in charts
- **Usage Tracking**: See how much you've spent per category

## Authentication

The application uses Supabase Auth for secure user authentication:
- Email/password authentication
- Session management
- Protected routes for authenticated users
- Automatic redirect for non-authenticated users

## Database Schema

### Expenses Table
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  description TEXT,
  date DATE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#3b82f6',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Development

### Adding New Features

1. **Components**: Add new components in `src/components/`
2. **Hooks**: Create custom hooks in `src/hooks/`
3. **Database**: Update schema in Supabase dashboard
4. **Styling**: Use Tailwind CSS classes and shadcn/ui components

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the existing color scheme (blue, emerald, orange, purple, pink)
- Maintain responsive design principles
- Use shadcn/ui components for consistency

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The application can also be deployed to:
- Netlify
- Railway
- Digital Ocean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

---

Built with ❤️ using Next.js, TypeScript, and Supabase