import { useParams } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

export default function CityDetail() {
  const { cityName } = useParams();
  const [tempData, setTempData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`
      );
      if (!res.ok) throw new Error("Failed to fetch forecast data");
      const data = await res.json();

      const dailyTemps = {};
      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyTemps[date]) dailyTemps[date] = [];
        dailyTemps[date].push(item.main.temp);
      });

      // 🔹 Average, Min, and Max temps for each day
      const processedTemps = Object.entries(dailyTemps).map(([date, temps]) => {
        const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
        const min = Math.min(...temps);
        const max = Math.max(...temps);
        return {
          day: date,
          avg: Math.round(avg),
          min: Math.round(min),
          max: Math.round(max),
        };
      });

      setTempData(processedTemps.slice(0, 7));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
    const interval = setInterval(fetchForecast, 60000); // 🔁 Refresh every 60s
    return () => clearInterval(interval);
  }, [cityName]);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        {cityName} - Detailed View
      </h1>

      <div className="max-w-2xl mx-auto mb-8">
        <WeatherCard city={cityName} />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Temperature Trends (Next 7 Days)
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading forecast...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={tempData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f0f9ff",
                  borderRadius: "8px",
                  border: "1px solid #3b82f6",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="avg"
                name="Avg Temp (°C)"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="min"
                name="Min Temp (°C)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="max"
                name="Max Temp (°C)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
