import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 to-blue-600 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-indigo-600 mb-6">
          Welcome Back 👋
        </h1>
        <div className="w-full overflow-hidden">
          <SignIn
            routing="path"
            path="/sign-in"
            appearance={{
              elements: {
                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
              },
              variables: {
                colorPrimary: "#4f46e5",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
