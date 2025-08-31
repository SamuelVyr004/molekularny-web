// Súbor: src/app/primer-designer/page.tsx

import Link from 'next/link';
import PrimerDesigner from '@/components/PrimerDesigner'; // Importujeme náš hlavný komponent

export default function PrimerDesignerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
        <header className="py-5 px-4 sm:px-6 lg:px-8 border-b border-border">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold font-primary text-primary no-underline">MB.</Link>
                <ul className="flex gap-8 items-center font-primary text-lg">
                    <li><Link href="/" className="text-text hover:text-primary no-underline transition-colors">Home</Link></li>
                    <li><Link href="/pathways" className="text-text hover:text-primary no-underline transition-colors">Pathways</Link></li>
                </ul>
            </nav>
        </header>

        <main className="flex-grow">
            {/* Vložíme sem náš hlavný komponent s nástrojom */}
            <PrimerDesigner />
        </main>

        <footer className="text-center py-6 border-t border-border text-sm">
            <p>&copy; 2025 | A fusion of science and code.</p>
        </footer>
    </div>
  );
}