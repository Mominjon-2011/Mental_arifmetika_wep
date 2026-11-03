// formulas.js - Mental arifmetika qoidalari va interaktiv formulalar
const FORMULA_CATEGORIES = [
    {
        id: 'small_friends_add',
        title: 'Kichik do\'stlar: Qo\'shish (+5 formulasi)',
        description: 'Pastki munchoqlar yetmaganda, yuqoridagi 5 munchoqdan foydalanish qoidalari.',
        formulas: [
            { formula: '+4 = +5 - 1', example: '1 + 4 = 5', desc: '5 ni tushiring (+5), 1 ni pastga suring (-1)', demo: { start: 1, steps: [{ action: '+5', note: 'Yuqori 5 ni tushiring' }, { action: '-1', note: '1 ta munchoqni tushiring' }], result: 5 } },
            { formula: '+3 = +5 - 2', example: '2 + 3 = 5', desc: '5 ni tushiring (+5), 2 ni pastga suring (-2)', demo: { start: 2, steps: [{ action: '+5' }, { action: '-2' }], result: 5 } },
            { formula: '+2 = +5 - 3', example: '3 + 2 = 5', desc: '5 ni tushiring (+5), 3 ni pastga suring (-3)', demo: { start: 3, steps: [{ action: '+5' }, { action: '-3' }], result: 5 } },
            { formula: '+1 = +5 - 4', example: '4 + 1 = 5', desc: '5 ni tushiring (+5), 4 ni pastga suring (-4)', demo: { start: 4, steps: [{ action: '+5' }, { action: '-4' }], result: 5 } }
        ]
    },
    {
        id: 'small_friends_sub',
        title: 'Kichik do\'stlar: Ayirish (-5 formulasi)',
        description: 'Pastki munchoqlardan ayirish yetmaganda, 5 dan foydalanish qoidalari.',
        formulas: [
            { formula: '-4 = +1 - 5', example: '5 - 4 = 1', desc: '1 ni ko\'taring (+1), 5 ni yuqoriga suring (-5)', demo: { start: 5, steps: [{ action: '+1' }, { action: '-5' }], result: 1 } },
            { formula: '-3 = +2 - 5', example: '5 - 3 = 2', desc: '2 ni ko\'taring (+2), 5 ni yuqoriga suring (-5)', demo: { start: 5, steps: [{ action: '+2' }, { action: '-5' }], result: 2 } },
            { formula: '-2 = +3 - 5', example: '5 - 2 = 3', desc: '3 ni ko\'taring (+3), 5 ni yuqoriga suring (-5)', demo: { start: 5, steps: [{ action: '+3' }, { action: '-5' }], result: 3 } },
            { formula: '-1 = +4 - 5', example: '5 - 1 = 4', desc: '4 ni ko\'taring (+4), 5 ni yuqoriga suring (-5)', demo: { start: 5, steps: [{ action: '+4' }, { action: '-5' }], result: 4 } }
        ]
    },
    {
        id: 'big_friends_add',
        title: 'Katta do\'stlar: Qo\'shish (+10 formulasi)',
        description: 'Joriy ustundagi munchoqlar to\'lganda, chapdagi qo\'shni ustundan (o\'nlik) 1 ni olib, do\'stini ayiramiz.',
        formulas: [
            { formula: '+9 = +10 - 1', example: '1 + 9 = 10', desc: 'Chap ustunga +1, joriy ustundan -1', demo: { start: 1, steps: [{ action: '+10' }, { action: '-1' }], result: 10 } },
            { formula: '+8 = +10 - 2', example: '2 + 8 = 10', desc: 'Chap ustunga +1, joriy ustundan -2', demo: { start: 2, steps: [{ action: '+10' }, { action: '-2' }], result: 10 } },
            { formula: '+7 = +10 - 3', example: '3 + 7 = 10', desc: 'Chap ustunga +1, joriy ustundan -3', demo: { start: 3, steps: [{ action: '+10' }, { action: '-3' }], result: 10 } },
            { formula: '+6 = +10 - 4', example: '4 + 6 = 10', desc: 'Chap ustunga +1, joriy ustundan -4', demo: { start: 4, steps: [{ action: '+10' }, { action: '-4' }], result: 10 } },
            { formula: '+5 = +10 - 5', example: '5 + 5 = 10', desc: 'Chap ustunga +1, joriy ustundan -5', demo: { start: 5, steps: [{ action: '+10' }, { action: '-5' }], result: 10 } },
            { formula: '+4 = +10 - 6', example: '6 + 4 = 10', desc: 'Chap ustunga +1, joriy ustundan -6', demo: { start: 6, steps: [{ action: '+10' }, { action: '-6' }], result: 10 } },
            { formula: '+3 = +10 - 7', example: '7 + 3 = 10', desc: 'Chap ustunga +1, joriy ustundan -7', demo: { start: 7, steps: [{ action: '+10' }, { action: '-7' }], result: 10 } },
            { formula: '+2 = +10 - 8', example: '8 + 2 = 10', desc: 'Chap ustunga +1, joriy ustundan -8', demo: { start: 8, steps: [{ action: '+10' }, { action: '-8' }], result: 10 } },
            { formula: '+1 = +10 - 9', example: '9 + 1 = 10', desc: 'Chap ustunga +1, joriy ustundan -9', demo: { start: 9, steps: [{ action: '+10' }, { action: '-9' }], result: 10 } }
        ]
    },
    {
        id: 'mixed_friends',
        title: 'Aralash do\'stlar (Oila formulalari: +6, +7, +8, +9)',
        description: '5 va 10 qoidalarining birgalikdagi qo\'llanilishi (masalan: 6 ni qo\'shish uchun +10 - 5 + 1).',
        formulas: [
            { formula: '+6 = +10 - 5 + 1', example: '5 + 6 = 11', desc: 'Chapga +1 (o\'nlik), 5 ni yuqoriga suring, 1 ni qo\'shing', demo: { start: 5, result: 11 } },
            { formula: '+7 = +10 - 5 + 2', example: '6 + 7 = 13', desc: 'Chapga +1 (o\'nlik), 5 ni yuqoriga suring, 2 ni qo\'shing', demo: { start: 6, result: 13 } },
            { formula: '+8 = +10 - 5 + 3', example: '7 + 8 = 15', desc: 'Chapga +1 (o\'nlik), 5 ni yuqoriga suring, 3 ni qo\'shing', demo: { start: 7, result: 15 } },
            { formula: '+9 = +10 - 5 + 4', example: '8 + 9 = 17', desc: 'Chapga +1 (o\'nlik), 5 ni yuqoriga suring, 4 ni qo\'shing', demo: { start: 8, result: 17 } }
        ]
    }
];

