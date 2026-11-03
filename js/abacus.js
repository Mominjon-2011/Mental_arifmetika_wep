// abacus.js - Interaktiv Soroban (Abakus) dvigateli
class SorobanAbacus {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.rodCount = options.rodCount || 7; // Standart 7 ta sim (ustun)
        this.showValues = options.showValues !== undefined ? options.showValues : true;
        this.showLabels = options.showLabels !== undefined ? options.showLabels : true;
        this.unitRodIndex = options.unitRodIndex || (this.rodCount - 1); // O'ngdagi oxirgi ustun = birliklar
        this.theme = options.theme || 'wood'; // 'wood', 'modern', 'rainbow'
        
        // Har bir ustun holati: { upper: 0|1, lower: 0|1|2|3|4 }
        this.state = [];
        this.initRods();

        // O'quv / mashq rejimi holati
        this.trainingMode = 'free'; // 'free', 'build_number', 'read_abacus'
        this.targetNumber = 0;
        this.trainingScore = 0;
        this.onValueChange = options.onValueChange || null;

        this.render();
    }

    initRods() {
        this.state = [];
        for (let i = 0; i < this.rodCount; i++) {
            this.state.push({ upper: 0, lower: 0 });
        }
    }

    setRodCount(count) {
        if (count < 3) count = 3;
        if (count > 13) count = 13;
        this.rodCount = count;
        this.unitRodIndex = this.rodCount - 1;
        this.initRods();
        this.render();
    }

    toggleValues(show) {
        this.showValues = show !== undefined ? show : !this.showValues;
        this.updateValueLabels();
    }

    toggleLabels(show) {
        this.showLabels = show !== undefined ? show : !this.showLabels;
        const labelsEl = this.container.querySelector('.abacus-column-labels');
        if (labelsEl) {
            labelsEl.style.display = this.showLabels ? 'flex' : 'none';
        }
    }

    setTheme(themeName) {
        this.theme = themeName;
        this.render();
    }

    // Har bir ustun qiymati (0 dan 9 gacha)
    getRodValue(rodIndex) {
        if (rodIndex < 0 || rodIndex >= this.rodCount) return 0;
        const rod = this.state[rodIndex];
        return (rod.upper * 5) + rod.lower;
    }

    // Abakusdagi umumiy yig'indi
    getTotalValue() {
        let total = 0;
        for (let i = 0; i < this.rodCount; i++) {
            const power = this.rodCount - 1 - i;
            total += this.getRodValue(i) * Math.pow(10, power);
        }
        return total;
    }

    // Abakusga aniq sonni o'rnatish
    setNumber(num) {
        let n = Math.max(0, Math.floor(num));
        for (let i = this.rodCount - 1; i >= 0; i--) {
            const digit = n % 10;
            this.state[i].upper = digit >= 5 ? 1 : 0;
            this.state[i].lower = digit % 5;
            n = Math.floor(n / 10);
        }
        this.updateAllBeadPositions();
        this.notifyChange();
    }

    // Tozalash (hamma munchoqlarni neytral holatga qaytarish)
    clear(playSound = true) {
        for (let i = 0; i < this.rodCount; i++) {
            this.state[i].upper = 0;
            this.state[i].lower = 0;
        }
        this.updateAllBeadPositions();
        if (playSound && typeof sound !== 'undefined') {
            sound.playClearSound();
        }
        this.notifyChange();
    }

    // Yuqori munchoqni bosish
    toggleUpperBead(rodIndex) {
        this.state[rodIndex].upper = this.state[rodIndex].upper === 1 ? 0 : 1;
        this.updateRodBeads(rodIndex);
        if (typeof sound !== 'undefined') {
            sound.playBeadClick(true, 0);
        }
        this.notifyChange();
    }

    // Pastki munchoqni bosish
    handleLowerBeadClick(rodIndex, beadIndex) {
        const currentActive = this.state[rodIndex].lower;
        
        // beadIndex: 0 = to'siqqa eng yaqin, 3 = eng pastdagi
        // Agar beadIndex < currentActive bo'lsa, bu munchoq faol holatda.
        // Uni bosish shu munchoq va undan pastidagilarni pastga tushiradi (deaktivatsiya).
        // Aks holda shu munchoq va undan yuqoridagilarni to'siqqa ko'taradi (faollashtirish).
        if (beadIndex < currentActive) {
            this.state[rodIndex].lower = beadIndex;
        } else {
            this.state[rodIndex].lower = beadIndex + 1;
        }

        this.updateRodBeads(rodIndex);
        if (typeof sound !== 'undefined') {
            sound.playBeadClick(false, beadIndex);
        }
        this.notifyChange();
    }

    notifyChange() {
        const val = this.getTotalValue();
        const totalDisplay = document.getElementById('abacus-total-val');
        if (totalDisplay) {
            totalDisplay.textContent = val.toLocaleString('uz-UZ');
        }
        this.updateValueLabels();

        if (this.onValueChange) {
            this.onValueChange(val, this.state);
        }

        // Mashq rejimida tekshirish
        if (this.trainingMode === 'build_number') {
            this.checkBuildNumber();
        }
    }

    updateValueLabels() {
        for (let i = 0; i < this.rodCount; i++) {
            const rodValEl = this.container.querySelector(`.rod-val-${i}`);
            if (rodValEl) {
                rodValEl.textContent = this.showValues ? this.getRodValue(i) : '•';
            }
        }
    }

    updateRodBeads(rodIndex) {
        const rodEl = this.container.querySelector(`[data-rod-index="${rodIndex}"]`);
        if (!rodEl) return;

        const rodState = this.state[rodIndex];

        // Yuqori munchoq
        const upperBead = rodEl.querySelector('.bead-upper');
        if (upperBead) {
            if (rodState.upper === 1) {
                // To'siqqa tushgan (faol)
                upperBead.classList.add('bead-active-down');
            } else {
                upperBead.classList.remove('bead-active-down');
            }
        }

        // Quyi munchoqlar
        const lowerBeads = rodEl.querySelectorAll('.bead-lower');
        lowerBeads.forEach((bead, idx) => {
            if (idx < rodState.lower) {
                // To'siqqa ko'tarilgan (faol)
                bead.classList.add('bead-active-up');
            } else {
                bead.classList.remove('bead-active-up');
            }
        });

        this.updateValueLabels();
    }

    updateAllBeadPositions() {
        for (let i = 0; i < this.rodCount; i++) {
            this.updateRodBeads(i);
        }
    }

    // Xona nomlari (o'ngdan chapga)
    getPlaceName(indexFromRight) {
        const names = [
            'Birlik', 'O\'nlik', 'Yuzlik', 'Minglik', 
            '10 Ming', '100 Ming', 'Million', '10 Million', 
            '100 Million', 'Milliard', '10 Milliard', '100 Milliard', 'Trillion'
        ];
        return names[indexFromRight] || `${Math.pow(10, indexFromRight)}`;
    }

    render() {
        this.container.innerHTML = '';

        // Umumiy abakus konteyneri
        const wrapper = document.createElement('div');
        wrapper.className = `soroban-wrapper theme-${this.theme}`;

        // Xona nomlari (Place labels)
        const labelsRow = document.createElement('div');
        labelsRow.className = 'abacus-column-labels';
        labelsRow.style.display = this.showLabels ? 'flex' : 'none';

        for (let i = 0; i < this.rodCount; i++) {
            const indexFromRight = this.rodCount - 1 - i;
            const labelEl = document.createElement('div');
            labelEl.className = 'rod-label';
            labelEl.textContent = this.getPlaceName(indexFromRight);
            labelsRow.appendChild(labelEl);
        }
        wrapper.appendChild(labelsRow);

        // Asosiy Soroban ramkasi
        const frame = document.createElement('div');
        frame.className = 'soroban-frame';

        // Yuqori ramka foni va simlar
        const deckUpper = document.createElement('div');
        deckUpper.className = 'soroban-deck deck-upper';

        // To'siq (Calculation Beam / To'siq chizig'i)
        const beam = document.createElement('div');
        beam.className = 'soroban-beam';

        // Quyi paluba (Lower deck)
        const deckLower = document.createElement('div');
        deckLower.className = 'soroban-deck deck-lower';

        // Ustunlar konteyneri
        const rodsContainer = document.createElement('div');
        rodsContainer.className = 'soroban-rods-container';

        for (let i = 0; i < this.rodCount; i++) {
            const indexFromRight = this.rodCount - 1 - i;
            const isUnitPoint = (indexFromRight % 3 === 0);

            const rodCol = document.createElement('div');
            rodCol.className = 'soroban-rod-column';
            rodCol.setAttribute('data-rod-index', i);

            // Sim chizig'i (metall o'q)
            const wire = document.createElement('div');
            wire.className = 'rod-wire';
            rodCol.appendChild(wire);

            // Yuqori qism
            const upperSection = document.createElement('div');
            upperSection.className = 'rod-section-upper';

            const upperBead = this.createBeadElement('upper', 0, i);
            if (this.state[i].upper === 1) upperBead.classList.add('bead-active-down');
            upperSection.appendChild(upperBead);
            rodCol.appendChild(upperSection);

            // To'siq qismi (nuqta bilan)
            const beamSection = document.createElement('div');
            beamSection.className = 'rod-section-beam';
            if (isUnitPoint) {
                const dot = document.createElement('div');
                dot.className = 'unit-dot';
                beamSection.appendChild(dot);
            }
            rodCol.appendChild(beamSection);

            // Quyi qism (4 ta munchoq)
            const lowerSection = document.createElement('div');
            lowerSection.className = 'rod-section-lower';

            for (let b = 0; b < 4; b++) {
                const lowerBead = this.createBeadElement('lower', b, i);
                if (b < this.state[i].lower) lowerBead.classList.add('bead-active-up');
                lowerSection.appendChild(lowerBead);
            }
            rodCol.appendChild(lowerSection);

            rodsContainer.appendChild(rodCol);
        }

        frame.appendChild(rodsContainer);
        wrapper.appendChild(frame);

        // Raqamlar qatori (pastki sonlar)
        const valuesRow = document.createElement('div');
        valuesRow.className = 'abacus-column-values';

        for (let i = 0; i < this.rodCount; i++) {
            const valEl = document.createElement('div');
            valEl.className = `rod-value rod-val-${i}`;
            valEl.textContent = this.showValues ? this.getRodValue(i) : '•';
            valuesRow.appendChild(valEl);
        }
        wrapper.appendChild(valuesRow);

        this.container.appendChild(wrapper);
    }

    createBeadElement(type, index, rodIndex) {
        const bead = document.createElement('div');
        bead.className = `soroban-bead bead-${type}`;
        bead.setAttribute('data-rod', rodIndex);
        bead.setAttribute('data-index', index);

        // Bikonik (olmos/romb shaklli Soroban munchoq SVG)
        bead.innerHTML = `
            <svg viewBox="0 0 70 38" class="bead-svg">
                <defs>
                    <linearGradient id="beadGrad-${type}-${rodIndex}-${index}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="var(--bead-top-color, #f6ad55)" />
                        <stop offset="48%" stop-color="var(--bead-ridge-color, #dd6b20)" />
                        <stop offset="52%" stop-color="var(--bead-ridge-color-dark, #c05621)" />
                        <stop offset="100%" stop-color="var(--bead-bottom-color, #7b341e)" />
                    </linearGradient>
                    <radialGradient id="beadHighlight" cx="35%" cy="30%" r="50%">
                        <stop offset="0%" stop-color="rgba(255,255,255,0.6)" />
                        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                    </radialGradient>
                </defs>
                <!-- Bikonik olmos shakl (Soroban standart munchoq) -->
                <polygon points="35,1 68,19 35,37 2,19" fill="url(#beadGrad-${type}-${rodIndex}-${index})" stroke="rgba(0,0,0,0.3)" stroke-width="1.2" />
                <!-- 3D yorug'lik aksi -->
                <polygon points="35,2 66,19 35,19 4,19" fill="url(#beadHighlight)" opacity="0.8" />
                <!-- Markaziy qirra chizig'i -->
                <line x1="2" y1="19" x2="68" y2="19" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
            </svg>
        `;

        if (type === 'upper') {
            bead.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUpperBead(rodIndex);
            });
        } else {
            bead.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLowerBeadClick(rodIndex, index);
            });
        }

        return bead;
    }

    // --- MASHQ REJIMI FUNKSIYALARI ---

    startBuildNumberChallenge(digits = 3) {
        this.trainingMode = 'build_number';
        this.clear(false);
        const max = Math.pow(10, Math.min(digits, this.rodCount)) - 1;
        const min = Math.pow(10, Math.min(digits, this.rodCount) - 1);
        this.targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        
        const promptEl = document.getElementById('abacus-challenge-text');
        if (promptEl) {
            promptEl.innerHTML = `Ushbu sonni abakusda tering: <span class="text-3xl font-extrabold text-amber-400 font-mono tracking-wider">${this.targetNumber.toLocaleString('uz-UZ')}</span>`;
        }
    }

    checkBuildNumber() {
        const currentVal = this.getTotalValue();
        if (currentVal === this.targetNumber) {
            if (typeof sound !== 'undefined') sound.playCorrect();
            this.trainingScore += 10;
            const scoreEl = document.getElementById('abacus-challenge-score');
            if (scoreEl) scoreEl.textContent = this.trainingScore;

            if (window.appStats) {
                window.appStats.recordProblem(true, 'abacus');
            }

            const promptEl = document.getElementById('abacus-challenge-text');
            if (promptEl) {
                promptEl.innerHTML = `🎉 <span class="text-emerald-400 font-bold">Barakalla! To'g'ri terdingiz!</span>`;
            }

            // 1 soniyadan keyin yangi son berish
            setTimeout(() => {
                if (this.trainingMode === 'build_number') {
                    this.startBuildNumberChallenge();
                }
            }, 1200);
        }
    }

    startReadAbacusChallenge(digits = 3) {
        this.trainingMode = 'read_abacus';
        this.clear(false);
        const max = Math.pow(10, Math.min(digits, this.rodCount)) - 1;
        const min = Math.pow(10, Math.min(digits, this.rodCount) - 1);
        this.targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        this.setNumber(this.targetNumber);
    }
}
