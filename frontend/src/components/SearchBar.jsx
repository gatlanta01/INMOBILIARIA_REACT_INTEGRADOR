// ============================================================
// COMPONENTE: SearchBar
// Buscador de propiedades
// Props: onSearch, placeholder
// ============================================================

import { useState } from 'react';
import Button from './Button';

const SearchBar = ({ onSearch, placeholder = 'Buscar por título, ciudad o sector...' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      {query && (
        <button type="button" className="search-clear" onClick={handleClear}>✕</button>
      )}
      <Button type="submit" variant="primary">🔍 Buscar</Button>
    </form>
  );
};

export default SearchBar;
