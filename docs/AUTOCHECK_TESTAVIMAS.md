# Experian AutoCheck – testavimo ataskaita

Paslauga: [AutoCheck | One Auto API](https://www.oneautoapi.com/service/e574ace7-e5b6-450f-ac0d-40a1412b32fc/)

## Apie paslaugą

AutoCheck nustato:
- ar automobilis turi **neapmokėtų finansų** (outstanding finance),
- ar įrašytas kaip **vogtas**,
- ar **write-off** (nurašytas po avarijos).

**Būtina:** UK valstybinis numeris (**VRM** – vehicle registration mark). VIN – neprivalomas, bet rekomenduojamas (tikslesniam atitikmeniui).

## API parametrai

| Parametras | Privalomas | Aprašymas |
|------------|------------|-----------|
| `vehicle_registration_mark` | Taip | UK valstybinis numeris (pvz. AB21 ABC) |
| `vehicle_identification_number` | Ne | VIN (rekomenduojama) |

**Endpoint:** `GET /experian/autocheck/v3`

## Kaip testuoti programoje

1. **Dashboard:** įjunk Experian AutoCheck paslaugą One Auto API dashboard (jei dar neįjungta).
2. **Aplikacijoje:** įvesk **VIN** ir lauke „Valst. nr. (UK)“ įvesk **UK valstybinį numerį**.
3. Paspausk **Tikrinti**.
4. **Konsolėje (F12):** turėtum matyti `[One Auto API] Experian AutoCheck: OK` arba klaidos pranešimą.
5. **Ataskaitoje:** apačioje atidaryk **„Visa informacija iš API“** – bus blokas **`experianAutoCheck`** (Experian AutoCheck) su pilnu atsakymu:
   - `success`, `result` (VRM, VIN, theft_indicator, finance_data_qty, finance_data_items, stolen_vehicle_data_*, write-off duomenys ir kt.) arba `error`.

Jei VRM neįvestas, Experian AutoCheck **nekviečiamas** (ir `rawApiResponses.experianAutoCheck` nebus).

## Kas naudojama iš atsakymo

- **theftStatus** ataskaitoje: jei Experian AutoCheck grąžina `theft_indicator` / `theft_indictor_literal` arba `stolen_vehicle_data_items` su `is_stolen: true` – rodoma kaip **flagged**, kitaip **clear**.
- Pilni duomenys (finansai, write-off, DVLA laukai) matomi tik **raw API** bloke; vėliau galima pridėti atskirus blokus ataskaitoje.

## Testavimo duomenys

- Naudok **tikrus UK VRM + VIN** (pvz. savo ar testinio auto), nes API grąžina realius duomenis.
- Sandbox: jei naudoji `useSandbox: true` arba sandbox URL, patikrink One Auto dokumentaciją, ar Experian AutoCheck ten palaikomas ir kokius testinius VRM leidžia.

## Nuorodos

- Paslaugos puslapis: https://www.oneautoapi.com/service/e574ace7-e5b6-450f-ac0d-40a1412b32fc/
- One Auto API dokumentacija: https://docs.oneautoapi.com/
- Status kodai (pvz. VOID VRM 206): One Auto Knowledge Base – „Understanding status codes“.
