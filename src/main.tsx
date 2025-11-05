import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import GlobalErrorBoundary from './components/GlobalErrorBoundary'
import LoadingBoundary from './components/LoadingBoundary'


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <Suspense fallback={<LoadingBoundary />}>
        <App />
      </Suspense>
    </GlobalErrorBoundary>
  </React.StrictMode>
);