# InvestPro PWA — Instrukcja instalacji na Android

## 📁 Struktura plików

```
investpro-pwa/
├── index.html       ← główna aplikacja
├── manifest.json    ← konfiguracja PWA
├── sw.js            ← service worker (offline + instalacja)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## 🚀 Krok 1 — Wrzuć na GitHub Pages

### 1.1 Utwórz konto na GitHub
Wejdź na https://github.com i zarejestruj się (jeśli nie masz).

### 1.2 Utwórz nowe repozytorium
- Kliknij **"New repository"** (zielony przycisk)
- Nazwa: `investpro` (lub dowolna)
- Ustaw jako **Public**
- Kliknij **"Create repository"**

### 1.3 Wgraj pliki
Na stronie repozytorium kliknij **"uploading an existing file"**, następnie:
1. Przeciągnij folder `investpro-pwa` — **lub** wgraj pliki jeden po jednym
2. Ważne: zachowaj strukturę folderów (`icons/` musi być podfolderem)
3. Kliknij **"Commit changes"**

> ⚠️ Folder `icons` wgraj osobno: wejdź do repo → "Add file" → utwórz plik
> `icons/icon-192.png` i wgraj odpowiedni plik.

### 1.4 Włącz GitHub Pages
1. Wejdź w **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / folder: **/ (root)**
4. Kliknij **Save**
5. Po ~2 minutach aplikacja będzie pod adresem:
   `https://TWOJA-NAZWA.github.io/investpro/`

---

## 📱 Krok 2 — Zainstaluj na Androidzie

1. Otwórz Chrome na telefonie
2. Wejdź na adres `https://TWOJA-NAZWA.github.io/investpro/`
3. Poczekaj ~3 sekundy — pojawi się baner **"Dodaj do ekranu głównego"**
4. Jeśli baner nie pojawi się sam: kliknij **⋮ menu** → **"Dodaj do ekranu głównego"**
5. Potwierdź — ikona InvestPro pojawi się na pulpicie

Aplikacja uruchomi się jak natywna — bez paska URL, na pełnym ekranie. ✅

---

## 🔑 Klucz Finnhub API

Aplikacja pyta o klucz przy pierwszym uruchomieniu.
Darmowy klucz: https://finnhub.io → "Get free API key"

---

## 🔄 Aktualizacja aplikacji

Po każdej zmianie plików na GitHub, zmień numer wersji cache w `sw.js`:
```js
const CACHE = 'investpro-v2';  // zmień v1 → v2 itd.
```
Dzięki temu telefon pobierze nową wersję przy kolejnym otwarciu.
