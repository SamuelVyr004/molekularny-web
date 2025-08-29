// Súbor: src/app/pathways/page.tsx
import { Suspense } from 'react';
import PathwayDisplay from '@/components/PathwayDisplay';
import Link from 'next/link';

// Jednoduchý "Loading" skeleton, ktorý sa zobrazí, kým sa načíta dynamická časť
function LoadingSkeleton() {
    return (
         <div className="flex-grow flex flex-col md:flex-row gap-8 p-4 sm:p-6 lg:p-8">
            <aside className="w-full md:w-3/12 md:max-w-sm flex-shrink-0">
                <div className="bg-card/50 p-4 rounded-lg border border-border h-full animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-12 bg-gray-700 rounded w-full"></div>
                </div>
            </aside>
            <main className="flex-grow flex flex-col min-w-0">
                <div className="flex-shrink-0 mb-4">
                    <div className="h-10 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="relative flex-grow rounded-lg border border-border bg-card/30 flex items-center justify-center">
                    <p>Loading Pathways...</p>
                </div>
            </main>
        </div>
    );
}


export default function PathwaysPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
        <header className="py-5 px-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">MB.</Link>
                <ul className="flex gap-8 items-center text-lg">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/pathways" className="text-primary font-bold">Pathways</Link></li>
                </ul>
            </nav>
        </header>
        
        <Suspense fallback={<LoadingSkeleton />}>
            <PathwayDisplay />
        </Suspense>

    </div>
  );
}