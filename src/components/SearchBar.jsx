import { useState } from "react";
import useSWR from "swr";
import { useDispatch } from "react-redux";
import { fetchWeatherAsync } from "../redux/weatherSlice";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const { data: suggestions } = useSWR(
    query.length > 2
      ? `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      : null,
    fetcher
  );

  const handleSelect = (city) => {
    dispatch(fetchWeatherAsync(city.name));
    setQuery("");
  };

  return (
    <div className="relative w-full md:w-1/2 mx-auto mb-6">
      <input
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
      {suggestions && (
        <ul className="absolute bg-white border mt-1 rounded-lg w-full shadow-lg z-50">
          {suggestions.map((c, i) => (
            <li
              key={i}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(c)}
            >
              {c.name}, {c.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
