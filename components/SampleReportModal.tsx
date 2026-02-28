import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Translations, LangCode } from '../constants/translations';

interface SampleReportModalProps {
  open: boolean;
  onClose: () => void;
  t: Translations;
  lang: LangCode;
}

const SAMPLE_VIN = 'WBA8E1100XK477XXX';
const SAMPLE_ORDER_ID = 'VS-XXXXXX-XXXX';

const MILEAGE_HISTORY = [
  { date: '2016-08-15', value: 3563 },
  { date: '2016-12-08', value: 15921 },
  { date: '2017-03-30', value: 29828 },
  { date: '2017-05-09', value: 33204 },
  { date: '2017-12-23', value: 53081 },
  { date: '2018-03-19', value: 57952 },
  { date: '2018-07-10', value: 64229 },
  { date: '2018-08-23', value: 65781 },
  { date: '2018-08-29', value: 66092 },
  { date: '2018-12-22', value: 74019 },
  { date: '2019-01-03', value: 74205 },
  { date: '2019-04-02', value: 79498 },
  { date: '2019-04-19', value: 80772 },
  { date: '2020-01-09', value: 96802 },
  { date: '2020-02-10', value: 99074 },
  { date: '2020-04-20', value: 100837 },
  { date: '2020-06-02', value: 101379 },
  { date: '2020-09-03', value: 101944 },
  { date: '2021-04-01', value: 115172 },
  { date: '2021-05-04', value: 118007 },
  { date: '2021-10-10', value: 130176 },
  { date: '2021-10-22', value: 131468 },
  { date: '2022-09-01', value: 155889 },
  { date: '2023-04-17', value: 169389 },
  { date: '2023-04-27', value: 170843 },
  { date: '2023-04-28', value: 170975 },
  { date: '2023-10-13', value: 181495 },
  { date: '2023-10-20', value: 182752 },
  { date: '2023-10-23', value: 183045 },
  { date: '2024-09-23', value: 200179 },
  { date: '2024-10-24', value: 200220 },
  { date: '2024-12-06', value: 201986 },
];

type TranslationMap = Record<string, string>;

const SERVICE_PROVIDERS: Record<string, TranslationMap> = {
  pl: {
    lt: 'Oficialus BMW Servisas, Lenkija',
    en: 'Official BMW Service, Poland',
    de: 'Offizieller BMW Service, Polen',
    pl: 'Oficjalny serwis BMW, Polska',
    fr: 'Service BMW officiel, Pologne',
    es: 'Servicio BMW oficial, Polonia',
    it: 'Servizio BMW ufficiale, Polonia',
    nl: 'Officiële BMW Service, Polen',
    cs: 'Oficiální BMW servis, Polsko',
    uk: 'Офіційний сервіс BMW, Польща',
    ro: 'Service BMW oficial, Polonia',
    sv: 'Officiell BMW-service, Polen',
    el: 'Επίσημο σέρβις BMW, Πολωνία',
    pt: 'Serviço BMW oficial, Polónia',
    hu: 'Hivatalos BMW szerviz, Lengyelország',
    bg: 'Официален BMW сервиз, Полша',
    sr: 'Званични BMW сервис, Пољска',
    da: 'Officiel BMW-service, Polen',
    no: 'Offisiell BMW-service, Polen',
    fi: 'Virallinen BMW-huolto, Puola',
    sk: 'Oficiálny BMW servis, Poľsko',
    hr: 'Službeni BMW servis, Poljska',
    bs: 'Službeni BMW servis, Poljska',
    sq: 'Shërbimi zyrtar BMW, Poloni',
    sl: 'Uradni BMW servis, Poljska',
    lv: 'Oficiālais BMW serviss, Polija',
    mk: 'Официјален BMW сервис, Полска',
    et: 'Ametlik BMW teenindus, Poola',
    ca: 'Servei BMW oficial, Polònia',
    lb: 'Offiziellen BMW Service, Polen',
    cnr: 'Službeni BMW servis, Poljska',
    mt: 'Servizz BMW uffiċjali, Polonja',
    is: 'Opinber BMW þjónusta, Pólland',
    tr: 'Resmi BMW Servisi, Polonya',
  },
  nl: {
    lt: 'Oficialus BMW Dileris, Olandija',
    en: 'Official BMW Dealer, Netherlands',
    de: 'Offizieller BMW Händler, Niederlande',
    pl: 'Oficjalny dealer BMW, Holandia',
    fr: 'Concessionnaire BMW officiel, Pays-Bas',
    es: 'Concesionario BMW oficial, Países Bajos',
    it: 'Concessionario BMW ufficiale, Paesi Bassi',
    nl: 'Officiële BMW Dealer, Nederland',
    cs: 'Oficiální BMW dealer, Nizozemsko',
    uk: 'Офіційний дилер BMW, Нідерланди',
    ro: 'Dealer BMW oficial, Țările de Jos',
    sv: 'Officiell BMW-återförsäljare, Nederländerna',
    el: 'Επίσημος αντιπρόσωπος BMW, Ολλανδία',
    pt: 'Concessionário BMW oficial, Países Baixos',
    hu: 'Hivatalos BMW kereskedő, Hollandia',
    bg: 'Официален BMW дилър, Нидерландия',
    sr: 'Званични BMW дилер, Холандија',
    da: 'Officiel BMW-forhandler, Holland',
    no: 'Offisiell BMW-forhandler, Nederland',
    fi: 'Virallinen BMW-jälleenmyyjä, Alankomaat',
    sk: 'Oficiálny BMW dealer, Holandsko',
    hr: 'Službeni BMW trgovac, Nizozemska',
    bs: 'Službeni BMW trgovac, Holandija',
    sq: 'Tregtari zyrtar BMW, Holandë',
    sl: 'Uradni BMW trgovec, Nizozemska',
    lv: 'Oficiālais BMW dīleris, Nīderlande',
    mk: 'Официјален BMW дилер, Холандија',
    et: 'Ametlik BMW edasimüüja, Holland',
    ca: 'Concessionari BMW oficial, Països Baixos',
    lb: 'Offiziellen BMW Händler, Holland',
    cnr: 'Službeni BMW trgovac, Holandija',
    mt: 'Dealer BMW uffiċjali, Olanda',
    is: 'Opinber BMW söluaðili, Holland',
    tr: 'Resmi BMW Bayisi, Hollanda',
  },
  nl2: {
    lt: 'BMW Dileris, Olandija',
    en: 'BMW Dealer, Netherlands',
    de: 'BMW Händler, Niederlande',
    pl: 'Dealer BMW, Holandia',
    fr: 'Concessionnaire BMW, Pays-Bas',
    es: 'Concesionario BMW, Países Bajos',
    it: 'Concessionario BMW, Paesi Bassi',
    nl: 'BMW Dealer, Nederland',
    cs: 'BMW dealer, Nizozemsko',
    uk: 'Дилер BMW, Нідерланди',
    ro: 'Dealer BMW, Țările de Jos',
    sv: 'BMW-återförsäljare, Nederländerna',
    el: 'Αντιπρόσωπος BMW, Ολλανδία',
    pt: 'Concessionário BMW, Países Baixos',
    hu: 'BMW kereskedő, Hollandia',
    bg: 'BMW дилър, Нидерландия',
    sr: 'BMW дилер, Холандија',
    da: 'BMW-forhandler, Holland',
    no: 'BMW-forhandler, Nederland',
    fi: 'BMW-jälleenmyyjä, Alankomaat',
    sk: 'BMW dealer, Holandsko',
    hr: 'BMW trgovac, Nizozemska',
    bs: 'BMW trgovac, Holandija',
    sq: 'Tregtari BMW, Holandë',
    sl: 'BMW trgovec, Nizozemska',
    lv: 'BMW dīleris, Nīderlande',
    mk: 'BMW дилер, Холандија',
    et: 'BMW edasimüüja, Holland',
    ca: 'Concessionari BMW, Països Baixos',
    lb: 'BMW Händler, Holland',
    cnr: 'BMW trgovac, Holandija',
    mt: 'Dealer BMW, Olanda',
    is: 'BMW söluaðili, Holland',
    tr: 'BMW Bayisi, Hollanda',
  },
};

