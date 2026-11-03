// flash-anzan.js - Flesh Anzan (Tezkor hisoblash trenajyori)
class FlashAnzan {
    constructor() {
        this.digits = 1; // 1-xonali
        this.count = 5;  // 5 ta son
        this.speed = 1.0; // 1.0 soniya interval
        this.allowNegative = false; // Faqat qo'shish yoki ayirish ham bor

        this.numbers = [];
        this.correctAnswer = 0;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.timer = null;

        this.initDOMElements();
    }

    initDOMElements() {
        this.displayBox = document.getElementById('flash-number-display');
        this.inputArea = document.getElementById('flash-input-area');
        this.resultArea = document.getElementById('flash-result-area');
        this.startBtn = document.getElementById('flash-start-btn');
        this.answerInput = document.getElementById('flash-user-answer');
        this.submitBtn = document.getElementById('flash-submit-btn');
    }

    setSettings(digits, count, speed, allowNegative) {
        this.digits = parseInt(digits);
        this.count = parseInt(count);
        this.speed = parseFloat(speed);
        this.allowNegative = Boolean(allowNegative);
    }

    // Mental arifmetikaga mos sonlar zanjirini hosil qilish
    generateSequence() {
        this.numbers = [];
        let runningSum = 0;
        const minVal = Math.pow(10, this.digits - 1);
        const maxVal = Math.pow(10, this.digits) - 1;

        for (let i = 0; i < this.count; i++) {
            let num = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

            // Agar ayirish ruxsat etilgan bo'lsa va oraliq yig'indi yetarli bo'lsa
            if (this.allowNegative && i > 0 && Math.random() > 0.45) {
                // Manfiy son: oraliq yig'indidan oshmasligi kerak (manfiyga tushib ketmaslik uchun)
                const maxSubtract = Math.min(runningSum - 1, maxVal);
                if (maxSubtract >= minVal) {
                    num = -(Math.floor(Math.random() * (maxSubtract - minVal + 1)) + minVal);
                }
            }

            runningSum += num;
            this.numbers.push(num);
        }

        this.correctAnswer = runningSum;
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.generateSequence();

        // UI holatini sozlash
        this.inputArea.classList.add('hidden');
        this.resultArea.classList.add('hidden');
        this.startBtn.disabled = true;
        this.startBtn.classList.add('opacity-50', 'cursor-not-allowed');

        this.startCountdown();
    }

    startCountdown() {
        let count = 3;
        this.displayBox.innerHTML = `<span class="flash-number countdown">${count}</span>`;
        if (typeof sound !== 'undefined') sound.playTick();

        const cdInterval = setInterval(() => {
            count--;
            if (count > 0) {
                this.displayBox.innerHTML = `<span class="flash-number countdown">${count}</span>`;
                if (typeof sound !== 'undefined') sound.playTick();
            } else if (count === 0) {
                this.displayBox.innerHTML = `<span class="flash-number countdown text-emerald-400">TAYYOR!</span>`;
                if (typeof sound !== 'undefined') sound.playTick();
            } else {
                clearInterval(cdInterval);
                this.currentIndex = 0;
                this.showNextNumber();
            }
        }, 800);
    }

    showNextNumber() {
        if (this.currentIndex >= this.numbers.length) {
            // Hammasi ko'rsatib bo'lindi, javob kiritish vaqti
            this.finishFlashing();
            return;
        }

        const num = this.numbers[this.currentIndex];
        const isNegative = num < 0;
        const formatted = isNegative ? `${num}` : `+${num}`;
        const colorClass = isNegative ? 'negative' : 'positive';

        this.displayBox.innerHTML = `
            <div class="text-center">
                <span class="flash-number ${colorClass}">${formatted}</span>
                <div class="text-xs text-slate-400 mt-2 font-mono">${this.currentIndex + 1} / ${this.numbers.length}</div>
            </div>
        `;

        if (typeof sound !== 'undefined') {
            sound.playPop();
            sound.speakNumber(num);
        }

        this.currentIndex++;

        // Sonni ko'rsatish vaqti va oraliq qisqa bo'sh joy (blank screen)
        const displayDuration = Math.max(120, this.speed * 1000 - 80);
        const blankDuration = Math.min(80, this.speed * 1000 * 0.2);

        this.timer = setTimeout(() => {
            // Bo'sh oraliq (ko'zni yangi songa tayyorlash)
            if (this.currentIndex < this.numbers.length) {
                this.displayBox.innerHTML = `<span class="text-slate-600 text-6xl">•</span>`;
            }
            this.timer = setTimeout(() => {
                this.showNextNumber();
            }, blankDuration);
        }, displayDuration);
    }

    finishFlashing() {
        this.displayBox.innerHTML = `
            <div class="text-center">
                <div class="text-3xl font-extrabold text-amber-400 animate-pulse">?</div>
                <div class="text-sm text-slate-400 mt-1 font-medium">Javobingizni kiriting</div>
            </div>
        `;

        this.inputArea.classList.remove('hidden');
        this.answerInput.value = '';
        this.answerInput.focus();

        this.startBtn.disabled = false;
        this.startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        this.isPlaying = false;
    }

    submitAnswer() {
        const userVal = parseInt(this.answerInput.value.trim());
        if (isNaN(userVal)) {
            this.answerInput.focus();
            return;
        }

        const isCorrect = (userVal === this.correctAnswer);

        // Tovush va statistika
        if (isCorrect) {
            if (typeof sound !== 'undefined') sound.playCorrect();
            if (window.appStats) window.appStats.recordProblem(true, 'flash');
        } else {
            if (typeof sound !== 'undefined') sound.playWrong();
            if (window.appStats) window.appStats.recordProblem(false, 'flash');
        }

        // Formulaning to'liq ko'rinishi
        const formulaString = this.numbers.map((n, i) => {
            if (i === 0) return `${n}`;
            return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
        }).join(' ') + ` = <span class="font-bold text-amber-400">${this.correctAnswer}</span>`;

        // Natija oynasi
        this.resultArea.classList.remove('hidden');
        this.resultArea.innerHTML = `
            <div class="p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-rose-950/40 border-rose-500/50'} text-center space-y-4">
                <div class="text-4xl">${isCorrect ? '🎉' : '❌'}</div>
                <div class="text-2xl font-black ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">
                    ${isCorrect ? 'Ajoyib! To\'g\'ri javob!' : 'Noto\'g\'ri javob!'}
                </div>
                <div class="flex justify-center gap-8 text-sm">
                    <div>
                        <div class="text-slate-400">Sizning javobingiz:</div>
                        <div class="text-xl font-bold font-mono ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}">${userVal}</div>
                    </div>
                    <div>
                        <div class="text-slate-400">To'g'ri javob:</div>
                        <div class="text-xl font-bold font-mono text-emerald-400">${this.correctAnswer}</div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-700/60">
                    <div class="text-xs text-slate-400 mb-1">Misollar ketma-ketligi:</div>
                    <div class="text-sm font-mono text-slate-200 bg-slate-900/60 p-2.5 rounded-lg overflow-x-auto">${formulaString}</div>
                </div>
                <button onclick="window.flashAnzan.start()" class="mt-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 inline-flex items-center gap-2">
                    <span>Keyingi misol</span> ➔
                </button>
            </div>
        `;
    }
}