function renderFormulas(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    FORMULA_CATEGORIES.forEach(cat => {
        html += `
            <div class="mb-10">
                <div class="flex items-center gap-3 mb-2">
                    <span class="w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50"></span>
                    <h3 class="text-xl font-black text-slate-100">${cat.title}</h3>
                </div>
                <p class="text-slate-400 text-sm mb-5">${cat.description}</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${cat.formulas.map(f => `
                        <div class="bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                            <div class="flex items-center justify-between mb-3">
                                <span class="px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-extrabold text-lg rounded-xl">
                                    ${f.formula}
                                </span>
                                <span class="text-xs font-semibold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">
                                    Misol: ${f.example}
                                </span>
                            </div>
                            <p class="text-slate-300 text-sm mb-4 leading-relaxed">${f.desc}</p>
                            
                            <button onclick="demoFormulaOnAbacus(${f.demo.start}, ${f.demo.result})" class="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-600/70 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 group">
                                <span>🧮 Abakusda sinab ko'rish</span>
                                <span class="group-hover:translate-x-1 transition-transform">➔</span>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Abakusda formulani animatsiya qilib ko'rsatish
function demoFormulaOnAbacus(startVal, endVal) {
    if (typeof switchTab === 'function') {
        switchTab('abacus');
    }

    if (window.soroban) {
        window.soroban.clear(false);
        window.soroban.setNumber(startVal);

        const banner = document.getElementById('abacus-demo-banner');
        if (banner) {
            banner.classList.remove('hidden');
            banner.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <span class="font-bold text-amber-400">Formula Namoyishi:</span> Boshlang'ich qiymat: <strong class="text-white">${startVal}</strong>.
                        1.5 soniyadan so'ng natija <strong class="text-emerald-400">${endVal}</strong> bo'ladi...
                    </div>
                    <button onclick="this.parentElement.parentElement.classList.add('hidden')" class="text-slate-400 hover:text-white">✕</button>
                </div>
            `;
        }

        setTimeout(() => {
            window.soroban.setNumber(endVal);
            if (typeof sound !== 'undefined') sound.playCorrect();
        }, 1600);
    }
}
