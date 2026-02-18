"use client";

import dynamic from 'next/dynamic';

// This MUST be a client component with ssr: false to prevent any server-side evaluation
const LoginForm = dynamic(
  () => import('./LoginFormContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100">
        <p>Loading...</p>
      </div>
    )
  }
);

// Force this page to never be prerendered
export const dynamicParams = true;
export const prerender = false;

export default function LoginPage() {
  return <LoginForm />;
}
