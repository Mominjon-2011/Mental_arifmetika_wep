// memory-game.js - Abakus Fotografik Xotira o'yini
class MemoryGame {
    constructor() {
        this.level = 1;
        this.digits = 2; // 2 xonali sondan boshlanadi
        this.flashDuration = 900; // ms
        this.currentNumber = 0;
        this.score = 0;
        this.isPlaying = false;

        this.initDOMElements();
    }

    initDOMElements() {
        this.levelEl = document.getElementById('memory-level');
        this.scoreEl = document.getElementById('memory-score');
        this.abacusContainer = document.getElementById('memory-abacus-card');
        this.inputArea = document.getElementById('memory-input-area');
        this.inputEl = document.getElementById('memory-answer-input');
        this.startBtn = document.getElementById('memory-start-btn');
        this.resultFeedback = document.getElementById('memory-feedback');
    }

    startRound() {
        this.isPlaying = true;
        this.inputArea.classList.add('hidden');
        this.resultFeedback.innerHTML = '';
        this.startBtn.classList.add('hidden');

        // Qiyinlik darajasiga qarab son yaratish
        const minVal = Math.pow(10, this.digits - 1);
        const maxVal = Math.pow(10, this.digits) - 1;
        this.currentNumber = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

        // Abakusda munchoqlarni ko'rsatish
        this.renderMiniAbacus(this.currentNumber);

        if (typeof sound !== 'undefined') sound.playPop();

        // flashDuration dan so'ng abakusni yopish (pardalash)
        setTimeout(() => {
            this.hideMiniAbacus();
            this.inputArea.classList.remove('hidden');
            this.inputEl.value = '';
            this.inputEl.focus();
        }, this.flashDuration);
    }

    renderMiniAbacus(number) {
        if (!this.abacusContainer) return;
        const strNum = String(number).padStart(this.digits, '0');
        let html = `
            <div class="flex items-center justify-center gap-3 p-4 bg-amber-950/40 rounded-2xl border-2 border-amber-600/50">
        `;

        for (let i = 0; i < strNum.length; i++) {
            const d = parseInt(strNum[i]);
            const upper = d >= 5 ? 1 : 0;
            const lower = d % 5;

            html += `
                <div class="flex flex-col items-center w-14 bg-slate-900/90 rounded-xl p-2 border border-amber-700/60 shadow-inner">
                    <!-- Yuqori qism (1 munchoq) -->
                    <div class="h-10 w-full flex items-center justify-center relative">
                        <div class="w-2.5 h-full bg-slate-400 absolute"></div>
                        <div class="w-10 h-6 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg shadow-md transition-all duration-150 z-10 ${upper ? 'mt-3 border-2 border-amber-300' : 'mb-3 opacity-30'}"></div>
                    </div>
                    <!-- To'siq -->
                    <div class="w-full h-2 bg-amber-700 rounded my-1 shadow"></div>
                    <!-- Quyi qism (4 munchoq) -->
                    <div class="h-28 w-full flex flex-col justify-end items-center relative py-1">
                        <div class="w-2.5 h-full bg-slate-400 absolute"></div>
                        ${[0, 1, 2, 3].map(idx => `
                            <div class="w-10 h-5 bg-gradient-to-r from-amber-500 to-amber-700 rounded-md shadow my-0.5 z-10 transition-all duration-150 ${idx < lower ? 'border border-amber-300 transform -translate-y-2' : 'opacity-35'}"></div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        this.abacusContainer.innerHTML = html;
    }

    hideMiniAbacus() {
        if (!this.abacusContainer) return;
        this.abacusContainer.innerHTML = `
            <div class="h-56 flex flex-col items-center justify-center bg-slate-900/60 rounded-2xl border-2 border-dashed border-slate-700 p-6 text-center animate-pulse">
                <span class="text-4xl mb-2">👁️</span>
                <span class="text-lg font-bold text-slate-300">Xotirangizni ishga soling!</span>
                <span class="text-xs text-slate-500 mt-1">Siz ko'rgan son qanday edi?</span>
            </div>
        `;
    }

    checkAnswer() {
        const userVal = parseInt(this.inputEl.value.trim());
        if (isNaN(userVal)) {
            this.inputEl.focus();
            return;
        }

        const isCorrect = (userVal === this.currentNumber);

        if (isCorrect) {
            this.score += 20 * this.level;
            this.level++;
            if (this.level % 3 === 0 && this.digits < 5) {
                this.digits++;
            }
            if (window.appStats && this.level > window.appStats.data.memoryBestLevel) {
                window.appStats.data.memoryBestLevel = this.level;
                window.appStats.saveData();
            }
            this.flashDuration = Math.max(300, this.flashDuration - 50);

            if (typeof sound !== 'undefined') sound.playCorrect();
            if (window.appStats) window.appStats.recordProblem(true, 'memory');

            this.resultFeedback.innerHTML = `
                <div class="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl text-emerald-400 font-bold text-center">
                    🎉 To'g'ri! Son: ${this.currentNumber}. Keyingi bosqich tezroq bo'ladi!
                </div>
            `;
        } else {
            if (typeof sound !== 'undefined') sound.playWrong();
            if (window.appStats) window.appStats.recordProblem(false, 'memory');

            this.resultFeedback.innerHTML = `
                <div class="p-3 bg-rose-950/60 border border-rose-500 rounded-xl text-rose-400 font-bold text-center">
                    ❌ Noto'g'ri! Haqiqiy son: <span class="text-white text-lg font-mono font-bold">${this.currentNumber}</span> edi.
                </div>
            `;
        }

        if (this.levelEl) this.levelEl.textContent = this.level;
        if (this.scoreEl) this.scoreEl.textContent = this.score;

        setTimeout(() => {
            this.startRound();
        }, 1500);
    }
}
