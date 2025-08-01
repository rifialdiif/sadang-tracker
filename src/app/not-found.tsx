'use client'

import dynamic from 'next/dynamic'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/hooks/useAuth'
import { TooltipProvider } from '@/components/ui/tooltip'

const queryClient = new QueryClient()

// Dynamically import the React Router setup to avoid SSR issues
const ClientRouter = dynamic(() => import('./ClientRouter'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
})

export default function NotFound() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ClientRouter />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}