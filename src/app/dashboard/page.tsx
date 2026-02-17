"use client";

import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('./DashboardContent'), { ssr: false });

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return <DashboardContent />;
}
