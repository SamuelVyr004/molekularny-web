document.addEventListener('DOMContentLoaded', () => {
    const dnaInput = document.getElementById('dna-input');
    const dnaOutput = document.getElementById('dna-output');
    const btnReverseComplement = document.getElementById('btn-reverse-complement');
    const btnComplement = document.getElementById('btn-complement');
    const btnClear = document.getElementById('btn-clear');
    const complementMap = {'A':'T','T':'A','C':'G','G':'C','a':'t','t':'a','c':'g','g':'c'};
    function getComplement(sequence) {
        let complement = '';
        for (let i = 0; i < sequence.length; i++) {
            const base = sequence[i];
            complement += complementMap[base] || base;
        }
        return complement;
    }
    function getReverseComplement(sequence) {
        const complement = getComplement(sequence);
        return complement.split('').reverse().join('');
    }
    btnReverseComplement.addEventListener('click', () => {
        const sequence = dnaInput.value;
        dnaOutput.textContent = sequence ? `5' ${getReverseComplement(sequence)} 3'` : 'Please enter a sequence first.';
    });
    btnComplement.addEventListener('click', () => {
        const sequence = dnaInput.value;
        dnaOutput.textContent = sequence ? `3' ${getComplement(sequence)} 5'` : 'Please enter a sequence first.';
    });
    btnClear.addEventListener('click', () => {
        dnaInput.value = '';
        dnaOutput.textContent = '';
    });
});