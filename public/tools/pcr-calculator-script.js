document.addEventListener('DOMContentLoaded', () => {
    // Prístup k HTML elementom
    const polymeraseSelect = document.getElementById('polymerase-select');
    const sequenceLengthInput = document.getElementById('sequence-length');
    const cyclesInput = document.getElementById('pcr-cycles');
    const calculateBtn = document.getElementById('btn-calculate-pcr');
    const resultsBody = document.getElementById('pcr-results-body');
    const exportBtn = document.getElementById('btn-export-txt');
    
    // Nové elementy pre primery
    const forwardPrimerInput = document.getElementById('forward-primer');
    const reversePrimerInput = document.getElementById('reverse-primer');
    const primerResultsDiv = document.getElementById('primer-results');

    const polymerases = {
        'q5': { name: 'Q5 High-Fidelity Master Mix', extension_rate: 25, initial_denat: 120, cycle_denat: 20, annealing_time: 20, final_extension_factor: 7 },
        'phusion': { name: 'Phusion High-Fidelity Master Mix', extension_rate: 30, initial_denat: 120, cycle_denat: 20, annealing_time: 20, final_extension_factor: 7 },
        'onetaq': { name: 'OneTaq Hot Start Master Mix', extension_rate: 60, initial_denat: 120, cycle_denat: 20, annealing_time: 20, final_extension_factor: 7 },
        'taq': { name: 'Standard Taq (non-hot-start)', extension_rate: 60, initial_denat: 120, cycle_denat: 20, annealing_time: 20, final_extension_factor: 7 }
    };
    
    let protocolForExport = null;

    // NOVÁ POMOCNÁ FUNKCIA na výpočet Tm
    function calculateTm(sequence) {
        const cleanedSeq = sequence.toUpperCase().replace(/[^ATCG]/g, "");
        if (!cleanedSeq) return 0;
        const aCount = (cleanedSeq.match(/A/g) || []).length;
        const tCount = (cleanedSeq.match(/T/g) || []).length;
        const gcCount = (cleanedSeq.match(/[GC]/g) || []).length;
        return (aCount + tCount) * 2 + gcCount * 4;
    }

    function formatTime(seconds) {
        if (seconds < 60) return `${seconds} sec`;
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return sec === 0 ? `${min} min` : `${min} min ${sec} sec`;
    }

    calculateBtn.addEventListener('click', () => {
        const length = parseInt(sequenceLengthInput.value);
        if (isNaN(length) || length <= 0) {
            alert("Please enter a valid amplicon length.");
            return;
        }

        const forwardPrimerSeq = forwardPrimerInput.value;
        const reversePrimerSeq = reversePrimerInput.value;
        let annealingTemp = "55-68°C *"; // Predvolená hodnota

        // Blok pre spracovanie primerov
        primerResultsDiv.classList.add('hidden');
        primerResultsDiv.innerHTML = '';

        if (forwardPrimerSeq && reversePrimerSeq) {
            const tmForward = calculateTm(forwardPrimerSeq);
            const tmReverse = calculateTm(reversePrimerSeq);
            const tmDifference = Math.abs(tmForward - tmReverse);

            primerResultsDiv.innerHTML = `<span>Fwd Tm: ${tmForward.toFixed(1)}°C</span> <span>Rev Tm: ${tmReverse.toFixed(1)}°C</span> <span>ΔTm: ${tmDifference.toFixed(1)}°C</span>`;

            if (tmDifference > 5) {
                primerResultsDiv.innerHTML += `<div class="warning">Warning: Tm difference is > 5°C. PCR may be inefficient.</div>`;
                primerResultsDiv.classList.remove('hidden');
                alert("Primer Tm difference is too high (> 5°C)! Please check your primers before proceeding.");
                return; // Zastaví generovanie protokolu
            }

            // Výpočet a nastavenie Annealing teploty
            const lowerTm = Math.min(tmForward, tmReverse);
            annealingTemp = `${(lowerTm - 8).toFixed(1)}°C`;
            primerResultsDiv.classList.remove('hidden');
        }

        // Zvyšok generovania protokolu
        const selectedPolymeraseKey = polymeraseSelect.value;
        const cycles = parseInt(cyclesInput.value);
        const polymerase = polymerases[selectedPolymeraseKey];

        const calculatedExtension = Math.ceil((length / 1000) * polymerase.extension_rate);
        const finalExtensionTime = calculatedExtension + 10;
        
        resultsBody.innerHTML = '';
        
        protocolForExport = [
            ["PCR Protocol - MB Toolkit"],
            ["Polymerase", polymerase.name],
            ["Amplicon Length (bp)", length],
            ["Cycles", cycles],
            [],
            ["Step", "Temperature", "Time", "Details"]
        ];

        const protocolSteps = [
            { step: 'Initial Denaturation', temp: '98°C', time: formatTime(polymerase.initial_denat) },
            { step: 'Denaturation', temp: '98°C', time: formatTime(polymerase.cycle_denat), isCycle: true },
            { step: 'Annealing', temp: annealingTemp, time: formatTime(polymerase.annealing_time), isCycle: true },
            { step: 'Extension', temp: '72°C', time: formatTime(finalExtensionTime), isCycle: true },
            { step: 'Final Extension', temp: '72°C', time: `${polymerase.final_extension_factor} min` },
            { step: 'Hold', temp: '4-10°C', time: '∞' }
        ];

        let cycleSteps = [];
        protocolSteps.forEach(p => {
            if (p.isCycle) {
                cycleSteps.push(p);
            } else {
                if (cycleSteps.length > 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td class="cycles-cell"><div>${cycles} Cycles</div></td><td>${cycleSteps.map(cs => cs.step).join('<br>')}</td><td>${cycleSteps.map(cs => cs.temp).join('<br>')}</td><td>${cycleSteps.map(cs => cs.time).join('<br>')}</td>`;
                    resultsBody.appendChild(row);
                    cycleSteps.forEach(cs => protocolForExport.push([cs.step, cs.temp, cs.time, `(Repeat ${cycles}x)`]));
                    cycleSteps = [];
                }
                const row = document.createElement('tr');
                row.innerHTML = `<td></td><td>${p.step}</td><td>${p.temp}</td><td>${p.time}</td>`;
                resultsBody.appendChild(row);
                protocolForExport.push([p.step, p.temp, p.time, '']);
            }
        });

        const footerRow = document.createElement('tr');
        footerRow.innerHTML = `<td colspan="4" class="table-footnote">${annealingTemp.includes('*') ? '* Annealing temperature is primer-specific. Use the Oligo Calculator.' : 'Annealing temp. calculated based on provided primers.'}</td>`;
        resultsBody.appendChild(footerRow);
        
        protocolForExport.push([]);
        protocolForExport.push([footerRow.innerText]);
        
        exportBtn.classList.remove('hidden');
    });

    // VYLEPŠENÁ EXPORT FUNKCIA S POUŽITÍM SheetJS
    exportBtn.addEventListener('click', () => {
        if (!protocolForExport) return;

        // Vytvoríme nový "workbook" a do neho "worksheet"
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(protocolForExport);

        // Pridáme worksheet do workbooku
        XLSX.utils.book_append_sheet(wb, ws, "PCR_Protocol");

        // Stiahneme súbor
        XLSX.writeFile(wb, "pcr-protocol.xlsx");
    });
});