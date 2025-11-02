import { useSelector, useDispatch } from "react-redux";
import { UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import { toggleUnit } from "../redux/settingsSlice";
import { fetchWeatherAsync, clearRecent } from "../redux/weatherSlice"; 
import { useState } from "react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { unit } = useSelector((state) => state.settings);
  const { cities } = useSelector((state) => state.weather);
  const { favorites } = useSelector((state) => state.favorites);
  const navigate = useNavigate();

  const [showFavorites, setShowFavorites] = useState(false);

  const handleLogout = () => navigate("/sign-in");

  const handleUnitChange = () => {
    dispatch(toggleUnit());
    setTimeout(() => {
      const allCities = [...favorites, ...cities];
      const uniqueCities = [...new Set(allCities)];
      uniqueCities.forEach((city) => dispatch(fetchWeatherAsync(city)));
    }, 100);
  };

  const defaultCities = [
    "Delhi",
    "Mumbai",
    "London",
    "New York",
    "Tokyo",
    "Paris",
    "Sydney",
    "Singapore",
    "Dubai",
    "Toronto",
  ];

  const recentCities = cities.filter((c) => !favorites.includes(c)&& !defaultCities.includes(c));
  const exploreCities = defaultCities;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Weather Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUnitChange}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            {unit === "metric" ? "°C → °F" : "°F → °C"}
          </button>
          <UserButton onClick={handleLogout} />
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* 🌤 Favorites Toggle */}
      <div className="flex justify-center mt-7 mb-6">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`px-4 py-3 rounded-full text-sm font-semibold transition-all ${
            showFavorites
              ? "bg-blue-600 text-white"
              : "bg-white border border-blue-450 text-blue-600 hover:bg-blue-100"
          }`}
        >
          🌤 {showFavorites ? "Hide My Favorites" : "Show My Favorites"}
        </button>
      </div>

    
      {showFavorites && (
        <>
          <h2 className="text-xl font-semibold text-blue-800 mt-4 mb-4 text-center">
            🌤 My Favorites
          </h2>
          {favorites.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((city) => (
                <WeatherCard key={city} city={city} isFavorite />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No favorites added yet.</p>
          )}
        </>
      )}

      {recentCities.length > 0 && (
        <>
          <div className="flex justify-between items-center mt-10 mb-4">
            <h2 className="text-xl font-semibold text-blue-800">
              🔍 Recently Searched
            </h2>
            <button
              onClick={() => dispatch(clearRecent())}
              className="text-sm text-red-500 hover:underline"
            >
              Clear Recent
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCities.map((city) => (
              <WeatherCard key={city} city={city} />
            ))}
          </div>
        </>
      )}

  
      <h2 className="text-xl font-semibold text-blue-800 mt-10 mb-4">
        🌍 Explore Weather
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exploreCities.map((city) => (
          <WeatherCard key={city} city={city} />
        ))}
      </div>
    </div>
  );
}
