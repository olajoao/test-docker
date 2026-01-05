import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { Toaster } from 'sonner'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    }
  }
})
const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    context: {
      queryClient: QueryClient
    }
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryClientProvider>
  </StrictMode>,
)
