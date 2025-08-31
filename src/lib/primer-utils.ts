// Súbor: src/lib/primer-utils.ts

// Typ pre jedného kandidáta na primer
export type PrimerCandidate = {
    sequence: string;
    start: number;
    length: number;
    gcContent: number;
    tm: number;
    hasGcClamp: boolean;
    // Neskôr pridáme ďalšie metriky ako self-dimer, hairpin...
};

// Typ pre finálny pár
export type PrimerPair = {
    id: number;
    forward: PrimerCandidate;
    reverse: PrimerCandidate;
    productSize: number;
    score: number;
};

// Funkcia na získanie reverzného komplementu
const complementMap: { [key: string]: string } = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
export const getReverseComplement = (seq: string): string => {
    let complement = '';
    for (const base of seq) {
        complement += complementMap[base.toUpperCase()] || 'N';
    }
    return complement.split('').reverse().join('');
};

// Funkcia na výpočet %GC
export const calculateGcContent = (seq: string): number => {
    const gcCount = (seq.match(/[GC]/gi) || []).length;
    return (gcCount / seq.length) * 100;
};

// Jednoduchý vzorec pre výpočet Teploty topenia (Tm)
export const calculateTm = (seq: string): number => {
    const gc = calculateGcContent(seq);
    // Základný Marmur-Doty vzorec
    if (seq.length < 14) {
        return (seq.match(/[AT]/gi) || []).length * 2 + (seq.match(/[GC]/gi) || []).length * 4;
    }
    return 64.9 + 41 * (gc/100) - 500 / seq.length;
};


// HLAVNÁ FUNKCIA, KTORÁ VŠETKO SPÁJA
export const designPrimers = (
    template: string,
    productMin: number,
    productMax: number,
    primerMin: number,
    primerMax: number
): PrimerPair[] => {
    
    const forwardCandidates: PrimerCandidate[] = [];
    const reverseCandidates: PrimerCandidate[] = [];
    const sequence = template.toUpperCase().replace(/[^ATGC]/g, ''); // Vyčistíme sekvenciu
    const revCompSequence = getReverseComplement(sequence);

    // 1. Generovanie a filtrovanie Forward kandidátov
    for (let i = 0; i < sequence.length - primerMin; i++) {
        for (let len = primerMin; len <= primerMax; len++) {
            if (i + len > sequence.length) continue;

            const seq = sequence.substring(i, i + len);
            const gcContent = calculateGcContent(seq);
            const tm = calculateTm(seq);
            const hasGcClamp = seq.endsWith('G') || seq.endsWith('C');
            
            // Základné filtrovanie: GC svorka je POVINNÁ
            if (!hasGcClamp) continue;
            // Filter na GC obsah a Tm
            if (gcContent < 40 || gcContent > 60) continue;
            if (tm < 55 || tm > 68) continue;

            forwardCandidates.push({ sequence: seq, start: i, length: len, gcContent, tm, hasGcClamp });
        }
    }

    // 2. Generovanie a filtrovanie Reverse kandidátov
    for (let i = 0; i < revCompSequence.length - primerMin; i++) {
        for (let len = primerMin; len <= primerMax; len++) {
            if (i + len > revCompSequence.length) continue;

            const seq = revCompSequence.substring(i, i + len);
            const gcContent = calculateGcContent(seq);
            const tm = calculateTm(seq);
            const hasGcClamp = seq.endsWith('G') || seq.endsWith('C');

            if (!hasGcClamp) continue;
            if (gcContent < 40 || gcContent > 60) continue;
            if (tm < 55 || tm > 68) continue;
            
            reverseCandidates.push({ sequence: seq, start: i, length: len, gcContent, tm, hasGcClamp });
        }
    }

    // 3. Párovanie a bodovanie
    const finalPairs: PrimerPair[] = [];
    let pairId = 0;
    for (const fwd of forwardCandidates) {
        for (const rev of reverseCandidates) {
            const productSize = (sequence.length - fwd.start) - rev.start;
            
            // Filter na veľkosť produktu a rozdiel Tm
            if (productSize < productMin || productSize > productMax) continue;
            if (Math.abs(fwd.tm - rev.tm) > 5) continue;

            // TODO: Pridať kontrolu primer-dimerov
            
            // Jednoduché bodovanie
            const score = Math.round(100 - Math.abs(fwd.tm - rev.tm) * 5 - Math.abs(50 - fwd.gcContent) - Math.abs(50 - rev.gcContent));

            finalPairs.push({
                id: pairId++,
                forward: fwd,
                reverse: rev,
                productSize,
                score
            });
        }
    }
    
    // Zoradíme podľa skóre a vrátime top 5
    return finalPairs.sort((a, b) => b.score - a.score).slice(0, 5);
};