'use client'

import { useEffect, useState } from 'react'
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

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof document !== 'undefined') {
      document.body.classList.add('antialiased')
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('antialiased')
      }
    }
  }, [])

  if (!mounted) {
    return null
  }

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