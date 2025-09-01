// Súbor: src/app/pathways/page.tsx

import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Táto funkcia beží na serveri a načíta dáta vopred
async function getPathways() {
    const { data } = await supabase.from('pathways').select('id, name, description').eq('is_public', true).order('created_at');
    return data || [];
}

export default async function PathwaysListPage() {
    const pathways = await getPathways();

    return (
        <div className="flex flex-col min-h-screen bg-background text-text">
            <header className="py-5 px-4 sm:px-6 lg:px-8 border-b border-border">
                 <nav className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold font-primary text-primary no-underline">MB.</Link>
                    <ul className="flex gap-8 items-center font-primary text-lg">
                        <li><Link href="/" className="text-text hover:text-primary no-underline transition-colors">Home</Link></li>
                        <li><Link href="/pathways" className="text-primary font-bold no-underline">Pathways</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow">
                <section className="text-center py-16 sm:py-24 px-4">
                    <h1 className="font-primary text-4xl sm:text-5xl font-bold mb-4 text-heading">
                        Interactive Pathway Library
                    </h1>
                    <p className="text-lg sm:text-xl max-w-2xl mx-auto text-text">
                        Explore our collection of signaling and biochemical pathways.
                    </p>
                </section>

                <section className="max-w-4xl mx-auto px-4 pb-16 sm:pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pathways.map((pathway) => (
                            <Link 
                                href={`/pathways/${pathway.id}`} 
                                key={pathway.id} 
                                className="group block bg-card/50 p-6 rounded-lg border border-border hover:border-white/50 transition-all duration-300 hover:scale-[1.02]"
                            >
                                <h2 className="font-primary text-2xl font-bold text-heading mb-2">{pathway.name}</h2>
                                <p className="text-text/80">{pathway.description || 'Click to view the interactive diagram.'}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="text-center py-6 border-t border-border text-sm">
                <p>&copy; 2025 | A fusion of science and code.</p>
            </footer>
        </div>
    );
}