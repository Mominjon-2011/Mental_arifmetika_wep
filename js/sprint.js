// sprint.js - Tezkor Sprint (Vaqtga qarshi hisoblash musobaqasi)
class SprintChallenge {
    constructor() {
        this.duration = 60; // 60 soniya
        this.timeLeft = 60;
        this.timer = null;
        this.isPlaying = false;

        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.correctCount = 0;
        this.wrongCount = 0;

        this.currentProblem = null;
        this.difficulty = 'easy'; // easy (1-xonali), medium (2-xonali), hard (aralash)
        this.operationType = 'add_sub'; // 'add_sub', 'all'

        this.initDOMElements();
    }

    initDOMElements() {
        this.timerEl = document.getElementById('sprint-timer');
        this.progressBar = document.getElementById('sprint-progress-bar');
        this.scoreEl = document.getElementById('sprint-score');
        this.comboEl = document.getElementById('sprint-combo');
        this.problemEl = document.getElementById('sprint-problem');
        this.inputEl = document.getElementById('sprint-input');
        this.startBtn = document.getElementById('sprint-start-btn');
        this.resultModal = document.getElementById('sprint-result-modal');
    }

    setSettings(duration, difficulty, operationType) {
        this.duration = parseInt(duration);
        this.timeLeft = this.duration;
        this.difficulty = difficulty;
        this.operationType = operationType;
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.timeLeft = this.duration;

        this.updateStatsUI();
        if (this.resultModal) this.resultModal.classList.add('hidden');
        if (this.startBtn) this.startBtn.classList.add('hidden');

        this.inputEl.value = '';
        this.inputEl.disabled = false;
        this.inputEl.focus();

        this.nextProblem();

        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();

            if (this.timeLeft <= 5 && this.timeLeft > 0) {
                if (typeof sound !== 'undefined') sound.playTick();
            }

            if (this.timeLeft <= 0) {
                this.finish();
            }
        }, 1000);

        this.updateTimerUI();
    }

    updateTimerUI() {
        if (this.timerEl) this.timerEl.textContent = `${this.timeLeft}s`;
        if (this.progressBar) {
            const percent = (this.timeLeft / this.duration) * 100;
            this.progressBar.style.width = `${percent}%`;
            if (percent <= 20) {
                this.progressBar.className = 'h-full bg-rose-500 transition-all duration-300';
            } else if (percent <= 50) {
                this.progressBar.className = 'h-full bg-amber-500 transition-all duration-300';
            } else {
                this.progressBar.className = 'h-full bg-indigo-500 transition-all duration-300';
            }
        }
    }

    updateStatsUI() {
        if (this.scoreEl) this.scoreEl.textContent = this.score;
        if (this.comboEl) {
            if (this.combo >= 2) {
                this.comboEl.innerHTML = `<span class="combo-badge px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold rounded-full text-sm inline-flex items-center gap-1 shadow-lg">🔥 ${this.combo}x COMBO!</span>`;
            } else {
                this.comboEl.innerHTML = '';
            }
        }
    }

    generateProblem() {
        let n1 = 0, n2 = 0, op = '+', answer = 0;

        let maxNum = 9;
        let minNum = 1;
        if (this.difficulty === 'medium') {
            minNum = 10;
            maxNum = 50;
        } else if (this.difficulty === 'hard') {
            minNum = 15;
            maxNum = 99;
        }

        const ops = ['+', '-'];
        if (this.operationType === 'all' && this.difficulty !== 'easy') {
            ops.push('×');
        }

        op = ops[Math.floor(Math.random() * ops.length)];

        if (op === '+') {
            n1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            n2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            answer = n1 + n2;
        } else if (op === '-') {
            n1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // n1 > n2 bo'lishi shart
            answer = n1 - n2;
        } else if (op === '×') {
            n1 = Math.floor(Math.random() * 9) + 2;
            n2 = Math.floor(Math.random() * 9) + 2;
            answer = n1 * n2;
        }

        return { n1, n2, op, answer };
    }

    nextProblem() {
        this.currentProblem = this.generateProblem();
        if (this.problemEl) {
            this.problemEl.innerHTML = `
                <span class="text-slate-100 font-mono">${this.currentProblem.n1}</span>
                <span class="text-amber-400 font-bold mx-3">${this.currentProblem.op}</span>
                <span class="text-slate-100 font-mono">${this.currentProblem.n2}</span>
                <span class="text-slate-400 mx-3">=</span>
                <span class="text-indigo-400 font-bold">?</span>
            `;
        }
        this.inputEl.value = '';
        this.inputEl.focus();
    }

    checkInput() {
        if (!this.isPlaying || !this.currentProblem) return;
        const userVal = parseInt(this.inputEl.value.trim());
        if (isNaN(userVal)) return;

        if (userVal === this.currentProblem.answer) {
            // To'g'ri!
            this.correctCount++;
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;

            // Ball hisoblash: asosiy 10 ball + combo bonusi
            const multiplier = this.combo >= 5 ? 3 : (this.combo >= 3 ? 2 : 1);
            this.score += 10 * multiplier;

            if (typeof sound !== 'undefined') sound.playCorrect();

            // Vizual belgi
            this.flashInputFeedback('border-emerald-500 bg-emerald-950/40');
            this.updateStatsUI();
            this.nextProblem();
        } else {
            // Agar foydalanuvchi to'liq kiritib bo'lgan bo'lsa (uzunligi teng yoki katta bo'lsa)
            const expectedLen = String(this.currentProblem.answer).length;
            if (String(userVal).length >= expectedLen) {
                this.wrongCount++;
                this.combo = 0;
                if (typeof sound !== 'undefined') sound.playWrong();
                this.flashInputFeedback('border-rose-500 bg-rose-950/40');
                this.updateStatsUI();
                this.nextProblem();
            }
        }
    }

    flashInputFeedback(classes) {
        this.inputEl.classList.add(...classes.split(' '));
        setTimeout(() => {
            this.inputEl.classList.remove(...classes.split(' '));
        }, 220);
    }

    finish() {
        clearInterval(this.timer);
        this.isPlaying = false;
        this.inputEl.disabled = true;

        if (typeof sound !== 'undefined') sound.playFanfare();

        // Rekordni saqlash
        const bestScoreKey = 'sprint_best_score';
        const prevBest = parseInt(localStorage.getItem(bestScoreKey) || '0');
        const isNewRecord = this.score > prevBest;
        if (isNewRecord) {
            localStorage.setItem(bestScoreKey, this.score);
            if (window.appStats) {
                window.appStats.data.sprintBestScore = this.score;
                window.appStats.saveData();
            }
        }

        if (window.appStats) {
            for (let i = 0; i < this.correctCount; i++) window.appStats.recordProblem(true, 'sprint');
            for (let i = 0; i < this.wrongCount; i++) window.appStats.recordProblem(false, 'sprint');
        }

        const totalAttempts = this.correctCount + this.wrongCount;
        const accuracy = totalAttempts > 0 ? Math.round((this.correctCount / totalAttempts) * 100) : 0;
        const speedPerMin = Math.round((this.correctCount / (this.duration / 60)));

        if (this.resultModal) {
            this.resultModal.classList.remove('hidden');
            this.resultModal.innerHTML = `
                <div class="bg-slate-900 border border-slate-700/80 rounded-3xl p-8 max-w-md w-full mx-auto text-center shadow-2xl relative overflow-hidden">
                    <div class="absolute -top-12 -left-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl"></div>
                    <div class="absolute -bottom-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl"></div>
                    
                    <div class="text-5xl mb-3">${isNewRecord ? '🏆' : '⚡'}</div>
                    <h3 class="text-2xl font-black text-white mb-1">
                        ${isNewRecord ? 'Yangi Rekord!' : 'Sprint Yakunlandi!'}
                    </h3>
                    <p class="text-slate-400 text-sm mb-6">60 soniyalik natijangiz</p>

                    <div class="grid grid-cols-2 gap-3 mb-6">
                        <div class="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                            <div class="text-xs text-slate-400">To'plangan Ball</div>
                            <div class="text-3xl font-black text-amber-400 font-mono">${this.score}</div>
                        </div>
                        <div class="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                            <div class="text-xs text-slate-400">To'g'ri / Xato</div>
                            <div class="text-2xl font-bold font-mono">
                                <span class="text-emerald-400">${this.correctCount}</span> / <span class="text-rose-400">${this.wrongCount}</span>
                            </div>
                        </div>
                        <div class="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                            <div class="text-xs text-slate-400">Aniqlik</div>
                            <div class="text-2xl font-bold text-sky-400 font-mono">${accuracy}%</div>
                        </div>
                        <div class="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                            <div class="text-xs text-slate-400">Tezlik</div>
                            <div class="text-2xl font-bold text-indigo-400 font-mono">${speedPerMin} mis/daq</div>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button onclick="window.sprintChallenge.start()" class="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg transition active:scale-95">
                            Qaytadan o'ynash 🔄
                        </button>
                    </div>
                </div>
            `;
        }

        if (this.startBtn) this.startBtn.classList.remove('hidden');
    }
}
