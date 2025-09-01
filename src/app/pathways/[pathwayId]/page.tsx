// Súbor: src/app/pathways/[pathwayId]/page.tsx
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import PathwayClientPage from './PathwayClientPage'; // Stále používame náš klientsky komponent

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ▼▼▼ TU JE FINÁLNA A SPRÁVNA OPRAVA PODĽA DOKUMENTÁCIE ▼▼▼
// 1. Definuje sa správny typ pre props, kde `params` je Promise.
// 2. Funkcia je `async`.
// 3. Používame `await` na získanie hodnoty z `params`.
export default async function PathwayPage({ params }: { params: Promise<{ pathwayId: string }> }) {
    
    // Získame hodnotu z Promise pomocou `await`
    const { pathwayId } = await params;

    // 1. Načítame všetky dáta na serveri
    const { data: allPathwaysData } = await supabase.from('pathways').select('*').eq('is_public', true).order('created_at');
    const allPathways = allPathwaysData || [];
    
    // 2. Nájdeme konkrétnu dráhu, ktorá sa má zobraziť
    const initialPathway = allPathways.find(p => p.id === pathwayId) || null;

    // 3. Vrátime hlavičku a náš klientsky komponent, ktorému pošleme načítané dáta
    return (
        <div className="flex flex-col min-h-screen bg-background text-text">
            <header className="py-5 px-4 border-b border-border">
                <nav className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold">MB.</Link>
                    <ul className="flex gap-8 items-center text-lg">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/pathways" className="text-primary font-bold">Pathways</Link></li>
                    </ul>
                </nav>
            </header>
            
            <PathwayClientPage 
                initialPathway={initialPathway} 
                allPathways={allPathways} 
            />
        </div>
    );
}