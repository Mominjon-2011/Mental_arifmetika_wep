// app.js - Asosiy boshqaruv va statistika
class AppStats {
    constructor() {
        this.storageKey = 'mental_arifmetika_stats_v1';
        this.data = this.loadData();
    }

    loadData() {
        const defaultData = {
            totalSolved: 0,
            totalCorrect: 0,
            totalWrong: 0,
            flashBestStreak: 0,
            sprintBestScore: 0,
            memoryBestLevel: 1,
            badges: {
                first_step: false,      // Ilk qadam
                flash_master: false,    // Flesh qahramoni (10 ta to'g'ri)
                sprint_hero: false,     // Chaqmoq hisobchi (sprintda 150+ ball)
                abacus_pro: false,      // Abakus ustasi (abakus mashqida 50+ ball)
                photographic_mind: false// Super fotografik xotira (5-darajaga yetish)
            }
        };

        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? { ...defaultData, ...JSON.parse(raw) } : defaultData;
        } catch (e) {
            return defaultData;
        }
    }

    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            this.updateStatsUI();
        } catch (e) {
            console.error(e);
        }
    }

    recordProblem(isCorrect, type = 'general') {
        this.data.totalSolved++;
        if (isCorrect) {
            this.data.totalCorrect++;
            this.checkBadges(type);
        } else {
            this.data.totalWrong++;
        }
        this.saveData();
    }

    checkBadges(type) {
        let newBadge = null;

        if (!this.data.badges.first_step && this.data.totalCorrect >= 1) {
            this.data.badges.first_step = true;
            newBadge = { title: "Birinchi Qadam! 🌟", desc: "Ilk misolni muvaffaqiyatli yechdingiz!" };
        }

        if (!this.data.badges.flash_master && type === 'flash' && this.data.totalCorrect >= 10) {
            this.data.badges.flash_master = true;
            newBadge = { title: "Flesh Qahramoni! ⚡", desc: "Flesh Anzanda 10 ta misolni to'g'ri bajardingiz!" };
        }

        if (!this.data.badges.sprint_hero && type === 'sprint' && this.data.sprintBestScore >= 150) {
            this.data.badges.sprint_hero = true;
            newBadge = { title: "Chaqmoq Hisobchi! 🏃", desc: "Sprintda 150 balldan oshirdingiz!" };
        }

        if (!this.data.badges.abacus_pro && type === 'abacus' && (window.soroban && window.soroban.trainingScore >= 50)) {
            this.data.badges.abacus_pro = true;
            newBadge = { title: "Abakus Ustasi! 🧮", desc: "Abakus mashqida 50 ball to'pladingiz!" };
        }

        if (!this.data.badges.photographic_mind && type === 'memory' && (window.memoryGame && window.memoryGame.level >= 5)) {
            this.data.badges.photographic_mind = true;
            newBadge = { title: "Fotografik Xotira! 🧠", desc: "Xotira o'yinida 5-bosqichga yetdingiz!" };
        }

        if (newBadge) {
            this.showBadgeNotification(newBadge);
        }
    }

    showBadgeNotification(badge) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-amber-300 animate-bounce';
        toast.innerHTML = `
            <span class="text-3xl">🏅</span>
            <div>
                <div class="font-extrabold text-sm">${badge.title}</div>
                <div class="text-xs font-semibold opacity-90">${badge.desc}</div>
            </div>
        `;
        document.body.appendChild(toast);
        if (typeof sound !== 'undefined') sound.playFanfare();
        setTimeout(() => toast.remove(), 4500);
    }

    updateStatsUI() {
        const solvedEl = document.getElementById('stats-total-solved');
        const solvedCardEl = document.getElementById('stats-total-solved-card');
        const accuracyEl = document.getElementById('stats-accuracy');
        const accuracyCardEl = document.getElementById('stats-accuracy-card');
        const correctEl = document.getElementById('stats-correct');

        if (solvedEl) solvedEl.textContent = this.data.totalSolved;
        if (solvedCardEl) solvedCardEl.textContent = this.data.totalSolved;
        if (correctEl) correctEl.textContent = this.data.totalCorrect;
        
        const acc = this.data.totalSolved > 0 
            ? Math.round((this.data.totalCorrect / this.data.totalSolved) * 100) 
            : 0;
        if (accuracyEl) accuracyEl.textContent = `${acc}%`;
        if (accuracyCardEl) accuracyCardEl.textContent = `${acc}%`;

        // Yutuqlar nishonlarini belgilash
        Object.keys(this.data.badges).forEach(key => {
            const el = document.getElementById(`badge-${key}`);
            if (el) {
                if (this.data.badges[key]) {
                    el.classList.remove('opacity-40', 'grayscale');
                    el.classList.add('border-amber-400', 'bg-amber-500/10');
                } else {
                    el.classList.add('opacity-40', 'grayscale');
                }
            }
        });
    }
}

