import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import GlobalErrorBoundary from './shared/components/GlobalErrorBoundary'
import LoadingBoundary from './shared/components/LoadingBoundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false, 
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <Suspense fallback={<LoadingBoundary />}>
        <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right"/>
            <Toaster />
        </QueryClientProvider>
      </Suspense>
    </GlobalErrorBoundary>
  </React.StrictMode>
);