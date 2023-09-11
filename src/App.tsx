import { useQuery, gql } from '@apollo/client';
import { Console } from 'console';

const COUNTRIES_QUERY = gql`
query Query {
  countries {
    emoji
    currency
    name
    native
    phone
    code
  }
}
`;
console.log(COUNTRIES_QUERY)
function DisplayLocations() {
  const { loading, error, data } = useQuery(COUNTRIES_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.locations.map(({ item,emoji,currency,name,native,phone,code }: any) => (
    <div key={item}>
      <h3>{name}</h3>
      <img width="400" height="250" alt="location-reference" src={`${emoji}`} />
      <br />
      <b>About this location:</b>
      <p>{name}</p>
      <br />
    </div>
  ));
}

export default function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      <br/>
      <DisplayLocations />
    </div>
  );
}
