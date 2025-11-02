import { Link, useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

export default function Home() {
  const { user } = useUser();
  const nav=useNavigate();
  const handleLogout = () => {
    nav("/sign-in");
  }



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-500 to-indigo-600 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-center w-[90%] max-w-md">
        <h1 className="text-3xl font-semibold mb-4">
          Welcome, {user?.firstName || "Guest"} 👋
        </h1>
        <p className="text-gray-200 mb-6">
          This is your weather analytics dashboard. Check forecasts, trends, and more!
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/dashboard"
            className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-medium hover:bg-indigo-100 transition"
          >
            Go to Dashboard
          </Link>
          <UserButton onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
