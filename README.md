# 🧮 MentalPro — Mental Arifmetika va Interaktiv Abakus Platformasi

Mental arifmetika o'rganuvchilar, o'quvchilar va ustozlar uchun mo'ljallangan zamonaviy, to'liq interaktiv veb-platforma. Ushbu platforma bolalar va yoshlarning **hisoblash tezligini, diqqatini, mantiqiy fikrlashini va fotografik xotirasini** oshirish uchun maxsus ishlab chiqilgan.

---

## 🌟 Asosiy Imkoniyatlar va Bo'limlar

### 1. 🧮 Interaktiv Soroban (Abakus) Modeli
- **Haqiqiy Soroban geometriyasi:** An'anaviy yapon Sorobaniga xos bikonik (olmos shaklli) munchoqlar, to'siq (harakat chizig'i), birlik nuqtalari (har 3 ustunda) va metall simlar.
- **To'liq interaktivlik:** 
  - Yuqori munchoq (qiymati 5): to'siqqa tushganda faollashadi.
  - Quyi 4 munchoq (qiymati 1 dan): to'siqqa ko'tarilganda faollashadi.
  - Istalgan munchoqni bosish orqali to'g'ridan-to'g'ri boshqarish.
- **Haqiqiy yog'och tovushi:** Web Audio API orqali munchoqlar taqillashi va tozalash ovozlari sintetik yaratilgan (hech qanday internet yuklanishiga bog'liq emas).
- **Moslashuvchan sozlamalar:**
  - 5, 7, 9 yoki 11 ta sim (ustun) tanlash imkoniyati.
  - 4 xil mavzu: **Klassik Yog'och**, **Zamonaviy Slate**, **Qizil Yoqut** va **Zumrad Yashil**.
  - Xona nomlari (Birlik, O'nlik, Yuzlik, Minglik...) va pastki raqamlarni yoqish/o'chirish.
- **Maxsus Mashq Rejimi:** 
  - *"🎯 Sonni terish"* rejimi: Dastur tasodifiy son beradi, o'quvchi abakusda uni hosil qilishi kerak, to'g'ri terilganda avtomatik tekshirib ball beradi.

---

### 2. ⚡ Flesh Anzan (Flash Calculation — Tezlik Trenajyori)
Dunyo mental arifmetika chempionatlarida qo'llaniladigan mashhur Flesh Anzan texnologiyasi:
- **Tezlik nazorati:** 0.2s (Ekstremal tezlik), 0.3s, 0.5s, 0.7s, 1.0s, 1.5s, 2.0s.
- **Xonalar soni:** 1 xonali (1-9), 2 xonali (10-99), 3 xonali (100-999) va 4 xonali.
- **Misollar soni:** 3, 5, 7, 10, 15 yoki 20 ta son.
- **Amallar:** Faqat qo'shish (+) yoki Qo'shish va ayirish (+ va -). Manfiy sonlar qizil rangda minus belgisi bilan aniq ko'rsatiladi.
- **Ovozli sintez:** Web Speech API orqali sonlarni ovoz bilan o'qish (yoqish/o'chirish).
- **Ekrandagi Numpad:** Sensorli ekranlar (planshet, telefon) va sichqoncha uchun maxsus raqamlar paneli.
- **Natijalar tahlili:** Sizning javobingiz vs To'g'ri javob, barcha bosqichlarning to'liq formulali zanjiri.

---

### 3. ⏱️ 60 Soniya Sprint (Blitz Challenge)
- Vaqt poygasi: 60 soniya ichida imkon qadar ko'p misollarni to'g'ri yechish.
- **Combo Multiplikatori:** Ketma-ket 3 ta to'g'ri topsangiz 2x ball, 5 ta topsangiz 3x ball va olovli animatsiya (`🔥 3x COMBO!`).
- Tezkor klaviatura kiritishi va avtomatik tekshiruv.
- Natijada: to'plangan ball, aniqlik foizi va daqiqasiga hisoblash tezligi (misol/daqiqa) hisoblab beriladi.

---

### 4. 🧠 Fotografik Xotira (Abacus Flash Memory)
- Abakusdagi munchoqlar tasviri ekranda bir lahzaga (sekundning ulushlarida) chaqnaydi va yashirinadi.
- O'quvchi munchoqlar holatini xotirasida gavdalantirib sonni kiritishi kerak.
- Bu mashq bolalarda fotografik xotira va tasavvurda hisoblash (mental tasavvur) qobiliyatini yuksaltiradi.

---

### 5. 📚 Qoidalar va Formulalar Ensiklopediyasi
- **Kichik do'stlar (5 qoidasi):** `+4 = +5 - 1`, `+3 = +5 - 2`, `+2 = +5 - 3`, `+1 = +5 - 4` va ularning ayirish shakllari.
- **Katta do'stlar (10 qoidasi):** `+9 = +10 - 1` dan `+1 = +10 - 9` gacha.
- **Aralash do'stlar (Oila formulalari):** 6, 7, 8, 9 maxsus formulalari.
- **"Abakusda sinab ko'rish" tugmasi:** Istalgan formuladagi tugmani bossangiz, avtomatik Abakus bo'limiga o'tib, qadam-baqadam animatsiya qilib beradi!

---

### 6. 🏆 Yutuqlar va Statistika (Gamification)
- Nishonlar (Badges):
  - 🌱 *Birinchi Qadam* — Ilk to'g'ri yechilgan misol.
  - ⚡ *Flesh Qahramoni* — Flesh Anzanda 10 ta to'g'ri javob.
  - 🏃 *Chaqmoq Hisobchi* — Sprintda 150 balldan oshirish.
  - 🧮 *Abakus Ustasi* — Abakus mashqida 50 ball to'plash.
  - 🧠 *Fotografik Xotira* — Xotira o'yinida 5-bosqichga yetish.
- Barcha natijalar brauzerning `localStorage` xotirasida saqlanadi.

---

## 🚀 Qanday ishga tushiriladi?

Hech qanday maxsus o'rnatish shart emas!

1. Papkadagi **`index.html`** faylini ikki marta bosing yoki istalgan brauzerda (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) oching.
2. Yoki mahalliy server orqali ochish uchun PowerShell / Terminalda:
   ```bash
   python -m http.server 8000
   ```
   So'ng brauzerda `http://localhost:8000` manziliga kiring.

---

## 📁 Fayllar tuzilishi

```
mental arifmetika/
├── index.html           # Asosiy HTML interfeys (Tailwind CSS, responsive dizayn)
├── css/
│   └── styles.css       # Abakus, munchoqlar animatsiyasi, yog'och ramka va effektlar
├── js/
│   ├── audio.js         # Web Audio API (yog'och chertish, tozalash, g'alaba tovushlari, nutq)
│   ├── abacus.js        # Interaktiv Soroban dvigateli (bikonik munchoqlar, xonalar)
│   ├── flash-anzan.js   # Flesh Anzan trenajyori (tezkor chaqnash, formulalar)
│   ├── sprint.js        # 60 soniyalik Blitz musobaqasi (vaqt, combo multiplikator)
│   ├── memory-game.js   # Fotografik xotira o'yini
│   ├── formulas.js      # Kichik va Katta do'stlar formulalari bazasi
│   └── app.js           # Asosiy router, boshqaruv va statistika
└── README.md            # Qo'llanma
```
