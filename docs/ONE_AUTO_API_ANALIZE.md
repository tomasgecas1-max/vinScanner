# One Auto API – ataskaitų analizė VIN skeneriui

Analizė atlikta pagal `postmanFull.json`. Žemiau – **VIN-based** endpoint'ai, susieti su ataskaitos blokais, ir **atskyrimas: Europa vs UK/Irlandija**.

---

## UK vs Europa – svarbu vinscanner.eu

**Ne viskas One Auto API yra UK.** Daugelis „labai rekomenduojamų“ endpoint'ų (UK Vehicle Data, Experian Vehicle Identity) – **tik UK rinkai** (DVLA, VRM ir kt.). Tavo projektas **vinscanner.eu**, todėl žemiau atskirta:

| Rinka | Servisai / endpoint'ai |
|-------|------------------------|
| **Europa (pan-EU)** | **Ezyvin** (Service History, VIN Lookup – jau naudojami), **One Auto** OE Build Sheet Europe, Recall Check (VIN – dažnai OE/global). **Cartell** VIN Decoder gali būti platesnis. **EVOX** Vehicle Images from VIN – dažnai OE. **CarGuide** Salvage from VIN – reikia patikrinti apimtį (gali būti UK arba platesnis). |
| **UK tik** | **UK Vehicle Data** (stolen, vehicle details, keeper, scrapped), **Experian** (Vehicle Identity, AutoCheck, Mileage, Finance, Stolen ir kt.) – visi DVLA/VRM. **Brego** valuation – daugiausia UK (ir Ireland variantai). |
| **Ireland** | **Cartell** Vehicle Identity (NCT), **Brego** Ireland (valuation). |

**Trumpai:** jei tikslinama **Europa** (LT, DE, PL ir kt.) – labiausiai tinka **Ezyvin** (jau turim) + **One Auto OE Build Sheet (Europe)** + **Recall Check**. UK/Ireland servisai – tik jei papildomai nori aptarnauti UK/IE rinką.

---

## Jau integruota

| Servisas | Endpoint | Ataskaitos dalis |
|----------|----------|------------------|
| **Ezyvin** | `GET /ezyvin/servicehistory/` | Ridos istorija, serviso įrašai |
| **Ezyvin** | `GET /ezyvin/vinlookup/` | Gamintojas, modelis, metai, techniniai (OE Europa) |
| **Experian** | `GET /experian/vehicleidentity/v3` | Vehicle Identity (DVLA UK) – reikia VRM |
| **Brego** | `GET /brego/valuationfromvin/v2` | Rinkos vertė (min/max/vidurkis) |

---

## Europa – rekomenduojama pridėti (vinscanner.eu)

### 1. One Auto – OE Build Sheet (Europe) from VIN

| Endpoint | Ką duoda |
|----------|----------|
| `GET /oneauto/oebuildsheeteuropefromvin/v2` | Gamyklinis build sheet **Europos apimtimi** – opcijos, specifikacija, rizikos valdymui. |

**Atitikmuo ataskaitoje:** techniniai duomenys, Europos emisijos (Euro X), NCAP ir pan. – **Europa**, ne UK.

---

### 2. One Auto – Recall Check from VIN

| Endpoint | Ką duoda |
|----------|----------|
| `GET /oneauto/recallcheckfromvin/v2` | OE atgalinio šaukimo patikra pagal VIN. |

**Atitikmuo ataskaitoje:** skyrius „Atgalinis šaukimas“. Dažnai veikia pagal VIN (OE), tinka ir ne-UK auto.

---

### 3. Cartell – VIN Decoder

| Endpoint | Ką duoda |
|----------|----------|
| `GET /cartell/vindecoder/` | VIN dekodavimas (Cartell – daugiausia Ireland, bet decoder gali būti platesnis). |

**Atitikmuo ataskaitoje:** make/model/year – papildomas šaltinis, jei Ezyvin neužtenka.

---

### 4. EVOX – Vehicle Images from VIN

| Endpoint | Ką duoda |
|----------|----------|
| `GET /evox/colourimagesetfromvin/` | Automobilio nuotrauka pagal VIN (dažnai OE duomenys). |

**Atitikmuo ataskaitoje:** paveikslėlis ataskaitoje – nepriklauso nuo UK.

