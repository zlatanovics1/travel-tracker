import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";

import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Click on the map and add your first country!" />;

  const countries = cities.reduce((arr, cur) => {
    if (arr.map((city) => city.country).includes(cur.country)) return arr;
    else
      return [...arr, { id: cur.id, country: cur.country, emoji: cur.emoji }];
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
