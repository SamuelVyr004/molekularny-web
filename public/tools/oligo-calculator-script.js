document.addEventListener('DOMContentLoaded', () => {
    const oligoInput = document.getElementById('oligo-input');
    const calculateBtn = document.getElementById('btn-calculate');

    const resLength = document.getElementById('res-length');
    const resGc = document.getElementById('res-gc');
    const resMw = document.getElementById('res-mw');
    const resTa = document.getElementById('res-ta');

    const thermometerMercury = document.getElementById('thermometer-mercury');
    const thermometerValue = document.getElementById('thermometer-value');

    calculateBtn.addEventListener('click', () => {
        const sequence = oligoInput.value.toUpperCase().replace(/[^ATCG]/g, "");
        
        if (!sequence) {
            alert("Please enter a valid DNA sequence.");
            return;
        }

        const aCount = (sequence.match(/A/g) || []).length;
        const tCount = (sequence.match(/T/g) || []).length;
        const gcCount = (sequence.match(/[GC]/g) || []).length;

        const tm = (aCount + tCount) * 2 + gcCount * 4;
        const ta = tm - 8;

        resLength.textContent = `${sequence.length} nt`;
        resGc.textContent = `${((gcCount / sequence.length) * 100).toFixed(1)} %`;
        resMw.textContent = `${((aCount * 313.21) + (tCount * 304.2) + (gcCount === 0 ? 0 : (gcCount / 2 * 289.18) + (gcCount / 2 * 329.21)) - 61.96).toFixed(2)} g/mol`;
        resTa.textContent = `${ta.toFixed(1)} °C`;
        
        // ====================================================================
        // === NOVÁ LOGIKA PRE HORIZONTÁLNY TEPLOMER (STUPNICA 40-70°C) ===
        // ====================================================================
        
        const scaleMin = 40;
        const scaleMax = 70;
        const scaleRange = scaleMax - scaleMin;

        // Vypočítame pozíciu teploty v rámci našej stupnice
        const tempPosition = tm - scaleMin;
        
        // Prevedieme pozíciu na percentá (0% až 100%)
        let mercuryWidth = (tempPosition / scaleRange) * 100;
        
        // Zabezpečíme, aby šírka nebola menšia ako 0% alebo väčšia ako 100%
        mercuryWidth = Math.max(0, Math.min(100, mercuryWidth));
        
        thermometerMercury.style.width = mercuryWidth + '%';
        thermometerValue.textContent = tm.toFixed(1) + '°C';
        
        // Zmena farby teplomera (stupnica upravená pre Ta)
        if (ta < 50) {
            thermometerMercury.style.backgroundColor = '#00aaff'; // Modrá
        } else if (ta < 60) {
            thermometerMercury.style.backgroundColor = '#34d399'; // Zelená (ideálna)
        } else {
            thermometerMercury.style.backgroundColor = '#ef4444'; // Červená (vysoká)
        }
    });
});