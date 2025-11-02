import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 to-blue-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center">
        <h1 className="text-3xl font-semibold text-indigo-600 mb-6">
          Welcome Back 👋
        </h1>
        <SignIn routing="path" path="/sign-in" />
      </div>
    </div>
  );
}