const SERVICE_ACTIONS: Record<string, TranslationMap> = {
  'Engine oil.': {
    lt: 'Variklio alyva.',
    en: 'Engine oil.',
    de: 'Motoröl.',
    pl: 'Olej silnikowy.',
    fr: 'Huile moteur.',
    es: 'Aceite de motor.',
    it: 'Olio motore.',
    nl: 'Motorolie.',
    cs: 'Motorový olej.',
    uk: 'Моторна олива.',
    ro: 'Ulei motor.',
    sv: 'Motorolja.',
    el: 'Λάδι κινητήρα.',
    pt: 'Óleo do motor.',
    hu: 'Motorolaj.',
    bg: 'Моторно масло.',
    sr: 'Моторно уље.',
    da: 'Motorolie.',
    no: 'Motorolje.',
    fi: 'Moottoriöljy.',
    sk: 'Motorový olej.',
    hr: 'Motorno ulje.',
    bs: 'Motorno ulje.',
    sq: 'Vaji i motorit.',
    sl: 'Motorno olje.',
    lv: 'Motora eļļa.',
    mk: 'Моторно масло.',
    et: 'Mootoriõli.',
    ca: 'Oli de motor.',
    lb: 'Motorueleg.',
    cnr: 'Motorno ulje.',
    mt: 'Żejt tal-magna.',
    is: 'Vélolía.',
    tr: 'Motor yağı.',
  },
  'Brake fluid service.': {
    lt: 'Stabdžių skysčio keitimas.',
    en: 'Brake fluid service.',
    de: 'Bremsflüssigkeitswechsel.',
    pl: 'Wymiana płynu hamulcowego.',
    fr: 'Changement de liquide de frein.',
    es: 'Cambio de líquido de frenos.',
    it: 'Sostituzione liquido freni.',
    nl: 'Remvloeistof verversen.',
    cs: 'Výměna brzdové kapaliny.',
    uk: 'Заміна гальмівної рідини.',
    ro: 'Schimb lichid de frână.',
    sv: 'Byte av bromsvätska.',
    el: 'Αλλαγή υγρού φρένων.',
    pt: 'Troca de fluido de travão.',
    hu: 'Fékfolyadék csere.',
    bg: 'Смяна на спирачна течност.',
    sr: 'Замена кочионе течности.',
    da: 'Skift af bremsevæske.',
    no: 'Bytte av bremsevæske.',
    fi: 'Jarrunesteen vaihto.',
    sk: 'Výmena brzdovej kvapaliny.',
    hr: 'Zamjena kočione tekućine.',
    bs: 'Zamjena kočione tečnosti.',
    sq: 'Ndërrimi i lëngut të frenave.',
    sl: 'Menjava zavorne tekočine.',
    lv: 'Bremžu šķidruma maiņa.',
    mk: 'Замена на кочна течност.',
    et: 'Pidurivedeliku vahetus.',
    ca: 'Canvi de líquid de frens.',
    lb: 'Bremsflëssegkeetswiessel.',
    cnr: 'Zamjena kočione tečnosti.',
    mt: 'Bidla tal-fluwidu tal-brejkijiet.',
    is: 'Skipt um bremsuvökva.',
    tr: 'Fren hidroliği değişimi.',
  },
  'Microfilter (consider further additional job(s) if appropriate).': {
    lt: 'Salono filtras (jei reikia, atlikti papildomus darbus).',
    en: 'Microfilter (consider further additional job(s) if appropriate).',
    de: 'Innenraumfilter (ggf. weitere Arbeiten durchführen).',
    pl: 'Filtr kabinowy (w razie potrzeby wykonać dodatkowe prace).',
    fr: 'Filtre d\'habitacle (effectuer des travaux supplémentaires si nécessaire).',
    es: 'Filtro de habitáculo (realizar trabajos adicionales si es necesario).',
    it: 'Filtro abitacolo (eseguire lavori aggiuntivi se necessario).',
    nl: 'Interieurfilter (indien nodig aanvullende werkzaamheden uitvoeren).',
    cs: 'Kabinový filtr (v případě potřeby provést další práce).',
    uk: 'Салонний фільтр (за потреби виконати додаткові роботи).',
    ro: 'Filtru de habitaclu (efectuați lucrări suplimentare dacă este necesar).',
    sv: 'Kupéfilter (utför ytterligare arbeten vid behov).',
    el: 'Φίλτρο καμπίνας (εκτελέστε επιπλέον εργασίες εάν χρειάζεται).',
    pt: 'Filtro de habitáculo (realizar trabalhos adicionais se necessário).',
    hu: 'Utastérszűrő (szükség esetén további munkák elvégzése).',
    bg: 'Филтър на купето (при необходимост извършете допълнителни работи).',
    sr: 'Филтер кабине (извршити додатне радове ако је потребно).',
    da: 'Kabinefilter (udfør yderligere arbejde om nødvendigt).',
    no: 'Kupéfilter (utfør ytterligere arbeid ved behov).',
    fi: 'Raitisilmasuodatin (tee tarvittaessa lisätöitä).',
    sk: 'Filter kabíny (v prípade potreby vykonať ďalšie práce).',
    hr: 'Filter kabine (po potrebi izvršiti dodatne radove).',
    bs: 'Filter kabine (po potrebi izvršiti dodatne radove).',
    sq: 'Filtri i kabinës (kryeni punë shtesë nëse është e nevojshme).',
    sl: 'Filter kabine (po potrebi opravite dodatna dela).',
    lv: 'Salona filtrs (ja nepieciešams, veiciet papildu darbus).',
    mk: 'Филтер за кабина (извршете дополнителни работи ако е потребно).',
    et: 'Salongifilter (vajadusel teostage lisatöid).',
    ca: 'Filtre d\'habitacle (realitzar treballs addicionals si cal).',
    lb: 'Inneraum Filter (wann néideg, weider Aarbechten maachen).',
    cnr: 'Filter kabine (po potrebi izvršiti dodatne radove).',
    mt: 'Filtru tal-kabina (agħmel xogħol addizzjonali jekk meħtieġ).',
    is: 'Ferðamannarýmissía (framkvæma viðbótarverk ef þörf krefur).',
    tr: 'Kabin filtresi (gerekirse ek işlemler yapılmalı).',
  },
  'Air filter element.': {
    lt: 'Oro filtro elementas.',
    en: 'Air filter element.',
    de: 'Luftfilterelement.',
    pl: 'Element filtra powietrza.',
    fr: 'Élément de filtre à air.',
    es: 'Elemento del filtro de aire.',
    it: 'Elemento filtro aria.',
    nl: 'Luchtfilterelement.',
    cs: 'Vzduchový filtr.',
    uk: 'Повітряний фільтр.',
    ro: 'Element filtru aer.',
    sv: 'Luftfilterelement.',
    el: 'Στοιχείο φίλτρου αέρα.',
    pt: 'Elemento do filtro de ar.',
    hu: 'Légszűrő betét.',
    bg: 'Въздушен филтър.',
    sr: 'Елемент филтера ваздуха.',
    da: 'Luftfilterelement.',
    no: 'Luftfilterelement.',
    fi: 'Ilmansuodatinelementti.',
    sk: 'Vzduchový filter.',
    hr: 'Element zračnog filtera.',
    bs: 'Element zračnog filtera.',
    sq: 'Elementi i filtrit të ajrit.',
    sl: 'Element zračnega filtra.',
    lv: 'Gaisa filtra elements.',
    mk: 'Елемент на воздушен филтер.',
    et: 'Õhufiltri element.',
    ca: 'Element del filtre d\'aire.',
    lb: 'Loftfilter Element.',
    cnr: 'Element zračnog filtera.',
    mt: 'Element tal-filtru tal-arja.',
    is: 'Loftsíueining.',
    tr: 'Hava filtresi elemanı.',
  },
  'Vehicle check.': {
    lt: 'Automobilio patikra.',
    en: 'Vehicle check.',
    de: 'Fahrzeugprüfung.',
    pl: 'Przegląd pojazdu.',
    fr: 'Contrôle du véhicule.',
    es: 'Revisión del vehículo.',
    it: 'Controllo veicolo.',
    nl: 'Voertuigcontrole.',
    cs: 'Kontrola vozidla.',
    uk: 'Перевірка автомобіля.',
    ro: 'Verificare vehicul.',
    sv: 'Fordonskontroll.',
    el: 'Έλεγχος οχήματος.',
    pt: 'Verificação do veículo.',
    hu: 'Járműellenőrzés.',
    bg: 'Проверка на автомобила.',
    sr: 'Преглед возила.',
    da: 'Køretøjskontrol.',
    no: 'Kjøretøykontroll.',
    fi: 'Ajoneuvon tarkastus.',
    sk: 'Kontrola vozidla.',
    hr: 'Pregled vozila.',
    bs: 'Pregled vozila.',
    sq: 'Kontroll i automjetit.',
    sl: 'Pregled vozila.',
    lv: 'Transportlīdzekļa pārbaude.',
    mk: 'Преглед на возилото.',
    et: 'Sõiduki kontroll.',
    ca: 'Revisió del vehicle.',
    lb: 'Gefierspréifung.',
    cnr: 'Pregled vozila.',
    mt: 'Kontroll tal-vettura.',
    is: 'Ökutækjaskoðun.',
    tr: 'Araç kontrolü.',
  },
  'unknown.': {
    lt: 'Nežinoma.',
    en: 'Unknown.',
    de: 'Unbekannt.',
    pl: 'Nieznane.',
    fr: 'Inconnu.',
    es: 'Desconocido.',
    it: 'Sconosciuto.',
    nl: 'Onbekend.',
    cs: 'Neznámé.',
    uk: 'Невідомо.',
    ro: 'Necunoscut.',
    sv: 'Okänt.',
    el: 'Άγνωστο.',
    pt: 'Desconhecido.',
    hu: 'Ismeretlen.',
    bg: 'Неизвестно.',
    sr: 'Непознато.',
    da: 'Ukendt.',
    no: 'Ukjent.',
    fi: 'Tuntematon.',
    sk: 'Neznáme.',
    hr: 'Nepoznato.',
    bs: 'Nepoznato.',
    sq: 'E panjohur.',
    sl: 'Neznano.',
    lv: 'Nezināms.',
    mk: 'Непознато.',
    et: 'Teadmata.',
    ca: 'Desconegut.',
    lb: 'Onbekannt.',
    cnr: 'Nepoznato.',
    mt: 'Mhux magħruf.',
    is: 'Óþekkt.',
    tr: 'Bilinmiyor.',
  },
  'Statutory vehicle inspection.': {
    lt: 'Privaloma techninė apžiūra.',
    en: 'Statutory vehicle inspection.',
    de: 'Hauptuntersuchung.',
    pl: 'Obowiązkowy przegląd techniczny.',
    fr: 'Contrôle technique obligatoire.',
    es: 'Inspección técnica obligatoria.',
    it: 'Revisione obbligatoria.',
    nl: 'APK-keuring.',
    cs: 'Povinná technická kontrola.',
    uk: 'Обов\'язковий технічний огляд.',
    ro: 'Inspecție tehnică obligatorie.',
    sv: 'Obligatorisk fordonsbesiktning.',
    el: 'Υποχρεωτικός τεχνικός έλεγχος.',
    pt: 'Inspeção técnica obrigatória.',
    hu: 'Kötelező műszaki vizsga.',
    bg: 'Задължителен технически преглед.',
    sr: 'Обавезан технички преглед.',
    da: 'Lovpligtig syn.',
    no: 'Obligatorisk EU-kontroll.',
    fi: 'Pakollinen katsastus.',
    sk: 'Povinná technická kontrola.',
    hr: 'Obavezni tehnički pregled.',
    bs: 'Obavezni tehnički pregled.',
    sq: 'Inspektimi teknik i detyrueshëm.',
    sl: 'Obvezni tehnični pregled.',
    lv: 'Obligātā tehniskā apskate.',
    mk: 'Задолжителен технички преглед.',
    et: 'Kohustuslik tehnoülevaatus.',
    ca: 'Inspecció tècnica obligatòria.',
    lb: 'Obligatoresch technesch Kontroll.',
    cnr: 'Obavezni tehnički pregled.',
    mt: 'Ispezzjoni teknika obbligatorja.',
    is: 'Lögboðin skoðun.',
    tr: 'Zorunlu teknik muayene.',
  },
};

