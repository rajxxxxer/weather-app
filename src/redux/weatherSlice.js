import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWeather } from "../services/weatherService";

export const fetchWeatherAsync = createAsyncThunk(
  "weather/fetchWeather",
  async (city, { getState }) => {
    const unit = getState().settings.unit;
    const data = await fetchWeather(city, unit);
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
      // 🔥 add new city to top (remove old duplicate if exists)
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
        state.data[city] = action.payload;

        // 🔥 always put searched city at top
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
