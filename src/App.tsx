import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

// GraphQL sorgusu
const COUNTRIES_QUERY = gql`
  query {
    countries {
      capital
      emoji
      currency
      name
      native
      phone
      code
      languages {
        name
      }
    }
  }
`;

interface Country {
  capital: string;
  emoji: string;
  currency: string;
  name: string;
  native: string;
  phone: string;
  code: string;
  languages: { name: string }[];
}

function App() {
  const { loading, error, data } = useQuery(COUNTRIES_QUERY);
  const [filter, setFilter] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string| any>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<string>('name');
  const [favorites, setFavorites] = useState<Country[]>([]);

  useEffect(() => {
    // Otomatik olarak 10. öğeyi veya son öğeyi seçin
    if (data?.countries.length > 0) {
      const selectedIndex = Math.min(9, data.countries.length - 1);
      setSelectedItem(selectedIndex);
    }
  }, [data]);
  
  const randomColor = () => {
    const colors = ["#33FF57"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setSelectedColor(randomColor());
  };


  const handleAddFavorite = (country: Country) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.name === country.name);
    if (isAlreadyFavorite) {
      alert('This country is already in your favorites!');
      return;
    }
    const newFavorites = [...favorites, country];
    setFavorites(newFavorites);
    setSelectedItem(country.name)
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const handleRemoveFavorite = (country: Country) => {
    const newFavorites = favorites.filter((fav) => fav.name !== country.name);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Verileri İstenilen özelliklere göre filtreleme
  const filteredAndGroupedData = data
    ? data.countries.filter((item: any) => {
        const lowerFilter = filter.toLowerCase();
        switch (filteredData) {
          case 'name':
            return item.name.toLowerCase().includes(lowerFilter);
          case 'languages':
            return item.languages.some(
              (language: any) =>
                language.name.toLowerCase().includes(lowerFilter)
            );
          case 'capital':
            return item.capital && item.capital.toLowerCase().includes(lowerFilter);
          default:
            return false;
        }
      })
    : [];

  const options = ['name', 'languages', 'capital'].map((option, index) => (
    <option key={index} value={option}>
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </option>
  ));

  return (
    <div>
      <label htmlFor="filterData">Filter Country by: </label>
      <select
        id="filterData"
        onChange={(e) => setFilteredData(e.target.value)}
        value={filteredData}
      >
        {options}
      </select>
      <input
        type="text"
        placeholder="Arama ve gruplama için kriterleri girin"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ul>
          {filteredAndGroupedData.map((item: any, index: number) => (
            <li
            key={index}
            onClick={() => handleItemClick(item)}
            style={{
              backgroundColor:
                selectedItem && selectedItem.name === item.name
                  ? selectedColor
                  : ""
              }}
            >
              <div>
                <strong>Name:</strong> {item.name}
              </div>
              <div>
                <strong>Languages:</strong>
                {item.languages.map((languages: any) => languages.name)}
              </div>
              <div>
                <strong>Capital:</strong> {item.capital}
              </div>
              <div>
                <button onClick={() => handleAddFavorite(item)}
                style={{
                  backgroundColor:
                    selectedItem && selectedItem.name === item.name
                      ? selectedColor
                      : ""
                  }}>Favori Ekle</button>
                <button onClick={() => handleRemoveFavorite(item)}>Favori Kaldır</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ul>
        {favorites.map((favorite, index) => (
          <li key={index}>{favorite.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