const SERVICE_EVENTS = [
  { date: '2024-12-06', mileage: 201986, providerKey: null, type: 'service', actionKeys: [] },
  { date: '2024-10-24', mileage: 200220, providerKey: null, type: 'service', actionKeys: [] },
  { date: '2023-04-28', mileage: 170975, providerKey: 'pl', type: 'service', actionKeys: ['Engine oil.', 'Brake fluid service.', 'Microfilter (consider further additional job(s) if appropriate).'] },
  { date: '2021-10-22', mileage: 131468, providerKey: 'pl', type: 'service', actionKeys: ['Engine oil.', 'Air filter element.', 'Vehicle check.', 'Microfilter (consider further additional job(s) if appropriate).', 'unknown.'] },
  { date: '2021-05-04', mileage: 118007, providerKey: 'pl', type: 'service', actionKeys: ['Brake fluid service.'] },
  { date: '2020-09-03', mileage: 101944, providerKey: 'nl2', type: 'service', actionKeys: ['Statutory vehicle inspection.'] },
  { date: '2020-02-10', mileage: 99074, providerKey: 'nl', type: 'service', actionKeys: ['Engine oil.', 'Microfilter (consider further additional job(s) if appropriate).'] },
  { date: '2019-04-19', mileage: 80772, providerKey: 'nl', type: 'service', actionKeys: ['Brake fluid service.'] },
  { date: '2018-08-23', mileage: 65781, providerKey: 'nl', type: 'service', actionKeys: ['Engine oil.', 'Air filter element.', 'Vehicle check.', 'Microfilter (consider further additional job(s) if appropriate).', 'unknown.'] },
  { date: '2017-05-09', mileage: 33204, providerKey: 'nl', type: 'service', actionKeys: ['Engine oil.', 'Microfilter (consider further additional job(s) if appropriate).'] },
];

const TECHNICAL_SPECS: Record<string, string> = {
  oem_vehicle_desc: 'BMW 3 (F30, F80) 330 e',
  vehicle_desc: 'BMW 3 330 e',
  manufacturer_desc: 'BMW',
  oem_model_range_desc: '3 (F30, F80)',
  oem_derivative_desc: '330 e',
  manufactured_year: '2016',
  power_kw: '185',
  power_bhp: '252',
  oem_engine_desc: 'B48 B20 A',
  oem_fuel_type_desc: 'Petrol',
  oem_transmission_type_desc: 'automatic',
  oem_drivetrain_desc: 'Rear-Wheel Drive',
  oem_body_type_desc: 'Saloon',
  oem_colour_desc: 'black-sapphire metallic (475)',
  oem_interior_trim_desc: 'Leather Dakota sattelbraun/accent brown (PLCDJ)',
};

