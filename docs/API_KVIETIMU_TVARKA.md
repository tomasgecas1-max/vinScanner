# API kvietimų tvarka – VIN Scanner ataskaita

**Trijų išskirtinių šaltinių logika:** duomenys tik iš **vieno** šaltinio. Tikrinimo eiliškumas nustato, kuris šaltinis naudojamas. Niekada nerenkami duomenys iš dviejų skirtingų šaltinių.

---

## 1. Schema – kur pirmiausia randami, ties tuo sustojama

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. CACHE                                                               │
│     GET /api/report-cache?vin=...                                       │
│     → Jei rasta: grąžinti ataskaitą, STOP                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │ nerasta
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. ONE AUTO (EzyVIN)                                                   │
│     Service History → jei duomenys rasti, papildyti VIN Lookup          │
│                                                                         │
│     - Service History: api.oneautoapi.com/ezyvin/servicehistory/        │
│     - Jei rasta: VIN Lookup (api.oneautoapi.com/ezyvin/vinlookup/)      │
│     - Grąžinti One Auto ataskaitą, STOP                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │ Service History nerasta
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. CARSXE                                                              │
│     History → jei duomenys rasti, papildyti Specs + Theft               │
│                                                                         │
│     - History: GET /api/carsxe-history?vin=...                          │
│     - Jei rasta: Specs (/api/carsxe-specs) + Theft (/api/carsxe-theft)  │
│     - Grąžinti CarsXE ataskaitą, STOP                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                            Duomenų nerasta (mock arba klaida)
```

---

## 2. Trys opcijos – tik vienas šaltinis

| # | Šaltinis | Kada naudojama | Papildomi kvietimai |
|---|----------|----------------|---------------------|
| 1 | **Cache** | Pirmiausia – jei VIN jau buvo ieškotas | – |
| 2 | **One Auto** | Jei Service History grąžino duomenis | VIN Lookup (jei useVinLookup) |
| 3 | **CarsXE** | Jei Service History nerasta, o CarsXE History grąžino duomenis | Specs + Theft |

---

## 3. Jungikliai

| Kintamasis | Reikšmė | Įtaka |
|------------|---------|-------|
| useServiceHistory | true/false | Ar bandyti One Auto Service History |
| useVinLookup | true/false | Ar papildyti One Auto ataskaitą VIN Lookup (kai Service History rasta) |
| useCarsXeHistory | true/false | Ar bandyti CarsXE (kai One Auto neranda) |
| useVehicleSpecs | true/false | Ar papildyti CarsXE ataskaitą Specs (kai CarsXE History rasta) |

**CarsXE Theft** – visada kviečiamas, kai naudojamas CarsXE šaltinis.

---

## 4. Šaltinio duomenys

**One Auto:** mileageHistory, serviceEvents, make, model, year, technicalSpecs (iš VIN Lookup)

**CarsXE:** mileageHistory, damages, titleBrands, junkSalvageRecords, insuranceRecords, vinChanged, theftStatus, lienTheftEvents + make, model, year, technicalSpecs (iš Specs)
