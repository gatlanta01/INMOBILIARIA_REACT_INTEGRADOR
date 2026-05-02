import { useContext } from 'react';
import { PropertyContext } from '../context/PropertyContext';

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) throw new Error('useProperty debe usarse dentro de PropertyProvider');
  return context;
};