const FIELD_LABELS: Record<string, TranslationMap> = {
  oem_vehicle_desc: { lt: 'OE aprašymas', en: 'OE description', de: 'OE Beschreibung', pl: 'Opis OE', fr: 'Description OE', es: 'Descripción OE', it: 'Descrizione OE', nl: 'OE beschrijving', cs: 'OE popis', uk: 'Опис OE', ro: 'Descriere OE', sv: 'OE beskrivning', el: 'Περιγραφή OE', pt: 'Descrição OE', hu: 'OE leírás', bg: 'OE описание', sr: 'OE опис', da: 'OE beskrivelse', no: 'OE beskrivelse', fi: 'OE kuvaus', sk: 'OE popis', hr: 'OE opis', bs: 'OE opis', sq: 'Përshkrimi OE', sl: 'OE opis', lv: 'OE apraksts', mk: 'OE опис', et: 'OE kirjeldus', ca: 'Descripció OE', lb: 'OE Beschreiwung', cnr: 'OE opis', mt: 'Deskrizzjoni OE', is: 'OE lýsing', tr: 'OE açıklama' },
  vehicle_desc: { lt: 'Aprašymas', en: 'Description', de: 'Beschreibung', pl: 'Opis', fr: 'Description', es: 'Descripción', it: 'Descrizione', nl: 'Beschrijving', cs: 'Popis', uk: 'Опис', ro: 'Descriere', sv: 'Beskrivning', el: 'Περιγραφή', pt: 'Descrição', hu: 'Leírás', bg: 'Описание', sr: 'Опис', da: 'Beskrivelse', no: 'Beskrivelse', fi: 'Kuvaus', sk: 'Popis', hr: 'Opis', bs: 'Opis', sq: 'Përshkrimi', sl: 'Opis', lv: 'Apraksts', mk: 'Опис', et: 'Kirjeldus', ca: 'Descripció', lb: 'Beschreiwung', cnr: 'Opis', mt: 'Deskrizzjoni', is: 'Lýsing', tr: 'Açıklama' },
  manufacturer_desc: { lt: 'Gamintojas', en: 'Manufacturer', de: 'Hersteller', pl: 'Producent', fr: 'Fabricant', es: 'Fabricante', it: 'Produttore', nl: 'Fabrikant', cs: 'Výrobce', uk: 'Виробник', ro: 'Producător', sv: 'Tillverkare', el: 'Κατασκευαστής', pt: 'Fabricante', hu: 'Gyártó', bg: 'Производител', sr: 'Произвођач', da: 'Producent', no: 'Produsent', fi: 'Valmistaja', sk: 'Výrobca', hr: 'Proizvođač', bs: 'Proizvođač', sq: 'Prodhuesi', sl: 'Proizvajalec', lv: 'Ražotājs', mk: 'Производител', et: 'Tootja', ca: 'Fabricant', lb: 'Hiersteller', cnr: 'Proizvođač', mt: 'Manifattur', is: 'Framleiðandi', tr: 'Üretici' },
  oem_model_range_desc: { lt: 'Serija / modelis', en: 'Series / Model', de: 'Serie / Modell', pl: 'Seria / Model', fr: 'Série / Modèle', es: 'Serie / Modelo', it: 'Serie / Modello', nl: 'Serie / Model', cs: 'Série / Model', uk: 'Серія / Модель', ro: 'Serie / Model', sv: 'Serie / Modell', el: 'Σειρά / Μοντέλο', pt: 'Série / Modelo', hu: 'Széria / Modell', bg: 'Серия / Модел', sr: 'Серија / Модел', da: 'Serie / Model', no: 'Serie / Modell', fi: 'Sarja / Malli', sk: 'Séria / Model', hr: 'Serija / Model', bs: 'Serija / Model', sq: 'Seria / Modeli', sl: 'Serija / Model', lv: 'Sērija / Modelis', mk: 'Серија / Модел', et: 'Seeria / Mudel', ca: 'Sèrie / Model', lb: 'Serie / Modell', cnr: 'Serija / Model', mt: 'Serje / Mudell', is: 'Röð / Gerð', tr: 'Seri / Model' },
  oem_derivative_desc: { lt: 'Derivatyvas', en: 'Derivative', de: 'Derivat', pl: 'Wariant', fr: 'Dérivé', es: 'Derivado', it: 'Derivato', nl: 'Afgeleide', cs: 'Derivát', uk: 'Деріватив', ro: 'Derivat', sv: 'Derivat', el: 'Παράγωγο', pt: 'Derivado', hu: 'Származék', bg: 'Производно', sr: 'Дериват', da: 'Derivat', no: 'Derivat', fi: 'Johdannainen', sk: 'Derivát', hr: 'Derivat', bs: 'Derivat', sq: 'Derivat', sl: 'Derivat', lv: 'Derivāts', mk: 'Дериват', et: 'Derivaat', ca: 'Derivat', lb: 'Derivat', cnr: 'Derivat', mt: 'Derivat', is: 'Afleiða', tr: 'Türev' },
  manufactured_year: { lt: 'Gamybos metai', en: 'Year of manufacture', de: 'Baujahr', pl: 'Rok produkcji', fr: 'Année de fabrication', es: 'Año de fabricación', it: 'Anno di produzione', nl: 'Bouwjaar', cs: 'Rok výroby', uk: 'Рік виробництва', ro: 'An fabricație', sv: 'Tillverkningsår', el: 'Έτος κατασκευής', pt: 'Ano de fabrico', hu: 'Gyártási év', bg: 'Година на производство', sr: 'Година производње', da: 'Produktionsår', no: 'Produksjonsår', fi: 'Valmistusvuosi', sk: 'Rok výroby', hr: 'Godina proizvodnje', bs: 'Godina proizvodnje', sq: 'Viti i prodhimit', sl: 'Leto izdelave', lv: 'Izgatavošanas gads', mk: 'Година на производство', et: 'Tootmisaasta', ca: 'Any de fabricació', lb: 'Baujor', cnr: 'Godina proizvodnje', mt: 'Sena tal-manifattura', is: 'Framleiðsluár', tr: 'Üretim yılı' },
  power_kw: { lt: 'Galia (kW)', en: 'Power (kW)', de: 'Leistung (kW)', pl: 'Moc (kW)', fr: 'Puissance (kW)', es: 'Potencia (kW)', it: 'Potenza (kW)', nl: 'Vermogen (kW)', cs: 'Výkon (kW)', uk: 'Потужність (кВт)', ro: 'Putere (kW)', sv: 'Effekt (kW)', el: 'Ισχύς (kW)', pt: 'Potência (kW)', hu: 'Teljesítmény (kW)', bg: 'Мощност (kW)', sr: 'Снага (kW)', da: 'Effekt (kW)', no: 'Effekt (kW)', fi: 'Teho (kW)', sk: 'Výkon (kW)', hr: 'Snaga (kW)', bs: 'Snaga (kW)', sq: 'Fuqia (kW)', sl: 'Moč (kW)', lv: 'Jauda (kW)', mk: 'Сила (kW)', et: 'Võimsus (kW)', ca: 'Potència (kW)', lb: 'Leeschtung (kW)', cnr: 'Snaga (kW)', mt: 'Qawwa (kW)', is: 'Afl (kW)', tr: 'Güç (kW)' },
  power_bhp: { lt: 'Galia (AG)', en: 'Power (HP)', de: 'Leistung (PS)', pl: 'Moc (KM)', fr: 'Puissance (ch)', es: 'Potencia (CV)', it: 'Potenza (CV)', nl: 'Vermogen (pk)', cs: 'Výkon (k)', uk: 'Потужність (к.с.)', ro: 'Putere (CP)', sv: 'Effekt (hk)', el: 'Ισχύς (ίπποι)', pt: 'Potência (cv)', hu: 'Teljesítmény (LE)', bg: 'Мощност (к.с.)', sr: 'Снага (КС)', da: 'Effekt (hk)', no: 'Effekt (hk)', fi: 'Teho (hv)', sk: 'Výkon (k)', hr: 'Snaga (KS)', bs: 'Snaga (KS)', sq: 'Fuqia (KF)', sl: 'Moč (KM)', lv: 'Jauda (ZS)', mk: 'Сила (КС)', et: 'Võimsus (hj)', ca: 'Potència (CV)', lb: 'Leeschtung (PS)', cnr: 'Snaga (KS)', mt: 'Qawwa (HP)', is: 'Afl (hö)', tr: 'Güç (BG)' },
  oem_engine_desc: { lt: 'Variklis', en: 'Engine', de: 'Motor', pl: 'Silnik', fr: 'Moteur', es: 'Motor', it: 'Motore', nl: 'Motor', cs: 'Motor', uk: 'Двигун', ro: 'Motor', sv: 'Motor', el: 'Κινητήρας', pt: 'Motor', hu: 'Motor', bg: 'Двигател', sr: 'Мотор', da: 'Motor', no: 'Motor', fi: 'Moottori', sk: 'Motor', hr: 'Motor', bs: 'Motor', sq: 'Motori', sl: 'Motor', lv: 'Dzinējs', mk: 'Мотор', et: 'Mootor', ca: 'Motor', lb: 'Motor', cnr: 'Motor', mt: 'Magna', is: 'Vél', tr: 'Motor' },
  oem_fuel_type_desc: { lt: 'Kuras', en: 'Fuel type', de: 'Kraftstoff', pl: 'Paliwo', fr: 'Carburant', es: 'Combustible', it: 'Carburante', nl: 'Brandstof', cs: 'Palivo', uk: 'Паливо', ro: 'Combustibil', sv: 'Bränsle', el: 'Καύσιμο', pt: 'Combustível', hu: 'Üzemanyag', bg: 'Гориво', sr: 'Гориво', da: 'Brændstof', no: 'Drivstoff', fi: 'Polttoaine', sk: 'Palivo', hr: 'Gorivo', bs: 'Gorivo', sq: 'Karburanti', sl: 'Gorivo', lv: 'Degviela', mk: 'Гориво', et: 'Kütus', ca: 'Combustible', lb: 'Brennstoff', cnr: 'Gorivo', mt: 'Fjuwil', is: 'Eldsneyti', tr: 'Yakıt' },
  oem_transmission_type_desc: { lt: 'Pavarų dėžė', en: 'Transmission', de: 'Getriebe', pl: 'Skrzynia biegów', fr: 'Boîte de vitesses', es: 'Caja de cambios', it: 'Cambio', nl: 'Versnellingsbak', cs: 'Převodovka', uk: 'Коробка передач', ro: 'Cutie de viteze', sv: 'Växellåda', el: 'Κιβώτιο ταχυτήτων', pt: 'Caixa de velocidades', hu: 'Sebességváltó', bg: 'Скоростна кутия', sr: 'Мењач', da: 'Gearkasse', no: 'Girkasse', fi: 'Vaihteisto', sk: 'Prevodovka', hr: 'Mjenjač', bs: 'Mjenjač', sq: 'Kutia e shpejtësisë', sl: 'Menjalnik', lv: 'Ātrumkārba', mk: 'Менувач', et: 'Käigukast', ca: 'Canvi de marxes', lb: 'Getriww', cnr: 'Mjenjač', mt: 'Kaxxa tal-ingrannaġġ', is: 'Gírkassi', tr: 'Şanzıman' },
  oem_drivetrain_desc: { lt: 'Pavara', en: 'Drivetrain', de: 'Antrieb', pl: 'Napęd', fr: 'Transmission', es: 'Tracción', it: 'Trazione', nl: 'Aandrijving', cs: 'Pohon', uk: 'Привід', ro: 'Tracțiune', sv: 'Drivlina', el: 'Κίνηση', pt: 'Tração', hu: 'Hajtás', bg: 'Задвижване', sr: 'Погон', da: 'Drivlinje', no: 'Drivlinje', fi: 'Voimansiirto', sk: 'Pohon', hr: 'Pogon', bs: 'Pogon', sq: 'Lëvizja', sl: 'Pogon', lv: 'Piedziņa', mk: 'Погон', et: 'Veoskeem', ca: 'Tracció', lb: 'Undréif', cnr: 'Pogon', mt: 'Drivetrain', is: 'Drif', tr: 'Tahrik' },
  oem_body_type_desc: { lt: 'Kėbulo tipas', en: 'Body type', de: 'Karosserietyp', pl: 'Typ nadwozia', fr: 'Type de carrosserie', es: 'Tipo de carrocería', it: 'Tipo di carrozzeria', nl: 'Carrosserietype', cs: 'Typ karoserie', uk: 'Тип кузова', ro: 'Tip caroserie', sv: 'Karosstyp', el: 'Τύπος αμαξώματος', pt: 'Tipo de carroçaria', hu: 'Karosszéria', bg: 'Тип каросерия', sr: 'Тип каросерије', da: 'Karosseritype', no: 'Karosseritype', fi: 'Korityyppi', sk: 'Typ karosérie', hr: 'Tip karoserije', bs: 'Tip karoserije', sq: 'Tipi i karrocerisë', sl: 'Tip karoserije', lv: 'Virsbūves tips', mk: 'Тип на каросерија', et: 'Keretüüp', ca: 'Tipus de carrosseria', lb: 'Karosserietype', cnr: 'Tip karoserije', mt: 'Tip ta\' karozzerija', is: 'Yfirbyggingartegund', tr: 'Kasa tipi' },
  oem_colour_desc: { lt: 'Spalva', en: 'Colour', de: 'Farbe', pl: 'Kolor', fr: 'Couleur', es: 'Color', it: 'Colore', nl: 'Kleur', cs: 'Barva', uk: 'Колір', ro: 'Culoare', sv: 'Färg', el: 'Χρώμα', pt: 'Cor', hu: 'Szín', bg: 'Цвят', sr: 'Боја', da: 'Farve', no: 'Farge', fi: 'Väri', sk: 'Farba', hr: 'Boja', bs: 'Boja', sq: 'Ngjyra', sl: 'Barva', lv: 'Krāsa', mk: 'Боја', et: 'Värv', ca: 'Color', lb: 'Faarf', cnr: 'Boja', mt: 'Kulur', is: 'Litur', tr: 'Renk' },
  oem_interior_trim_desc: { lt: 'Interjero apdaila', en: 'Interior trim', de: 'Innenausstattung', pl: 'Wykończenie wnętrza', fr: 'Garniture intérieure', es: 'Acabado interior', it: 'Rivestimento interni', nl: 'Interieurafwerking', cs: 'Výbava interiéru', uk: 'Оздоблення салону', ro: 'Tapițerie interioară', sv: 'Inredning', el: 'Εσωτερική επένδυση', pt: 'Acabamento interior', hu: 'Belső kárpitozás', bg: 'Интериорна тапицерия', sr: 'Унутрашња облога', da: 'Interiørbeklædning', no: 'Innvendig bekledning', fi: 'Sisäverhoilu', sk: 'Výbava interiéru', hr: 'Unutarnja obloga', bs: 'Unutrašnja obloga', sq: 'Veshja e brendshme', sl: 'Notranja obloga', lv: 'Salona apdare', mk: 'Внатрешна облога', et: 'Salongi viimistlus', ca: 'Acabat interior', lb: 'Innenausstattung', cnr: 'Unutrašnja obloga', mt: 'Finitura interna', is: 'Innréttingar', tr: 'İç döşeme' },
};

