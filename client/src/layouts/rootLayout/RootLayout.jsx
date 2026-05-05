// RootLayout.jsx
import { Link, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-8 2xl:px-0 2xl:max-w-[1400px] mx-auto pt-4 sm:pt-5 pb-3 sm:pb-4 h-screen flex flex-col box-border overflow-hidden">

          <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <img src="/logo.png" alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="hidden sm:block">LEARN AI</span>
            </Link>

            <div className="flex items-center">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-hidden py-3 px-1">
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;