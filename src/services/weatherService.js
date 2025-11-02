const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const fetchWeather = async (city, unit = "metric") => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
  );

  if (!res.ok) throw new Error("City not found");
  return res.json();
};