const MARKET_VALUE = { min: 9500, average: 12500, max: 15500 };

const AI_ANALYSIS: Record<string, { problemAreas: string[]; strongPoints: string[] }> = {
  lt: { problemAreas: ['Didelė rida (201 986 km) – gali reikėti papildomų patikrinimų', 'Paskutiniai serviso įrašai be detalių apie atliktus darbus'], strongPoints: ['Reguliariai prižiūrėtas oficialiuose BMW servisuose', 'Nuosekli ridos istorija be manipuliacijų požymių', 'Pilna serviso istorija nuo pirmos dienos', 'Stabdžių skysčio keitimas atliktas reguliariai'] },
  en: { problemAreas: ['High mileage (201,986 km) – may require additional checks', 'Recent service records without details about work performed'], strongPoints: ['Regularly maintained at official BMW service centers', 'Consistent mileage history with no signs of tampering', 'Complete service history from day one', 'Brake fluid changed regularly'] },
  de: { problemAreas: ['Hohe Laufleistung (201.986 km) – zusätzliche Prüfungen können erforderlich sein', 'Letzte Serviceeinträge ohne Details zu durchgeführten Arbeiten'], strongPoints: ['Regelmäßig bei offiziellen BMW-Servicezentren gewartet', 'Konsistente Kilometerhistorie ohne Manipulationsanzeichen', 'Vollständige Servicehistorie ab dem ersten Tag', 'Bremsflüssigkeit regelmäßig gewechselt'] },
  pl: { problemAreas: ['Duży przebieg (201 986 km) – może wymagać dodatkowych kontroli', 'Ostatnie wpisy serwisowe bez szczegółów o wykonanych pracach'], strongPoints: ['Regularnie serwisowany w oficjalnych serwisach BMW', 'Spójna historia przebiegu bez oznak manipulacji', 'Pełna historia serwisowa od pierwszego dnia', 'Regularnie wymieniony płyn hamulcowy'] },
  fr: { problemAreas: ['Kilométrage élevé (201 986 km) – des vérifications supplémentaires peuvent être nécessaires', 'Derniers enregistrements de service sans détails sur les travaux effectués'], strongPoints: ['Entretenu régulièrement dans les centres de service BMW officiels', 'Historique de kilométrage cohérent sans signes de manipulation', 'Historique de service complet depuis le premier jour', 'Liquide de frein changé régulièrement'] },
  es: { problemAreas: ['Alto kilometraje (201.986 km) – puede requerir verificaciones adicionales', 'Últimos registros de servicio sin detalles sobre trabajos realizados'], strongPoints: ['Mantenido regularmente en centros de servicio BMW oficiales', 'Historial de kilometraje consistente sin signos de manipulación', 'Historial de servicio completo desde el primer día', 'Líquido de frenos cambiado regularmente'] },
  it: { problemAreas: ['Chilometraggio elevato (201.986 km) – potrebbero essere necessari controlli aggiuntivi', 'Ultimi record di servizio senza dettagli sui lavori eseguiti'], strongPoints: ['Regolarmente mantenuto presso centri di servizio BMW ufficiali', 'Storico chilometrico coerente senza segni di manomissione', 'Storico di servizio completo dal primo giorno', 'Liquido freni sostituito regolarmente'] },
  nl: { problemAreas: ['Hoge kilometerstand (201.986 km) – extra controles kunnen nodig zijn', 'Recente servicegegevens zonder details over uitgevoerde werkzaamheden'], strongPoints: ['Regelmatig onderhouden bij officiële BMW-servicecentra', 'Consistente kilometerhistorie zonder tekenen van manipulatie', 'Volledige servicehistorie vanaf de eerste dag', 'Remvloeistof regelmatig vervangen'] },
  cs: { problemAreas: ['Vysoký nájezd (201 986 km) – mohou být nutné další kontroly', 'Poslední servisní záznamy bez podrobností o provedených pracích'], strongPoints: ['Pravidelně udržováno v oficiálních servisech BMW', 'Konzistentní historie kilometrů bez známek manipulace', 'Kompletní servisní historie od prvního dne', 'Brzdová kapalina pravidelně měněna'] },
  uk: { problemAreas: ['Великий пробіг (201 986 км) – можуть знадобитися додаткові перевірки', 'Останні сервісні записи без деталей про виконані роботи'], strongPoints: ['Регулярно обслуговувався в офіційних сервісах BMW', 'Послідовна історія пробігу без ознак маніпуляцій', 'Повна сервісна історія з першого дня', 'Гальмівна рідина замінювалася регулярно'] },
  ro: { problemAreas: ['Kilometraj mare (201.986 km) – pot fi necesare verificări suplimentare', 'Ultimele înregistrări de service fără detalii despre lucrările efectuate'], strongPoints: ['Întreținut regulat la centrele de service BMW oficiale', 'Istoric de kilometraj consistent fără semne de manipulare', 'Istoric de service complet din prima zi', 'Lichid de frână schimbat regulat'] },
  sv: { problemAreas: ['Hög körsträcka (201 986 km) – ytterligare kontroller kan behövas', 'Senaste serviceregistreringar utan detaljer om utfört arbete'], strongPoints: ['Regelbundet underhållen vid officiella BMW-servicecenter', 'Konsekvent mätarhistorik utan tecken på manipulation', 'Komplett servicehistorik från första dagen', 'Bromsvätska bytt regelbundet'] },
  el: { problemAreas: ['Υψηλά χιλιόμετρα (201.986 km) – ενδέχεται να απαιτηθούν επιπλέον έλεγχοι', 'Πρόσφατα αρχεία service χωρίς λεπτομέρειες για τις εργασίες'], strongPoints: ['Τακτική συντήρηση σε επίσημα κέντρα service BMW', 'Συνεπές ιστορικό χιλιομέτρων χωρίς ενδείξεις παραποίησης', 'Πλήρες ιστορικό service από την πρώτη μέρα', 'Υγρό φρένων αλλαγμένο τακτικά'] },
  pt: { problemAreas: ['Quilometragem elevada (201.986 km) – podem ser necessárias verificações adicionais', 'Últimos registos de serviço sem detalhes sobre trabalhos realizados'], strongPoints: ['Regularmente mantido em centros de serviço BMW oficiais', 'Histórico de quilometragem consistente sem sinais de manipulação', 'Histórico de serviço completo desde o primeiro dia', 'Fluido de travão trocado regularmente'] },
  hu: { problemAreas: ['Magas futásteljesítmény (201 986 km) – további ellenőrzések szükségesek lehetnek', 'Legutóbbi szervizrekordok az elvégzett munkák részletei nélkül'], strongPoints: ['Rendszeresen karbantartva hivatalos BMW szervizközpontokban', 'Konzisztens futásteljesítmény-előzmények manipuláció jelei nélkül', 'Teljes szervizhistória az első naptól', 'Fékfolyadék rendszeresen cserélve'] },
  bg: { problemAreas: ['Голям пробег (201 986 км) – може да са необходими допълнителни проверки', 'Последни сервизни записи без подробности за извършената работа'], strongPoints: ['Редовно обслужван в официални BMW сервизни центрове', 'Последователна история на пробега без признаци на манипулация', 'Пълна сервизна история от първия ден', 'Спирачна течност сменяна редовно'] },
  sr: { problemAreas: ['Велика километража (201.986 км) – могу бити потребне додатне провере', 'Последњи сервисни записи без детаља о обављеним радовима'], strongPoints: ['Редовно одржаван у званичним BMW сервисним центрима', 'Доследна историја километраже без знакова манипулације', 'Потпуна сервисна историја од првог дана', 'Кочиона течност редовно мењана'] },
  da: { problemAreas: ['Høj kilometerstand (201.986 km) – yderligere kontroller kan være nødvendige', 'Seneste serviceregistreringer uden detaljer om udført arbejde'], strongPoints: ['Regelmæssigt vedligeholdt på officielle BMW-servicecentre', 'Konsistent kilometerhistorik uden tegn på manipulation', 'Komplet servicehistorik fra dag ét', 'Bremsevæske skiftet regelmæssigt'] },
  no: { problemAreas: ['Høy kilometerstand (201 986 km) – ytterligere kontroller kan være nødvendige', 'Siste serviceregistreringer uten detaljer om utført arbeid'], strongPoints: ['Regelmessig vedlikeholdt ved offisielle BMW-servicesentre', 'Konsistent kilometerhistorikk uten tegn på manipulasjon', 'Komplett servicehistorikk fra dag én', 'Bremsevæske byttet regelmessig'] },
  fi: { problemAreas: ['Suuri ajokilometrimäärä (201 986 km) – lisätarkastuksia voidaan tarvita', 'Viimeisimmät huoltomerkinnät ilman tietoja tehdyistä töistä'], strongPoints: ['Säännöllisesti huollettu virallisissa BMW-huoltokeskuksissa', 'Johdonmukainen ajokilometrihistoria ilman merkkejä manipuloinnista', 'Täydellinen huoltohistoria ensimmäisestä päivästä', 'Jarruneste vaihdettu säännöllisesti'] },
  sk: { problemAreas: ['Vysoký nájazd (201 986 km) – môžu byť potrebné ďalšie kontroly', 'Posledné servisné záznamy bez podrobností o vykonaných prácach'], strongPoints: ['Pravidelne udržiavané v oficiálnych BMW servisoch', 'Konzistentná história kilometrov bez známok manipulácie', 'Kompletná servisná história od prvého dňa', 'Brzdová kvapalina pravidelne menená'] },
  hr: { problemAreas: ['Visoka kilometraža (201.986 km) – mogu biti potrebne dodatne provjere', 'Najnoviji servisni zapisi bez detalja o obavljenim radovima'], strongPoints: ['Redovito održavan u službenim BMW servisnim centrima', 'Dosljedna povijest kilometraže bez znakova manipulacije', 'Potpuna servisna povijest od prvog dana', 'Kočiona tekućina redovito mijenjana'] },
  bs: { problemAreas: ['Visoka kilometraža (201.986 km) – mogu biti potrebne dodatne provjere', 'Najnoviji servisni zapisi bez detalja o obavljenim radovima'], strongPoints: ['Redovno održavan u službenim BMW servisnim centrima', 'Dosljedna historija kilometraže bez znakova manipulacije', 'Potpuna servisna historija od prvog dana', 'Kočiona tečnost redovno mijenjana'] },
  sq: { problemAreas: ['Kilometrazh i lartë (201,986 km) – mund të nevojiten kontrolle shtesë', 'Regjistrimet e fundit të shërbimit pa detaje për punët e kryera'], strongPoints: ['Mirëmbajtur rregullisht në qendrat zyrtare të shërbimit BMW', 'Historik i qëndrueshëm i kilometrazhit pa shenja manipulimi', 'Historik i plotë shërbimi që nga dita e parë', 'Lëngu i frenave ndërruar rregullisht'] },
  sl: { problemAreas: ['Visoka prevožena razdalja (201.986 km) – morda bodo potrebni dodatni pregledi', 'Zadnji servisni zapisi brez podrobnosti o opravljenih delih'], strongPoints: ['Redno vzdrževan v uradnih BMW servisnih centrih', 'Dosledna zgodovina kilometrine brez znakov manipulacije', 'Popolna servisna zgodovina od prvega dne', 'Zavorna tekočina redno menjavana'] },
  lv: { problemAreas: ['Liels nobraukums (201 986 km) – var būt nepieciešamas papildu pārbaudes', 'Jaunākie servisa ieraksti bez detaļām par veiktajiem darbiem'], strongPoints: ['Regulāri apkalpots oficiālajos BMW servisa centros', 'Konsekventa nobraukuma vēsture bez manipulācijas pazīmēm', 'Pilna servisa vēsture no pirmās dienas', 'Bremžu šķidrums regulāri mainīts'] },
  mk: { problemAreas: ['Голема километража (201.986 км) – може да бидат потребни дополнителни проверки', 'Последни сервисни записи без детали за извршените работи'], strongPoints: ['Редовно одржуван во официјални BMW сервисни центри', 'Конзистентна историја на километража без знаци на манипулација', 'Целосна сервисна историја од првиот ден', 'Кочна течност редовно менувана'] },
  et: { problemAreas: ['Suur läbisõit (201 986 km) – võivad olla vajalikud lisakontrollid', 'Viimased hoolduskanded ilma tehtud tööde üksikasjadeta'], strongPoints: ['Regulaarselt hooldatud ametlikes BMW teeninduskeskustes', 'Järjepidev läbisõiduajalugu ilma manipuleerimise märkideta', 'Täielik hooldusajalugu esimesest päevast', 'Pidurivedelik regulaarselt vahetatud'] },
  ca: { problemAreas: ['Quilometratge elevat (201.986 km) – poden ser necessàries verificacions addicionals', 'Últims registres de servei sense detalls sobre treballs realitzats'], strongPoints: ['Mantingut regularment en centres de servei BMW oficials', 'Historial de quilometratge consistent sense signes de manipulació', 'Historial de servei complet des del primer dia', 'Líquid de frens canviat regularment'] },
  lb: { problemAreas: ['Héich Kilometerzuel (201.986 km) – zousätzlech Kontrollen kënne néideg sinn', 'Lescht Servicerecorden ouni Detailer iwwer gemaachten Aarbechten'], strongPoints: ['Regelméisseg ënnerhalen an offiziellen BMW Servicezenteren', 'Konsistent Kilometergeschicht ouni Zeeche vu Manipulatioun', 'Komplett Servicegeschicht vum éischten Dag un', 'Bremsflëssegkeet regelméisseg gewiesselt'] },
  cnr: { problemAreas: ['Visoka kilometraža (201.986 km) – mogu biti potrebne dodatne provjere', 'Najnoviji servisni zapisi bez detalja o obavljenim radovima'], strongPoints: ['Redovno održavan u službenim BMW servisnim centrima', 'Dosljedna istorija kilometraže bez znakova manipulacije', 'Potpuna servisna istorija od prvog dana', 'Kočiona tečnost redovno mijenjana'] },
  mt: { problemAreas: ['Kilometraġġ għoli (201,986 km) – jistgħu jkunu meħtieġa kontrolli addizzjonali', 'L-aħħar rekords tas-servizz mingħajr dettalji dwar ix-xogħol li sar'], strongPoints: ['Miżmum regolarment f\'ċentri tas-servizz BMW uffiċjali', 'Storja konsistenti tal-kilometraġġ mingħajr sinjali ta\' manipulazzjoni', 'Storja kompluta tas-servizz mill-ewwel jum', 'Fluwidu tal-brejkijiet mibdul regolarment'] },
  is: { problemAreas: ['Mikið akstur (201.986 km) – frekari skoðanir gætu verið nauðsynlegar', 'Nýjustu þjónustuskrár án upplýsinga um unnin störf'], strongPoints: ['Reglulega þjónustað á opinberum BMW þjónustumiðstöðvum', 'Samræmd kílómetrasaga án marks um misnotkun', 'Fullkomin þjónustusaga frá fyrsta degi', 'Bremsuvökva skipt reglulega'] },
  tr: { problemAreas: ['Yüksek kilometre (201.986 km) – ek kontroller gerekebilir', 'Son servis kayıtları yapılan işler hakkında detay içermiyor'], strongPoints: ['Resmi BMW servis merkezlerinde düzenli bakım yapılmış', 'Manipülasyon belirtisi olmayan tutarlı kilometre geçmişi', 'İlk günden itibaren tam servis geçmişi', 'Fren hidroliği düzenli olarak değiştirilmiş'] },
};

