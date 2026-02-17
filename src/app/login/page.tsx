"use client";

export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100 dark:from-yellow-900 dark:via-orange-900 dark:to-red-900 bg-gradient-animation">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 dark:border-gray-800/30">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img 
              src="/bookmark.png" 
              alt="Bookmark Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Smart Bookmark</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to access your bookmarks</p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 mb-4 dark:from-red-600 dark:to-red-700"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-4.73-3.3c-.9.6-2.06.96-3.55.96-2.65 0-4.85-1.8-5.65-4.3H4.5v2.92c1.4 3.32 4.07 5.6 7.35 5.6z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.09v4.35C2.09 11.86 2.46 12.91 3.15 13.66c.7-.75 1.55-1.36 2.54-1.81v2.77z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.03 1 3.55 2.09 1.96 4.81l3.76 2.62c.8-1.5 2.33-2.58 4.13-2.58z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="text-center text-sm text-gray-500 dark:text-gray-500">
          <p>Continue with Google to access your bookmarks</p>
        </div>
      </div>
    </div>
  );
}

// Add CSS for animated gradient background
const style = document.createElement('style');
style.textContent = `
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  .bg-gradient-animation {
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
  }
`;
document.head.appendChild(style);