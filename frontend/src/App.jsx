// ============================================================
// APP.JSX
// Componente raíz — envuelve la app con todos los Context providers
// ============================================================

import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { FavoriteProvider } from './context/FavoriteContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <FavoriteProvider>
          <AppRoutes />
        </FavoriteProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
