import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import axios from 'axios';


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

// interface Country {
//   capital: string;
//   emoji: string;
//   currency: string;
//   name: string;
//   native: string;
//   phone: string;
//   code: string;
//   languages: { name: string }[];
// }


function App() {
  const { loading, error, data } = useQuery(COUNTRIES_QUERY);
  const [filter, setFilter] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string| any>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<string>('name');
  // const [favorites, setFavorites] = useState<Country[]>([]);
  const [countryFlags, setCountryFlags] = useState<string[]>([]); // Ülke bayraklarını tutmak için bir dizi

  useEffect(() => {
   
    const fetchCountryFlags = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all'); // Tüm ülkeleri çekiyoruz
        console.log(response.data)
        const flags = response.data.map((country: any) => country.flags); // Ülke bayraklarını alıyoruz
        setCountryFlags(flags);
      } catch (error) {
        console.error('Ülke bayraklarını alırken bir hata oluştu: ', error);
      }
    };

    fetchCountryFlags();
    
  }, []);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setSelectedColor(randomColor());
  };
  const randomColor = () => {
    const colors = ["#33FF57",]; //istenirse bir kaç renk daha eklenebilir
    return colors[Math.floor(Math.random() * colors.length)];
  };


  // const resetColor = () =>{
  //   const color = ["#FFF"];
  //   return color
  // }


  // const handleAddFavorite = (country: Country) => {
  //   const isAlreadyFavorite = favorites.some((fav) => fav.name === country.name);
  //   if (isAlreadyFavorite) {
  //     alert('This country is already in your favorites!');
  //     return;
  //   }
  //   const newFavorites = [...favorites, country];
  //   setFavorites(newFavorites);
  //   setSelectedItem(country)
  //   setSelectedColor(randomColor());
  //   localStorage.setItem('favorites', JSON.stringify(newFavorites));
  // };

  // const handleRemoveFavorite = (country: Country) => {
  //   const newFavorites = favorites.filter((fav) => fav.name !== country.name);
  //   setFavorites(newFavorites);
  //   setSelectedItem(country)
  //   setSelectedColor(resetColor());
  //   localStorage.setItem('favorites', JSON.stringify(newFavorites));
  // };

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
                  : (index === 9 ) || index === filteredAndGroupedData.length - 1 
                  ? '#ff0000' // Son 10. veya son ögeye kırmızı arka plan rengi uygula
                  : '',
              }}
            >
     <img src={countryFlags[item]} alt={`${item.name} Flag`} height={100} /> {/* Bayrakları göster */}
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
                {/* <button onClick={() => handleAddFavorite(item)}
                  >Favori Ekle</button>
                <button onClick={() => handleRemoveFavorite(item)}>Favori Kaldır</button> */}
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* <ul>
        {favorites.map((favorite, index) => (
          <li key={index}>{favorite.name}</li>
        ))}
      </ul> */}
    </div>
  );
}

export default App;

