import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignInPage from "./pages/SignInPage";
import CityDetail from "./pages/CityDetail"; 


export default function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Routes>
     
      <Route
        path="/"
        element={isSignedIn ? <Home /> : <Navigate to="/sign-in" />}
      />

    
      <Route
        path="/dashboard"
        element={isSignedIn ? <Dashboard /> : <Navigate to="/sign-in" />}
      />

     
      <Route
        path="/city/:cityName"
        element={isSignedIn ? <CityDetail /> : <Navigate to="/sign-in" />}
      />

    
      <Route path="/sign-in" element={<SignInPage />} />
    
    </Routes>
  );
}
