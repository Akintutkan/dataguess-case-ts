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
      languages{
        name
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(COUNTRIES_QUERY);
  const [filter, setFilter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<number | null| string>("");
  const [filteredData, setFilteredData] = useState<string>("name")

  useEffect(() => {
    // Otomatik olarak 10. öğeyi veya son öğeyi seçin
    if (data?.countries.length > 0) {
      const selectedIndex = Math.min(9, data.countries.length - 1);
      setSelectedItem(selectedIndex);
    }
  }, [data]);

  const handleItemClick = (index: number) => {
    setSelectedItem(index);
  };

//Verileri İstenilen özelliklere göre filtreleme
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
        <select id="filterData" onChange={(e) => setFilteredData(e.target.value)} value={filteredData}>
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
                onClick={() => handleItemClick(index)}
                style={{
                  backgroundColor:
                    selectedItem === index ? 'your-selected-color' : 'white',
                  cursor: 'pointer', 
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
              </li>
              
            ))}
          </ul>
        )}
      </div>
   
  );
}

export default App;

