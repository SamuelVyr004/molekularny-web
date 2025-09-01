'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Typy si môžeme znova definovať alebo importovať zo zdieľaného súboru
type Pathway = { 
    id: string; 
    name: string; 
    pathway_type: 'signaling' | 'biochemical';
    image_url_inactive: string | null;
    image_url_active: string | null;
    details: string | null;
};

interface PathwayClientPageProps {
    initialPathway: Pathway | null;
    allPathways: Pathway[];
}

export default function PathwayClientPage({ initialPathway, allPathways }: PathwayClientPageProps) {
    // Stavy sú teraz odvodené z props
    const [activePathway, setActivePathway] = useState<Pathway | null>(initialPathway);
    const [isShowingActive, setIsShowingActive] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Tento efekt sa spustí vždy, keď sa zmení dráha v URL (a teda aj `initialPathway` prop)
    useEffect(() => {
        setActivePathway(initialPathway);
        // Resetujeme stavy pri zmene dráhy
        setIsShowingActive(false);
        setIsDetailsOpen(false);
    }, [initialPathway]);

    const getDisplayedImage = () => {
        if (!activePathway) return null;
        if (activePathway.pathway_type === 'signaling' && isShowingActive) {
            return activePathway.image_url_active;
        }
        return activePathway.image_url_inactive;
    };
    
    return (
        <>
            {/* Panel s detailmi */}
            <div className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isDetailsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDetailsOpen(false)} />
            <aside className={`fixed top-0 right-0 h-full w-[90%] md:w-1/3 bg-card border-l border-border p-6 overflow-y-auto transition-transform duration-300 ease-in-out z-40 ${isDetailsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Details</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsDetailsOpen(false)}><X className="h-6 w-6" /></Button>
                </div>
                {/* Bezpečné zobrazenie HTML obsahu */}
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: activePathway?.details || '' }} />
            </aside>

            {/* Hlavný obsah stránky */}
            <div className="flex-grow flex flex-col md:flex-row gap-8 p-4 sm:p-6 lg:p-8">
                {/* Bočný panel so zoznamom dráh */}
                <aside className="w-full md:w-3/12 md:max-w-sm flex-shrink-0">
                    <div className="bg-card/50 p-4 rounded-lg border border-border h-full">
                        <h2 className="text-lg font-bold mb-3">Available Pathways</h2>
                        <ul className="space-y-2">
                            {allPathways.map(p => (
                                <li key={p.id}>
                                    <Link href={`/pathways/${p.id}`} className={`block w-full text-left p-3 rounded-md border transition-colors ${activePathway?.id === p.id ? 'bg-background font-bold text-primary' : 'hover:bg-white/5'}`}>
                                        {p.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Zobrazenie aktívnej dráhy */}
                <main className="flex-grow flex flex-col min-w-0">
                    {activePathway ? (
                        <>
                            <section aria-labelledby="pathway-title" className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <h1 id="pathway-title" className="text-3xl font-bold">{activePathway.name}</h1>
                                <div className="flex gap-2 self-end sm:self-center">
                                    {activePathway.details && (<Button variant="outline" onClick={() => setIsDetailsOpen(true)}>Show Details</Button>)}
                                    {activePathway.pathway_type === 'signaling' && (<Button onClick={() => setIsShowingActive(!isShowingActive)}>{isShowingActive ? 'Show Inactive' : 'Show Active'}</Button>)}
                                </div>
                            </section>
                            <div className="relative flex-grow rounded-lg border border-border bg-card/30 flex items-center justify-center overflow-hidden min-h-[500px]">
                                {getDisplayedImage() ? 
                                 <Image src={getDisplayedImage()!} alt={activePathway.name} fill={true} style={{objectFit: 'contain'}} className="p-4" /> :
                                 <p>Image not available.</p>
                                }
                            </div>
                        </>
                    ) : (
                        <p className="text-center p-10">Pathway not found. Please select one from the list.</p>
                    )}
                </main>
            </div>
        </>
    );
}