// Global stats instansiyasi
window.appStats = new AppStats();

// Bo'limlarni almashtirish (Tab routing)
function switchTab(tabId) {
    const tabs = ['abacus', 'flash', 'sprint', 'memory', 'formulas', 'stats'];
    const tabNames = {
        'abacus': '🧮 Abakus',
        'flash': '⚡ Flesh Anzan',
        'sprint': '⏱️ Sprint 60s',
        'memory': '🧠 Xotira',
        'formulas': '📚 Formulalar',
        'stats': '🏆 Yutuqlar'
    };

    tabs.forEach(id => {
        const section = document.getElementById(`section-${id}`);
        const desktopBtn = document.getElementById(`tab-btn-${id}`);
        const mobileBtn = document.getElementById(`mob-tab-${id}`);

        if (section) {
            if (id === tabId) {
                section.classList.remove('hidden');
                section.classList.add('animate-fadeIn');
            } else {
                section.classList.add('hidden');
            }
        }

        // Desktop tugmalar
        if (desktopBtn) {
            if (id === tabId) {
                desktopBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/30');
                desktopBtn.classList.remove('text-slate-400', 'hover:bg-slate-800');
            } else {
                desktopBtn.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/30');
                desktopBtn.classList.add('text-slate-400', 'hover:bg-slate-800');
            }
        }

        // Mobil menyu kartalari
        if (mobileBtn) {
            if (id === tabId) {
                mobileBtn.className = 'p-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2.5 transition active:scale-95 text-left border border-indigo-400/40 shadow-md shadow-indigo-600/30';
            } else {
                mobileBtn.className = 'p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2.5 transition active:scale-95 text-left hover:border-slate-700';
            }
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobil Menyuni ochish / yopish
function toggleMobileMenu(forceState) {
    const drawer = document.getElementById('mobile-menu-drawer');
    const icon = document.getElementById('mobile-menu-icon');
    if (!drawer) return;

    const isOpen = drawer.classList.contains('menu-open');
    const newState = (forceState !== undefined) ? forceState : !isOpen;

    if (newState) {
        drawer.classList.remove('menu-closed');
        drawer.classList.add('menu-open');
        if (icon) icon.textContent = '✕';
    } else {
        drawer.classList.remove('menu-open');
        drawer.classList.add('menu-closed');
        if (icon) icon.textContent = '☰';
    }
}

// Flesh Anzan Tugmali Sozlamalar Boshqaruvi
function selectFlashDigits(digits, btn) {
    if (window.flashAnzan) window.flashAnzan.digits = parseInt(digits);
    if (typeof sound !== 'undefined') sound.playBeadClick(false, 1);

    const container = btn.parentElement;
    container.querySelectorAll('.setting-chip').forEach(b => {
        b.classList.remove('active');
        b.className = 'setting-chip py-2.5 px-1 rounded-xl text-xs font-bold text-center bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700';
    });
    btn.classList.add('active');

    const label = document.getElementById('flash-digits-label');
    if (label) {
        const ranges = { 1: '1 xonali (1—9)', 2: '2 xonali (10—99)', 3: '3 xonali (100—999)', 4: '4 xonali (1000+)' };
        label.textContent = ranges[digits] || `${digits} xonali`;
    }
    updateFlashSummaryBadge();
}

function selectFlashCount(count, btn) {
    if (window.flashAnzan) window.flashAnzan.count = parseInt(count);
    if (typeof sound !== 'undefined') sound.playBeadClick(false, 2);

    const container = btn.parentElement;
    container.querySelectorAll('.setting-chip').forEach(b => {
        b.classList.remove('active');
        b.className = 'setting-chip py-2 px-1 rounded-xl text-xs font-bold text-center bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700';
    });
    btn.classList.add('active');

    const label = document.getElementById('flash-count-label');
    if (label) label.textContent = `${count} ta son`;
    updateFlashSummaryBadge();
}

function selectFlashSpeed(speed, labelText, btn) {
    if (window.flashAnzan) window.flashAnzan.speed = parseFloat(speed);
    if (typeof sound !== 'undefined') sound.playBeadClick(false, 3);

    const container = btn.parentElement;
    container.querySelectorAll('.setting-chip').forEach(b => {
        b.classList.remove('active');
        b.className = 'setting-chip py-2 px-1 rounded-xl text-xs font-bold text-center bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700';
    });
    btn.classList.add('active');

    const label = document.getElementById('flash-speed-label');
    if (label) label.textContent = labelText;
    updateFlashSummaryBadge();
}

function selectFlashOperation(allowNegative, btn) {
    if (window.flashAnzan) window.flashAnzan.allowNegative = Boolean(allowNegative);
    if (typeof sound !== 'undefined') sound.playBeadClick(true, 0);

    const addOnlyBtn = document.getElementById('flash-op-add-only');
    const addSubBtn = document.getElementById('flash-op-add-sub');

    if (allowNegative) {
        if (addOnlyBtn) {
            addOnlyBtn.classList.remove('active');
            addOnlyBtn.className = 'setting-chip p-3 rounded-2xl text-xs font-bold text-left bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 flex items-center gap-2.5';
        }
        if (addSubBtn) {
            addSubBtn.classList.add('active');
            addSubBtn.className = 'setting-chip active p-3 rounded-2xl text-xs font-bold text-left border flex items-center gap-2.5';
        }
    } else {
        if (addSubBtn) {
            addSubBtn.classList.remove('active');
            addSubBtn.className = 'setting-chip p-3 rounded-2xl text-xs font-bold text-left bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 flex items-center gap-2.5';
        }
        if (addOnlyBtn) {
            addOnlyBtn.classList.add('active');
            addOnlyBtn.className = 'setting-chip active p-3 rounded-2xl text-xs font-bold text-left border flex items-center gap-2.5';
        }
    }
    updateFlashSummaryBadge();
}

// Flesh Anzan Sozlamalar Modali Boshqaruvi (⚙️)
function openFlashSettingsModal() {
    const modal = document.getElementById('flash-settings-modal');
    if (modal) {
        modal.classList.remove('hidden');
        if (typeof sound !== 'undefined') sound.playBeadClick(false, 0);
    }
}

function closeFlashSettingsModal() {
    const modal = document.getElementById('flash-settings-modal');
    if (modal) {
        modal.classList.add('hidden');
        if (typeof sound !== 'undefined') sound.playBeadClick(false, 2);
    }
    updateFlashSummaryBadge();
}

function updateFlashSummaryBadge() {
    const badge = document.getElementById('flash-summary-badge');
    if (!badge || !window.flashAnzan) return;
    const d = window.flashAnzan.digits || 1;
    const c = window.flashAnzan.count || 5;
    const s = window.flashAnzan.speed || 1.0;
    const op = window.flashAnzan.allowNegative ? '(+ va -)' : '(+)';
    badge.textContent = `${d} xona • ${c} ta son • ${s}s • ${op}`;
}

// Dastur ishga tushganda boshlash
document.addEventListener('DOMContentLoaded', () => {
    // 1. Abakusni ishga tushirish
    window.soroban = new SorobanAbacus('soroban-container', {
        rodCount: 7,
        showValues: true,
        showLabels: true,
        theme: 'wood'
    });

    // 2. Flesh Anzan trenajyori
    window.flashAnzan = new FlashAnzan();
    updateFlashSummaryBadge();

    // 3. Tezkor Sprint trenajyori
    window.sprintChallenge = new SprintChallenge();

    // 4. Fotografik Xotira o'yini
    window.memoryGame = new MemoryGame();

    // 5. Formulalar ro'yxatini chiqarish
    if (typeof renderFormulas === 'function') {
        renderFormulas('formulas-container');
    }

    // 6. UI statistikasini yangilash
    window.appStats.updateStatsUI();

    // 7. Tovush tugmasi holatini boshqarish
    const soundBtn = document.getElementById('header-sound-btn');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            const isEnabled = sound.toggleSound();
            soundBtn.innerHTML = isEnabled 
                ? '<span>🔊</span> <span class="hidden sm:inline">Tovush: Yoqilgan</span>' 
                : '<span>🔇</span> <span class="hidden sm:inline">Tovush: O\'chirilgan</span>';
            soundBtn.className = isEnabled 
                ? 'px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95' 
                : 'px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-400 text-xs font-bold flex items-center gap-1.5 transition active:scale-95';
        });
    }

    // 8. Ovozli aytish (Speech) tugmasi
    const speechBtn = document.getElementById('header-speech-btn');
    if (speechBtn) {
        speechBtn.addEventListener('click', () => {
            const isEnabled = sound.toggleSpeech();
            speechBtn.innerHTML = isEnabled 
                ? '<span>🗣️</span> <span class="hidden sm:inline">Ovoz: Yoqilgan</span>' 
                : '<span>💬</span> <span class="hidden sm:inline">Ovoz: O\'chiq</span>';
            speechBtn.className = isEnabled 
                ? 'px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95' 
                : 'px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-400 text-xs font-bold flex items-center gap-1.5 transition active:scale-95';
        });
    }

    // Mobil menyudan tashqariga bosilganda avtomatik yopish
    document.addEventListener('click', (e) => {
        const drawer = document.getElementById('mobile-menu-drawer');
        const btn = document.getElementById('mobile-menu-btn');
        if (drawer && drawer.classList.contains('menu-open')) {
            if (!drawer.contains(e.target) && btn && !btn.contains(e.target)) {
                toggleMobileMenu(false);
            }
        }
    });

    // Flesh Anzan boshlash tugmasi
    const flashStartBtn = document.getElementById('flash-start-btn');
    if (flashStartBtn) {
        flashStartBtn.addEventListener('click', () => {
            window.flashAnzan.start();
        });
    }

    const flashSubmitBtn = document.getElementById('flash-submit-btn');
    if (flashSubmitBtn) {
        flashSubmitBtn.addEventListener('click', () => {
            window.flashAnzan.submitAnswer();
        });
    }

    // Kompyuter klaviaturasini boshqarish (Flesh Anzan javob kiritish uchun)
    window.addEventListener('keydown', (e) => {
        const flashSection = document.getElementById('section-flash');
        const flashInputArea = document.getElementById('flash-input-area');
        if (!flashSection || flashSection.classList.contains('hidden')) return;
        if (!flashInputArea || flashInputArea.classList.contains('hidden')) return;
        if (window.flashAnzan && window.flashAnzan.isPlaying) return;

        // Boshqa form inputlarida (masalan sozlamalar modalida) xalaqit bermaslik
        if (e.target && e.target.tagName === 'INPUT' && e.target.id !== 'flash-user-answer') return;

        if (e.key >= '0' && e.key <= '9') {
            appendFlashDigit(e.key);
            e.preventDefault();
        } else if (e.key === 'Backspace') {
            backspaceFlashInput();
            e.preventDefault();
        } else if (e.key === '-' || e.key === 'Subtract') {
            toggleFlashMinus();
            e.preventDefault();
        } else if (e.key === 'Enter') {
            if (window.flashAnzan) window.flashAnzan.submitAnswer();
            e.preventDefault();
        } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
            clearFlashInput();
            e.preventDefault();
        }
    });

    // Touch ekranlarda telefonning o'z soft-klaviaturasi chiqib ketmasligi uchun
    const flashInput = document.getElementById('flash-user-answer');
    if (flashInput) {
        flashInput.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
        flashInput.addEventListener('focus', () => {
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                flashInput.blur();
            }
        });
    }

    // Sprint challenge hodisalari
    const sprintInput = document.getElementById('sprint-input');
    if (sprintInput) {
        sprintInput.addEventListener('input', () => {
            window.sprintChallenge.checkInput();
        });
    }

    const sprintStartBtn = document.getElementById('sprint-start-btn');
    if (sprintStartBtn) {
        sprintStartBtn.addEventListener('click', () => {
            const diff = document.getElementById('sprint-diff-select').value;
            const op = document.getElementById('sprint-op-select').value;
            window.sprintChallenge.setSettings(60, diff, op);
            window.sprintChallenge.start();
        });
    }

    // Xotira o'yini hodisalari
    const memStartBtn = document.getElementById('memory-start-btn');
    if (memStartBtn) {
        memStartBtn.addEventListener('click', () => {
            window.memoryGame.startRound();
        });
    }

    const memInput = document.getElementById('memory-answer-input');
    if (memInput) {
        memInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                window.memoryGame.checkAnswer();
            }
        });
    }

    const memSubmitBtn = document.getElementById('memory-submit-btn');
    if (memSubmitBtn) {
        memSubmitBtn.addEventListener('click', () => {
            window.memoryGame.checkAnswer();
        });
    }
});
