import { createRoot } from 'react-dom/client';
import App from './components/App';
import { AuthProvider } from './hooks/AuthContext';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Could not find root element');
}

createRoot(root).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
);
