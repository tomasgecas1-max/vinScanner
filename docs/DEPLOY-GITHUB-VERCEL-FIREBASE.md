# Vinscanner – diegimas: GitHub, Vercel, Firebase

## Kokia eilė?

1. **GitHub** – pirmiausia (kodo repozitorija)
2. **Vercel** – antra (frontendo hostingas)
3. **Firebase** – trečia (jei reikia: Auth, DB arba Hosting)

---

## Aplinkos kintamieji (env)

Projektas **nenaudoja** `.env.example` faile repozitorijoje. Reikalingus kintamuosius laikyk tik lokaliai `.env` (ir Vercel / Firebase config). **Vėliau pridėdamas naujus API** – įrašai juos į `.env` ir, jei nori, į šią dokumentaciją.

| Kintamasis | Paskirtis |
|------------|-----------|
| `VIN_API_KEY` | VIN ataskaitų API raktas |
| `AI_API_KEY` | AI / papildomų funkcijų API raktas |
| `VIN_VEHICLE_IDENTITY_ONLY` | Pasirinktinai: `true` – tik Vehicle Identity |
| `VIN_SKIP_SERVICE_HISTORY` | Pasirinktinai: `true` – be serviso istorijos |
| `DISABLE_MOCK_REPORT` | Pasirinktinai: `true` – išjungia mock ataskaitą |

**Jei seniau naudojai kitus pavadinimus:** lokaliai `.env` pervadink į šiuos: `ONE_AUTO_API_KEY` → `VIN_API_KEY`, `GEMINI_API_KEY` → `AI_API_KEY`, `ONE_AUTO_VEHICLE_IDENTITY_ONLY` → `VIN_VEHICLE_IDENTITY_ONLY`, `ONE_AUTO_SKIP_SERVICE_HISTORY` → `VIN_SKIP_SERVICE_HISTORY`. Vercel'e taip pat nustatyk naujus kintamųjų pavadinimus.

---

## Saugumas: kad API raktai nepatiktų

| Kas | Kur |
|-----|-----|
| **Nepushinti į Git** | Failai `.env`, `.env.local`, `.env.production` ir kt. jau įrašyti į `.gitignore`. **Niekada** necommittink `.env` su tikrais raktais. |
| **Vercel** | Raktus įrašyk **Vercel → Project → Settings → Environment Variables**. Build metu Vite įdeda juos į bundle; į GitHub jie **nepateina**. |
| **Firebase** | Jei naudoji Functions – raktus laikyk Firebase Functions config arba Secret Manager, ne faile repozitorijoje. |

**Prieš pirmą `git push` patikrink:**

```bash
git status
# Įsitikink, kad .env NĖRA sąraše (nepridėtas)
git check-ignore -v .env
# Turėtų parodyti: .gitignore:12:.env    .env
```

---

## 1. GitHub – žingsnis po žingsnio

### A. Lokaliai (terminalas)

**Žingsnis 1.** Atidaryk terminalą ir nueik į projekto aplanką:

```bash
cd vinscanner.eu---moderni-automobilių-patikra
```

**Žingsnis 2.** Inicializuok Git (jei dar nepadarėte):

```bash
git init
```

**Žingsnis 3.** Patikrink, kad `.env` **nepateks** į commit:

```bash
git status
```
- Turėtum matyti daug failų (pvz. `package.json`, `src/`).
- **`.env` neturėtų būti sąraše** – jis ignoruojamas per `.gitignore`.

Papildomai:
```bash
git check-ignore -v .env
```
- Turėtų išvesti: `.gitignore:12:.env    .env` (arba panašiai).

**Žingsnis 4.** Pridėk visus failus (į commit pateks tik tai, kas neįtraukta į `.gitignore`):

```bash
git add .
```

**Žingsnis 5.** Dar kartą pažiūrėk, kas bus commitinama:

```bash
git status
```
- Įsitikink, kad **nėra** `.env` (nėra po "Changes to be committed").

**Žingsnis 6.** Padaryk pirmą commit:

```bash
git commit -m "Initial: Vite React VIN ataskaita"
```

---

### B. GitHub.com – nauja repozitorija