const ORDER_LABEL: TranslationMap = {
  lt: 'Užsakymo Nr.', en: 'Order No.', de: 'Bestell-Nr.', pl: 'Nr zamówienia', fr: 'N° de commande', es: 'N° de pedido', it: 'N. ordine', nl: 'Bestelnr.', cs: 'Č. objednávky', uk: 'Номер замовлення', ro: 'Nr. comandă', sv: 'Ordernr.', el: 'Αρ. παραγγελίας', pt: 'N.º de encomenda', hu: 'Rendelésszám', bg: 'Поръчка №', sr: 'Број наруџбе', da: 'Ordrenr.', no: 'Ordrenr.', fi: 'Tilausnro', sk: 'Č. objednávky', hr: 'Br. narudžbe', bs: 'Br. narudžbe', sq: 'Nr. i porosisë', sl: 'Št. naročila', lv: 'Pasūtījuma nr.', mk: 'Број на нарачка', et: 'Tellimuse nr', ca: 'N. comanda', lb: 'Bestellnummer', cnr: 'Br. narudžbe', mt: 'Nru. tal-ordni', is: 'Pöntunarnr.', tr: 'Sipariş No.',
};

const NO_DAMAGES: TranslationMap = {
  lt: 'Žalų įrašų nerasta', en: 'No damage records found', de: 'Keine Schadenseinträge gefunden', pl: 'Nie znaleziono wpisów o szkodach', fr: 'Aucun enregistrement de dommage trouvé', es: 'No se encontraron registros de daños', it: 'Nessun record di danni trovato', nl: 'Geen schaderecords gevonden', cs: 'Nenalezeny žádné záznamy o poškození', uk: 'Записів про пошкодження не знайдено', ro: 'Nu s-au găsit înregistrări de daune', sv: 'Inga skaderegistreringar hittades', el: 'Δεν βρέθηκαν αρχεία ζημιών', pt: 'Não foram encontrados registos de danos', hu: 'Nem találhatók kárbejegyzések', bg: 'Не са намерени записи за щети', sr: 'Нема пронађених записа о штети', da: 'Ingen skaderegistreringer fundet', no: 'Ingen skaderegistreringer funnet', fi: 'Vahinkotietoja ei löytynyt', sk: 'Nenašli sa žiadne záznamy o poškodení', hr: 'Nisu pronađeni zapisi o štetama', bs: 'Nisu pronađeni zapisi o štetama', sq: 'Nuk u gjetën regjistrime dëmtimesh', sl: 'Ni najdenih zapisov o škodi', lv: 'Nav atrasti bojājumu ieraksti', mk: 'Не се пронајдени записи за штети', et: 'Kahjustuskirjeid ei leitud', ca: 'No s\'han trobat registres de danys', lb: 'Keng Schuedrecorder fonnt', cnr: 'Nisu pronađeni zapisi o štetama', mt: 'Ma nstabu l-ebda rekords ta\' ħsara', is: 'Engar tjónaskrár fundust', tr: 'Hasar kaydı bulunamadı',
};

