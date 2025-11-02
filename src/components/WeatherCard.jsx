import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/favoritesSlice";
import { fetchWeatherAsync, removeCity } from "../redux/weatherSlice";
import { useNavigate } from "react-router-dom";

export default function WeatherCard({ city, isFavorite = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { favorites } = useSelector((state) => state.favorites);
  const { unit } = useSelector((state) => state.settings);
  const weatherState = useSelector((state) => state.weather);
  const weather = weatherState.data[city];

  // ⛅ Fetch weather on mount + every 60s
  useEffect(() => {
    dispatch(fetchWeatherAsync(city));

    const interval = setInterval(() => {
      dispatch(fetchWeatherAsync(city));
    }, 60000);

    return () => clearInterval(interval);
  }, [city, unit, dispatch]);

  const handleFavorite = (e) => {
    e.stopPropagation();
    favorites.includes(city)
      ? dispatch(removeFavorite(city))
      : dispatch(addFavorite(city));
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch(removeCity(city)); // ✅ Redux removeCity use
  };

  const handleNavigate = () => navigate(`/city/${city}`);

  if (weatherState.status === "loading" && !weather)
    return (
      <div className="p-4 bg-blue-100 rounded-xl animate-pulse text-blue-600">
        Loading {city}...
      </div>
    );

  if (weatherState.status === "failed" || weatherState.error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-xl">
        Failed to load {city}
      </div>
    );

  if (!weather) return null;

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div
      onClick={handleNavigate}
      className="cursor-pointer bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-200 relative"
    >
      {/* Header Row */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{weather.name}</h3>
        <div className="flex gap-2">
          {/* ❤️ Favorite toggle */}
          <button
            onClick={handleFavorite}
            className={`text-2xl ${
              favorites.includes(city) ? "text-red-500" : "text-gray-400"
            } hover:scale-110 transition`}
          >
            {favorites.includes(city) ? "❤️" : "🤍"}
          </button>

          {/* ❌ Remove button (only for recent) */}
          {!isFavorite && (
            <button
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-500 text-lg transition"
              title="Remove from Recently Searched"
            >
              ❌
            </button>
          )}
        </div>
      </div>

      {/* Weather Info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold text-blue-600">
            {Math.round(weather.main.temp)}{tempUnit}
          </p>
          <p className="text-gray-500 capitalize">
            {weather.weather[0].description}
          </p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="w-16 h-16"
        />
      </div>

      {/* Details */}
      <div className="mt-3 text-sm text-gray-600 flex justify-between">
        <span>💧 {weather.main.humidity}%</span>
        <span>
          🌬 {weather.wind.speed} {speedUnit}
        </span>
      </div>

      <p className="text-xs text-gray-400 mt-1">
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
