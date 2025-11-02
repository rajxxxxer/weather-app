import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWeather } from "../services/weatherService";


const CACHE_DURATION = 60 * 1000;

export const fetchWeatherAsync = createAsyncThunk(
  "weather/fetchWeather",
  async (city, { getState }) => {
    const state = getState().weather;
    const unit = getState().settings.unit;
    const cached = state.data[city];
    const now = Date.now();

   
    if (cached && cached._timestamp && now - cached._timestamp < CACHE_DURATION) {
      return cached;
    }

    
    const data = await fetchWeather(city, unit);
    data._timestamp = now; 
    return data;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    cities: [],
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {
    addCity: (state, action) => {
      const city = action.payload;
      // 🔥 Add new city to top (remove duplicate)
      state.cities = [city, ...state.cities.filter((c) => c !== city)];
    },
    removeCity: (state, action) => {
      const city = action.payload;
      state.cities = state.cities.filter((c) => c !== city);
      delete state.data[city];
    },
    clearRecent: (state) => {
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWeatherAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const city = action.payload.name;
        // ⏱️ Add timestamped cached data
        state.data[city] = action.payload;
        // 🧩 Keep city list clean (no duplicate)
        state.cities = [city, ...state.cities.filter((c) => c !== city)];
      })
      .addCase(fetchWeatherAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addCity, removeCity, clearRecent } = weatherSlice.actions;
export default weatherSlice.reducer;