const MILEAGE_LABEL: TranslationMap = {
  lt: 'Rida', en: 'Mileage', de: 'Kilometerstand', pl: 'Przebieg', fr: 'Kilométrage', es: 'Kilometraje', it: 'Chilometraggio', nl: 'Kilometerstand', cs: 'Nájezd', uk: 'Пробіг', ro: 'Kilometraj', sv: 'Mätarställning', el: 'Χιλιόμετρα', pt: 'Quilometragem', hu: 'Kilométeróra', bg: 'Километраж', sr: 'Километража', da: 'Kilometerstand', no: 'Kilometerstand', fi: 'Mittarilukema', sk: 'Nájazd', hr: 'Kilometraža', bs: 'Kilometraža', sq: 'Kilometrazhi', sl: 'Prevoženi km', lv: 'Nobraukums', mk: 'Километража', et: 'Läbisõit', ca: 'Quilometratge', lb: 'Kilometerzuel', cnr: 'Kilometraža', mt: 'Kilometraġġ', is: 'Kílómetrar', tr: 'Kilometre',
};

const SampleReportModal: React.FC<SampleReportModalProps> = ({ open, onClose, t, lang }) => {
  const [showOriginalServiceTexts, setShowOriginalServiceTexts] = useState(false);

  if (!open) return null;

  const chartData = MILEAGE_HISTORY.filter((_, i) => i % 4 === 0 || i === MILEAGE_HISTORY.length - 1);

  const getServiceProvider = (key: string | null) => {
    if (!key) return null;
    return showOriginalServiceTexts ? SERVICE_PROVIDERS[key]?.en : (SERVICE_PROVIDERS[key]?.[lang] || SERVICE_PROVIDERS[key]?.en);
  };

  const getServiceAction = (actionKey: string) => {
    return showOriginalServiceTexts ? actionKey : (SERVICE_ACTIONS[actionKey]?.[lang] || SERVICE_ACTIONS[actionKey]?.en || actionKey);
  };

  const getFieldLabel = (key: string) => {
    return FIELD_LABELS[key]?.[lang] || FIELD_LABELS[key]?.en || key.replace(/_/g, ' ');
  };

  const analysis = AI_ANALYSIS[lang] || AI_ANALYSIS.en;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
          <div className="w-full md:w-auto">
            <div className="text-indigo-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{t.report.fullReport}</div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">2016 BMW 3 330 e</h2>
            <div className="flex items-center gap-2 mt-2 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span className="font-mono text-sm break-all">{SAMPLE_VIN}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span className="font-mono text-sm">{ORDER_LABEL[lang] || ORDER_LABEL.en} {SAMPLE_ORDER_ID}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400" />
              {t.report.theftClear}
            </div>
            <button
              type="button"
              onClick={() => setShowOriginalServiceTexts(!showOriginalServiceTexts)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                showOriginalServiceTexts
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
              }`}
              title={t.report.showOriginal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
              {showOriginalServiceTexts ? 'EN' : lang.toUpperCase()}
            </button>
            <button type="button" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title={t.report.downloadPdf}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </button>
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors ml-auto md:ml-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* Technical specs */}
          <div className="w-full px-6 sm:px-8 py-6 sm:py-8 border-b border-slate-100">
            <h4 className="text-slate-900 font-bold text-sm sm:text-base mb-4">{t.report.technicalSpecs}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {Object.entries(TECHNICAL_SPECS).map(([key, val]) => (
                <div key={key} className="flex justify-between py-3 border-b border-slate-200/50">
                  <span className="text-slate-500 text-xs sm:text-sm capitalize">{getFieldLabel(key)}</span>
                  <span className="text-slate-900 text-xs sm:text-sm font-semibold text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8 p-0 lg:p-8">
            <div className="lg:col-span-2 space-y-10 p-6 sm:p-8 lg:p-0">
              {/* Mileage */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-2-2"/></svg>
                    {t.report.mileageHistory}
                  </h3>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">{t.report.lastMileage} 201 986 km</span>
                </div>
                <div className="h-48 sm:h-64 w-full bg-slate-50 rounded-2xl p-2 sm:p-4 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }} formatter={(value: number) => [`${value.toLocaleString()} km`, MILEAGE_LABEL[lang] || MILEAGE_LABEL.en]} />
                      <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Service history */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
                  {t.report.serviceEvents}
                </h3>
                <div className="space-y-4">
                  {SERVICE_EVENTS.map((event, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-sm font-bold text-slate-800">{event.date}</span>
                        <span className="text-sm font-semibold text-indigo-600">{event.mileage.toLocaleString()} km</span>
                      </div>
                      {event.providerKey && <p className="text-xs sm:text-sm text-slate-600 mb-2">{getServiceProvider(event.providerKey)}</p>}
                      {event.type && <span className="inline-block px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">{event.type}</span>}
                      {event.actionKeys && event.actionKeys.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          {event.actionKeys.map((actionKey, i) => <li key={i}>{getServiceAction(actionKey)}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Damages */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12" y1="17" y2="17.01"/></svg>
                  {t.report.damages}
                </h3>
                <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-sm font-semibold text-emerald-800">{NO_DAMAGES[lang] || NO_DAMAGES.en}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="bg-slate-50 lg:bg-transparent p-6 sm:p-8 lg:p-0 space-y-8 border-t lg:border-t-0 border-slate-100">
              {/* Market value */}
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h4 className="text-indigo-900 font-bold mb-4 text-sm sm:text-base">{t.report.marketValue}</h4>
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-1">~{MARKET_VALUE.average.toLocaleString()} €</div>
                <p className="text-xs text-indigo-700/70 mb-6">{t.report.marketValueBased}</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] sm:text-xs uppercase font-bold tracking-wider">
                    <span className="text-indigo-900/40">{t.report.min}</span>
                    <span className="text-indigo-900/40">{t.report.max}</span>
                  </div>
                  <div className="w-full bg-indigo-200/50 h-2 rounded-full overflow-hidden"><div className="bg-indigo-600 h-full w-2/3 ml-[15%]"></div></div>
                  <div className="flex justify-between text-xs font-bold text-indigo-900">
                    <span>{MARKET_VALUE.min.toLocaleString()} €</span>
                    <span>{MARKET_VALUE.max.toLocaleString()} €</span>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
                <h4 className="font-bold mb-4 text-sm">{t.report.aiInsights}</h4>
                <div className="space-y-4 mb-4">
                  {analysis.problemAreas.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 mb-2">{t.report.problemAreas}</h5>
                      <ul className="space-y-1.5">
                        {analysis.problemAreas.map((item, i) => (
                          <li key={i} className="text-[13px] text-slate-300 flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.strongPoints.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/90 mb-2">{t.report.strongPoints}</h5>
                      <ul className="space-y-1.5">
                        {analysis.strongPoints.map((item, i) => (
                          <li key={i} className="text-[13px] text-slate-300 flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 transition-colors">{t.pricing.close}</button>
        </div>
      </div>
    </div>
  );
};

export default SampleReportModal;