**Žingsnis 7.** Eik į [github.com](https://github.com) ir prisijunk.

**Žingsnis 8.** Sukurk naują repozitoriją:
- Spausk **„New“** (arba **„+“** → **„New repository“**).
- **Repository name:** pvz. `vinScanner` arba `vinscanner-eu`.
- **Description:** pasirinktinai, pvz. „VIN ataskaitų svetainė“.
- **Public** arba **Private** – pagal poreikį.
- **Nepažymėk** „Add a README file“, „Add .gitignore“, „Choose a license“ – projektas jau turi failus lokaliai.
- Spausk **„Create repository“**.

**Žingsnis 9.** GitHub parodys instrukcijas („…or push an existing repository from the command line“). Naudok šią dalį – žiūrėk žingsnius 10–12 žemiau.

---

### C. Sujungti lokalu su GitHub ir nusiųsti kodą

**Žingsnis 10.** Pridėk nuotolinę repozitoriją (pakeisk `TAVO_USERNAME` ir `REPO_NAME` į savo GitHub vardą ir repo pavadinimą):

```bash
git remote add origin https://github.com/TAVO_USERNAME/REPO_NAME.git
```

Pvz. jei vartotojas `tomasgecas`, repo `vinScanner`:
```bash
git remote add origin https://github.com/tomasgecas/vinScanner.git
```

**Žingsnis 11.** Pagrindinę šaką pavadink `main` (jei dar ne):

```bash
git branch -M main
```

**Žingsnis 12.** Nusiųsk kodą į GitHub:

```bash
git push -u origin main
```

- Gali būti paprašyta prisijungimo (GitHub vardas + slaptažodis arba **Personal Access Token**). Jei naudoji 2FA, naudok tokeną vietoj slaptažodžio.

**Žingsnis 13.** Patikrink: atidaryk savo repozitoriją github.com – turėtum matyti visus failus. **Nėra:** `.env` (su API raktais). Aplinkos kintamieji – tik lokaliai ir Vercel; sąrašas žr. skyriuje „Aplinkos kintamieji (env)“.

---

## 2. Vercel (frontendo hostingas)

- Tinka Vite/React projektui: automatinis build (`npm run build`) ir CDN.
- Nemokamai: Hobby planas pakanka.

**Žingsniai:**

1. Eik į [vercel.com](https://vercel.com) ir prisijunk (gali per GitHub).
2. **Add New** → **Project** → pasirink savo **GitHub** repozitoriją.
3. **Root Directory:** jei projektas yra repo šaknyje – palik tuščią; jei po `vinscanner.eu---moderni-automobilių-patikra/` – nurodyk tą aplanką.
4. **Build:** Vercel paprastai atpažįsta Vite (Build Command: `vite build`, Output: `dist`). Jei reikia, nustatyk:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables (Vercel Dashboard):** pridėk kintamuosius (reikšmes iš savo `.env`; į GitHub **nerašyk**):
   - `VIN_API_KEY` – VIN ataskaitų API raktas
   - `AI_API_KEY` – AI / papildomų funkcijų raktas (jei naudoji)
   - Pasirinktinai: `VIN_VEHICLE_IDENTITY_ONLY`, `VIN_SKIP_SERVICE_HISTORY`, `DISABLE_MOCK_REPORT` (`true` arba tuščią)
   Nustatyk **Production** (ir pasirinktinai Preview). Po **Redeploy** raktai įsigalios.
6. **Deploy** – po push į `main` Vercel automatiškai perbuildins ir išskirs naują URL.

**Rezultatas:** svetainė prieinama pvz. `tavo-projektas.vercel.app` (ir galima prijungti savo domeną).

---

## 3. Firebase (trečias žingsnis – jei reikia)

Firebase naudingas, jei reikia:

- **Firebase Hosting** – alternatyva Vercel (dažniausiai pakanka vieno: arba Vercel, arba Firebase Hosting).
- **Authentication** – prisijungimai (pvz. el. paštas, Google).
- **Firestore / Realtime Database** – duomenų saugojimas (pvz. išsaugotos ataskaitos, vartotojų duomenys).
- **Cloud Functions** – serverio logika (pvz. One Auto API kvietimai per backend, kad būtų nematomi API raktai kliente).

**Jei dabar tik frontendas + One Auto API iš naršyklės:**

- Dažnai **pakanka GitHub + Vercel**. API raktą laikyk tik Vercel Environment Variables (ir nekoduok jo į frontendą, jei galima – idealiau kvietimus daryti per savo backend / Cloud Function).

**Jei nori Firebase:**

1. [Firebase Console](https://console.firebase.google.com) → sukurti projektą.
2. Įdiegti **Firebase CLI:** `npm install -g firebase-tools` → `firebase login`.
3. Projekte: `firebase init` – pasirink:
   - **Hosting** (jei hostinsi čia), **Firestore**, **Functions** arba **Auth**, priklausomai nuo poreikio.
4. Hosting: jei frontendą jau hostini **Vercel**, Firebase Hosting gali būti naudojamas tik atskiems puslapiams arba admin; jei viską nori hostinti Firebase – build output (`dist`) nurodai kaip `public` ir deploy’ini su `firebase deploy`.

**Rekomenduojama eilė šiame projekte:**

- **Dabar:** GitHub → Vercel (ataskaitos svetainė veikia).
- **Vėliau:** Firebase – jei reikės prisijungimų, išsaugotų ataskaitų ar API raktų slėpimo per Cloud Functions.

---

## Santrauka

| Eilė | Paslauga | Paskirtis |
|------|----------|-----------|
| 1 | **GitHub** | Kodo repozitorija, versijų kontrolė, ryšys su Vercel/Firebase |
| 2 | **Vercel** | Frontendo (Vite/React) build ir hostingas |
| 3 | **Firebase** | Papildomai: Auth, DB, Functions arba Hosting (jei reikia) |

**Minimalus kelias dabar:** GitHub → Vercel. Firebase pridėti tik tada, kai reikės prisijungimų, duomenų bazės ar serverio funkcijų.

---

## Paruošti prieš deploy (kad API kodai nenutektų)

1. **Patikrink `.gitignore`** – turi būti: `.env`, `.env.local`, `.env.*.local`, `.env.development`, `.env.production`.
2. **Lokaliai** naudok failą `.env` su kintamaisiais iš skyriaus „Aplinkos kintamieji (env)“; **nepushink** `.env` į GitHub.
3. **Prieš `git add` / `git commit`** paleisk: `git status` ir įsitikink, kad `.env` nerodomas; `git check-ignore -v .env` turėtų patvirtinti, kad `.env` ignoruojamas.
4. **Raktus į Vercel** įrašyk tik per **Settings → Environment Variables**, niekada neįkelk `.env` failo į GitHub.
5. Po pirmo deploy Vercel – patikrink svetainę; jei ataskaitos neveikia – peržiūrėk env kintamuosius ir **Redeploy**.
