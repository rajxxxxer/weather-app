import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";
import favoritesReducer from "./favoritesSlice";
import settingsReducer from "./settingsSlice";

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
  },
});

export default store;
