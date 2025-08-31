'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// ▼▼▼ Importujeme našu novú logiku ▼▼▼
import { designPrimers, PrimerPair } from '@/lib/primer-utils';

export default function PrimerDesigner() {
    const [sequence, setSequence] = useState('');
    const [productSize, setProductSize] = useState({ min: "300", max: "500" });
    const [primerLength, setPrimerLength] = useState({ min: "18", max: "22" });

    const [status, setStatus] = useState<'idle' | 'analyzing' | 'done' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [results, setResults] = useState<PrimerPair[]>([]);

    const runAnalysis = () => {
        // Validácia vstupov
        if (sequence.length < parseInt(productSize.max)) {
            setStatus('error');
            setErrorMessage(`Template sequence must be longer than the max product size (${productSize.max} bp).`);
            return;
        }

        setStatus('analyzing');
        setResults([]);
        
        // Spustíme skutočnú analýzu v "pozadí", aby sa UI nezaseklo
        setTimeout(() => {
            const primerPairs = designPrimers(
                sequence,
                parseInt(productSize.min),
                parseInt(productSize.max),
                parseInt(primerLength.min),
                parseInt(primerLength.max)
            );
            
            if (primerPairs.length === 0) {
                setStatus('error');
                setErrorMessage('No suitable primer pairs found with the given criteria. Try adjusting the parameters.');
            } else {
                setResults(primerPairs);
                setStatus('done');
            }
        }, 100); // Malá pauza, aby sa stihol zobraziť "Analyzing..."
    };

    return (
        <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
            <div className="bg-card/50 p-6 sm:p-8 rounded-lg border border-border">
                {/* ... (časť s nadpisom zostáva rovnaká) ... */}
                <h2 className="font-primary text-3xl font-bold mb-2 text-heading">Intelligent Primer Designer</h2>
                <p className="text-text/80 mb-6">Automatically design optimal PCR primers based on thermodynamic principles.</p>
                
                <div className="space-y-6 mb-6">
                    <div>
                        <Label htmlFor="sequence" className="block text-lg font-medium mb-2">1. Template DNA Sequence</Label>
                        <textarea id="sequence" rows={5} value={sequence} onChange={e => setSequence(e.target.value)} className="w-full bg-background border border-border rounded-md p-2 font-mono text-sm" placeholder="Paste your FASTA or raw sequence here..."></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="block text-lg font-medium mb-2">2. Product Size (bp)</Label>
                            <div className="flex items-center gap-2">
                                <Input type="number" value={productSize.min} onChange={e => setProductSize(prev => ({...prev, min: e.target.value}))} placeholder="Min" />
                                <span>-</span>
                                <Input type="number" value={productSize.max} onChange={e => setProductSize(prev => ({...prev, max: e.target.value}))} placeholder="Max" />
                            </div>
                        </div>
                        <div>
                            <Label className="block text-lg font-medium mb-2">3. Primer Length (nt)</Label>
                            <div className="flex items-center gap-2">
                                <Input type="number" value={primerLength.min} onChange={e => setPrimerLength(prev => ({...prev, min: e.target.value}))} placeholder="Min" />
                                <span>-</span>
                                <Input type="number" value={primerLength.max} onChange={e => setPrimerLength(prev => ({...prev, max: e.target.value}))} placeholder="Max" />
                            </div>
                        </div>
                    </div>
                </div>
                <Button onClick={runAnalysis} disabled={status === 'analyzing'} size="lg" className="w-full md:w-auto">
                    {status === 'analyzing' ? 'Analyzing...' : 'Design Primers'}
                </Button>

                <AnimatePresence>
                    {status !== 'idle' && (
                        <motion.div key="output" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-border overflow-hidden">
                            {status === 'analyzing' && ( <p className="text-center text-text/80">Analyzing sequence, please wait...</p> )}
                            {status === 'error' && ( <p className="text-center text-red-400">{errorMessage}</p> )}
                            {status === 'done' && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Top {results.length} Primer Pairs Found</h3>
                                    <div className="space-y-4">
                                        {results.map((pair, index) => (
                                            <div key={pair.id} className="p-4 bg-background rounded-md border border-border font-mono text-sm">
                                                <p className="font-bold mb-2">Pair #{index + 1} (Score: {pair.score}/100)</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 break-all">
                                                    <p><span className="font-semibold text-text/70">Fwd:</span> {pair.forward.sequence}</p>
                                                    <p><span className="font-semibold text-text/70">Rev:</span> {pair.reverse.sequence}</p>
                                                    <p><span className="font-semibold text-text/70">Tm:</span> {pair.forward.tm.toFixed(1)}°C / {pair.reverse.tm.toFixed(1)}°C</p>
                                                    <p><span className="font-semibold text-text/70">GC%:</span> {pair.forward.gcContent.toFixed(0)}% / {pair.reverse.gcContent.toFixed(0)}%</p>
                                                </div>
                                                <p className="mt-2"><span className="font-semibold text-text/70">Product:</span> {pair.productSize} bp</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}