---

### 5. CarGuide – Salvage Check from VIN

| Endpoint | Ką duoda |
|----------|----------|
| `GET /carguide/salvagecheckfromvin/v2` | Salvage / write-off patikra. |

**Pastaba:** One Auto dokumentacijoje reikia patikrinti, ar apimtis – tik UK, ar platesnė. Jei Europa – tinka; jei tik UK – naudinga tik UK srautui.

---

## UK / Ireland – tik jei tikslinama ši rinka

### 1. Vagystės patikra (theftStatus) – UK

| Endpoint | Ką duoda |
|----------|----------|
| **UK Vehicle Data** `GET /ukvehicledata/stolenvehiclecheckfromvin/v2` | Ar automobilis įrašytas kaip vogtas – **tikra theftStatus** vietoj fiksuoto "clear". |

**Atitikmuo ataskaitoje:** `theftStatus` iš tikrų duomenų – **tik UK**.

---

### 2. UK automobilio detalės (make/model/year)

| Endpoint | Ką duoda |
|----------|----------|
| **UK Vehicle Data** `GET /ukvehicledata/vehicledetailsfromvin/v2` | Pilni transporto duomenys iš UK (DVLA-style). |
| **UK Vehicle Data** `GET /ukvehicledata/vehicleandmodeldetailsfromvin/v2` | Transporto ir modelio detalės pagal VIN. |

**Atitikmuo ataskaitoje:** make, model, year, techniniai – **tik UK**.

---

### 3. Savininkų kaita (UK)

| Endpoint | Ką duoda |
|----------|----------|
| **UK Vehicle Data** `GET /ukvehicledata/keeperchangefromvin/v2` | Keeper change istorija – kiek savininkų. |

**Atitikmuo ataskaitoje:** naujas blokas "Savininkų istorija" – **tik UK**.

---

### 4. Sužalotas / scrap statusas (UK)

| Endpoint | Ką duoda |
|----------|----------|
| **UK Vehicle Data** `GET /ukvehicledata/scrappedmarkercheckfromvin/v2` | Ar automobilis pažymėtas kaip sudužęs (scrapped). |

**Atitikmuo ataskaitoje:** badge "Sudužęs" / "Ne sudužęs" – **tik UK**.

---

## Naudinga papildomai (rikiavimas pagal rinką)

| Endpoint | Paskirtis |
|----------|-----------|
| **Percayso** previousadvertsfromvin / currentvaluationfromvin | Buvusios skelbimų kainos, vertinimas – daugiausia **UK** rinka. |
| **EVOX** colourimagesetfromvin | Nuotrauka pagal VIN – **Europa/global** (jau įrašyta aukščiau). |
| **One Auto** oebuildsheeteuropefromvin | Europa build sheet – **Europa** (jau įrašyta aukščiau). |

---

## Kiti VIN endpoint'ai (mažiau prioritetiniai šiam projektui)

- **AutoPredict** – predict / statistics (VRM, ne VIN).
- **Brego** – desirability rating, Ireland variants (jei tikslinama IE rinka).
- **Vehicle Imagery** `imagesearchfromvin` – nuotraukų paieška.

---

## Rekomenduojama eilė – Europa (vinscanner.eu)

1. **One Auto – Recall Check from VIN** – atgalinio šaukimo skyrius (VIN/OE, tinka Europai).
2. **One Auto – OE Build Sheet (Europe) from VIN** – techninė specifikacija Europos apimtimi.
3. **EVOX – Vehicle Images from VIN** – paveikslėlis ataskaitoje.
4. **Cartell – VIN Decoder** – papildomas make/model/year šaltinis (patikrinti apimtį).
5. **CarGuide – Salvage Check from VIN** – tik jei One Auto dokumentacija patvirtina Europos apimtį.

## Jei papildomai tikslinama UK / Ireland

1. **UK Vehicle Data – Stolen Vehicle Check from VIN** – theftStatus.
2. **UK Vehicle Data – Vehicle Details from VIN** – make/model/year be VRM.
3. **UK Vehicle Data – Scrapped / Keeper Change** – scrap statusas, savininkų kaita.

---

Jei nori, galiu pasiūlyti konkretų integracijos planą (pirmiausia Europa endpoint'ai).
