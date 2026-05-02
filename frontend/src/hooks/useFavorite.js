import { useContext } from 'react';
import { FavoriteContext } from '../context/FavoriteContext';

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error('useFavorite debe usarse dentro de FavoriteProvider');
  return context;
};
