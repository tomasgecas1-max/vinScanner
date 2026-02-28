/**
 * Vertimai – visi vartotojui matomi tekstai.
 *
 * Kaip pridėti naują kalbą (pvz. 'de'):
 * 1. Pridėk 'de' į SUPPORTED_LANGUAGES masyvą
 * 2. Pridėk translationsMap['de'] = { ... } su visais vertimais (galima nukopijuoti iš 'en' ir išversti)
 * 3. Pridėk į ALL_LANGUAGES masyvą (jei dar ne)
 */

export const SUPPORTED_LANGUAGES = ['lt', 'en', 'de', 'pl', 'fr', 'es', 'it', 'nl', 'cs', 'uk', 'ro', 'sv', 'el', 'pt', 'hu', 'bg', 'sr', 'da', 'no', 'fi', 'sk', 'hr', 'bs', 'sq', 'sl', 'lv', 'mk', 'et', 'ca', 'lb', 'cnr', 'mt', 'is', 'tr'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGUAGES)[number];

const FALLBACK_LANG: SupportedLang = 'en';

/** Visos rodomos kalbos su vėliavėlėmis ir pavadinimais lietuviškai */
export const ALL_LANGUAGES = [
  { code: 'tr', flag: '🇹🇷', name: 'Turkų' },
  { code: 'de', flag: '🇩🇪', name: 'Vokiečių' },
  { code: 'en', flag: '🇬🇧', name: 'Anglų' },
  { code: 'fr', flag: '🇫🇷', name: 'Prancūzų' },
  { code: 'it', flag: '🇮🇹', name: 'Italų' },
  { code: 'es', flag: '🇪🇸', name: 'Ispanų' },
  { code: 'uk', flag: '🇺🇦', name: 'Ukrainiečių' },
  { code: 'pl', flag: '🇵🇱', name: 'Lenkų' },
  { code: 'ro', flag: '🇷🇴', name: 'Rumunų' },
  { code: 'nl', flag: '🇳🇱', name: 'Olandų' },
  { code: 'cs', flag: '🇨🇿', name: 'Čekų' },
  { code: 'sv', flag: '🇸🇪', name: 'Švedų' },
  { code: 'el', flag: '🇬🇷', name: 'Graikų' },
  { code: 'pt', flag: '🇵🇹', name: 'Portugalų' },
  { code: 'hu', flag: '🇭🇺', name: 'Vengrų' },
  { code: 'bg', flag: '🇧🇬', name: 'Bulgarų' },
  { code: 'sr', flag: '🇷🇸', name: 'Serbų' },
  { code: 'da', flag: '🇩🇰', name: 'Danų' },
  { code: 'no', flag: '🇳🇴', name: 'Norvegų' },
  { code: 'fi', flag: '🇫🇮', name: 'Suomių' },
  { code: 'sk', flag: '🇸🇰', name: 'Slovakų' },
  { code: 'hr', flag: '🇭🇷', name: 'Kroatų' },
  { code: 'bs', flag: '🇧🇦', name: 'Bosnių' },
  { code: 'lt', flag: '🇱🇹', name: 'Lietuvių' },
  { code: 'sq', flag: '🇦🇱', name: 'Albanų' },
  { code: 'sl', flag: '🇸🇮', name: 'Slovėnų' },
  { code: 'lv', flag: '🇱🇻', name: 'Latvių' },
  { code: 'mk', flag: '🇲🇰', name: 'Makedonų' },
  { code: 'et', flag: '🇪🇪', name: 'Estų' },
  { code: 'ca', flag: '🌐', name: 'Katalonų' },
  { code: 'lb', flag: '🇱🇺', name: 'Liuksemburgiečių' },
  { code: 'cnr', flag: '🇲🇪', name: 'Juodkalniečių' },
  { code: 'mt', flag: '🇲🇹', name: 'Maltiečių' },
  { code: 'is', flag: '🇮🇸', name: 'Islandų' },
] as const;

export type LangCode = (typeof ALL_LANGUAGES)[number]['code'];

export interface Translations {
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: {
    services: string;
    pricing: string;
    about: string;
    login: string;
    myReports: string;
    signOut: string;
    deleteAccount: string;
    deleteAccountConfirm: string;
    deleteAccountConfirmText: string;
    deleteAccountDeleting: string;
    deleteAccountError: string;
  };
  tokenMode: {
    banner: string;
    noReports: string;
    loading: string;
    error: string;
  };
  hero: {
    title: string;
    titleAccent: string;
    desc: string;
    placeholder: string;
    button: string;
    sample: string;
  };
  pricing: {
    title: string;
    desc: string;
    /** Fraze paryškinimui desc tekste (pvz. "nieko nekainuos"). Jei nustatyta – ji bus bold/indigo. */
    descHighlight?: string;
    bestValue: string;
    order: string;
    confirm: string;
    selectPlanForVin: string;
    refundPolicy: string;
    refundPolicyText: string;
    close: string;
    perReport: string;
    orderStepTitle: string;
    orderStepEmailLabel: string;
    orderStepEmailPlaceholder: string;
    orderStepAgreeTerms: string;
    orderStepAgreeBeforeTerms: string;
    orderStepTermsLink: string;
    orderStepAgreeBetween: string;
    orderStepPrivacyLink: string;
    orderStepTermsText: string;
    orderStepPrivacyText: string;
    orderStepContinue: string;
    paymentTitle: string;
    paymentOrderSummary: string;
    paymentPlan: string;
    paymentVin: string;
    paymentSubtotal: string;
    paymentDiscount: string;
    paymentTotal: string;
    paymentDiscountCode: string;
    paymentDiscountPlaceholder: string;
    paymentApply: string;
    paymentPay: string;
    paymentSecure: string;
    paymentCodeInvalid: string;
    paymentCodeApplied: string;
    paymentApiUnavailable: string;
    paymentFormLoading: string;
    paymentOrPayAnotherWay: string;
    paymentMethod: string;
    paymentCard: string;
    paymentLink: string;
    paymentApplePay: string;
    paymentEmail: string;
    paymentOr: string;
    paymentExpressCheckout: string;
    planSingle: string;
    planPopular: string;
    planBestValue: string;
    report1: string;
    reports2: string;
    reports3: string;
  };
  footer: {
    desc: string;
    privacyLink: string;
    termsLink: string;
    usageInstructionsLink: string;
  };
  about: {
    body: string;
    contactLabel: string;
  };
  loading: {
    steps: string[];
    ready: string;
    scanningHistory: string;
    secureConnection: string;
    sslEncryption: string;
  };
  errors: {
    historyNotFound: string;
    apiFailed: string;
    networkFailed: string;
  };
  features: {
    mileageHistory: string;
    mileageHistoryDesc: string;
    damageRecords: string;
    damageRecordsDesc: string;
    theftCheck: string;
    theftCheckDesc: string;
  };
  report: {
    fullReport: string;
    theftClear: string;
    theftFlagged: string;
    theftUnknown: string;
    theftUnknownTooltip: string;
    saveToCloud: string;
    downloadPdf: string;
    supplementTitle: string;
    supplementButton: string;
    supplementLoading: string;
    serviceHistoryNotFound: string;
    mileageHistory: string;
    lastMileage: string;
    serviceEvents: string;
    damages: string;
    damageLabel: string;
    severityHigh: string;
    severityMedium: string;
    marketValue: string;
    marketValueBased: string;
    min: string;
    max: string;
    technicalSpecs: string;
    fuelType: string;
    power: string;
    engine: string;
    transmission: string;
    bodyType: string;
    colour: string;
    aiInsights: string;
    aiInsightsDesc: string;
    analyzing: string;
    problemAreas: string;
    strongPoints: string;
      analyzeWithAI: string;
      refreshAnalysis: string;
      retryIn: string;
      aiAnalysisFailed: string;
    allApiSources: string;
      showRawData: string;
      show: string;
      hide: string;
    saveAsJson: string;
    rawDataUnavailable: string;
    yes: string;
    no: string;
    showOriginal: string;
    translatingServiceComments: string;
    serviceTranslationFailed: string;
  };
  myReports: {
    title: string;
    loading: string;
    noReports: string;
  };
  aiChat: {
    welcome: string;
    cantRespond: string;
    expertTitle: string;
    online: string;
    placeholder: string;
  };
}

const translationsMap: Record<SupportedLang, Translations> = {
  lt: {
    seo: {
      title: 'VinScanner - Automobilių istorijos patikra',
      description: 'Patikrinkite VIN kodą ir sužinokite automobilio istoriją: rida, avarijos, remontai, nuosavybės istorija. Greita ir patikima automobilių patikra.',
      ogTitle: 'VinScanner - Automobilių istorijos patikra',
      ogDescription: 'Patikrinkite VIN kodą ir sužinokite automobilio istoriją: rida, avarijos, remontai, nuosavybės istorija.',
    },
    nav: { services: 'Paslaugos', pricing: 'Kainos', about: 'Apie mus', login: 'Prisijungti', myReports: 'Mano ataskaitos', signOut: 'Atsijungti', deleteAccount: 'Ištrinti paskyrą', deleteAccountConfirm: 'Ištrinti paskyrą', deleteAccountConfirmText: 'Ar tikrai norite ištrinti paskyrą? Visi išsaugoti ataskaitos bus pašalinti. Šio veiksmo negalima atšaukti.', deleteAccountDeleting: 'Trinama…', deleteAccountError: 'Nepavyko ištrinti. Bandykite dar kartą.' },
    tokenMode: {
      banner: 'Turite {n} iš {total} ataskaitų. Įveskite VIN žemiau.',
      noReports: 'Neturite likusių ataskaitų. Norėdami patikrinti kitą automobilį, įsigykite naują planą.',
      loading: 'Kraunama…',
      error: 'Nepavyko užkrauti pirkimo. Patikrinkite nuorodą.',
    },
    hero: {
      title: 'Sužinokite automobilio istoriją',
      titleAccent: 'pagal VIN kodą',
      desc: 'Patikrinkite ridos istoriją, žalų įrašus ir rinkos vertę per kelias sekundes. Profesionali patikra prieinama kiekvienam.',
      placeholder: 'Įveskite VIN numerį...',
      button: 'Tikrinti',
      sample: 'Išbandyti su pavyzdžiu',
    },
    pricing: {
      title: 'Išsirinkite sau tinkamą planą',
      desc: 'Jei jūsų ataskaitose nebus rasta ridos fiksavimo duomenų, ši ataskaita nieko nekainuos – galėsite sugeneruoti papildomas ataskaitas už tą pačią sumokėtą sumą be jokių papildomų mokesčių.',
      descHighlight: 'nieko nekainuos',
      bestValue: 'Sutaupote daugiausiai',
      order: 'Užsakyti dabar',
      confirm: 'Patvirtinti',
      selectPlanForVin: 'Pasirinkite planą VIN patikrai',
      refundPolicy: 'Pinigų grąžinimo politika',
      perReport: 'Vienai atask.:',
      orderStepTitle: 'Įveskite el. paštą ataskaitoms',
      orderStepEmailLabel: 'El. paštas, kuriuo bus siunčiamos ataskaitos',
      orderStepEmailPlaceholder: 'pavyzdys@elpastas.lt',
      orderStepAgreeTerms: 'Sutinku su taisyklėmis ir perskaičiau privatumo politiką',
      orderStepAgreeBeforeTerms: 'Sutinku su ',
      orderStepTermsLink: 'taisyklėmis',
      orderStepAgreeBetween: ' ir perskaičiau ',
      orderStepPrivacyLink: 'privatumo politiką',
      orderStepTermsText: 'Čia bus rodomos paslaugų teikimo ir naudojimo taisyklės. Šis tekstas yra laikinas – galutinė versija bus pridėta vėliau.',
      orderStepPrivacyText: 'Čia bus rodoma privatumo politika: kaip renkame, saugome ir naudojame jūsų duomenis. Šis aprašymas yra laikinas – pilnas tekstas bus pridėtas vėliau.',
      orderStepContinue: 'Tęsti',
      paymentTitle: 'Mokėjimas',
      paymentOrderSummary: 'Užsakymo santrauka',
      paymentPlan: 'Planas',
      paymentVin: 'VIN',
      paymentSubtotal: 'Tarpinė suma',
      paymentDiscount: 'Nuolaida',
      paymentTotal: 'Iš viso',
      paymentDiscountCode: 'Nuolaidos kodas',
      paymentDiscountPlaceholder: 'Įveskite kodą',
      paymentApply: 'Taikyti',
      paymentPay: 'Mokėti',
      paymentSecure: 'Saugus mokėjimas',
      paymentCodeInvalid: 'Netinkamas nuolaidos kodas',
      paymentCodeApplied: 'Nuolaida taikoma',
      paymentApiUnavailable: 'Mokėjimo API nepasiekiamas. Lokaliai paleiskite: vercel dev (ne npm run dev).',
      paymentFormLoading: 'Ruošiama mokėjimo forma…',
      paymentOrPayAnotherWay: 'Arba mokėkite kitu būdu',
      paymentMethod: 'Mokėjimo būdas',
      paymentCard: 'Korta',
      paymentLink: 'Link',
      paymentApplePay: 'Apple Pay',
      paymentEmail: 'El. paštas',
      paymentOr: 'arba',
      paymentExpressCheckout: 'Express: Apple Pay, Google Pay (rodomi žemiau, kai įrenginyje palaikomi)',
      planSingle: 'Vienkartinė',
      planPopular: 'Populiariausias',
      planBestValue: 'Geriausia vertė',
      report1: '1 ataskaita',
      reports2: '2 ataskaitos',
      reports3: '3 ataskaitos',
      refundPolicyText: 'Naudotojas turi teisę per 30 dienų nuo įsigijimo dienos atsisakyti Paslaugų (Ataskaitų), pateikdamas prašymą el. paštu ir nurodydamas užsakymo numerį, užsakymo datą bei savo kontaktinius duomenis. Pinigai grąžinami per 14 dienų nuo prašymo gavimo.\n\nGrąžinimas netaikomas, jei ataskaita jau buvo panaudota transporto priemonės istorijai tikrinti arba jei iš įsigyto ataskaitų paketo buvo panaudota bent viena ataskaita.',
      close: 'Uždaryti',
    },
    footer: {
      desc: 'Patikimas automobilių istorijos šaltinis Europoje. Mūsų misija – skaidrumas kiekviename kilometre.',
      privacyLink: 'Privatumo politika',
      termsLink: 'Naudojimo taisyklės',
      usageInstructionsLink: 'Naudojimo instrukcija',
    },
    about: {
      body: 'Vinscanner.eu – patikima VIN ir automobilių istorijos patikra. Siūlome ataskaitas apie ridą, žalų įrašus ir rinkos vertę, kad galėtumėte įsigyti naudotą automobilį saugiai.',
      contactLabel: 'Susisiekite:',
    },
    loading: {
      steps: [
        'Jungiamasi prie tarptautinių duomenų bazių...',
        'Tikrinami ridos įrašai TA centruose...',
        'Analizuojamas žalų registras...',
        'Tikrinama Interpol vagysčių bazė...',
        'Generuojama išsami ataskaita...',
      ],
      ready: 'Paruošta!',
      scanningHistory: 'Skenuojama istorija',
      secureConnection: 'Saugus ryšys',
      sslEncryption: 'SSL Encryption Active',
    },
    errors: {
      historyNotFound: 'Istorija nebuvo rasta.',
      apiFailed: 'Duomenų nepavyko gauti iš API. Patikrinkite raktą ir ryšį.',
      networkFailed: 'Nepavyko gauti duomenų. Patikrinkite ryšį.',
    },
    features: {
      mileageHistory: 'Ridos Istorija',
      mileageHistoryDesc: 'Analizuojame duomenis iš visos Europos dilerių ir TA registrų.',
      damageRecords: 'Žalų Registras',
      damageRecordsDesc: 'Pateikiame detalią informaciją apie eismo įvykius.',
      theftCheck: 'Vagysčių Patikra',
      theftCheckDesc: 'Tikriname Interpol ir vietines policijos bazes.',
    },
    report: {
      fullReport: 'Pilna Ataskaita',
      theftClear: 'Nevogtas',
      theftFlagged: 'VOGTAS / IEŠKOMAS',
      theftUnknown: 'NEPATIKRINTA',
      theftUnknownTooltip: 'Vagystės patikra atliekama tik su UK valst. nr. (Experian AutoCheck)',
      saveToCloud: 'Išsaugoti ataskaitą į debesį',
      downloadPdf: 'Parsisiųsti ataskaitą kaip PDF',
      supplementTitle: 'Papildyti ataskaitą iš šaltinių:',
      supplementButton: 'Gauti duomenis',
      supplementLoading: 'Gaunama…',
      serviceHistoryNotFound: 'Serviso istorija nerasta – atsakymas negaunamas per nustatytą laiką. Ridos grafikas gali būti tuščias.',
      mileageHistory: 'Ridos Istorija (km)',
      lastMileage: 'Paskutinė rida:',
      serviceEvents: 'Serviso įrašai',
      damages: 'Užfiksuotos Žalos',
      damageLabel: 'Žala:',
      severityHigh: 'Didelė',
      severityMedium: 'Vidutinė',
      marketValue: 'Rinkos Vertė',
      marketValueBased: 'Remiantis panašių modelių pardavimais.',
      min: 'Min',
      max: 'Max',
      technicalSpecs: 'Techniniai Duomenys',
      fuelType: 'Kuras',
      power: 'Galia',
      engine: 'Variklis',
      transmission: 'Pavarų dėžė',
      bodyType: 'Kėbulas',
      colour: 'Spalva',
      aiInsights: 'AI įžvalgos',
      aiInsightsDesc: 'Pagal ataskaitos duomenis AI gali pažymėti galimas problemines vietas ir stipriąsias automobilio puses.',
      analyzing: 'Analizuojama…',
      problemAreas: 'Galimos problemos / rizikos',
      strongPoints: 'Stipriosios pusės',
      analyzeWithAI: 'Analizuoti su AI',
      refreshAnalysis: 'Atnaujinti AI analizę',
      retryIn: 'Bandyti vėl po',
      aiAnalysisFailed: 'Nepavyko gauti AI analizės.',
      allApiSources: 'Visi API šaltiniai',
      showRawData: 'Žemyn: visa informacija iš API (JSON)',
      show: 'Rodyti',
      hide: 'Slėpti',
      saveAsJson: 'Išsaugoti kaip JSON',
      rawDataUnavailable: 'API duomenys neprieinami',
      yes: 'Taip',
      no: 'Ne',
      showOriginal: 'Rodyti originalą',
      translatingServiceComments: 'Verčiami serviso komentarai…',
      serviceTranslationFailed: 'Nepavyko išversti serviso komentarų. Rodoma originali kalba.',
    },
    myReports: {
      title: 'Mano ataskaitos',
      loading: 'Kraunama...',
      noReports: 'Išsaugotų ataskaitų nėra.',
    },
    aiChat: {
      welcome: 'Sveiki! Aš esu VinSkaneris AI ekspertas. Kaip galiu padėti jums šiandien?',
      cantRespond: 'Atsiprašau, negaliu dabar atsakyti.',
      expertTitle: 'AI Ekspertas',
      online: 'Online',
      placeholder: 'Parašykite savo klausimą...',
    },
  },
  en: {
    seo: {
      title: 'VinScanner - Vehicle History Check',
      description: 'Check VIN code and discover vehicle history: mileage, accidents, repairs, ownership history. Fast and reliable car check.',
      ogTitle: 'VinScanner - Vehicle History Check',
      ogDescription: 'Check VIN code and discover vehicle history: mileage, accidents, repairs, ownership history.',
    },
    nav: { services: 'Services', pricing: 'Pricing', about: 'About Us', login: 'Login', myReports: 'My reports', signOut: 'Sign out', deleteAccount: 'Delete account', deleteAccountConfirm: 'Delete account', deleteAccountConfirmText: 'Are you sure you want to delete your account? All saved reports will be removed. This action cannot be undone.', deleteAccountDeleting: 'Deleting…', deleteAccountError: 'Failed to delete. Please try again.' },
    tokenMode: {
      banner: 'You have {n} of {total} reports left. Enter VIN below.',
      noReports: 'No reports remaining. Purchase a new plan to check another vehicle.',
      loading: 'Loading…',
      error: 'Failed to load purchase. Please check the link.',
    },
    hero: {
      title: 'Discover vehicle history',
      titleAccent: 'by VIN code',
      desc: 'Check mileage history, damage records, and market value in seconds. Professional verification available for everyone.',
      placeholder: 'Enter VIN number...',
      button: 'Check',
      sample: 'Try with a sample',
    },
    pricing: {
      title: 'Choose the right plan for you',
      desc: 'Save more by purchasing multiple checks at once. Professional reports will help you make the right decision.',
      bestValue: 'Best Value',
      order: 'Order Now',
      confirm: 'Confirm',
      selectPlanForVin: 'Select a plan for VIN check',
      refundPolicy: 'Refund Policy',
      perReport: 'Per report:',
      orderStepTitle: 'Enter email for your reports',
      orderStepEmailLabel: 'Email address where reports will be sent',
      orderStepEmailPlaceholder: 'example@email.com',
      orderStepAgreeTerms: 'I agree to the terms and have read the privacy policy',
      orderStepAgreeBeforeTerms: 'I agree to the ',
      orderStepTermsLink: 'terms',
      orderStepAgreeBetween: ' and have read the ',
      orderStepPrivacyLink: 'privacy policy',
      orderStepTermsText: 'Terms of service and use will be displayed here. This is a temporary placeholder – the final version will be added later.',
      orderStepPrivacyText: 'Privacy policy will be displayed here: how we collect, store and use your data. This description is temporary – the full text will be added later.',
      orderStepContinue: 'Continue',
      paymentTitle: 'Payment',
      paymentOrderSummary: 'Order summary',
      paymentPlan: 'Plan',
      paymentVin: 'VIN',
      paymentSubtotal: 'Subtotal',
      paymentDiscount: 'Discount',
      paymentTotal: 'Total',
      paymentDiscountCode: 'Discount code',
      paymentDiscountPlaceholder: 'Enter code',
      paymentApply: 'Apply',
      paymentPay: 'Pay',
      paymentSecure: 'Secure payment',
      paymentCodeInvalid: 'Invalid discount code',
      paymentCodeApplied: 'Discount applied',
      paymentApiUnavailable: 'Payment API unavailable. For local testing run: vercel dev (not npm run dev).',
      paymentFormLoading: 'Preparing payment form…',
      paymentOrPayAnotherWay: 'Or pay another way',
      paymentMethod: 'Payment method',
      paymentCard: 'Card',
      paymentLink: 'Link',
      paymentApplePay: 'Apple Pay',
      paymentEmail: 'Email',
      paymentOr: 'or',
      paymentExpressCheckout: 'Express: Apple Pay, Google Pay (shown below when supported on your device)',
      planSingle: 'Single',
      planPopular: 'Most Popular',
      planBestValue: 'Best Value',
      report1: '1 Report',
      reports2: '2 Reports',
      reports3: '3 Reports',
      refundPolicyText: 'The user has the right to withdraw from the Services (Reports) within 30 days of the purchase date by submitting a request by email, indicating the order number, order date and contact details. The refund is processed within 14 days of receiving the request.\n\nRefunds do not apply if the report has already been used to verify the vehicle history or if at least one report from the purchased report package has been used.',
      close: 'Close',
    },
    footer: {
      desc: 'A reliable source of car history in Europe. Our mission is transparency in every kilometer.',
      privacyLink: 'Privacy Policy',
      termsLink: 'Terms of Use',
      usageInstructionsLink: 'Usage instructions',
    },
    about: {
      body: 'Vinscanner.eu – reliable VIN and vehicle history checks. We provide reports on mileage, damage records and market value so you can buy a used car with confidence.',
      contactLabel: 'Contact us:',
    },
    loading: {
      steps: [
        'Connecting to international databases...',
        'Checking mileage records...',
        'Analyzing damage registry...',
        'Checking Interpol databases...',
        'Generating report...',
      ],
      ready: 'Ready!',
      scanningHistory: 'Scanning History',
      secureConnection: 'Secure Connection',
      sslEncryption: 'SSL Encryption Active',
    },
    errors: {
      historyNotFound: 'History was not found.',
      apiFailed: 'Failed to get data from API. Check key and connection.',
      networkFailed: 'Failed to retrieve data. Check connection.',
    },
    features: {
      mileageHistory: 'Mileage History',
      mileageHistoryDesc: 'Analyzing data from dealers and registries across Europe.',
      damageRecords: 'Damage Records',
      damageRecordsDesc: 'Detailed information about traffic accidents.',
      theftCheck: 'Theft Check',
      theftCheckDesc: 'Checking Interpol and local police databases.',
    },
    report: {
      fullReport: 'Full Report',
      theftClear: 'Not stolen',
      theftFlagged: 'STOLEN / WANTED',
      theftUnknown: 'NOT CHECKED',
      theftUnknownTooltip: 'Theft check is performed only with UK registration (Experian AutoCheck)',
      saveToCloud: 'Save report to cloud',
      downloadPdf: 'Download report as PDF',
      supplementTitle: 'Supplement report from sources:',
      supplementButton: 'Get data',
      supplementLoading: 'Fetching…',
      serviceHistoryNotFound: 'Service history not found – response not received in time. Mileage chart may be empty.',
      mileageHistory: 'Mileage History (km)',
      lastMileage: 'Last mileage:',
      serviceEvents: 'Service records',
      damages: 'Recorded damages',
      damageLabel: 'Damage:',
      severityHigh: 'High',
      severityMedium: 'Medium',
      marketValue: 'Market Value',
      marketValueBased: 'Based on similar models sales.',
      min: 'Min',
      max: 'Max',
      technicalSpecs: 'Technical Data',
      fuelType: 'Fuel',
      power: 'Power',
      engine: 'Engine',
      transmission: 'Transmission',
      bodyType: 'Body',
      colour: 'Colour',
      aiInsights: 'AI insights',
      aiInsightsDesc: "Based on the report data, AI can highlight possible problem areas and the vehicle's strong points.",
      analyzing: 'Analyzing…',
      problemAreas: 'Possible problems / risks',
      strongPoints: 'Strong points',
      analyzeWithAI: 'Analyze with AI',
      refreshAnalysis: 'Refresh AI analysis',
      retryIn: 'Retry in',
      aiAnalysisFailed: 'Failed to get AI analysis.',
      allApiSources: 'All API sources',
      showRawData: 'Down: full API information (JSON)',
      show: 'Show',
      hide: 'Hide',
      saveAsJson: 'Save as JSON',
      rawDataUnavailable: 'API data unavailable',
      yes: 'Yes',
      no: 'No',
      showOriginal: 'Show original',
      translatingServiceComments: 'Translating service comments…',
      serviceTranslationFailed: 'Failed to translate service comments. Showing original language.',
    },
    myReports: {
      title: 'My reports',
      loading: 'Loading...',
      noReports: 'No saved reports.',
    },
    aiChat: {
      welcome: 'Hello! I am VinScanner AI expert. How can I help you today?',
      cantRespond: "Sorry, I can't respond right now.",
      expertTitle: 'AI Expert',
      online: 'Online',
      placeholder: 'Type your question...',
    },
  },
  de: {
    seo: {
      title: 'VinScanner - Fahrzeughistorie prüfen',
      description: 'FIN-Code prüfen und Fahrzeughistorie entdecken: Kilometerstand, Unfälle, Reparaturen, Besitzerverlauf. Schnelle und zuverlässige Fahrzeugprüfung.',
      ogTitle: 'VinScanner - Fahrzeughistorie prüfen',
      ogDescription: 'FIN-Code prüfen und Fahrzeughistorie entdecken: Kilometerstand, Unfälle, Reparaturen, Besitzerverlauf.',
    },
    nav: { services: 'Leistungen', pricing: 'Preise', about: 'Über uns', login: 'Anmelden', myReports: 'Meine Berichte', signOut: 'Abmelden', deleteAccount: 'Konto löschen', deleteAccountConfirm: 'Konto löschen', deleteAccountConfirmText: 'Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Alle gespeicherten Berichte werden entfernt. Diese Aktion kann nicht rückgängig gemacht werden.', deleteAccountDeleting: 'Wird gelöscht…', deleteAccountError: 'Löschen fehlgeschlagen. Bitte versuchen Sie es erneut.' },
    tokenMode: {
      banner: 'Sie haben {n} von {total} Berichten übrig. FIN unten eingeben.',
      noReports: 'Keine Berichte übrig. Kaufen Sie einen neuen Plan für ein weiteres Fahrzeug.',
      loading: 'Laden…',
      error: 'Kauf konnte nicht geladen werden. Bitte prüfen Sie den Link.',
    },
    hero: {
      title: 'Fahrzeughistorie abrufen',
      titleAccent: 'per FIN-Code',
      desc: 'Prüfen Sie Kilometerstand, Schadenshistorie und Marktwert in Sekunden. Professionelle Verifizierung für jeden.',
      placeholder: 'FIN-Nummer eingeben...',
      button: 'Prüfen',
      sample: 'Mit Beispiel testen',
    },
    pricing: {
      title: 'Wählen Sie den richtigen Plan',
      desc: 'Sparen Sie, indem Sie mehrere Prüfungen auf einmal kaufen. Professionelle Berichte helfen bei der richtigen Entscheidung.',
      bestValue: 'Bester Wert',
      order: 'Jetzt bestellen',
      confirm: 'Bestätigen',
      selectPlanForVin: 'Wählen Sie einen Plan für die FIN-Prüfung',
      refundPolicy: 'Rückerstattungsrichtlinie',
      perReport: 'Pro Bericht:',
      orderStepTitle: 'E-Mail für Ihre Berichte eingeben',
      orderStepEmailLabel: 'E-Mail-Adresse, an die Berichte gesendet werden',
      orderStepEmailPlaceholder: 'beispiel@email.de',
      orderStepAgreeTerms: 'Ich stimme den AGB zu und habe die Datenschutzrichtlinie gelesen',
      orderStepAgreeBeforeTerms: 'Ich stimme den ',
      orderStepTermsLink: 'AGB',
      orderStepAgreeBetween: ' zu und habe die ',
      orderStepPrivacyLink: 'Datenschutzrichtlinie',
      orderStepTermsText: 'Hier werden die Nutzungsbedingungen angezeigt. Dies ist ein vorläufiger Platzhalter – die endgültige Version wird später ergänzt.',
      orderStepPrivacyText: 'Hier wird die Datenschutzrichtlinie angezeigt: wie wir Ihre Daten erheben, speichern und verwenden. Diese Beschreibung ist vorläufig – der vollständige Text wird später ergänzt.',
      orderStepContinue: 'Weiter',
      paymentTitle: 'Zahlung',
      paymentOrderSummary: 'Bestellübersicht',
      paymentPlan: 'Plan',
      paymentVin: 'FIN',
      paymentSubtotal: 'Zwischensumme',
      paymentDiscount: 'Rabatt',
      paymentTotal: 'Gesamt',
      paymentDiscountCode: 'Rabattcode',
      paymentDiscountPlaceholder: 'Code eingeben',
      paymentApply: 'Anwenden',
      paymentPay: 'Bezahlen',
      paymentSecure: 'Sichere Zahlung',
      paymentCodeInvalid: 'Ungültiger Rabattcode',
      paymentCodeApplied: 'Rabatt angewendet',
      paymentApiUnavailable: 'Zahlungs-API nicht erreichbar. Lokal bitte ausführen: vercel dev (nicht npm run dev).',
      paymentFormLoading: 'Zahlungsformular wird vorbereitet…',
      paymentOrPayAnotherWay: 'Oder anders bezahlen',
      paymentMethod: 'Zahlungsmethode',
      paymentCard: 'Karte',
      paymentLink: 'Link',
      paymentApplePay: 'Apple Pay',
      paymentEmail: 'E-Mail',
      paymentOr: 'oder',
      paymentExpressCheckout: 'Express: Apple Pay, Google Pay (unten angezeigt, wenn vom Gerät unterstützt)',
      planSingle: 'Einzeln',
      planPopular: 'Beliebteste',
      planBestValue: 'Bester Wert',
      report1: '1 Bericht',
      reports2: '2 Berichte',
      reports3: '3 Berichte',
      refundPolicyText: 'Der Nutzer hat das Recht, innerhalb von 30 Tagen ab dem Kaufdatum von den Leistungen (Berichten) zurückzutreten, indem er einen Antrag per E-Mail einreicht und die Bestellnummer, das Bestelldatum und seine Kontaktdaten angibt. Die Rückerstattung erfolgt innerhalb von 14 Tagen nach Erhalt des Antrags.\n\nRückerstattungen gelten nicht, wenn der Bericht bereits zur Überprüfung der Fahrzeughistorie verwendet wurde oder wenn mindestens ein Bericht aus dem gekauften Berichtspaket verwendet wurde.',
      close: 'Schließen',
    },
    footer: {
      desc: 'Eine zuverlässige Quelle für Fahrzeughistorie in Europa. Unsere Mission ist Transparenz bei jedem Kilometer.',
      privacyLink: 'Datenschutzrichtlinie',
      termsLink: 'Nutzungsbedingungen',
      usageInstructionsLink: 'Nutzungsanleitung',
    },
    about: {
      body: 'Vinscanner.eu – zuverlässige VIN- und Fahrzeughistorie-Prüfungen. Wir liefern Berichte zu Laufleistung, Schadenshistorie und Marktwert für einen sicheren Gebrauchtwagenkauf.',
      contactLabel: 'Kontakt:',
    },
    loading: {
      steps: [
        'Verbindung zu internationalen Datenbanken...',
        'Kilometerstand wird geprüft...',
        'Schadenregister wird analysiert...',
        'Interpol-Datenbank wird geprüft...',
        'Bericht wird erstellt...',
      ],
      ready: 'Fertig!',
      scanningHistory: 'Historie wird gescannt',
      secureConnection: 'Sichere Verbindung',
      sslEncryption: 'SSL-Verschlüsselung aktiv',
    },
    errors: {
      historyNotFound: 'Historie wurde nicht gefunden.',
      apiFailed: 'Daten konnten nicht von der API abgerufen werden. Prüfen Sie den Schlüssel und die Verbindung.',
      networkFailed: 'Daten konnten nicht abgerufen werden. Prüfen Sie die Verbindung.',
    },
    features: {
      mileageHistory: 'Kilometerstand',
      mileageHistoryDesc: 'Wir analysieren Daten von Händlern und Zulassungsstellen in ganz Europa.',
      damageRecords: 'Schadenregister',
      damageRecordsDesc: 'Detaillierte Informationen über Verkehrsunfälle.',
      theftCheck: 'Diebstahlprüfung',
      theftCheckDesc: 'Prüfung in Interpol- und lokalen Polizeidatenbanken.',
    },
    report: {
      fullReport: 'Vollständiger Bericht',
      theftClear: 'Nicht gestohlen',
      theftFlagged: 'GESTOHLEN / GESUCHT',
      theftUnknown: 'NICHT GEPRÜFT',
      theftUnknownTooltip: 'Diebstahlprüfung nur mit UK-Kennzeichen möglich (Experian AutoCheck)',
      saveToCloud: 'Bericht in Cloud speichern',
      downloadPdf: 'Bericht als PDF herunterladen',
      supplementTitle: 'Bericht aus Quellen ergänzen:',
      supplementButton: 'Daten abrufen',
      supplementLoading: 'Wird geladen…',
      serviceHistoryNotFound: 'Servicehistorie nicht gefunden – Antwort nicht rechtzeitig erhalten. Kilometerdiagramm kann leer sein.',
      mileageHistory: 'Kilometerstand (km)',
      lastMileage: 'Letzter Kilometerstand:',
      serviceEvents: 'Service-Einträge',
      damages: 'Erfasste Schäden',
      damageLabel: 'Schaden:',
      severityHigh: 'Hoch',
      severityMedium: 'Mittel',
      marketValue: 'Marktwert',
      marketValueBased: 'Basierend auf Verkäufen ähnlicher Modelle.',
      min: 'Min',
      max: 'Max',
      technicalSpecs: 'Technische Daten',
      fuelType: 'Kraftstoff',
      power: 'Leistung',
      engine: 'Motor',
      transmission: 'Getriebe',
      bodyType: 'Karosserie',
      colour: 'Farbe',
      aiInsights: 'KI-Einblicke',
      aiInsightsDesc: 'Basierend auf den Berichtsdaten kann die KI mögliche Problembereiche und Stärken des Fahrzeugs hervorheben.',
      analyzing: 'Wird analysiert…',
      problemAreas: 'Mögliche Probleme / Risiken',
      strongPoints: 'Stärken',
      analyzeWithAI: 'Mit KI analysieren',
      refreshAnalysis: 'KI-Analyse aktualisieren',
      retryIn: 'Erneut versuchen in',
      aiAnalysisFailed: 'KI-Analyse fehlgeschlagen.',
      allApiSources: 'Alle API-Quellen',
      showRawData: 'Vollständige API-Informationen (JSON)',
      show: 'Anzeigen',
      hide: 'Ausblenden',
      saveAsJson: 'Als JSON speichern',
      rawDataUnavailable: 'API-Daten nicht verfügbar',
      yes: 'Ja',
      no: 'Nein',
      showOriginal: 'Original anzeigen',
      translatingServiceComments: 'Service-Kommentare werden übersetzt…',
      serviceTranslationFailed: 'Service-Kommentare konnten nicht übersetzt werden. Originale Sprache wird angezeigt.',
    },
    myReports: {
      title: 'Meine Berichte',
      loading: 'Wird geladen...',
      noReports: 'Keine gespeicherten Berichte.',
    },
    aiChat: {
      welcome: 'Hallo! Ich bin der VinScanner KI-Experte. Wie kann ich Ihnen heute helfen?',
      cantRespond: 'Entschuldigung, ich kann gerade nicht antworten.',
      expertTitle: 'KI-Experte',
      online: 'Online',
      placeholder: 'Geben Sie Ihre Frage ein...',
    },
  },
  pl: {
    seo: {
      title: 'VinScanner - Sprawdź historię pojazdu',
      description: 'Sprawdź numer VIN i poznaj historię pojazdu: przebieg, wypadki, naprawy, historia właścicieli. Szybka i niezawodna weryfikacja samochodu.',
      ogTitle: 'VinScanner - Sprawdź historię pojazdu',
      ogDescription: 'Sprawdź numer VIN i poznaj historię pojazdu: przebieg, wypadki, naprawy, historia właścicieli.',
    },
    nav: { services: 'Usługi', pricing: 'Cennik', about: 'O nas', login: 'Zaloguj się', myReports: 'Moje raporty', signOut: 'Wyloguj się', deleteAccount: 'Usuń konto', deleteAccountConfirm: 'Usuń konto', deleteAccountConfirmText: 'Czy na pewno chcesz usunąć swoje konto? Wszystkie zapisane raporty zostaną usunięte. Tej operacji nie można cofnąć.', deleteAccountDeleting: 'Usuwanie…', deleteAccountError: 'Usunięcie nie powiodło się. Spróbuj ponownie.' },
    tokenMode: { banner: 'Masz {n} z {total} raportów. Wpisz VIN poniżej.', noReports: 'Brak pozostałych raportów. Kup nowy plan, aby sprawdzić kolejny pojazd.', loading: 'Ładowanie…', error: 'Nie udało się załadować zakupu. Sprawdź link.' },
    hero: { title: 'Poznaj historię pojazdu', titleAccent: 'według numeru VIN', desc: 'Sprawdź historię przebiegu, zapisy szkód i wartość rynkową w kilka sekund. Profesjonalna weryfikacja dostępna dla każdego.', placeholder: 'Wpisz numer VIN...', button: 'Sprawdź', sample: 'Wypróbuj z przykładem' },
    pricing: { title: 'Wybierz odpowiedni plan', desc: 'Oszczędzaj kupując wiele sprawdzeń naraz. Profesjonalne raporty pomogą podjąć właściwą decyzję.', bestValue: 'Najlepsza wartość', order: 'Zamów teraz', confirm: 'Potwierdź', selectPlanForVin: 'Wybierz plan do sprawdzenia VIN', refundPolicy: 'Polityka zwrotów', perReport: 'Za raport:', orderStepTitle: 'Podaj e-mail do raportów', orderStepEmailLabel: 'Adres e-mail, na który będą wysyłane raporty', orderStepEmailPlaceholder: 'przyklad@email.pl', orderStepAgreeTerms: 'Akceptuję regulamin i zapoznałem się z polityką prywatności', orderStepAgreeBeforeTerms: 'Akceptuję ', orderStepTermsLink: 'regulamin', orderStepAgreeBetween: ' i zapoznałem się z ', orderStepPrivacyLink: 'polityką prywatności', orderStepTermsText: 'Tutaj zostaną wyświetlone warunki korzystania z usług. To jest tymczasowy tekst – ostateczna wersja zostanie dodana później.', orderStepPrivacyText: 'Tutaj zostanie wyświetlona polityka prywatności: jak zbieramy, przechowujemy i wykorzystujemy Twoje dane. Ten opis jest tymczasowy – pełny tekst zostanie dodany później.', orderStepContinue: 'Kontynuuj', paymentTitle: 'Płatność', paymentOrderSummary: 'Podsumowanie zamówienia', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Suma częściowa', paymentDiscount: 'Rabat', paymentTotal: 'Razem', paymentDiscountCode: 'Kod rabatowy', paymentDiscountPlaceholder: 'Wpisz kod', paymentApply: 'Zastosuj', paymentPay: 'Zapłać', paymentSecure: 'Bezpieczna płatność', paymentCodeInvalid: 'Nieprawidłowy kod rabatowy', paymentCodeApplied: 'Rabat zastosowany', paymentApiUnavailable: 'API płatności niedostępne. Lokalnie uruchom: vercel dev (nie npm run dev).', paymentFormLoading: 'Przygotowywanie formularza płatności…', paymentOrPayAnotherWay: 'Lub zapłać inną metodą', paymentMethod: 'Metoda płatności', paymentCard: 'Karta', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'E-mail', paymentOr: 'lub', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (widoczne poniżej, gdy obsługiwane przez urządzenie)', planSingle: 'Pojedynczy', planPopular: 'Najpopularniejszy', planBestValue: 'Najlepsza wartość', report1: '1 Raport', reports2: '2 Raporty', reports3: '3 Raporty', refundPolicyText: 'Użytkownik ma prawo do odstąpienia od Usług (Raportów) w ciągu 30 dni od daty zakupu, składając wniosek e-mailem z podaniem numeru zamówienia, daty zamówienia i danych kontaktowych. Zwrot zostanie przetworzony w ciągu 14 dni od otrzymania wniosku.\n\nZwroty nie dotyczą przypadków, gdy raport został już wykorzystany do weryfikacji historii pojazdu lub gdy wykorzystano co najmniej jeden raport z zakupionego pakietu.', close: 'Zamknij' },
    footer: { desc: 'Wiarygodne źródło historii pojazdów w Europie. Naszą misją jest przejrzystość na każdym kilometrze.', privacyLink: 'Polityka prywatności', termsLink: 'Regulamin', usageInstructionsLink: 'Instrukcja obsługi' },
    about: { body: 'Vinscanner.eu – wiarygodne sprawdzanie VIN i historii pojazdów. Dostarczamy raporty o przebiegu, szkodach i wartości rynkowej, abyś mógł kupić używany samochód z pewnością.', contactLabel: 'Kontakt:' },
    loading: { steps: ['Łączenie z międzynarodowymi bazami danych...', 'Sprawdzanie zapisów przebiegu...', 'Analizowanie rejestru szkód...', 'Sprawdzanie baz Interpolu...', 'Generowanie raportu...'], ready: 'Gotowe!', scanningHistory: 'Skanowanie historii', secureConnection: 'Bezpieczne połączenie', sslEncryption: 'Szyfrowanie SSL aktywne' },
    errors: { historyNotFound: 'Historia nie została znaleziona.', apiFailed: 'Nie udało się pobrać danych z API. Sprawdź klucz i połączenie.', networkFailed: 'Nie udało się pobrać danych. Sprawdź połączenie.' },
    features: { mileageHistory: 'Historia przebiegu', mileageHistoryDesc: 'Analizujemy dane od dealerów i rejestrów w całej Europie.', damageRecords: 'Rejestr szkód', damageRecordsDesc: 'Szczegółowe informacje o wypadkach drogowych.', theftCheck: 'Sprawdzenie kradzieży', theftCheckDesc: 'Sprawdzamy bazy Interpolu i lokalnej policji.' },
    report: { fullReport: 'Pełny raport', theftClear: 'Nie kradziony', theftFlagged: 'KRADZIONY / POSZUKIWANY', theftUnknown: 'NIE SPRAWDZONO', theftUnknownTooltip: 'Sprawdzenie kradzieży tylko z rejestracją UK (Experian AutoCheck)', saveToCloud: 'Zapisz raport w chmurze', downloadPdf: 'Pobierz raport jako PDF', supplementTitle: 'Uzupełnij raport ze źródeł:', supplementButton: 'Pobierz dane', supplementLoading: 'Pobieranie…', serviceHistoryNotFound: 'Historia serwisowa nie znaleziona – odpowiedź nie otrzymana na czas. Wykres przebiegu może być pusty.', mileageHistory: 'Historia przebiegu (km)', lastMileage: 'Ostatni przebieg:', serviceEvents: 'Zapisy serwisowe', damages: 'Zarejestrowane szkody', damageLabel: 'Szkoda:', severityHigh: 'Wysoka', severityMedium: 'Średnia', marketValue: 'Wartość rynkowa', marketValueBased: 'Na podstawie sprzedaży podobnych modeli.', min: 'Min', max: 'Max', technicalSpecs: 'Dane techniczne', fuelType: 'Paliwo', power: 'Moc', engine: 'Silnik', transmission: 'Skrzynia biegów', bodyType: 'Nadwozie', colour: 'Kolor', aiInsights: 'Analiza AI', aiInsightsDesc: 'Na podstawie danych raportu AI może wskazać możliwe problemy i mocne strony pojazdu.', analyzing: 'Analizowanie…', problemAreas: 'Możliwe problemy / ryzyka', strongPoints: 'Mocne strony', analyzeWithAI: 'Analizuj z AI', refreshAnalysis: 'Odśwież analizę AI', retryIn: 'Ponów za', aiAnalysisFailed: 'Nie udało się uzyskać analizy AI.', allApiSources: 'Wszystkie źródła API', showRawData: 'Pełne informacje API (JSON)', show: 'Pokaż', hide: 'Ukryj', saveAsJson: 'Zapisz jako JSON', rawDataUnavailable: 'Dane API niedostępne', yes: 'Tak', no: 'Nie', showOriginal: 'Pokaż oryginał', translatingServiceComments: 'Tłumaczenie komentarzy serwisowych…', serviceTranslationFailed: 'Nie udało się przetłumaczyć komentarzy serwisowych. Wyświetlany oryginalny język.' },
    myReports: { title: 'Moje raporty', loading: 'Ładowanie...', noReports: 'Brak zapisanych raportów.' },
    aiChat: { welcome: 'Cześć! Jestem ekspertem AI VinScanner. Jak mogę Ci dzisiaj pomóc?', cantRespond: 'Przepraszam, nie mogę teraz odpowiedzieć.', expertTitle: 'Ekspert AI', online: 'Online', placeholder: 'Wpisz swoje pytanie...' },
  },
  fr: {
    seo: {
      title: 'VinScanner - Vérification historique véhicule',
      description: 'Vérifiez le code VIN et découvrez l\'historique du véhicule: kilométrage, accidents, réparations, historique de propriété. Vérification rapide et fiable.',
      ogTitle: 'VinScanner - Vérification historique véhicule',
      ogDescription: 'Vérifiez le code VIN et découvrez l\'historique du véhicule: kilométrage, accidents, réparations.',
    },
    nav: { services: 'Services', pricing: 'Tarifs', about: 'À propos', login: 'Connexion', myReports: 'Mes rapports', signOut: 'Déconnexion', deleteAccount: 'Supprimer le compte', deleteAccountConfirm: 'Supprimer le compte', deleteAccountConfirmText: 'Êtes-vous sûr de vouloir supprimer votre compte ? Tous les rapports enregistrés seront supprimés. Cette action est irréversible.', deleteAccountDeleting: 'Suppression…', deleteAccountError: 'Échec de la suppression. Veuillez réessayer.' },
    tokenMode: { banner: 'Vous avez {n} sur {total} rapports. Entrez le VIN ci-dessous.', noReports: 'Aucun rapport restant. Achetez un nouveau forfait pour vérifier un autre véhicule.', loading: 'Chargement…', error: 'Échec du chargement de l\'achat. Vérifiez le lien.' },
    hero: { title: 'Découvrez l\'historique du véhicule', titleAccent: 'par code VIN', desc: 'Vérifiez l\'historique du kilométrage, les dommages et la valeur marchande en quelques secondes. Vérification professionnelle accessible à tous.', placeholder: 'Entrez le numéro VIN...', button: 'Vérifier', sample: 'Essayer avec un exemple' },
    pricing: { title: 'Choisissez le forfait adapté', desc: 'Économisez en achetant plusieurs vérifications à la fois. Des rapports professionnels pour prendre la bonne décision.', bestValue: 'Meilleur rapport qualité-prix', order: 'Commander maintenant', confirm: 'Confirmer', selectPlanForVin: 'Sélectionnez un forfait pour la vérification VIN', refundPolicy: 'Politique de remboursement', perReport: 'Par rapport:', orderStepTitle: 'Entrez votre e-mail pour les rapports', orderStepEmailLabel: 'Adresse e-mail où les rapports seront envoyés', orderStepEmailPlaceholder: 'exemple@email.fr', orderStepAgreeTerms: 'J\'accepte les conditions et j\'ai lu la politique de confidentialité', orderStepAgreeBeforeTerms: 'J\'accepte les ', orderStepTermsLink: 'conditions', orderStepAgreeBetween: ' et j\'ai lu la ', orderStepPrivacyLink: 'politique de confidentialité', orderStepTermsText: 'Les conditions d\'utilisation seront affichées ici. Ceci est un texte temporaire – la version finale sera ajoutée ultérieurement.', orderStepPrivacyText: 'La politique de confidentialité sera affichée ici : comment nous collectons, stockons et utilisons vos données. Cette description est temporaire – le texte complet sera ajouté ultérieurement.', orderStepContinue: 'Continuer', paymentTitle: 'Paiement', paymentOrderSummary: 'Récapitulatif de commande', paymentPlan: 'Forfait', paymentVin: 'VIN', paymentSubtotal: 'Sous-total', paymentDiscount: 'Réduction', paymentTotal: 'Total', paymentDiscountCode: 'Code de réduction', paymentDiscountPlaceholder: 'Entrez le code', paymentApply: 'Appliquer', paymentPay: 'Payer', paymentSecure: 'Paiement sécurisé', paymentCodeInvalid: 'Code de réduction invalide', paymentCodeApplied: 'Réduction appliquée', paymentApiUnavailable: 'API de paiement indisponible. En local, exécutez : vercel dev (pas npm run dev).', paymentFormLoading: 'Préparation du formulaire de paiement…', paymentOrPayAnotherWay: 'Ou payer autrement', paymentMethod: 'Mode de paiement', paymentCard: 'Carte', paymentLink: 'Lien', paymentApplePay: 'Apple Pay', paymentEmail: 'E-mail', paymentOr: 'ou', paymentExpressCheckout: 'Express : Apple Pay, Google Pay (affichés ci-dessous si pris en charge)', planSingle: 'Unique', planPopular: 'Le plus populaire', planBestValue: 'Meilleur rapport', report1: '1 Rapport', reports2: '2 Rapports', reports3: '3 Rapports', refundPolicyText: 'L\'utilisateur a le droit de se rétracter des Services (Rapports) dans les 30 jours suivant la date d\'achat en soumettant une demande par e-mail avec le numéro de commande, la date et ses coordonnées. Le remboursement est traité dans les 14 jours suivant la réception de la demande.\n\nLes remboursements ne s\'appliquent pas si le rapport a déjà été utilisé pour vérifier l\'historique du véhicule ou si au moins un rapport du forfait a été utilisé.', close: 'Fermer' },
    footer: { desc: 'Source fiable d\'historique automobile en Europe. Notre mission : la transparence à chaque kilomètre.', privacyLink: 'Politique de confidentialité', termsLink: 'Conditions d\'utilisation', usageInstructionsLink: 'Instructions d\'utilisation' },
    about: { body: 'Vinscanner.eu – vérifications fiables du VIN et de l\'historique des véhicules. Nous fournissons des rapports sur le kilométrage, les dommages et la valeur marchande pour acheter une voiture d\'occasion en toute confiance.', contactLabel: 'Contactez-nous :' },
    loading: { steps: ['Connexion aux bases de données internationales...', 'Vérification des relevés kilométriques...', 'Analyse du registre des dommages...', 'Vérification des bases Interpol...', 'Génération du rapport...'], ready: 'Prêt !', scanningHistory: 'Analyse de l\'historique', secureConnection: 'Connexion sécurisée', sslEncryption: 'Chiffrement SSL actif' },
    errors: { historyNotFound: 'Historique non trouvé.', apiFailed: 'Échec de récupération des données API. Vérifiez la clé et la connexion.', networkFailed: 'Échec de récupération des données. Vérifiez la connexion.' },
    features: { mileageHistory: 'Historique kilométrique', mileageHistoryDesc: 'Analyse des données des concessionnaires et registres européens.', damageRecords: 'Registre des dommages', damageRecordsDesc: 'Informations détaillées sur les accidents de la route.', theftCheck: 'Vérification de vol', theftCheckDesc: 'Vérification dans les bases Interpol et de police locale.' },
    report: { fullReport: 'Rapport complet', theftClear: 'Non volé', theftFlagged: 'VOLÉ / RECHERCHÉ', theftUnknown: 'NON VÉRIFIÉ', theftUnknownTooltip: 'Vérification de vol uniquement avec immatriculation UK (Experian AutoCheck)', saveToCloud: 'Sauvegarder le rapport dans le cloud', downloadPdf: 'Télécharger le rapport en PDF', supplementTitle: 'Compléter le rapport depuis les sources :', supplementButton: 'Obtenir les données', supplementLoading: 'Récupération…', serviceHistoryNotFound: 'Historique de service non trouvé – réponse non reçue à temps. Le graphique kilométrique peut être vide.', mileageHistory: 'Historique kilométrique (km)', lastMileage: 'Dernier kilométrage :', serviceEvents: 'Enregistrements de service', damages: 'Dommages enregistrés', damageLabel: 'Dommage :', severityHigh: 'Élevé', severityMedium: 'Moyen', marketValue: 'Valeur marchande', marketValueBased: 'Basé sur les ventes de modèles similaires.', min: 'Min', max: 'Max', technicalSpecs: 'Données techniques', fuelType: 'Carburant', power: 'Puissance', engine: 'Moteur', transmission: 'Transmission', bodyType: 'Carrosserie', colour: 'Couleur', aiInsights: 'Analyse IA', aiInsightsDesc: 'Basé sur les données du rapport, l\'IA peut identifier les problèmes potentiels et les points forts du véhicule.', analyzing: 'Analyse en cours…', problemAreas: 'Problèmes / risques potentiels', strongPoints: 'Points forts', analyzeWithAI: 'Analyser avec l\'IA', refreshAnalysis: 'Actualiser l\'analyse IA', retryIn: 'Réessayer dans', aiAnalysisFailed: 'Échec de l\'analyse IA.', allApiSources: 'Toutes les sources API', showRawData: 'Informations API complètes (JSON)', show: 'Afficher', hide: 'Masquer', saveAsJson: 'Enregistrer en JSON', rawDataUnavailable: 'Données API indisponibles', yes: 'Oui', no: 'Non', showOriginal: 'Afficher l\'original', translatingServiceComments: 'Traduction des commentaires de service…', serviceTranslationFailed: 'Échec de la traduction. Langue originale affichée.' },
    myReports: { title: 'Mes rapports', loading: 'Chargement...', noReports: 'Aucun rapport enregistré.' },
    aiChat: { welcome: 'Bonjour ! Je suis l\'expert IA VinScanner. Comment puis-je vous aider aujourd\'hui ?', cantRespond: 'Désolé, je ne peux pas répondre pour le moment.', expertTitle: 'Expert IA', online: 'En ligne', placeholder: 'Tapez votre question...' },
  },
  es: {
    seo: {
      title: 'VinScanner - Verificación de historial de vehículo',
      description: 'Verifique el código VIN y descubra el historial del vehículo: kilometraje, accidentes, reparaciones, historial de propiedad. Verificación rápida y confiable.',
      ogTitle: 'VinScanner - Verificación de historial de vehículo',
      ogDescription: 'Verifique el código VIN y descubra el historial del vehículo: kilometraje, accidentes, reparaciones.',
    },
    nav: { services: 'Servicios', pricing: 'Precios', about: 'Sobre nosotros', login: 'Iniciar sesión', myReports: 'Mis informes', signOut: 'Cerrar sesión', deleteAccount: 'Eliminar cuenta', deleteAccountConfirm: 'Eliminar cuenta', deleteAccountConfirmText: '¿Está seguro de que desea eliminar su cuenta? Todos los informes guardados serán eliminados. Esta acción no se puede deshacer.', deleteAccountDeleting: 'Eliminando…', deleteAccountError: 'Error al eliminar. Inténtelo de nuevo.' },
    tokenMode: { banner: 'Tiene {n} de {total} informes. Ingrese el VIN abajo.', noReports: 'No quedan informes. Compre un nuevo plan para verificar otro vehículo.', loading: 'Cargando…', error: 'Error al cargar la compra. Verifique el enlace.' },
    hero: { title: 'Descubra el historial del vehículo', titleAccent: 'por código VIN', desc: 'Verifique el historial de kilometraje, registros de daños y valor de mercado en segundos. Verificación profesional disponible para todos.', placeholder: 'Ingrese el número VIN...', button: 'Verificar', sample: 'Probar con un ejemplo' },
    pricing: { title: 'Elija el plan adecuado', desc: 'Ahorre comprando múltiples verificaciones a la vez. Los informes profesionales le ayudarán a tomar la decisión correcta.', bestValue: 'Mejor valor', order: 'Ordenar ahora', confirm: 'Confirmar', selectPlanForVin: 'Seleccione un plan para la verificación VIN', refundPolicy: 'Política de reembolso', perReport: 'Por informe:', orderStepTitle: 'Ingrese su email para los informes', orderStepEmailLabel: 'Dirección de email donde se enviarán los informes', orderStepEmailPlaceholder: 'ejemplo@email.es', orderStepAgreeTerms: 'Acepto los términos y he leído la política de privacidad', orderStepAgreeBeforeTerms: 'Acepto los ', orderStepTermsLink: 'términos', orderStepAgreeBetween: ' y he leído la ', orderStepPrivacyLink: 'política de privacidad', orderStepTermsText: 'Los términos de servicio se mostrarán aquí. Este es un texto temporal – la versión final se añadirá más tarde.', orderStepPrivacyText: 'La política de privacidad se mostrará aquí: cómo recopilamos, almacenamos y usamos sus datos. Esta descripción es temporal – el texto completo se añadirá más tarde.', orderStepContinue: 'Continuar', paymentTitle: 'Pago', paymentOrderSummary: 'Resumen del pedido', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Subtotal', paymentDiscount: 'Descuento', paymentTotal: 'Total', paymentDiscountCode: 'Código de descuento', paymentDiscountPlaceholder: 'Ingrese el código', paymentApply: 'Aplicar', paymentPay: 'Pagar', paymentSecure: 'Pago seguro', paymentCodeInvalid: 'Código de descuento inválido', paymentCodeApplied: 'Descuento aplicado', paymentApiUnavailable: 'API de pago no disponible. Localmente ejecute: vercel dev (no npm run dev).', paymentFormLoading: 'Preparando formulario de pago…', paymentOrPayAnotherWay: 'O pague de otra forma', paymentMethod: 'Método de pago', paymentCard: 'Tarjeta', paymentLink: 'Enlace', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'o', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (mostrados abajo cuando sea compatible)', planSingle: 'Único', planPopular: 'Más popular', planBestValue: 'Mejor valor', report1: '1 Informe', reports2: '2 Informes', reports3: '3 Informes', refundPolicyText: 'El usuario tiene derecho a retirarse de los Servicios (Informes) dentro de los 30 días posteriores a la fecha de compra, enviando una solicitud por correo electrónico con el número de pedido, fecha y datos de contacto. El reembolso se procesa dentro de los 14 días de recibir la solicitud.\n\nLos reembolsos no aplican si el informe ya se usó para verificar el historial del vehículo o si se usó al menos un informe del paquete comprado.', close: 'Cerrar' },
    footer: { desc: 'Fuente confiable de historial de vehículos en Europa. Nuestra misión es la transparencia en cada kilómetro.', privacyLink: 'Política de privacidad', termsLink: 'Términos de uso', usageInstructionsLink: 'Instrucciones de uso' },
    about: { body: 'Vinscanner.eu – verificaciones confiables de VIN e historial de vehículos. Proporcionamos informes sobre kilometraje, daños y valor de mercado para que compre un auto usado con confianza.', contactLabel: 'Contáctenos:' },
    loading: { steps: ['Conectando a bases de datos internacionales...', 'Verificando registros de kilometraje...', 'Analizando registro de daños...', 'Verificando bases de Interpol...', 'Generando informe...'], ready: '¡Listo!', scanningHistory: 'Escaneando historial', secureConnection: 'Conexión segura', sslEncryption: 'Cifrado SSL activo' },
    errors: { historyNotFound: 'No se encontró historial.', apiFailed: 'Error al obtener datos de la API. Verifique la clave y la conexión.', networkFailed: 'Error al obtener datos. Verifique la conexión.' },
    features: { mileageHistory: 'Historial de kilometraje', mileageHistoryDesc: 'Analizamos datos de concesionarios y registros de toda Europa.', damageRecords: 'Registro de daños', damageRecordsDesc: 'Información detallada sobre accidentes de tráfico.', theftCheck: 'Verificación de robo', theftCheckDesc: 'Verificamos bases de Interpol y policía local.' },
    report: { fullReport: 'Informe completo', theftClear: 'No robado', theftFlagged: 'ROBADO / BUSCADO', theftUnknown: 'NO VERIFICADO', theftUnknownTooltip: 'Verificación de robo solo con matrícula UK (Experian AutoCheck)', saveToCloud: 'Guardar informe en la nube', downloadPdf: 'Descargar informe como PDF', supplementTitle: 'Complementar informe desde fuentes:', supplementButton: 'Obtener datos', supplementLoading: 'Obteniendo…', serviceHistoryNotFound: 'Historial de servicio no encontrado – respuesta no recibida a tiempo. El gráfico de kilometraje puede estar vacío.', mileageHistory: 'Historial de kilometraje (km)', lastMileage: 'Último kilometraje:', serviceEvents: 'Registros de servicio', damages: 'Daños registrados', damageLabel: 'Daño:', severityHigh: 'Alto', severityMedium: 'Medio', marketValue: 'Valor de mercado', marketValueBased: 'Basado en ventas de modelos similares.', min: 'Mín', max: 'Máx', technicalSpecs: 'Datos técnicos', fuelType: 'Combustible', power: 'Potencia', engine: 'Motor', transmission: 'Transmisión', bodyType: 'Carrocería', colour: 'Color', aiInsights: 'Análisis IA', aiInsightsDesc: 'Basado en los datos del informe, la IA puede identificar posibles problemas y puntos fuertes del vehículo.', analyzing: 'Analizando…', problemAreas: 'Posibles problemas / riesgos', strongPoints: 'Puntos fuertes', analyzeWithAI: 'Analizar con IA', refreshAnalysis: 'Actualizar análisis IA', retryIn: 'Reintentar en', aiAnalysisFailed: 'Error al obtener análisis IA.', allApiSources: 'Todas las fuentes API', showRawData: 'Información API completa (JSON)', show: 'Mostrar', hide: 'Ocultar', saveAsJson: 'Guardar como JSON', rawDataUnavailable: 'Datos API no disponibles', yes: 'Sí', no: 'No', showOriginal: 'Mostrar original', translatingServiceComments: 'Traduciendo comentarios de servicio…', serviceTranslationFailed: 'Error al traducir comentarios. Se muestra el idioma original.' },
    myReports: { title: 'Mis informes', loading: 'Cargando...', noReports: 'No hay informes guardados.' },
    aiChat: { welcome: '¡Hola! Soy el experto IA de VinScanner. ¿Cómo puedo ayudarte hoy?', cantRespond: 'Lo siento, no puedo responder ahora.', expertTitle: 'Experto IA', online: 'En línea', placeholder: 'Escriba su pregunta...' },
  },
  it: {
    seo: {
      title: 'VinScanner - Verifica storico veicolo',
      description: 'Verifica il codice VIN e scopri lo storico del veicolo: chilometraggio, incidenti, riparazioni, storico proprietari. Verifica rapida e affidabile.',
      ogTitle: 'VinScanner - Verifica storico veicolo',
      ogDescription: 'Verifica il codice VIN e scopri lo storico del veicolo: chilometraggio, incidenti, riparazioni.',
    },
    nav: { services: 'Servizi', pricing: 'Prezzi', about: 'Chi siamo', login: 'Accedi', myReports: 'I miei report', signOut: 'Esci', deleteAccount: 'Elimina account', deleteAccountConfirm: 'Elimina account', deleteAccountConfirmText: 'Sei sicuro di voler eliminare il tuo account? Tutti i report salvati verranno rimossi. Questa azione non può essere annullata.', deleteAccountDeleting: 'Eliminazione…', deleteAccountError: 'Eliminazione fallita. Riprova.' },
    tokenMode: { banner: 'Hai {n} di {total} report. Inserisci il VIN qui sotto.', noReports: 'Nessun report rimanente. Acquista un nuovo piano per verificare un altro veicolo.', loading: 'Caricamento…', error: 'Impossibile caricare l\'acquisto. Controlla il link.' },
    hero: { title: 'Scopri la storia del veicolo', titleAccent: 'tramite codice VIN', desc: 'Verifica lo storico chilometrico, i danni e il valore di mercato in pochi secondi. Verifica professionale accessibile a tutti.', placeholder: 'Inserisci il numero VIN...', button: 'Verifica', sample: 'Prova con un esempio' },
    pricing: { title: 'Scegli il piano giusto', desc: 'Risparmia acquistando più verifiche insieme. Report professionali per prendere la decisione giusta.', bestValue: 'Miglior valore', order: 'Ordina ora', confirm: 'Conferma', selectPlanForVin: 'Seleziona un piano per la verifica VIN', refundPolicy: 'Politica di rimborso', perReport: 'Per report:', orderStepTitle: 'Inserisci l\'email per i report', orderStepEmailLabel: 'Indirizzo email dove verranno inviati i report', orderStepEmailPlaceholder: 'esempio@email.it', orderStepAgreeTerms: 'Accetto i termini e ho letto l\'informativa sulla privacy', orderStepAgreeBeforeTerms: 'Accetto i ', orderStepTermsLink: 'termini', orderStepAgreeBetween: ' e ho letto l\'', orderStepPrivacyLink: 'informativa sulla privacy', orderStepTermsText: 'I termini di servizio verranno visualizzati qui. Questo è un testo provvisorio – la versione finale verrà aggiunta in seguito.', orderStepPrivacyText: 'L\'informativa sulla privacy verrà visualizzata qui: come raccogliamo, conserviamo e utilizziamo i tuoi dati. Questa descrizione è provvisoria – il testo completo verrà aggiunto in seguito.', orderStepContinue: 'Continua', paymentTitle: 'Pagamento', paymentOrderSummary: 'Riepilogo ordine', paymentPlan: 'Piano', paymentVin: 'VIN', paymentSubtotal: 'Subtotale', paymentDiscount: 'Sconto', paymentTotal: 'Totale', paymentDiscountCode: 'Codice sconto', paymentDiscountPlaceholder: 'Inserisci il codice', paymentApply: 'Applica', paymentPay: 'Paga', paymentSecure: 'Pagamento sicuro', paymentCodeInvalid: 'Codice sconto non valido', paymentCodeApplied: 'Sconto applicato', paymentApiUnavailable: 'API di pagamento non disponibile. In locale esegui: vercel dev (non npm run dev).', paymentFormLoading: 'Preparazione modulo di pagamento…', paymentOrPayAnotherWay: 'O paga in altro modo', paymentMethod: 'Metodo di pagamento', paymentCard: 'Carta', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'o', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (mostrati sotto se supportati)', planSingle: 'Singolo', planPopular: 'Più popolare', planBestValue: 'Miglior valore', report1: '1 Report', reports2: '2 Report', reports3: '3 Report', refundPolicyText: 'L\'utente ha il diritto di recedere dai Servizi (Report) entro 30 giorni dalla data di acquisto, inviando una richiesta via email con numero ordine, data e dati di contatto. Il rimborso viene elaborato entro 14 giorni dalla ricezione della richiesta.\n\nI rimborsi non si applicano se il report è già stato utilizzato per verificare lo storico del veicolo o se è stato utilizzato almeno un report del pacchetto acquistato.', close: 'Chiudi' },
    footer: { desc: 'Fonte affidabile di storia dei veicoli in Europa. La nostra missione è la trasparenza in ogni chilometro.', privacyLink: 'Informativa sulla privacy', termsLink: 'Termini di utilizzo', usageInstructionsLink: 'Istruzioni per l\'uso' },
    about: { body: 'Vinscanner.eu – verifiche affidabili di VIN e storia dei veicoli. Forniamo report su chilometraggio, danni e valore di mercato per acquistare un\'auto usata con sicurezza.', contactLabel: 'Contattaci:' },
    loading: { steps: ['Connessione ai database internazionali...', 'Verifica dei registri chilometrici...', 'Analisi del registro danni...', 'Verifica database Interpol...', 'Generazione del report...'], ready: 'Pronto!', scanningHistory: 'Scansione dello storico', secureConnection: 'Connessione sicura', sslEncryption: 'Crittografia SSL attiva' },
    errors: { historyNotFound: 'Storico non trovato.', apiFailed: 'Impossibile ottenere dati dall\'API. Controlla la chiave e la connessione.', networkFailed: 'Impossibile ottenere dati. Controlla la connessione.' },
    features: { mileageHistory: 'Storico chilometrico', mileageHistoryDesc: 'Analizziamo i dati di concessionari e registri in tutta Europa.', damageRecords: 'Registro danni', damageRecordsDesc: 'Informazioni dettagliate sugli incidenti stradali.', theftCheck: 'Verifica furto', theftCheckDesc: 'Verifichiamo i database Interpol e della polizia locale.' },
    report: { fullReport: 'Report completo', theftClear: 'Non rubato', theftFlagged: 'RUBATO / RICERCATO', theftUnknown: 'NON VERIFICATO', theftUnknownTooltip: 'Verifica furto solo con targa UK (Experian AutoCheck)', saveToCloud: 'Salva report nel cloud', downloadPdf: 'Scarica report come PDF', supplementTitle: 'Completa report dalle fonti:', supplementButton: 'Ottieni dati', supplementLoading: 'Recupero…', serviceHistoryNotFound: 'Storico servizi non trovato – risposta non ricevuta in tempo. Il grafico chilometrico potrebbe essere vuoto.', mileageHistory: 'Storico chilometrico (km)', lastMileage: 'Ultimo chilometraggio:', serviceEvents: 'Registri di servizio', damages: 'Danni registrati', damageLabel: 'Danno:', severityHigh: 'Alto', severityMedium: 'Medio', marketValue: 'Valore di mercato', marketValueBased: 'Basato sulle vendite di modelli simili.', min: 'Min', max: 'Max', technicalSpecs: 'Dati tecnici', fuelType: 'Carburante', power: 'Potenza', engine: 'Motore', transmission: 'Trasmissione', bodyType: 'Carrozzeria', colour: 'Colore', aiInsights: 'Analisi IA', aiInsightsDesc: 'In base ai dati del report, l\'IA può identificare possibili problemi e punti di forza del veicolo.', analyzing: 'Analisi in corso…', problemAreas: 'Possibili problemi / rischi', strongPoints: 'Punti di forza', analyzeWithAI: 'Analizza con IA', refreshAnalysis: 'Aggiorna analisi IA', retryIn: 'Riprova tra', aiAnalysisFailed: 'Impossibile ottenere l\'analisi IA.', allApiSources: 'Tutte le fonti API', showRawData: 'Informazioni API complete (JSON)', show: 'Mostra', hide: 'Nascondi', saveAsJson: 'Salva come JSON', rawDataUnavailable: 'Dati API non disponibili', yes: 'Sì', no: 'No', showOriginal: 'Mostra originale', translatingServiceComments: 'Traduzione commenti di servizio…', serviceTranslationFailed: 'Traduzione fallita. Viene mostrata la lingua originale.' },
    myReports: { title: 'I miei report', loading: 'Caricamento...', noReports: 'Nessun report salvato.' },
    aiChat: { welcome: 'Ciao! Sono l\'esperto IA di VinScanner. Come posso aiutarti oggi?', cantRespond: 'Mi dispiace, non posso rispondere ora.', expertTitle: 'Esperto IA', online: 'Online', placeholder: 'Scrivi la tua domanda...' },
  },
  nl: {
    seo: {
      title: 'VinScanner - Voertuiggeschiedenis controleren',
      description: 'Controleer de VIN-code en ontdek de voertuiggeschiedenis: kilometerstand, ongevallen, reparaties, eigendomsgeschiedenis. Snelle en betrouwbare controle.',
      ogTitle: 'VinScanner - Voertuiggeschiedenis controleren',
      ogDescription: 'Controleer de VIN-code en ontdek de voertuiggeschiedenis: kilometerstand, ongevallen, reparaties.',
    },
    nav: { services: 'Diensten', pricing: 'Prijzen', about: 'Over ons', login: 'Inloggen', myReports: 'Mijn rapporten', signOut: 'Uitloggen', deleteAccount: 'Account verwijderen', deleteAccountConfirm: 'Account verwijderen', deleteAccountConfirmText: 'Weet u zeker dat u uw account wilt verwijderen? Alle opgeslagen rapporten worden verwijderd. Deze actie kan niet ongedaan worden gemaakt.', deleteAccountDeleting: 'Verwijderen…', deleteAccountError: 'Verwijderen mislukt. Probeer opnieuw.' },
    tokenMode: { banner: 'U heeft {n} van {total} rapporten. Voer hieronder het VIN in.', noReports: 'Geen rapporten meer. Koop een nieuw plan om een ander voertuig te controleren.', loading: 'Laden…', error: 'Kan aankoop niet laden. Controleer de link.' },
    hero: { title: 'Ontdek de voertuiggeschiedenis', titleAccent: 'via VIN-code', desc: 'Controleer kilometerstand, schaderegistratie en marktwaarde in seconden. Professionele verificatie voor iedereen beschikbaar.', placeholder: 'Voer VIN-nummer in...', button: 'Controleren', sample: 'Probeer met een voorbeeld' },
    pricing: { title: 'Kies het juiste plan', desc: 'Bespaar door meerdere controles tegelijk te kopen. Professionele rapporten helpen bij de juiste beslissing.', bestValue: 'Beste waarde', order: 'Nu bestellen', confirm: 'Bevestigen', selectPlanForVin: 'Selecteer een plan voor VIN-controle', refundPolicy: 'Terugbetalingsbeleid', perReport: 'Per rapport:', orderStepTitle: 'Voer e-mail in voor uw rapporten', orderStepEmailLabel: 'E-mailadres waar rapporten naartoe worden gestuurd', orderStepEmailPlaceholder: 'voorbeeld@email.nl', orderStepAgreeTerms: 'Ik ga akkoord met de voorwaarden en heb het privacybeleid gelezen', orderStepAgreeBeforeTerms: 'Ik ga akkoord met de ', orderStepTermsLink: 'voorwaarden', orderStepAgreeBetween: ' en heb het ', orderStepPrivacyLink: 'privacybeleid', orderStepTermsText: 'De servicevoorwaarden worden hier weergegeven. Dit is tijdelijke tekst – de definitieve versie wordt later toegevoegd.', orderStepPrivacyText: 'Het privacybeleid wordt hier weergegeven: hoe we uw gegevens verzamelen, opslaan en gebruiken. Deze beschrijving is tijdelijk – de volledige tekst wordt later toegevoegd.', orderStepContinue: 'Doorgaan', paymentTitle: 'Betaling', paymentOrderSummary: 'Besteloverzicht', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Subtotaal', paymentDiscount: 'Korting', paymentTotal: 'Totaal', paymentDiscountCode: 'Kortingscode', paymentDiscountPlaceholder: 'Voer code in', paymentApply: 'Toepassen', paymentPay: 'Betalen', paymentSecure: 'Veilige betaling', paymentCodeInvalid: 'Ongeldige kortingscode', paymentCodeApplied: 'Korting toegepast', paymentApiUnavailable: 'Betalings-API niet beschikbaar. Lokaal uitvoeren: vercel dev (niet npm run dev).', paymentFormLoading: 'Betalingsformulier voorbereiden…', paymentOrPayAnotherWay: 'Of betaal op een andere manier', paymentMethod: 'Betaalmethode', paymentCard: 'Kaart', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'E-mail', paymentOr: 'of', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (hieronder getoond indien ondersteund)', planSingle: 'Enkel', planPopular: 'Populairst', planBestValue: 'Beste waarde', report1: '1 Rapport', reports2: '2 Rapporten', reports3: '3 Rapporten', refundPolicyText: 'De gebruiker heeft het recht om zich binnen 30 dagen na aankoopdatum terug te trekken van de Diensten (Rapporten) door een verzoek per e-mail in te dienen met ordernummer, datum en contactgegevens. De terugbetaling wordt binnen 14 dagen na ontvangst van het verzoek verwerkt.\n\nTerugbetalingen zijn niet van toepassing als het rapport al is gebruikt om de voertuiggeschiedenis te verifiëren of als er minstens één rapport uit het gekochte pakket is gebruikt.', close: 'Sluiten' },
    footer: { desc: 'Betrouwbare bron van voertuiggeschiedenis in Europa. Onze missie is transparantie bij elke kilometer.', privacyLink: 'Privacybeleid', termsLink: 'Gebruiksvoorwaarden', usageInstructionsLink: 'Gebruiksinstructies' },
    about: { body: 'Vinscanner.eu – betrouwbare VIN- en voertuiggeschiedeniscontroles. Wij leveren rapporten over kilometerstand, schade en marktwaarde zodat u met vertrouwen een gebruikte auto kunt kopen.', contactLabel: 'Neem contact op:' },
    loading: { steps: ['Verbinden met internationale databases...', 'Kilometergegevens controleren...', 'Schaderegister analyseren...', 'Interpol-databases controleren...', 'Rapport genereren...'], ready: 'Klaar!', scanningHistory: 'Geschiedenis scannen', secureConnection: 'Veilige verbinding', sslEncryption: 'SSL-versleuteling actief' },
    errors: { historyNotFound: 'Geschiedenis niet gevonden.', apiFailed: 'Kan geen gegevens ophalen van API. Controleer sleutel en verbinding.', networkFailed: 'Kan geen gegevens ophalen. Controleer verbinding.' },
    features: { mileageHistory: 'Kilometergeschiedenis', mileageHistoryDesc: 'Wij analyseren gegevens van dealers en registers in heel Europa.', damageRecords: 'Schaderegister', damageRecordsDesc: 'Gedetailleerde informatie over verkeersongevallen.', theftCheck: 'Diefstalcontrole', theftCheckDesc: 'We controleren Interpol en lokale politiedatabases.' },
    report: { fullReport: 'Volledig rapport', theftClear: 'Niet gestolen', theftFlagged: 'GESTOLEN / GEZOCHT', theftUnknown: 'NIET GECONTROLEERD', theftUnknownTooltip: 'Diefstalcontrole alleen met UK-kenteken (Experian AutoCheck)', saveToCloud: 'Rapport opslaan in cloud', downloadPdf: 'Rapport downloaden als PDF', supplementTitle: 'Rapport aanvullen uit bronnen:', supplementButton: 'Gegevens ophalen', supplementLoading: 'Ophalen…', serviceHistoryNotFound: 'Servicegeschiedenis niet gevonden – antwoord niet op tijd ontvangen. Kilometergrafiek kan leeg zijn.', mileageHistory: 'Kilometergeschiedenis (km)', lastMileage: 'Laatste kilometerstand:', serviceEvents: 'Serviceregistraties', damages: 'Geregistreerde schade', damageLabel: 'Schade:', severityHigh: 'Hoog', severityMedium: 'Gemiddeld', marketValue: 'Marktwaarde', marketValueBased: 'Gebaseerd op verkopen van vergelijkbare modellen.', min: 'Min', max: 'Max', technicalSpecs: 'Technische gegevens', fuelType: 'Brandstof', power: 'Vermogen', engine: 'Motor', transmission: 'Transmissie', bodyType: 'Carrosserie', colour: 'Kleur', aiInsights: 'AI-analyse', aiInsightsDesc: 'Op basis van de rapportgegevens kan AI mogelijke problemen en sterke punten van het voertuig identificeren.', analyzing: 'Analyseren…', problemAreas: 'Mogelijke problemen / risico\'s', strongPoints: 'Sterke punten', analyzeWithAI: 'Analyseren met AI', refreshAnalysis: 'AI-analyse vernieuwen', retryIn: 'Opnieuw proberen over', aiAnalysisFailed: 'Kan AI-analyse niet ophalen.', allApiSources: 'Alle API-bronnen', showRawData: 'Volledige API-informatie (JSON)', show: 'Tonen', hide: 'Verbergen', saveAsJson: 'Opslaan als JSON', rawDataUnavailable: 'API-gegevens niet beschikbaar', yes: 'Ja', no: 'Nee', showOriginal: 'Origineel tonen', translatingServiceComments: 'Servicecommentaar vertalen…', serviceTranslationFailed: 'Vertaling mislukt. Originele taal wordt getoond.' },
    myReports: { title: 'Mijn rapporten', loading: 'Laden...', noReports: 'Geen opgeslagen rapporten.' },
    aiChat: { welcome: 'Hallo! Ik ben de VinScanner AI-expert. Hoe kan ik u vandaag helpen?', cantRespond: 'Sorry, ik kan nu niet reageren.', expertTitle: 'AI-expert', online: 'Online', placeholder: 'Typ uw vraag...' },
  },
  cs: {
    seo: {
      title: 'VinScanner - Kontrola historie vozidla',
      description: 'Zkontrolujte VIN kód a zjistěte historii vozidla: kilometry, nehody, opravy, historie vlastníků. Rychlá a spolehlivá kontrola vozidla.',
      ogTitle: 'VinScanner - Kontrola historie vozidla',
      ogDescription: 'Zkontrolujte VIN kód a zjistěte historii vozidla: kilometry, nehody, opravy, historie vlastníků.',
    },
    nav: { services: 'Služby', pricing: 'Ceník', about: 'O nás', login: 'Přihlásit se', myReports: 'Moje reporty', signOut: 'Odhlásit se', deleteAccount: 'Smazat účet', deleteAccountConfirm: 'Smazat účet', deleteAccountConfirmText: 'Opravdu chcete smazat svůj účet? Všechny uložené reporty budou odstraněny. Tuto akci nelze vrátit.', deleteAccountDeleting: 'Mazání…', deleteAccountError: 'Smazání se nezdařilo. Zkuste to znovu.' },
    tokenMode: { banner: 'Máte {n} z {total} reportů. Zadejte VIN níže.', noReports: 'Žádné zbývající reporty. Kupte si nový plán pro kontrolu dalšího vozidla.', loading: 'Načítání…', error: 'Nepodařilo se načíst nákup. Zkontrolujte odkaz.' },
    hero: { title: 'Zjistěte historii vozidla', titleAccent: 'podle VIN kódu', desc: 'Zkontrolujte historii kilometrů, záznamy o poškození a tržní hodnotu během několika sekund. Profesionální ověření dostupné pro každého.', placeholder: 'Zadejte číslo VIN...', button: 'Zkontrolovat', sample: 'Vyzkoušet s příkladem' },
    pricing: { title: 'Vyberte si správný plán', desc: 'Ušetřete nákupem více kontrol najednou. Profesionální reporty vám pomohou učinit správné rozhodnutí.', bestValue: 'Nejlepší hodnota', order: 'Objednat nyní', confirm: 'Potvrdit', selectPlanForVin: 'Vyberte plán pro kontrolu VIN', refundPolicy: 'Zásady vrácení peněz', perReport: 'Za report:', orderStepTitle: 'Zadejte e-mail pro reporty', orderStepEmailLabel: 'E-mailová adresa, kam budou zasílány reporty', orderStepEmailPlaceholder: 'priklad@email.cz', orderStepAgreeTerms: 'Souhlasím s podmínkami a přečetl jsem zásady ochrany osobních údajů', orderStepAgreeBeforeTerms: 'Souhlasím s ', orderStepTermsLink: 'podmínkami', orderStepAgreeBetween: ' a přečetl jsem ', orderStepPrivacyLink: 'zásady ochrany osobních údajů', orderStepTermsText: 'Zde budou zobrazeny podmínky služby. Toto je dočasný text – finální verze bude přidána později.', orderStepPrivacyText: 'Zde budou zobrazeny zásady ochrany osobních údajů: jak shromažďujeme, ukládáme a používáme vaše data. Tento popis je dočasný – úplný text bude přidán později.', orderStepContinue: 'Pokračovat', paymentTitle: 'Platba', paymentOrderSummary: 'Shrnutí objednávky', paymentPlan: 'Plán', paymentVin: 'VIN', paymentSubtotal: 'Mezisoučet', paymentDiscount: 'Sleva', paymentTotal: 'Celkem', paymentDiscountCode: 'Slevový kód', paymentDiscountPlaceholder: 'Zadejte kód', paymentApply: 'Použít', paymentPay: 'Zaplatit', paymentSecure: 'Bezpečná platba', paymentCodeInvalid: 'Neplatný slevový kód', paymentCodeApplied: 'Sleva použita', paymentApiUnavailable: 'Platební API nedostupné. Lokálně spusťte: vercel dev (ne npm run dev).', paymentFormLoading: 'Příprava platebního formuláře…', paymentOrPayAnotherWay: 'Nebo zaplaťte jinak', paymentMethod: 'Způsob platby', paymentCard: 'Karta', paymentLink: 'Odkaz', paymentApplePay: 'Apple Pay', paymentEmail: 'E-mail', paymentOr: 'nebo', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (zobrazeno níže, pokud je podporováno)', planSingle: 'Jednorázový', planPopular: 'Nejoblíbenější', planBestValue: 'Nejlepší hodnota', report1: '1 Report', reports2: '2 Reporty', reports3: '3 Reporty', refundPolicyText: 'Uživatel má právo odstoupit od Služeb (Reportů) do 30 dnů od data nákupu zasláním žádosti e-mailem s číslem objednávky, datem a kontaktními údaji. Vrácení peněz bude zpracováno do 14 dnů od obdržení žádosti.\n\nVrácení peněz neplatí, pokud byl report již použit k ověření historie vozidla nebo pokud byl použit alespoň jeden report ze zakoupeného balíčku.', close: 'Zavřít' },
    footer: { desc: 'Spolehlivý zdroj historie vozidel v Evropě. Naším posláním je transparentnost na každém kilometru.', privacyLink: 'Zásady ochrany osobních údajů', termsLink: 'Podmínky používání', usageInstructionsLink: 'Návod k použití' },
    about: { body: 'Vinscanner.eu – spolehlivé ověření VIN a historie vozidel. Poskytujeme reporty o kilometrech, poškozeních a tržní hodnotě, abyste mohli koupit ojeté auto s jistotou.', contactLabel: 'Kontaktujte nás:' },
    loading: { steps: ['Připojování k mezinárodním databázím...', 'Kontrola záznamů o kilometrech...', 'Analýza registru poškození...', 'Kontrola databází Interpolu...', 'Generování reportu...'], ready: 'Hotovo!', scanningHistory: 'Skenování historie', secureConnection: 'Zabezpečené připojení', sslEncryption: 'SSL šifrování aktivní' },
    errors: { historyNotFound: 'Historie nebyla nalezena.', apiFailed: 'Nepodařilo se získat data z API. Zkontrolujte klíč a připojení.', networkFailed: 'Nepodařilo se získat data. Zkontrolujte připojení.' },
    features: { mileageHistory: 'Historie kilometrů', mileageHistoryDesc: 'Analyzujeme data od prodejců a registrů po celé Evropě.', damageRecords: 'Registr poškození', damageRecordsDesc: 'Podrobné informace o dopravních nehodách.', theftCheck: 'Kontrola krádeže', theftCheckDesc: 'Kontrolujeme databáze Interpolu a místní policie.' },
    report: { fullReport: 'Kompletní report', theftClear: 'Nekradené', theftFlagged: 'UKRADENÉ / HLEDANÉ', theftUnknown: 'NEZKONTROLOVÁNO', theftUnknownTooltip: 'Kontrola krádeže pouze s UK registrací (Experian AutoCheck)', saveToCloud: 'Uložit report do cloudu', downloadPdf: 'Stáhnout report jako PDF', supplementTitle: 'Doplnit report ze zdrojů:', supplementButton: 'Získat data', supplementLoading: 'Načítání…', serviceHistoryNotFound: 'Servisní historie nenalezena – odpověď nebyla přijata včas. Graf kilometrů může být prázdný.', mileageHistory: 'Historie kilometrů (km)', lastMileage: 'Poslední kilometry:', serviceEvents: 'Servisní záznamy', damages: 'Zaznamenané škody', damageLabel: 'Škoda:', severityHigh: 'Vysoká', severityMedium: 'Střední', marketValue: 'Tržní hodnota', marketValueBased: 'Na základě prodejů podobných modelů.', min: 'Min', max: 'Max', technicalSpecs: 'Technické údaje', fuelType: 'Palivo', power: 'Výkon', engine: 'Motor', transmission: 'Převodovka', bodyType: 'Karoserie', colour: 'Barva', aiInsights: 'AI analýza', aiInsightsDesc: 'Na základě dat reportu může AI identifikovat možné problémy a silné stránky vozidla.', analyzing: 'Analyzování…', problemAreas: 'Možné problémy / rizika', strongPoints: 'Silné stránky', analyzeWithAI: 'Analyzovat s AI', refreshAnalysis: 'Obnovit AI analýzu', retryIn: 'Zkusit znovu za', aiAnalysisFailed: 'Nepodařilo se získat AI analýzu.', allApiSources: 'Všechny zdroje API', showRawData: 'Kompletní informace API (JSON)', show: 'Zobrazit', hide: 'Skrýt', saveAsJson: 'Uložit jako JSON', rawDataUnavailable: 'Data API nedostupná', yes: 'Ano', no: 'Ne', showOriginal: 'Zobrazit originál', translatingServiceComments: 'Překlad servisních komentářů…', serviceTranslationFailed: 'Překlad se nezdařil. Zobrazuje se původní jazyk.' },
    myReports: { title: 'Moje reporty', loading: 'Načítání...', noReports: 'Žádné uložené reporty.' },
    aiChat: { welcome: 'Ahoj! Jsem AI expert VinScanner. Jak vám mohu dnes pomoci?', cantRespond: 'Omlouvám se, nemohu nyní odpovědět.', expertTitle: 'AI expert', online: 'Online', placeholder: 'Napište svůj dotaz...' },
  },
  uk: {
    seo: {
      title: 'VinScanner - Перевірка історії автомобіля',
      description: 'Перевірте VIN-код та дізнайтесь історію автомобіля: пробіг, аварії, ремонти, історія власників. Швидка та надійна перевірка.',
      ogTitle: 'VinScanner - Перевірка історії автомобіля',
      ogDescription: 'Перевірте VIN-код та дізнайтесь історію автомобіля: пробіг, аварії, ремонти, історія власників.',
    },
    nav: { services: 'Послуги', pricing: 'Ціни', about: 'Про нас', login: 'Увійти', myReports: 'Мої звіти', signOut: 'Вийти', deleteAccount: 'Видалити акаунт', deleteAccountConfirm: 'Видалити акаунт', deleteAccountConfirmText: 'Ви впевнені, що хочете видалити свій акаунт? Усі збережені звіти будуть видалені. Цю дію не можна скасувати.', deleteAccountDeleting: 'Видалення…', deleteAccountError: 'Не вдалося видалити. Спробуйте ще раз.' },
    tokenMode: { banner: 'У вас {n} з {total} звітів. Введіть VIN нижче.', noReports: 'Звітів не залишилось. Придбайте новий план для перевірки іншого автомобіля.', loading: 'Завантаження…', error: 'Не вдалося завантажити покупку. Перевірте посилання.' },
    hero: { title: 'Дізнайтеся історію автомобіля', titleAccent: 'за VIN-кодом', desc: 'Перевірте історію пробігу, записи про пошкодження та ринкову вартість за кілька секунд. Професійна перевірка доступна кожному.', placeholder: 'Введіть номер VIN...', button: 'Перевірити', sample: 'Спробувати з прикладом' },
    pricing: { title: 'Оберіть відповідний план', desc: 'Заощаджуйте, купуючи кілька перевірок одночасно. Професійні звіти допоможуть прийняти правильне рішення.', bestValue: 'Найкраща ціна', order: 'Замовити зараз', confirm: 'Підтвердити', selectPlanForVin: 'Оберіть план для перевірки VIN', refundPolicy: 'Політика повернення', perReport: 'За звіт:', orderStepTitle: 'Введіть email для звітів', orderStepEmailLabel: 'Email-адреса, на яку надсилатимуться звіти', orderStepEmailPlaceholder: 'приклад@email.ua', orderStepAgreeTerms: 'Я погоджуюсь з умовами та ознайомився з політикою конфіденційності', orderStepAgreeBeforeTerms: 'Я погоджуюсь з ', orderStepTermsLink: 'умовами', orderStepAgreeBetween: ' та ознайомився з ', orderStepPrivacyLink: 'політикою конфіденційності', orderStepTermsText: 'Тут будуть відображені умови використання. Це тимчасовий текст – остаточна версія буде додана пізніше.', orderStepPrivacyText: 'Тут буде відображена політика конфіденційності: як ми збираємо, зберігаємо та використовуємо ваші дані. Цей опис тимчасовий – повний текст буде додано пізніше.', orderStepContinue: 'Продовжити', paymentTitle: 'Оплата', paymentOrderSummary: 'Підсумок замовлення', paymentPlan: 'План', paymentVin: 'VIN', paymentSubtotal: 'Проміжна сума', paymentDiscount: 'Знижка', paymentTotal: 'Всього', paymentDiscountCode: 'Код знижки', paymentDiscountPlaceholder: 'Введіть код', paymentApply: 'Застосувати', paymentPay: 'Оплатити', paymentSecure: 'Безпечна оплата', paymentCodeInvalid: 'Недійсний код знижки', paymentCodeApplied: 'Знижку застосовано', paymentApiUnavailable: 'API оплати недоступний. Локально запустіть: vercel dev (не npm run dev).', paymentFormLoading: 'Підготовка форми оплати…', paymentOrPayAnotherWay: 'Або оплатіть іншим способом', paymentMethod: 'Спосіб оплати', paymentCard: 'Картка', paymentLink: 'Посилання', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'або', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (показано нижче, якщо підтримується)', planSingle: 'Одноразовий', planPopular: 'Найпопулярніший', planBestValue: 'Найкраща ціна', report1: '1 Звіт', reports2: '2 Звіти', reports3: '3 Звіти', refundPolicyText: 'Користувач має право відмовитися від Послуг (Звітів) протягом 30 днів з дати покупки, надіславши запит на email із зазначенням номера замовлення, дати та контактних даних. Повернення коштів обробляється протягом 14 днів з моменту отримання запиту.\n\nПовернення не застосовується, якщо звіт уже використовувався для перевірки історії автомобіля або якщо було використано принаймні один звіт із придбаного пакету.', close: 'Закрити' },
    footer: { desc: 'Надійне джерело історії автомобілів у Європі. Наша місія – прозорість на кожному кілометрі.', privacyLink: 'Політика конфіденційності', termsLink: 'Умови використання', usageInstructionsLink: 'Інструкція з використання' },
    about: { body: 'Vinscanner.eu – надійна перевірка VIN та історії автомобілів. Ми надаємо звіти про пробіг, пошкодження та ринкову вартість, щоб ви могли впевнено придбати вживаний автомобіль.', contactLabel: 'Зв\'яжіться з нами:' },
    loading: { steps: ['Підключення до міжнародних баз даних...', 'Перевірка записів про пробіг...', 'Аналіз реєстру пошкоджень...', 'Перевірка баз Інтерполу...', 'Генерація звіту...'], ready: 'Готово!', scanningHistory: 'Сканування історії', secureConnection: 'Безпечне з\'єднання', sslEncryption: 'SSL-шифрування активне' },
    errors: { historyNotFound: 'Історію не знайдено.', apiFailed: 'Не вдалося отримати дані з API. Перевірте ключ та з\'єднання.', networkFailed: 'Не вдалося отримати дані. Перевірте з\'єднання.' },
    features: { mileageHistory: 'Історія пробігу', mileageHistoryDesc: 'Ми аналізуємо дані від дилерів та реєстрів по всій Європі.', damageRecords: 'Реєстр пошкоджень', damageRecordsDesc: 'Детальна інформація про ДТП.', theftCheck: 'Перевірка на викрадення', theftCheckDesc: 'Перевіряємо бази Інтерполу та місцевої поліції.' },
    report: { fullReport: 'Повний звіт', theftClear: 'Не викрадений', theftFlagged: 'ВИКРАДЕНИЙ / РОЗШУКУЄТЬСЯ', theftUnknown: 'НЕ ПЕРЕВІРЕНО', theftUnknownTooltip: 'Перевірка на викрадення лише з UK реєстрацією (Experian AutoCheck)', saveToCloud: 'Зберегти звіт у хмару', downloadPdf: 'Завантажити звіт як PDF', supplementTitle: 'Доповнити звіт із джерел:', supplementButton: 'Отримати дані', supplementLoading: 'Отримання…', serviceHistoryNotFound: 'Сервісну історію не знайдено – відповідь не отримано вчасно. Графік пробігу може бути порожнім.', mileageHistory: 'Історія пробігу (км)', lastMileage: 'Останній пробіг:', serviceEvents: 'Сервісні записи', damages: 'Зареєстровані пошкодження', damageLabel: 'Пошкодження:', severityHigh: 'Висока', severityMedium: 'Середня', marketValue: 'Ринкова вартість', marketValueBased: 'На основі продажів аналогічних моделей.', min: 'Мін', max: 'Макс', technicalSpecs: 'Технічні дані', fuelType: 'Паливо', power: 'Потужність', engine: 'Двигун', transmission: 'Коробка передач', bodyType: 'Кузов', colour: 'Колір', aiInsights: 'AI-аналіз', aiInsightsDesc: 'На основі даних звіту AI може визначити можливі проблеми та сильні сторони автомобіля.', analyzing: 'Аналіз…', problemAreas: 'Можливі проблеми / ризики', strongPoints: 'Сильні сторони', analyzeWithAI: 'Аналізувати з AI', refreshAnalysis: 'Оновити AI-аналіз', retryIn: 'Повторити через', aiAnalysisFailed: 'Не вдалося отримати AI-аналіз.', allApiSources: 'Усі джерела API', showRawData: 'Повна інформація API (JSON)', show: 'Показати', hide: 'Приховати', saveAsJson: 'Зберегти як JSON', rawDataUnavailable: 'Дані API недоступні', yes: 'Так', no: 'Ні', showOriginal: 'Показати оригінал', translatingServiceComments: 'Переклад сервісних коментарів…', serviceTranslationFailed: 'Не вдалося перекласти. Показано оригінальну мову.' },
    myReports: { title: 'Мої звіти', loading: 'Завантаження...', noReports: 'Немає збережених звітів.' },
    aiChat: { welcome: 'Привіт! Я AI-експерт VinScanner. Як я можу допомогти вам сьогодні?', cantRespond: 'Вибачте, зараз не можу відповісти.', expertTitle: 'AI-експерт', online: 'Онлайн', placeholder: 'Напишіть ваше питання...' },
  },
  ro: {
    seo: {
      title: 'VinScanner - Verificare istoric vehicul',
      description: 'Verificați codul VIN și descoperiți istoricul vehiculului: kilometraj, accidente, reparații, istoric proprietari. Verificare rapidă și fiabilă.',
      ogTitle: 'VinScanner - Verificare istoric vehicul',
      ogDescription: 'Verificați codul VIN și descoperiți istoricul vehiculului: kilometraj, accidente, reparații.',
    },
    nav: { services: 'Servicii', pricing: 'Prețuri', about: 'Despre noi', login: 'Autentificare', myReports: 'Rapoartele mele', signOut: 'Deconectare', deleteAccount: 'Șterge contul', deleteAccountConfirm: 'Șterge contul', deleteAccountConfirmText: 'Sunteți sigur că doriți să ștergeți contul? Toate rapoartele salvate vor fi șterse. Această acțiune nu poate fi anulată.', deleteAccountDeleting: 'Se șterge…', deleteAccountError: 'Ștergerea a eșuat. Încercați din nou.' },
    tokenMode: { banner: 'Aveți {n} din {total} rapoarte. Introduceți VIN-ul mai jos.', noReports: 'Nu mai aveți rapoarte. Cumpărați un plan nou pentru a verifica alt vehicul.', loading: 'Se încarcă…', error: 'Nu s-a putut încărca achiziția. Verificați linkul.' },
    hero: { title: 'Descoperiți istoricul vehiculului', titleAccent: 'după codul VIN', desc: 'Verificați istoricul kilometrajului, daunele și valoarea de piață în câteva secunde. Verificare profesională disponibilă pentru toți.', placeholder: 'Introduceți numărul VIN...', button: 'Verifică', sample: 'Încearcă cu un exemplu' },
    pricing: { title: 'Alegeți planul potrivit', desc: 'Economisiți cumpărând mai multe verificări odată. Rapoartele profesionale vă ajută să luați decizia corectă.', bestValue: 'Cea mai bună valoare', order: 'Comandă acum', confirm: 'Confirmă', selectPlanForVin: 'Selectați un plan pentru verificarea VIN', refundPolicy: 'Politica de rambursare', perReport: 'Per raport:', orderStepTitle: 'Introduceți emailul pentru rapoarte', orderStepEmailLabel: 'Adresa de email unde vor fi trimise rapoartele', orderStepEmailPlaceholder: 'exemplu@email.ro', orderStepAgreeTerms: 'Accept termenii și am citit politica de confidențialitate', orderStepAgreeBeforeTerms: 'Accept ', orderStepTermsLink: 'termenii', orderStepAgreeBetween: ' și am citit ', orderStepPrivacyLink: 'politica de confidențialitate', orderStepTermsText: 'Aici vor fi afișați termenii de utilizare. Acesta este un text temporar – versiunea finală va fi adăugată ulterior.', orderStepPrivacyText: 'Aici va fi afișată politica de confidențialitate: cum colectăm, stocăm și folosim datele dvs. Această descriere este temporară – textul complet va fi adăugat ulterior.', orderStepContinue: 'Continuă', paymentTitle: 'Plată', paymentOrderSummary: 'Rezumatul comenzii', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Subtotal', paymentDiscount: 'Reducere', paymentTotal: 'Total', paymentDiscountCode: 'Cod de reducere', paymentDiscountPlaceholder: 'Introduceți codul', paymentApply: 'Aplică', paymentPay: 'Plătește', paymentSecure: 'Plată securizată', paymentCodeInvalid: 'Cod de reducere invalid', paymentCodeApplied: 'Reducere aplicată', paymentApiUnavailable: 'API de plată indisponibil. Local rulați: vercel dev (nu npm run dev).', paymentFormLoading: 'Se pregătește formularul de plată…', paymentOrPayAnotherWay: 'Sau plătiți altfel', paymentMethod: 'Metodă de plată', paymentCard: 'Card', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'sau', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (afișate mai jos când sunt suportate)', planSingle: 'Unic', planPopular: 'Cel mai popular', planBestValue: 'Cea mai bună valoare', report1: '1 Raport', reports2: '2 Rapoarte', reports3: '3 Rapoarte', refundPolicyText: 'Utilizatorul are dreptul de a se retrage din Servicii (Rapoarte) în termen de 30 de zile de la data achiziției, trimițând o cerere prin email cu numărul comenzii, data și datele de contact. Rambursarea se procesează în 14 zile de la primirea cererii.\n\nRambursările nu se aplică dacă raportul a fost deja folosit pentru verificarea istoricului vehiculului sau dacă a fost folosit cel puțin un raport din pachetul achiziționat.', close: 'Închide' },
    footer: { desc: 'Sursă de încredere pentru istoricul vehiculelor în Europa. Misiunea noastră este transparența la fiecare kilometru.', privacyLink: 'Politica de confidențialitate', termsLink: 'Termeni de utilizare', usageInstructionsLink: 'Instrucțiuni de utilizare' },
    about: { body: 'Vinscanner.eu – verificări de încredere VIN și istoric vehicule. Oferim rapoarte despre kilometraj, daune și valoare de piață pentru a cumpăra o mașină second-hand cu încredere.', contactLabel: 'Contactați-ne:' },
    loading: { steps: ['Conectare la baze de date internaționale...', 'Verificarea înregistrărilor de kilometraj...', 'Analizarea registrului de daune...', 'Verificarea bazelor Interpol...', 'Generarea raportului...'], ready: 'Gata!', scanningHistory: 'Scanare istoric', secureConnection: 'Conexiune securizată', sslEncryption: 'Criptare SSL activă' },
    errors: { historyNotFound: 'Istoricul nu a fost găsit.', apiFailed: 'Nu s-au putut obține date din API. Verificați cheia și conexiunea.', networkFailed: 'Nu s-au putut obține date. Verificați conexiunea.' },
    features: { mileageHistory: 'Istoric kilometraj', mileageHistoryDesc: 'Analizăm date de la dealeri și registre din toată Europa.', damageRecords: 'Registru daune', damageRecordsDesc: 'Informații detaliate despre accidentele rutiere.', theftCheck: 'Verificare furt', theftCheckDesc: 'Verificăm bazele Interpol și ale poliției locale.' },
    report: { fullReport: 'Raport complet', theftClear: 'Nefurat', theftFlagged: 'FURAT / CĂUTAT', theftUnknown: 'NEVERIFICAT', theftUnknownTooltip: 'Verificare furt doar cu înmatriculare UK (Experian AutoCheck)', saveToCloud: 'Salvează raportul în cloud', downloadPdf: 'Descarcă raportul ca PDF', supplementTitle: 'Completează raportul din surse:', supplementButton: 'Obține date', supplementLoading: 'Se obțin…', serviceHistoryNotFound: 'Istoricul service nu a fost găsit – răspunsul nu a fost primit la timp. Graficul kilometrajului poate fi gol.', mileageHistory: 'Istoric kilometraj (km)', lastMileage: 'Ultimul kilometraj:', serviceEvents: 'Înregistrări service', damages: 'Daune înregistrate', damageLabel: 'Daună:', severityHigh: 'Ridicată', severityMedium: 'Medie', marketValue: 'Valoare de piață', marketValueBased: 'Bazat pe vânzări de modele similare.', min: 'Min', max: 'Max', technicalSpecs: 'Date tehnice', fuelType: 'Combustibil', power: 'Putere', engine: 'Motor', transmission: 'Transmisie', bodyType: 'Caroserie', colour: 'Culoare', aiInsights: 'Analiză AI', aiInsightsDesc: 'Pe baza datelor raportului, AI poate identifica posibile probleme și puncte forte ale vehiculului.', analyzing: 'Se analizează…', problemAreas: 'Posibile probleme / riscuri', strongPoints: 'Puncte forte', analyzeWithAI: 'Analizează cu AI', refreshAnalysis: 'Actualizează analiza AI', retryIn: 'Reîncearcă în', aiAnalysisFailed: 'Nu s-a putut obține analiza AI.', allApiSources: 'Toate sursele API', showRawData: 'Informații API complete (JSON)', show: 'Afișează', hide: 'Ascunde', saveAsJson: 'Salvează ca JSON', rawDataUnavailable: 'Date API indisponibile', yes: 'Da', no: 'Nu', showOriginal: 'Afișează originalul', translatingServiceComments: 'Se traduc comentariile service…', serviceTranslationFailed: 'Traducerea a eșuat. Se afișează limba originală.' },
    myReports: { title: 'Rapoartele mele', loading: 'Se încarcă...', noReports: 'Niciun raport salvat.' },
    aiChat: { welcome: 'Bună! Sunt expertul AI VinScanner. Cum vă pot ajuta astăzi?', cantRespond: 'Îmi pare rău, nu pot răspunde acum.', expertTitle: 'Expert AI', online: 'Online', placeholder: 'Scrieți întrebarea dvs...' },
  },
  sv: {
    seo: {
      title: 'VinScanner - Fordonshistorik kontroll',
      description: 'Kontrollera VIN-koden och upptäck fordonshistoriken: mätarställning, olyckor, reparationer, ägarhistorik. Snabb och pålitlig kontroll.',
      ogTitle: 'VinScanner - Fordonshistorik kontroll',
      ogDescription: 'Kontrollera VIN-koden och upptäck fordonshistoriken: mätarställning, olyckor, reparationer.',
    },
    nav: { services: 'Tjänster', pricing: 'Priser', about: 'Om oss', login: 'Logga in', myReports: 'Mina rapporter', signOut: 'Logga ut', deleteAccount: 'Radera konto', deleteAccountConfirm: 'Radera konto', deleteAccountConfirmText: 'Är du säker på att du vill radera ditt konto? Alla sparade rapporter kommer att tas bort. Denna åtgärd kan inte ångras.', deleteAccountDeleting: 'Raderar…', deleteAccountError: 'Radering misslyckades. Försök igen.' },
    tokenMode: { banner: 'Du har {n} av {total} rapporter. Ange VIN nedan.', noReports: 'Inga rapporter kvar. Köp en ny plan för att kontrollera ett annat fordon.', loading: 'Laddar…', error: 'Kunde inte ladda köpet. Kontrollera länken.' },
    hero: { title: 'Upptäck fordonets historia', titleAccent: 'via VIN-kod', desc: 'Kontrollera mätarställning, skaderegister och marknadsvärde på några sekunder. Professionell verifiering tillgänglig för alla.', placeholder: 'Ange VIN-nummer...', button: 'Kontrollera', sample: 'Prova med ett exempel' },
    pricing: { title: 'Välj rätt plan', desc: 'Spara genom att köpa flera kontroller samtidigt. Professionella rapporter hjälper dig fatta rätt beslut.', bestValue: 'Bästa värde', order: 'Beställ nu', confirm: 'Bekräfta', selectPlanForVin: 'Välj en plan för VIN-kontroll', refundPolicy: 'Återbetalningspolicy', perReport: 'Per rapport:', orderStepTitle: 'Ange e-post för rapporter', orderStepEmailLabel: 'E-postadress dit rapporter skickas', orderStepEmailPlaceholder: 'exempel@email.se', orderStepAgreeTerms: 'Jag godkänner villkoren och har läst integritetspolicyn', orderStepAgreeBeforeTerms: 'Jag godkänner ', orderStepTermsLink: 'villkoren', orderStepAgreeBetween: ' och har läst ', orderStepPrivacyLink: 'integritetspolicyn', orderStepTermsText: 'Här visas användarvillkoren. Detta är tillfällig text – slutversionen läggs till senare.', orderStepPrivacyText: 'Här visas integritetspolicyn: hur vi samlar in, lagrar och använder dina data. Denna beskrivning är tillfällig – fullständig text läggs till senare.', orderStepContinue: 'Fortsätt', paymentTitle: 'Betalning', paymentOrderSummary: 'Ordersammanfattning', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Delsumma', paymentDiscount: 'Rabatt', paymentTotal: 'Totalt', paymentDiscountCode: 'Rabattkod', paymentDiscountPlaceholder: 'Ange kod', paymentApply: 'Tillämpa', paymentPay: 'Betala', paymentSecure: 'Säker betalning', paymentCodeInvalid: 'Ogiltig rabattkod', paymentCodeApplied: 'Rabatt tillämpad', paymentApiUnavailable: 'Betalnings-API ej tillgängligt. Kör lokalt: vercel dev (inte npm run dev).', paymentFormLoading: 'Förbereder betalningsformulär…', paymentOrPayAnotherWay: 'Eller betala på annat sätt', paymentMethod: 'Betalningsmetod', paymentCard: 'Kort', paymentLink: 'Länk', paymentApplePay: 'Apple Pay', paymentEmail: 'E-post', paymentOr: 'eller', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (visas nedan om det stöds)', planSingle: 'Enskild', planPopular: 'Populärast', planBestValue: 'Bästa värde', report1: '1 Rapport', reports2: '2 Rapporter', reports3: '3 Rapporter', refundPolicyText: 'Användaren har rätt att frånträda Tjänsterna (Rapporterna) inom 30 dagar från köpdatumet genom att skicka en begäran via e-post med ordernummer, datum och kontaktuppgifter. Återbetalningen behandlas inom 14 dagar efter mottagande av begäran.\n\nÅterbetalningar gäller inte om rapporten redan har använts för att verifiera fordonets historia eller om minst en rapport från det köpta paketet har använts.', close: 'Stäng' },
    footer: { desc: 'Pålitlig källa för fordonshistorik i Europa. Vårt uppdrag är transparens vid varje kilometer.', privacyLink: 'Integritetspolicy', termsLink: 'Användarvillkor', usageInstructionsLink: 'Användarinstruktioner' },
    about: { body: 'Vinscanner.eu – pålitliga VIN- och fordonshistorikkontroller. Vi tillhandahåller rapporter om mätarställning, skador och marknadsvärde så att du kan köpa en begagnad bil med förtroende.', contactLabel: 'Kontakta oss:' },
    loading: { steps: ['Ansluter till internationella databaser...', 'Kontrollerar mätarställningsregister...', 'Analyserar skaderegister...', 'Kontrollerar Interpol-databaser...', 'Genererar rapport...'], ready: 'Klart!', scanningHistory: 'Skannar historik', secureConnection: 'Säker anslutning', sslEncryption: 'SSL-kryptering aktiv' },
    errors: { historyNotFound: 'Historik hittades inte.', apiFailed: 'Kunde inte hämta data från API. Kontrollera nyckel och anslutning.', networkFailed: 'Kunde inte hämta data. Kontrollera anslutningen.' },
    features: { mileageHistory: 'Mätarhistorik', mileageHistoryDesc: 'Vi analyserar data från återförsäljare och register i hela Europa.', damageRecords: 'Skaderegister', damageRecordsDesc: 'Detaljerad information om trafikolyckor.', theftCheck: 'Stöldkontroll', theftCheckDesc: 'Vi kontrollerar Interpol och lokala polisdatabaser.' },
    report: { fullReport: 'Fullständig rapport', theftClear: 'Ej stulen', theftFlagged: 'STULEN / EFTERLYST', theftUnknown: 'EJ KONTROLLERAD', theftUnknownTooltip: 'Stöldkontroll endast med UK-registrering (Experian AutoCheck)', saveToCloud: 'Spara rapport i molnet', downloadPdf: 'Ladda ner rapport som PDF', supplementTitle: 'Komplettera rapport från källor:', supplementButton: 'Hämta data', supplementLoading: 'Hämtar…', serviceHistoryNotFound: 'Servicehistorik hittades inte – svar mottogs inte i tid. Mätardiagrammet kan vara tomt.', mileageHistory: 'Mätarhistorik (km)', lastMileage: 'Senaste mätarställning:', serviceEvents: 'Serviceregister', damages: 'Registrerade skador', damageLabel: 'Skada:', severityHigh: 'Hög', severityMedium: 'Medel', marketValue: 'Marknadsvärde', marketValueBased: 'Baserat på försäljning av liknande modeller.', min: 'Min', max: 'Max', technicalSpecs: 'Tekniska data', fuelType: 'Bränsle', power: 'Effekt', engine: 'Motor', transmission: 'Växellåda', bodyType: 'Kaross', colour: 'Färg', aiInsights: 'AI-analys', aiInsightsDesc: 'Baserat på rapportdata kan AI identifiera möjliga problem och fordonets starka sidor.', analyzing: 'Analyserar…', problemAreas: 'Möjliga problem / risker', strongPoints: 'Starka sidor', analyzeWithAI: 'Analysera med AI', refreshAnalysis: 'Uppdatera AI-analys', retryIn: 'Försök igen om', aiAnalysisFailed: 'Kunde inte hämta AI-analys.', allApiSources: 'Alla API-källor', showRawData: 'Fullständig API-information (JSON)', show: 'Visa', hide: 'Dölj', saveAsJson: 'Spara som JSON', rawDataUnavailable: 'API-data ej tillgänglig', yes: 'Ja', no: 'Nej', showOriginal: 'Visa original', translatingServiceComments: 'Översätter servicekommentarer…', serviceTranslationFailed: 'Översättning misslyckades. Originalspråk visas.' },
    myReports: { title: 'Mina rapporter', loading: 'Laddar...', noReports: 'Inga sparade rapporter.' },
    aiChat: { welcome: 'Hej! Jag är VinScanner AI-expert. Hur kan jag hjälpa dig idag?', cantRespond: 'Tyvärr kan jag inte svara just nu.', expertTitle: 'AI-expert', online: 'Online', placeholder: 'Skriv din fråga...' },
  },
  el: {
    seo: {
      title: 'VinScanner - Έλεγχος ιστορικού οχήματος',
      description: 'Ελέγξτε τον κωδικό VIN και ανακαλύψτε το ιστορικό του οχήματος: χιλιόμετρα, ατυχήματα, επισκευές, ιστορικό ιδιοκτησίας. Γρήγορος και αξιόπιστος έλεγχος.',
      ogTitle: 'VinScanner - Έλεγχος ιστορικού οχήματος',
      ogDescription: 'Ελέγξτε τον κωδικό VIN και ανακαλύψτε το ιστορικό του οχήματος: χιλιόμετρα, ατυχήματα, επισκευές.',
    },
    nav: { services: 'Υπηρεσίες', pricing: 'Τιμές', about: 'Σχετικά', login: 'Σύνδεση', myReports: 'Οι αναφορές μου', signOut: 'Αποσύνδεση', deleteAccount: 'Διαγραφή λογαριασμού', deleteAccountConfirm: 'Διαγραφή λογαριασμού', deleteAccountConfirmText: 'Είστε σίγουροι ότι θέλετε να διαγράψετε τον λογαριασμό σας; Όλες οι αποθηκευμένες αναφορές θα διαγραφούν. Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.', deleteAccountDeleting: 'Διαγραφή…', deleteAccountError: 'Η διαγραφή απέτυχε. Δοκιμάστε ξανά.' },
    tokenMode: { banner: 'Έχετε {n} από {total} αναφορές. Εισάγετε VIN παρακάτω.', noReports: 'Δεν απομένουν αναφορές. Αγοράστε νέο πλάνο για έλεγχο άλλου οχήματος.', loading: 'Φόρτωση…', error: 'Αποτυχία φόρτωσης αγοράς. Ελέγξτε τον σύνδεσμο.' },
    hero: { title: 'Ανακαλύψτε το ιστορικό του οχήματος', titleAccent: 'με κωδικό VIN', desc: 'Ελέγξτε ιστορικό χιλιομέτρων, ζημιές και αξία αγοράς σε δευτερόλεπτα. Επαγγελματική επαλήθευση διαθέσιμη σε όλους.', placeholder: 'Εισάγετε αριθμό VIN...', button: 'Έλεγχος', sample: 'Δοκιμή με παράδειγμα' },
    pricing: { title: 'Επιλέξτε το κατάλληλο πλάνο', desc: 'Εξοικονομήστε αγοράζοντας πολλαπλούς ελέγχους μαζί. Επαγγελματικές αναφορές για σωστή απόφαση.', bestValue: 'Καλύτερη αξία', order: 'Παραγγελία τώρα', confirm: 'Επιβεβαίωση', selectPlanForVin: 'Επιλέξτε πλάνο για έλεγχο VIN', refundPolicy: 'Πολιτική επιστροφής', perReport: 'Ανά αναφορά:', orderStepTitle: 'Εισάγετε email για αναφορές', orderStepEmailLabel: 'Διεύθυνση email όπου θα σταλούν οι αναφορές', orderStepEmailPlaceholder: 'paradeigma@email.gr', orderStepAgreeTerms: 'Αποδέχομαι τους όρους και έχω διαβάσει την πολιτική απορρήτου', orderStepAgreeBeforeTerms: 'Αποδέχομαι τους ', orderStepTermsLink: 'όρους', orderStepAgreeBetween: ' και έχω διαβάσει την ', orderStepPrivacyLink: 'πολιτική απορρήτου', orderStepTermsText: 'Εδώ θα εμφανιστούν οι όροι χρήσης. Αυτό είναι προσωρινό κείμενο – η τελική έκδοση θα προστεθεί αργότερα.', orderStepPrivacyText: 'Εδώ θα εμφανιστεί η πολιτική απορρήτου: πώς συλλέγουμε, αποθηκεύουμε και χρησιμοποιούμε τα δεδομένα σας. Αυτή η περιγραφή είναι προσωρινή – το πλήρες κείμενο θα προστεθεί αργότερα.', orderStepContinue: 'Συνέχεια', paymentTitle: 'Πληρωμή', paymentOrderSummary: 'Σύνοψη παραγγελίας', paymentPlan: 'Πλάνο', paymentVin: 'VIN', paymentSubtotal: 'Υποσύνολο', paymentDiscount: 'Έκπτωση', paymentTotal: 'Σύνολο', paymentDiscountCode: 'Κωδικός έκπτωσης', paymentDiscountPlaceholder: 'Εισάγετε κωδικό', paymentApply: 'Εφαρμογή', paymentPay: 'Πληρωμή', paymentSecure: 'Ασφαλής πληρωμή', paymentCodeInvalid: 'Μη έγκυρος κωδικός έκπτωσης', paymentCodeApplied: 'Έκπτωση εφαρμόστηκε', paymentApiUnavailable: 'API πληρωμών μη διαθέσιμο. Τοπικά εκτελέστε: vercel dev (όχι npm run dev).', paymentFormLoading: 'Προετοιμασία φόρμας πληρωμής…', paymentOrPayAnotherWay: 'Ή πληρώστε διαφορετικά', paymentMethod: 'Μέθοδος πληρωμής', paymentCard: 'Κάρτα', paymentLink: 'Σύνδεσμος', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'ή', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (εμφανίζονται παρακάτω αν υποστηρίζονται)', planSingle: 'Μεμονωμένο', planPopular: 'Δημοφιλέστερο', planBestValue: 'Καλύτερη αξία', report1: '1 Αναφορά', reports2: '2 Αναφορές', reports3: '3 Αναφορές', refundPolicyText: 'Ο χρήστης έχει δικαίωμα υπαναχώρησης από τις Υπηρεσίες (Αναφορές) εντός 30 ημερών από την ημερομηνία αγοράς, υποβάλλοντας αίτημα μέσω email με αριθμό παραγγελίας, ημερομηνία και στοιχεία επικοινωνίας. Η επιστροφή χρημάτων επεξεργάζεται εντός 14 ημερών από τη λήψη του αιτήματος.\n\nΟι επιστροφές δεν ισχύουν αν η αναφορά έχει ήδη χρησιμοποιηθεί για επαλήθευση ιστορικού ή αν έχει χρησιμοποιηθεί τουλάχιστον μία αναφορά από το πακέτο.', close: 'Κλείσιμο' },
    footer: { desc: 'Αξιόπιστη πηγή ιστορικού οχημάτων στην Ευρώπη. Αποστολή μας η διαφάνεια σε κάθε χιλιόμετρο.', privacyLink: 'Πολιτική απορρήτου', termsLink: 'Όροι χρήσης', usageInstructionsLink: 'Οδηγίες χρήσης' },
    about: { body: 'Vinscanner.eu – αξιόπιστοι έλεγχοι VIN και ιστορικού οχημάτων. Παρέχουμε αναφορές για χιλιόμετρα, ζημιές και αξία αγοράς για αγορά μεταχειρισμένου με εμπιστοσύνη.', contactLabel: 'Επικοινωνήστε:' },
    loading: { steps: ['Σύνδεση σε διεθνείς βάσεις δεδομένων...', 'Έλεγχος αρχείων χιλιομέτρων...', 'Ανάλυση μητρώου ζημιών...', 'Έλεγχος βάσεων Interpol...', 'Δημιουργία αναφοράς...'], ready: 'Έτοιμο!', scanningHistory: 'Σάρωση ιστορικού', secureConnection: 'Ασφαλής σύνδεση', sslEncryption: 'Κρυπτογράφηση SSL ενεργή' },
    errors: { historyNotFound: 'Το ιστορικό δεν βρέθηκε.', apiFailed: 'Αποτυχία λήψης δεδομένων από API. Ελέγξτε κλειδί και σύνδεση.', networkFailed: 'Αποτυχία λήψης δεδομένων. Ελέγξτε σύνδεση.' },
    features: { mileageHistory: 'Ιστορικό χιλιομέτρων', mileageHistoryDesc: 'Αναλύουμε δεδομένα από αντιπροσώπους και μητρώα σε όλη την Ευρώπη.', damageRecords: 'Μητρώο ζημιών', damageRecordsDesc: 'Λεπτομερείς πληροφορίες για τροχαία ατυχήματα.', theftCheck: 'Έλεγχος κλοπής', theftCheckDesc: 'Ελέγχουμε βάσεις Interpol και τοπικής αστυνομίας.' },
    report: { fullReport: 'Πλήρης αναφορά', theftClear: 'Μη κλεμμένο', theftFlagged: 'ΚΛΕΜΜΕΝΟ / ΑΝΑΖΗΤΕΙΤΑΙ', theftUnknown: 'ΔΕΝ ΕΛΕΓΧΘΗΚΕ', theftUnknownTooltip: 'Έλεγχος κλοπής μόνο με UK πινακίδα (Experian AutoCheck)', saveToCloud: 'Αποθήκευση αναφοράς στο cloud', downloadPdf: 'Λήψη αναφοράς ως PDF', supplementTitle: 'Συμπλήρωση αναφοράς από πηγές:', supplementButton: 'Λήψη δεδομένων', supplementLoading: 'Λήψη…', serviceHistoryNotFound: 'Ιστορικό service δεν βρέθηκε – απάντηση δεν ελήφθη εγκαίρως. Το γράφημα χιλιομέτρων μπορεί να είναι κενό.', mileageHistory: 'Ιστορικό χιλιομέτρων (km)', lastMileage: 'Τελευταία χιλιόμετρα:', serviceEvents: 'Αρχεία service', damages: 'Καταγεγραμμένες ζημιές', damageLabel: 'Ζημιά:', severityHigh: 'Υψηλή', severityMedium: 'Μέτρια', marketValue: 'Αξία αγοράς', marketValueBased: 'Βασισμένο σε πωλήσεις παρόμοιων μοντέλων.', min: 'Ελάχ', max: 'Μέγ', technicalSpecs: 'Τεχνικά στοιχεία', fuelType: 'Καύσιμο', power: 'Ισχύς', engine: 'Κινητήρας', transmission: 'Κιβώτιο', bodyType: 'Αμάξωμα', colour: 'Χρώμα', aiInsights: 'AI ανάλυση', aiInsightsDesc: 'Βάσει δεδομένων αναφοράς, το AI μπορεί να εντοπίσει πιθανά προβλήματα και δυνατά σημεία του οχήματος.', analyzing: 'Ανάλυση…', problemAreas: 'Πιθανά προβλήματα / κίνδυνοι', strongPoints: 'Δυνατά σημεία', analyzeWithAI: 'Ανάλυση με AI', refreshAnalysis: 'Ανανέωση ανάλυσης AI', retryIn: 'Επανάληψη σε', aiAnalysisFailed: 'Αποτυχία λήψης ανάλυσης AI.', allApiSources: 'Όλες οι πηγές API', showRawData: 'Πλήρεις πληροφορίες API (JSON)', show: 'Εμφάνιση', hide: 'Απόκρυψη', saveAsJson: 'Αποθήκευση ως JSON', rawDataUnavailable: 'Δεδομένα API μη διαθέσιμα', yes: 'Ναι', no: 'Όχι', showOriginal: 'Εμφάνιση πρωτοτύπου', translatingServiceComments: 'Μετάφραση σχολίων service…', serviceTranslationFailed: 'Η μετάφραση απέτυχε. Εμφανίζεται η αρχική γλώσσα.' },
    myReports: { title: 'Οι αναφορές μου', loading: 'Φόρτωση...', noReports: 'Καμία αποθηκευμένη αναφορά.' },
    aiChat: { welcome: 'Γεια! Είμαι ο ειδικός AI του VinScanner. Πώς μπορώ να σας βοηθήσω σήμερα;', cantRespond: 'Λυπάμαι, δεν μπορώ να απαντήσω τώρα.', expertTitle: 'Ειδικός AI', online: 'Online', placeholder: 'Γράψτε την ερώτησή σας...' },
  },
  pt: {
    seo: {
      title: 'VinScanner - Verificação de histórico de veículo',
      description: 'Verifique o código VIN e descubra o histórico do veículo: quilometragem, acidentes, reparos, histórico de propriedade. Verificação rápida e confiável.',
      ogTitle: 'VinScanner - Verificação de histórico de veículo',
      ogDescription: 'Verifique o código VIN e descubra o histórico do veículo: quilometragem, acidentes, reparos.',
    },
    nav: { services: 'Serviços', pricing: 'Preços', about: 'Sobre nós', login: 'Entrar', myReports: 'Meus relatórios', signOut: 'Sair', deleteAccount: 'Excluir conta', deleteAccountConfirm: 'Excluir conta', deleteAccountConfirmText: 'Tem certeza de que deseja excluir sua conta? Todos os relatórios salvos serão removidos. Esta ação não pode ser desfeita.', deleteAccountDeleting: 'Excluindo…', deleteAccountError: 'Falha ao excluir. Tente novamente.' },
    tokenMode: { banner: 'Você tem {n} de {total} relatórios. Digite o VIN abaixo.', noReports: 'Sem relatórios restantes. Compre um novo plano para verificar outro veículo.', loading: 'Carregando…', error: 'Falha ao carregar a compra. Verifique o link.' },
    hero: { title: 'Descubra o histórico do veículo', titleAccent: 'pelo código VIN', desc: 'Verifique histórico de quilometragem, danos e valor de mercado em segundos. Verificação profissional disponível para todos.', placeholder: 'Digite o número VIN...', button: 'Verificar', sample: 'Testar com exemplo' },
    pricing: { title: 'Escolha o plano certo', desc: 'Economize comprando várias verificações de uma vez. Relatórios profissionais ajudam a tomar a decisão certa.', bestValue: 'Melhor valor', order: 'Pedir agora', confirm: 'Confirmar', selectPlanForVin: 'Selecione um plano para verificação VIN', refundPolicy: 'Política de reembolso', perReport: 'Por relatório:', orderStepTitle: 'Digite o email para relatórios', orderStepEmailLabel: 'Endereço de email para onde os relatórios serão enviados', orderStepEmailPlaceholder: 'exemplo@email.pt', orderStepAgreeTerms: 'Aceito os termos e li a política de privacidade', orderStepAgreeBeforeTerms: 'Aceito os ', orderStepTermsLink: 'termos', orderStepAgreeBetween: ' e li a ', orderStepPrivacyLink: 'política de privacidade', orderStepTermsText: 'Os termos de serviço serão exibidos aqui. Este é um texto temporário – a versão final será adicionada posteriormente.', orderStepPrivacyText: 'A política de privacidade será exibida aqui: como coletamos, armazenamos e usamos seus dados. Esta descrição é temporária – o texto completo será adicionado posteriormente.', orderStepContinue: 'Continuar', paymentTitle: 'Pagamento', paymentOrderSummary: 'Resumo do pedido', paymentPlan: 'Plano', paymentVin: 'VIN', paymentSubtotal: 'Subtotal', paymentDiscount: 'Desconto', paymentTotal: 'Total', paymentDiscountCode: 'Código de desconto', paymentDiscountPlaceholder: 'Digite o código', paymentApply: 'Aplicar', paymentPay: 'Pagar', paymentSecure: 'Pagamento seguro', paymentCodeInvalid: 'Código de desconto inválido', paymentCodeApplied: 'Desconto aplicado', paymentApiUnavailable: 'API de pagamento indisponível. Localmente execute: vercel dev (não npm run dev).', paymentFormLoading: 'Preparando formulário de pagamento…', paymentOrPayAnotherWay: 'Ou pague de outra forma', paymentMethod: 'Método de pagamento', paymentCard: 'Cartão', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'ou', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (mostrados abaixo quando suportados)', planSingle: 'Único', planPopular: 'Mais popular', planBestValue: 'Melhor valor', report1: '1 Relatório', reports2: '2 Relatórios', reports3: '3 Relatórios', refundPolicyText: 'O utilizador tem o direito de desistir dos Serviços (Relatórios) no prazo de 30 dias a partir da data de compra, enviando um pedido por email com número do pedido, data e dados de contacto. O reembolso é processado no prazo de 14 dias após receção do pedido.\n\nOs reembolsos não se aplicam se o relatório já foi usado para verificar o histórico do veículo ou se foi usado pelo menos um relatório do pacote adquirido.', close: 'Fechar' },
    footer: { desc: 'Fonte confiável de histórico de veículos na Europa. Nossa missão é transparência em cada quilómetro.', privacyLink: 'Política de privacidade', termsLink: 'Termos de uso', usageInstructionsLink: 'Instruções de uso' },
    about: { body: 'Vinscanner.eu – verificações confiáveis de VIN e histórico de veículos. Fornecemos relatórios sobre quilometragem, danos e valor de mercado para comprar um carro usado com confiança.', contactLabel: 'Contacte-nos:' },
    loading: { steps: ['Conectando a bases de dados internacionais...', 'Verificando registos de quilometragem...', 'Analisando registo de danos...', 'Verificando bases da Interpol...', 'Gerando relatório...'], ready: 'Pronto!', scanningHistory: 'Analisando histórico', secureConnection: 'Conexão segura', sslEncryption: 'Encriptação SSL ativa' },
    errors: { historyNotFound: 'Histórico não encontrado.', apiFailed: 'Falha ao obter dados da API. Verifique a chave e conexão.', networkFailed: 'Falha ao obter dados. Verifique a conexão.' },
    features: { mileageHistory: 'Histórico de quilometragem', mileageHistoryDesc: 'Analisamos dados de concessionários e registos em toda a Europa.', damageRecords: 'Registo de danos', damageRecordsDesc: 'Informações detalhadas sobre acidentes de trânsito.', theftCheck: 'Verificação de roubo', theftCheckDesc: 'Verificamos bases da Interpol e polícia local.' },
    report: { fullReport: 'Relatório completo', theftClear: 'Não roubado', theftFlagged: 'ROUBADO / PROCURADO', theftUnknown: 'NÃO VERIFICADO', theftUnknownTooltip: 'Verificação de roubo apenas com matrícula UK (Experian AutoCheck)', saveToCloud: 'Guardar relatório na nuvem', downloadPdf: 'Descarregar relatório como PDF', supplementTitle: 'Complementar relatório de fontes:', supplementButton: 'Obter dados', supplementLoading: 'A obter…', serviceHistoryNotFound: 'Histórico de serviço não encontrado – resposta não recebida a tempo. O gráfico de quilometragem pode estar vazio.', mileageHistory: 'Histórico de quilometragem (km)', lastMileage: 'Última quilometragem:', serviceEvents: 'Registos de serviço', damages: 'Danos registados', damageLabel: 'Dano:', severityHigh: 'Alto', severityMedium: 'Médio', marketValue: 'Valor de mercado', marketValueBased: 'Baseado em vendas de modelos similares.', min: 'Mín', max: 'Máx', technicalSpecs: 'Dados técnicos', fuelType: 'Combustível', power: 'Potência', engine: 'Motor', transmission: 'Transmissão', bodyType: 'Carroçaria', colour: 'Cor', aiInsights: 'Análise IA', aiInsightsDesc: 'Com base nos dados do relatório, a IA pode identificar possíveis problemas e pontos fortes do veículo.', analyzing: 'A analisar…', problemAreas: 'Possíveis problemas / riscos', strongPoints: 'Pontos fortes', analyzeWithAI: 'Analisar com IA', refreshAnalysis: 'Atualizar análise IA', retryIn: 'Tentar novamente em', aiAnalysisFailed: 'Falha ao obter análise IA.', allApiSources: 'Todas as fontes API', showRawData: 'Informações API completas (JSON)', show: 'Mostrar', hide: 'Ocultar', saveAsJson: 'Guardar como JSON', rawDataUnavailable: 'Dados API indisponíveis', yes: 'Sim', no: 'Não', showOriginal: 'Mostrar original', translatingServiceComments: 'A traduzir comentários de serviço…', serviceTranslationFailed: 'Tradução falhou. Idioma original exibido.' },
    myReports: { title: 'Meus relatórios', loading: 'A carregar...', noReports: 'Sem relatórios guardados.' },
    aiChat: { welcome: 'Olá! Sou o especialista IA do VinScanner. Como posso ajudá-lo hoje?', cantRespond: 'Desculpe, não posso responder agora.', expertTitle: 'Especialista IA', online: 'Online', placeholder: 'Escreva a sua pergunta...' },
  },
  hu: {
    seo: {
      title: 'VinScanner - Jármű előzményellenőrzés',
      description: 'Ellenőrizze a VIN kódot és fedezze fel a jármű előzményeit: kilométeróra, balesetek, javítások, tulajdonosi előzmények. Gyors és megbízható ellenőrzés.',
      ogTitle: 'VinScanner - Jármű előzményellenőrzés',
      ogDescription: 'Ellenőrizze a VIN kódot és fedezze fel a jármű előzményeit: kilométeróra, balesetek, javítások.',
    },
    nav: { services: 'Szolgáltatások', pricing: 'Árak', about: 'Rólunk', login: 'Bejelentkezés', myReports: 'Jelentéseim', signOut: 'Kijelentkezés', deleteAccount: 'Fiók törlése', deleteAccountConfirm: 'Fiók törlése', deleteAccountConfirmText: 'Biztosan törölni szeretné fiókját? Minden mentett jelentés törlődik. Ez a művelet nem vonható vissza.', deleteAccountDeleting: 'Törlés…', deleteAccountError: 'A törlés sikertelen. Próbálja újra.' },
    tokenMode: { banner: 'Önnek {n} jelentése van a {total}-ból. Adja meg a VIN-t alább.', noReports: 'Nincs több jelentés. Vásároljon új csomagot másik jármű ellenőrzéséhez.', loading: 'Betöltés…', error: 'A vásárlás betöltése sikertelen. Ellenőrizze a linket.' },
    hero: { title: 'Fedezze fel a jármű történetét', titleAccent: 'VIN-kód alapján', desc: 'Ellenőrizze a kilométer-történetet, káreseményeket és piaci értéket másodpercek alatt. Professzionális ellenőrzés mindenki számára.', placeholder: 'Adja meg a VIN számot...', button: 'Ellenőrzés', sample: 'Próba mintával' },
    pricing: { title: 'Válassza ki a megfelelő csomagot', desc: 'Spóroljon több ellenőrzés egyszerre vásárlásával. Professzionális jelentések a helyes döntéshez.', bestValue: 'Legjobb érték', order: 'Rendelés most', confirm: 'Megerősítés', selectPlanForVin: 'Válasszon csomagot VIN ellenőrzéshez', refundPolicy: 'Visszatérítési szabályzat', perReport: 'Jelentésenként:', orderStepTitle: 'Adja meg az emailt a jelentésekhez', orderStepEmailLabel: 'Email cím, ahová a jelentések érkeznek', orderStepEmailPlaceholder: 'pelda@email.hu', orderStepAgreeTerms: 'Elfogadom a feltételeket és elolvastam az adatvédelmi szabályzatot', orderStepAgreeBeforeTerms: 'Elfogadom a ', orderStepTermsLink: 'feltételeket', orderStepAgreeBetween: ' és elolvastam az ', orderStepPrivacyLink: 'adatvédelmi szabályzatot', orderStepTermsText: 'Itt jelennek meg a szolgáltatási feltételek. Ez ideiglenes szöveg – a végleges verzió később kerül hozzáadásra.', orderStepPrivacyText: 'Itt jelenik meg az adatvédelmi szabályzat: hogyan gyűjtjük, tároljuk és használjuk adatait. Ez a leírás ideiglenes – a teljes szöveg később kerül hozzáadásra.', orderStepContinue: 'Tovább', paymentTitle: 'Fizetés', paymentOrderSummary: 'Rendelés összesítő', paymentPlan: 'Csomag', paymentVin: 'VIN', paymentSubtotal: 'Részösszeg', paymentDiscount: 'Kedvezmény', paymentTotal: 'Összesen', paymentDiscountCode: 'Kedvezménykód', paymentDiscountPlaceholder: 'Adja meg a kódot', paymentApply: 'Alkalmaz', paymentPay: 'Fizetés', paymentSecure: 'Biztonságos fizetés', paymentCodeInvalid: 'Érvénytelen kedvezménykód', paymentCodeApplied: 'Kedvezmény alkalmazva', paymentApiUnavailable: 'Fizetési API nem elérhető. Lokálisan futtassa: vercel dev (nem npm run dev).', paymentFormLoading: 'Fizetési űrlap előkészítése…', paymentOrPayAnotherWay: 'Vagy fizessen másképp', paymentMethod: 'Fizetési mód', paymentCard: 'Kártya', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'vagy', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (lent jelenik meg, ha támogatott)', planSingle: 'Egyszeri', planPopular: 'Legnépszerűbb', planBestValue: 'Legjobb érték', report1: '1 Jelentés', reports2: '2 Jelentés', reports3: '3 Jelentés', refundPolicyText: 'A felhasználónak joga van 30 napon belül elállni a Szolgáltatásoktól (Jelentésektől) a vásárlás napjától számítva, emailben küldött kérelemmel, megadva a rendelésszámot, dátumot és elérhetőségeket. A visszatérítés 14 napon belül történik a kérelem beérkezésétől.\n\nA visszatérítés nem alkalmazható, ha a jelentést már használták a jármű történetének ellenőrzésére, vagy ha legalább egy jelentést használtak a megvásárolt csomagból.', close: 'Bezárás' },
    footer: { desc: 'Megbízható járműtörténet-forrás Európában. Küldetésünk az átláthatóság minden kilométernél.', privacyLink: 'Adatvédelmi szabályzat', termsLink: 'Használati feltételek', usageInstructionsLink: 'Használati útmutató' },
    about: { body: 'Vinscanner.eu – megbízható VIN és járműtörténet ellenőrzések. Jelentéseket biztosítunk a kilométerállásról, károkról és piaci értékről, hogy bizalommal vásárolhasson használt autót.', contactLabel: 'Kapcsolat:' },
    loading: { steps: ['Csatlakozás nemzetközi adatbázisokhoz...', 'Kilométer-nyilvántartások ellenőrzése...', 'Kárnyilvántartás elemzése...', 'Interpol adatbázisok ellenőrzése...', 'Jelentés generálása...'], ready: 'Kész!', scanningHistory: 'Történet vizsgálata', secureConnection: 'Biztonságos kapcsolat', sslEncryption: 'SSL titkosítás aktív' },
    errors: { historyNotFound: 'A történet nem található.', apiFailed: 'Nem sikerült adatokat lekérni az API-ból. Ellenőrizze a kulcsot és a kapcsolatot.', networkFailed: 'Nem sikerült adatokat lekérni. Ellenőrizze a kapcsolatot.' },
    features: { mileageHistory: 'Kilométer-történet', mileageHistoryDesc: 'Adatokat elemzünk kereskedőktől és nyilvántartásokból egész Európából.', damageRecords: 'Kárnyilvántartás', damageRecordsDesc: 'Részletes információk a közlekedési balesetekről.', theftCheck: 'Lopásellenőrzés', theftCheckDesc: 'Ellenőrizzük az Interpol és helyi rendőrségi adatbázisokat.' },
    report: { fullReport: 'Teljes jelentés', theftClear: 'Nem lopott', theftFlagged: 'LOPOTT / KÖRÖZÖTT', theftUnknown: 'NEM ELLENŐRZÖTT', theftUnknownTooltip: 'Lopásellenőrzés csak UK rendszámmal (Experian AutoCheck)', saveToCloud: 'Jelentés mentése felhőbe', downloadPdf: 'Jelentés letöltése PDF-ként', supplementTitle: 'Jelentés kiegészítése forrásokból:', supplementButton: 'Adatok lekérése', supplementLoading: 'Lekérés…', serviceHistoryNotFound: 'Szerviz történet nem található – válasz nem érkezett időben. A kilométer-grafikon üres lehet.', mileageHistory: 'Kilométer-történet (km)', lastMileage: 'Utolsó kilométerállás:', serviceEvents: 'Szerviz bejegyzések', damages: 'Rögzített károk', damageLabel: 'Kár:', severityHigh: 'Magas', severityMedium: 'Közepes', marketValue: 'Piaci érték', marketValueBased: 'Hasonló modellek eladásai alapján.', min: 'Min', max: 'Max', technicalSpecs: 'Műszaki adatok', fuelType: 'Üzemanyag', power: 'Teljesítmény', engine: 'Motor', transmission: 'Sebességváltó', bodyType: 'Karosszéria', colour: 'Szín', aiInsights: 'AI elemzés', aiInsightsDesc: 'A jelentés adatai alapján az AI azonosíthatja a lehetséges problémákat és a jármű erősségeit.', analyzing: 'Elemzés…', problemAreas: 'Lehetséges problémák / kockázatok', strongPoints: 'Erősségek', analyzeWithAI: 'Elemzés AI-val', refreshAnalysis: 'AI elemzés frissítése', retryIn: 'Újrapróbálás', aiAnalysisFailed: 'Nem sikerült AI elemzést lekérni.', allApiSources: 'Összes API forrás', showRawData: 'Teljes API információ (JSON)', show: 'Mutat', hide: 'Elrejt', saveAsJson: 'Mentés JSON-ként', rawDataUnavailable: 'API adatok nem elérhetők', yes: 'Igen', no: 'Nem', showOriginal: 'Eredeti mutatása', translatingServiceComments: 'Szerviz megjegyzések fordítása…', serviceTranslationFailed: 'A fordítás sikertelen. Eredeti nyelv megjelenítve.' },
    myReports: { title: 'Jelentéseim', loading: 'Betöltés...', noReports: 'Nincs mentett jelentés.' },
    aiChat: { welcome: 'Üdv! Én vagyok a VinScanner AI szakértője. Miben segíthetek ma?', cantRespond: 'Sajnálom, most nem tudok válaszolni.', expertTitle: 'AI szakértő', online: 'Online', placeholder: 'Írja be kérdését...' },
  },
  bg: {
    seo: {
      title: 'VinScanner - Проверка на история на превозно средство',
      description: 'Проверете VIN кода и открийте историята на превозното средство: пробег, инциденти, ремонти, история на собствеността. Бърза и надеждна проверка.',
      ogTitle: 'VinScanner - Проверка на история на превозно средство',
      ogDescription: 'Проверете VIN кода и открийте историята на превозното средство: пробег, инциденти, ремонти.',
    },
    nav: { services: 'Услуги', pricing: 'Цени', about: 'За нас', login: 'Вход', myReports: 'Моите справки', signOut: 'Изход', deleteAccount: 'Изтриване на акаунт', deleteAccountConfirm: 'Изтриване на акаунт', deleteAccountConfirmText: 'Сигурни ли сте, че искате да изтриете акаунта си? Всички запазени справки ще бъдат премахнати. Това действие не може да бъде отменено.', deleteAccountDeleting: 'Изтриване…', deleteAccountError: 'Неуспешно изтриване. Опитайте отново.' },
    tokenMode: { banner: 'Имате {n} от {total} справки. Въведете VIN по-долу.', noReports: 'Няма останали справки. Купете нов план за проверка на друго превозно средство.', loading: 'Зареждане…', error: 'Неуспешно зареждане на покупката. Проверете линка.' },
    hero: { title: 'Открийте историята на превозното средство', titleAccent: 'по VIN код', desc: 'Проверете история на километража, щети и пазарна стойност за секунди. Професионална проверка достъпна за всеки.', placeholder: 'Въведете VIN номер...', button: 'Провери', sample: 'Опитай с пример' },
    pricing: { title: 'Изберете подходящия план', desc: 'Спестете като купите множество проверки наведнъж. Професионални справки за правилно решение.', bestValue: 'Най-добра стойност', order: 'Поръчай сега', confirm: 'Потвърди', selectPlanForVin: 'Изберете план за VIN проверка', refundPolicy: 'Политика за възстановяване', perReport: 'На справка:', orderStepTitle: 'Въведете имейл за справки', orderStepEmailLabel: 'Имейл адрес, на който ще бъдат изпратени справките', orderStepEmailPlaceholder: 'primer@email.bg', orderStepAgreeTerms: 'Съгласен съм с условията и прочетох политиката за поверителност', orderStepAgreeBeforeTerms: 'Съгласен съм с ', orderStepTermsLink: 'условията', orderStepAgreeBetween: ' и прочетох ', orderStepPrivacyLink: 'политиката за поверителност', orderStepTermsText: 'Тук ще се показват условията за ползване. Това е временен текст – окончателната версия ще бъде добавена по-късно.', orderStepPrivacyText: 'Тук ще се показва политиката за поверителност: как събираме, съхраняваме и използваме вашите данни. Това описание е временно – пълният текст ще бъде добавен по-късно.', orderStepContinue: 'Продължи', paymentTitle: 'Плащане', paymentOrderSummary: 'Обобщение на поръчката', paymentPlan: 'План', paymentVin: 'VIN', paymentSubtotal: 'Междинна сума', paymentDiscount: 'Отстъпка', paymentTotal: 'Общо', paymentDiscountCode: 'Код за отстъпка', paymentDiscountPlaceholder: 'Въведете код', paymentApply: 'Приложи', paymentPay: 'Плати', paymentSecure: 'Сигурно плащане', paymentCodeInvalid: 'Невалиден код за отстъпка', paymentCodeApplied: 'Отстъпката е приложена', paymentApiUnavailable: 'API за плащане недостъпен. Локално стартирайте: vercel dev (не npm run dev).', paymentFormLoading: 'Подготовка на формата за плащане…', paymentOrPayAnotherWay: 'Или платете по друг начин', paymentMethod: 'Начин на плащане', paymentCard: 'Карта', paymentLink: 'Линк', paymentApplePay: 'Apple Pay', paymentEmail: 'Имейл', paymentOr: 'или', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (показани по-долу, ако се поддържат)', planSingle: 'Единичен', planPopular: 'Най-популярен', planBestValue: 'Най-добра стойност', report1: '1 Справка', reports2: '2 Справки', reports3: '3 Справки', refundPolicyText: 'Потребителят има право да се откаже от Услугите (Справките) в рамките на 30 дни от датата на покупка, като изпрати заявка по имейл с номер на поръчка, дата и данни за контакт. Възстановяването се обработва в рамките на 14 дни от получаване на заявката.\n\nВъзстановяването не се прилага, ако справката вече е използвана за проверка на историята на превозното средство или ако е използвана поне една справка от закупения пакет.', close: 'Затвори' },
    footer: { desc: 'Надежден източник на история на превозни средства в Европа. Нашата мисия е прозрачност на всеки километър.', privacyLink: 'Политика за поверителност', termsLink: 'Условия за ползване', usageInstructionsLink: 'Инструкции за употреба' },
    about: { body: 'Vinscanner.eu – надеждни VIN и проверки на история на превозни средства. Предоставяме справки за километраж, щети и пазарна стойност, за да купите употребяван автомобил с увереност.', contactLabel: 'Свържете се с нас:' },
    loading: { steps: ['Свързване с международни бази данни...', 'Проверка на записи за километраж...', 'Анализ на регистър на щети...', 'Проверка на бази на Интерпол...', 'Генериране на справка...'], ready: 'Готово!', scanningHistory: 'Сканиране на история', secureConnection: 'Сигурна връзка', sslEncryption: 'SSL криптиране активно' },
    errors: { historyNotFound: 'Историята не е намерена.', apiFailed: 'Неуспешно получаване на данни от API. Проверете ключа и връзката.', networkFailed: 'Неуспешно получаване на данни. Проверете връзката.' },
    features: { mileageHistory: 'История на километража', mileageHistoryDesc: 'Анализираме данни от дилъри и регистри в цяла Европа.', damageRecords: 'Регистър на щети', damageRecordsDesc: 'Подробна информация за пътни инциденти.', theftCheck: 'Проверка за кражба', theftCheckDesc: 'Проверяваме базите на Интерпол и местната полиция.' },
    report: { fullReport: 'Пълна справка', theftClear: 'Не е откраднат', theftFlagged: 'ОТКРАДНАТ / ИЗДИРВАН', theftUnknown: 'НЕ Е ПРОВЕРЕНО', theftUnknownTooltip: 'Проверка за кражба само с UK регистрация (Experian AutoCheck)', saveToCloud: 'Запази справката в облака', downloadPdf: 'Изтегли справката като PDF', supplementTitle: 'Допълни справката от източници:', supplementButton: 'Вземи данни', supplementLoading: 'Зареждане…', serviceHistoryNotFound: 'История на сервиза не е намерена – отговорът не е получен навреме. Графиката на километража може да е празна.', mileageHistory: 'История на километража (км)', lastMileage: 'Последен километраж:', serviceEvents: 'Сервизни записи', damages: 'Регистрирани щети', damageLabel: 'Щета:', severityHigh: 'Висока', severityMedium: 'Средна', marketValue: 'Пазарна стойност', marketValueBased: 'Базирано на продажби на подобни модели.', min: 'Мин', max: 'Макс', technicalSpecs: 'Технически данни', fuelType: 'Гориво', power: 'Мощност', engine: 'Двигател', transmission: 'Скоростна кутия', bodyType: 'Каросерия', colour: 'Цвят', aiInsights: 'AI анализ', aiInsightsDesc: 'Въз основа на данните от справката, AI може да идентифицира възможни проблеми и силни страни на превозното средство.', analyzing: 'Анализиране…', problemAreas: 'Възможни проблеми / рискове', strongPoints: 'Силни страни', analyzeWithAI: 'Анализирай с AI', refreshAnalysis: 'Обнови AI анализа', retryIn: 'Опитай отново след', aiAnalysisFailed: 'Неуспешно получаване на AI анализ.', allApiSources: 'Всички API източници', showRawData: 'Пълна API информация (JSON)', show: 'Покажи', hide: 'Скрий', saveAsJson: 'Запази като JSON', rawDataUnavailable: 'API данни недостъпни', yes: 'Да', no: 'Не', showOriginal: 'Покажи оригинала', translatingServiceComments: 'Превод на сервизни коментари…', serviceTranslationFailed: 'Преводът е неуспешен. Показва се оригинален език.' },
    myReports: { title: 'Моите справки', loading: 'Зареждане...', noReports: 'Няма запазени справки.' },
    aiChat: { welcome: 'Здравейте! Аз съм AI експерт на VinScanner. Как мога да ви помогна днес?', cantRespond: 'Съжалявам, не мога да отговоря сега.', expertTitle: 'AI експерт', online: 'Онлайн', placeholder: 'Напишете въпроса си...' },
  },
  sr: {
    seo: {
      title: 'VinScanner - Провера историје возила',
      description: 'Проверите VIN код и откријте историју возила: километража, удеси, поправке, историја власништва. Брза и поуздана провера.',
      ogTitle: 'VinScanner - Провера историје возила',
      ogDescription: 'Проверите VIN код и откријте историју возила: километража, удеси, поправке, историја власништва.',
    },
    nav: { services: 'Услуге', pricing: 'Цене', about: 'О нама', login: 'Пријава', myReports: 'Моји извештаји', signOut: 'Одјава', deleteAccount: 'Обриши налог', deleteAccountConfirm: 'Обриши налог', deleteAccountConfirmText: 'Да ли сте сигурни да желите да обришете свој налог? Сви сачувани извештаји ће бити уклоњени. Ова радња се не може поништити.', deleteAccountDeleting: 'Брисање…', deleteAccountError: 'Брисање није успело. Покушајте поново.' },
    tokenMode: { banner: 'Имате {n} од {total} извештаја. Унесите VIN испод.', noReports: 'Нема преосталих извештаја. Купите нови план за проверу другог возила.', loading: 'Учитавање…', error: 'Учитавање куповине није успело. Проверите линк.' },
    hero: { title: 'Откријте историју возила', titleAccent: 'по VIN коду', desc: 'Проверите историју километраже, штете и тржишну вредност за неколико секунди. Професионална верификација доступна свима.', placeholder: 'Унесите VIN број...', button: 'Провери', sample: 'Испробај са примером' },
    pricing: { title: 'Изаберите одговарајући план', desc: 'Уштедите купујући више провера одједном. Професионални извештаји помажу у доношењу праве одлуке.', bestValue: 'Најбоља вредност', order: 'Наручи сада', confirm: 'Потврди', selectPlanForVin: 'Изаберите план за VIN проверу', refundPolicy: 'Политика повраћаја', perReport: 'По извештају:', orderStepTitle: 'Унесите имејл за извештаје', orderStepEmailLabel: 'Имејл адреса на коју ће бити послати извештаји', orderStepEmailPlaceholder: 'primer@email.rs', orderStepAgreeTerms: 'Слажем се са условима и прочитао сам политику приватности', orderStepAgreeBeforeTerms: 'Слажем се са ', orderStepTermsLink: 'условима', orderStepAgreeBetween: ' и прочитао сам ', orderStepPrivacyLink: 'политику приватности', orderStepTermsText: 'Овде ће бити приказани услови коришћења. Ово је привремени текст – коначна верзија биће додата касније.', orderStepPrivacyText: 'Овде ће бити приказана политика приватности: како прикупљамо, чувамо и користимо ваше податке. Овај опис је привремен – комплетан текст биће додат касније.', orderStepContinue: 'Настави', paymentTitle: 'Плаћање', paymentOrderSummary: 'Резиме наруџбине', paymentPlan: 'План', paymentVin: 'VIN', paymentSubtotal: 'Међузбир', paymentDiscount: 'Попуст', paymentTotal: 'Укупно', paymentDiscountCode: 'Код за попуст', paymentDiscountPlaceholder: 'Унесите код', paymentApply: 'Примени', paymentPay: 'Плати', paymentSecure: 'Безбедно плаћање', paymentCodeInvalid: 'Неважећи код за попуст', paymentCodeApplied: 'Попуст примењен', paymentApiUnavailable: 'API за плаћање није доступан. Локално покрените: vercel dev (не npm run dev).', paymentFormLoading: 'Припрема форме за плаћање…', paymentOrPayAnotherWay: 'Или платите на други начин', paymentMethod: 'Начин плаћања', paymentCard: 'Картица', paymentLink: 'Линк', paymentApplePay: 'Apple Pay', paymentEmail: 'Имејл', paymentOr: 'или', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (приказано испод ако је подржано)', planSingle: 'Појединачан', planPopular: 'Најпопуларнији', planBestValue: 'Најбоља вредност', report1: '1 Извештај', reports2: '2 Извештаја', reports3: '3 Извештаја', refundPolicyText: 'Корисник има право да одустане од Услуга (Извештаја) у року од 30 дана од датума куповине, подношењем захтева путем имејла са бројем наруџбине, датумом и контакт подацима. Повраћај се обрађује у року од 14 дана од пријема захтева.\n\nПовраћај се не примењује ако је извештај већ коришћен за верификацију историје возила или ако је коришћен најмање један извештај из купљеног пакета.', close: 'Затвори' },
    footer: { desc: 'Поуздан извор историје возила у Европи. Наша мисија је транспарентност на сваком километру.', privacyLink: 'Политика приватности', termsLink: 'Услови коришћења', usageInstructionsLink: 'Упутства за употребу' },
    about: { body: 'Vinscanner.eu – поуздане VIN и провере историје возила. Пружамо извештаје о километражи, штетама и тржишној вредности да бисте купили половни аутомобил са поверењем.', contactLabel: 'Контактирајте нас:' },
    loading: { steps: ['Повезивање са међународним базама података...', 'Провера записа о километражи...', 'Анализа регистра штета...', 'Провера Интерпол база...', 'Генерисање извештаја...'], ready: 'Готово!', scanningHistory: 'Скенирање историје', secureConnection: 'Безбедна веза', sslEncryption: 'SSL шифровање активно' },
    errors: { historyNotFound: 'Историја није пронађена.', apiFailed: 'Није успело преузимање података из API-ја. Проверите кључ и везу.', networkFailed: 'Није успело преузимање података. Проверите везу.' },
    features: { mileageHistory: 'Историја километраже', mileageHistoryDesc: 'Анализирамо податке од дилера и регистара широм Европе.', damageRecords: 'Регистар штета', damageRecordsDesc: 'Детаљне информације о саобраћајним несрећама.', theftCheck: 'Провера крађе', theftCheckDesc: 'Проверавамо базе Интерпола и локалне полиције.' },
    report: { fullReport: 'Комплетан извештај', theftClear: 'Није украден', theftFlagged: 'УКРАДЕН / ТРАЖЕН', theftUnknown: 'НИЈЕ ПРОВЕРЕНО', theftUnknownTooltip: 'Провера крађе само са UK регистрацијом (Experian AutoCheck)', saveToCloud: 'Сачувај извештај у облак', downloadPdf: 'Преузми извештај као PDF', supplementTitle: 'Допуни извештај из извора:', supplementButton: 'Преузми податке', supplementLoading: 'Преузимање…', serviceHistoryNotFound: 'Историја сервиса није пронађена – одговор није примљен на време. График километраже може бити празан.', mileageHistory: 'Историја километраже (км)', lastMileage: 'Последња километража:', serviceEvents: 'Сервисни записи', damages: 'Забележене штете', damageLabel: 'Штета:', severityHigh: 'Висока', severityMedium: 'Средња', marketValue: 'Тржишна вредност', marketValueBased: 'На основу продаја сличних модела.', min: 'Мин', max: 'Макс', technicalSpecs: 'Технички подаци', fuelType: 'Гориво', power: 'Снага', engine: 'Мотор', transmission: 'Мењач', bodyType: 'Каросерија', colour: 'Боја', aiInsights: 'AI анализа', aiInsightsDesc: 'На основу података извештаја, AI може идентификовати могуће проблеме и јаке стране возила.', analyzing: 'Анализирање…', problemAreas: 'Могући проблеми / ризици', strongPoints: 'Јаке стране', analyzeWithAI: 'Анализирај са AI', refreshAnalysis: 'Освежи AI анализу', retryIn: 'Покушај поново за', aiAnalysisFailed: 'Није успело преузимање AI анализе.', allApiSources: 'Сви API извори', showRawData: 'Комплетне API информације (JSON)', show: 'Прикажи', hide: 'Сакриј', saveAsJson: 'Сачувај као JSON', rawDataUnavailable: 'API подаци недоступни', yes: 'Да', no: 'Не', showOriginal: 'Прикажи оригинал', translatingServiceComments: 'Превођење сервисних коментара…', serviceTranslationFailed: 'Превод није успео. Приказује се оригинални језик.' },
    myReports: { title: 'Моји извештаји', loading: 'Учитавање...', noReports: 'Нема сачуваних извештаја.' },
    aiChat: { welcome: 'Здраво! Ја сам VinScanner AI експерт. Како вам могу помоћи данас?', cantRespond: 'Извините, не могу сада да одговорим.', expertTitle: 'AI експерт', online: 'Онлајн', placeholder: 'Напишите своје питање...' },
  },
  da: {
    seo: {
      title: 'VinScanner - Køretøjshistorik kontrol',
      description: 'Tjek VIN-koden og opdag køretøjets historik: kilometertal, ulykker, reparationer, ejerhistorik. Hurtig og pålidelig kontrol.',
      ogTitle: 'VinScanner - Køretøjshistorik kontrol',
      ogDescription: 'Tjek VIN-koden og opdag køretøjets historik: kilometertal, ulykker, reparationer.',
    },
    nav: { services: 'Tjenester', pricing: 'Priser', about: 'Om os', login: 'Log ind', myReports: 'Mine rapporter', signOut: 'Log ud', deleteAccount: 'Slet konto', deleteAccountConfirm: 'Slet konto', deleteAccountConfirmText: 'Er du sikker på, at du vil slette din konto? Alle gemte rapporter vil blive fjernet. Denne handling kan ikke fortrydes.', deleteAccountDeleting: 'Sletter…', deleteAccountError: 'Sletning mislykkedes. Prøv igen.' },
    tokenMode: { banner: 'Du har {n} af {total} rapporter. Indtast VIN nedenfor.', noReports: 'Ingen rapporter tilbage. Køb en ny plan for at tjekke et andet køretøj.', loading: 'Indlæser…', error: 'Kunne ikke indlæse købet. Tjek linket.' },
    hero: { title: 'Opdag køretøjets historik', titleAccent: 'via VIN-kode', desc: 'Tjek kilometerhistorik, skaderegistre og markedsværdi på sekunder. Professionel verifikation tilgængelig for alle.', placeholder: 'Indtast VIN-nummer...', button: 'Tjek', sample: 'Prøv med et eksempel' },
    pricing: { title: 'Vælg den rigtige plan', desc: 'Spar ved at købe flere tjek på én gang. Professionelle rapporter hjælper med at træffe den rigtige beslutning.', bestValue: 'Bedste værdi', order: 'Bestil nu', confirm: 'Bekræft', selectPlanForVin: 'Vælg en plan til VIN-tjek', refundPolicy: 'Tilbagebetalingspolitik', perReport: 'Per rapport:', orderStepTitle: 'Indtast e-mail til rapporter', orderStepEmailLabel: 'E-mailadresse hvor rapporter sendes til', orderStepEmailPlaceholder: 'eksempel@email.dk', orderStepAgreeTerms: 'Jeg accepterer vilkårene og har læst privatlivspolitikken', orderStepAgreeBeforeTerms: 'Jeg accepterer ', orderStepTermsLink: 'vilkårene', orderStepAgreeBetween: ' og har læst ', orderStepPrivacyLink: 'privatlivspolitikken', orderStepTermsText: 'Her vises servicevilkårene. Dette er midlertidig tekst – den endelige version tilføjes senere.', orderStepPrivacyText: 'Her vises privatlivspolitikken: hvordan vi indsamler, opbevarer og bruger dine data. Denne beskrivelse er midlertidig – den fulde tekst tilføjes senere.', orderStepContinue: 'Fortsæt', paymentTitle: 'Betaling', paymentOrderSummary: 'Ordreoversigt', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Subtotal', paymentDiscount: 'Rabat', paymentTotal: 'Total', paymentDiscountCode: 'Rabatkode', paymentDiscountPlaceholder: 'Indtast kode', paymentApply: 'Anvend', paymentPay: 'Betal', paymentSecure: 'Sikker betaling', paymentCodeInvalid: 'Ugyldig rabatkode', paymentCodeApplied: 'Rabat anvendt', paymentApiUnavailable: 'Betalings-API ikke tilgængelig. Kør lokalt: vercel dev (ikke npm run dev).', paymentFormLoading: 'Forbereder betalingsformular…', paymentOrPayAnotherWay: 'Eller betal på anden måde', paymentMethod: 'Betalingsmetode', paymentCard: 'Kort', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'E-mail', paymentOr: 'eller', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (vises nedenfor hvis understøttet)', planSingle: 'Enkelt', planPopular: 'Mest populære', planBestValue: 'Bedste værdi', report1: '1 Rapport', reports2: '2 Rapporter', reports3: '3 Rapporter', refundPolicyText: 'Brugeren har ret til at fortryde Tjenesterne (Rapporterne) inden for 30 dage fra købsdatoen ved at indsende en anmodning via e-mail med ordrenummer, dato og kontaktoplysninger. Tilbagebetalingen behandles inden for 14 dage efter modtagelse af anmodningen.\n\nTilbagebetalinger gælder ikke, hvis rapporten allerede er brugt til at verificere køretøjets historik, eller hvis mindst én rapport fra den købte pakke er brugt.', close: 'Luk' },
    footer: { desc: 'Pålidelig kilde til køretøjshistorik i Europa. Vores mission er gennemsigtighed ved hver kilometer.', privacyLink: 'Privatlivspolitik', termsLink: 'Brugsvilkår', usageInstructionsLink: 'Brugsvejledning' },
    about: { body: 'Vinscanner.eu – pålidelige VIN- og køretøjshistoriktjek. Vi leverer rapporter om kilometerstand, skader og markedsværdi, så du kan købe en brugt bil med tillid.', contactLabel: 'Kontakt os:' },
    loading: { steps: ['Forbinder til internationale databaser...', 'Tjekker kilometerregistre...', 'Analyserer skaderegister...', 'Tjekker Interpol-databaser...', 'Genererer rapport...'], ready: 'Klar!', scanningHistory: 'Scanner historik', secureConnection: 'Sikker forbindelse', sslEncryption: 'SSL-kryptering aktiv' },
    errors: { historyNotFound: 'Historik ikke fundet.', apiFailed: 'Kunne ikke hente data fra API. Tjek nøgle og forbindelse.', networkFailed: 'Kunne ikke hente data. Tjek forbindelsen.' },
    features: { mileageHistory: 'Kilometerhistorik', mileageHistoryDesc: 'Vi analyserer data fra forhandlere og registre i hele Europa.', damageRecords: 'Skaderegister', damageRecordsDesc: 'Detaljeret information om trafikulykker.', theftCheck: 'Tyvericheck', theftCheckDesc: 'Vi tjekker Interpol og lokale politidatabaser.' },
    report: { fullReport: 'Fuld rapport', theftClear: 'Ikke stjålet', theftFlagged: 'STJÅLET / EFTERSØGT', theftUnknown: 'IKKE TJEKKET', theftUnknownTooltip: 'Tyvericheck kun med UK-registrering (Experian AutoCheck)', saveToCloud: 'Gem rapport i skyen', downloadPdf: 'Download rapport som PDF', supplementTitle: 'Supplér rapport fra kilder:', supplementButton: 'Hent data', supplementLoading: 'Henter…', serviceHistoryNotFound: 'Servicehistorik ikke fundet – svar ikke modtaget i tide. Kilometergrafen kan være tom.', mileageHistory: 'Kilometerhistorik (km)', lastMileage: 'Seneste kilometerstand:', serviceEvents: 'Serviceregistreringer', damages: 'Registrerede skader', damageLabel: 'Skade:', severityHigh: 'Høj', severityMedium: 'Mellem', marketValue: 'Markedsværdi', marketValueBased: 'Baseret på salg af lignende modeller.', min: 'Min', max: 'Maks', technicalSpecs: 'Tekniske data', fuelType: 'Brændstof', power: 'Effekt', engine: 'Motor', transmission: 'Gearkasse', bodyType: 'Karrosseri', colour: 'Farve', aiInsights: 'AI-analyse', aiInsightsDesc: 'Baseret på rapportdata kan AI identificere mulige problemer og køretøjets styrker.', analyzing: 'Analyserer…', problemAreas: 'Mulige problemer / risici', strongPoints: 'Styrker', analyzeWithAI: 'Analysér med AI', refreshAnalysis: 'Opdater AI-analyse', retryIn: 'Prøv igen om', aiAnalysisFailed: 'Kunne ikke hente AI-analyse.', allApiSources: 'Alle API-kilder', showRawData: 'Fuld API-information (JSON)', show: 'Vis', hide: 'Skjul', saveAsJson: 'Gem som JSON', rawDataUnavailable: 'API-data ikke tilgængelig', yes: 'Ja', no: 'Nej', showOriginal: 'Vis original', translatingServiceComments: 'Oversætter servicekommentarer…', serviceTranslationFailed: 'Oversættelse mislykkedes. Viser originalt sprog.' },
    myReports: { title: 'Mine rapporter', loading: 'Indlæser...', noReports: 'Ingen gemte rapporter.' },
    aiChat: { welcome: 'Hej! Jeg er VinScanner AI-ekspert. Hvordan kan jeg hjælpe dig i dag?', cantRespond: 'Beklager, jeg kan ikke svare lige nu.', expertTitle: 'AI-ekspert', online: 'Online', placeholder: 'Skriv dit spørgsmål...' },
  },
  no: {
    seo: {
      title: 'VinScanner - Kjøretøyhistorikk sjekk',
      description: 'Sjekk VIN-koden og oppdag kjøretøyets historikk: kilometerstand, ulykker, reparasjoner, eierhistorikk. Rask og pålitelig kontroll.',
      ogTitle: 'VinScanner - Kjøretøyhistorikk sjekk',
      ogDescription: 'Sjekk VIN-koden og oppdag kjøretøyets historikk: kilometerstand, ulykker, reparasjoner.',
    },
    nav: { services: 'Tjenester', pricing: 'Priser', about: 'Om oss', login: 'Logg inn', myReports: 'Mine rapporter', signOut: 'Logg ut', deleteAccount: 'Slett konto', deleteAccountConfirm: 'Slett konto', deleteAccountConfirmText: 'Er du sikker på at du vil slette kontoen din? Alle lagrede rapporter vil bli fjernet. Denne handlingen kan ikke angres.', deleteAccountDeleting: 'Sletter…', deleteAccountError: 'Sletting mislyktes. Prøv igjen.' },
    tokenMode: { banner: 'Du har {n} av {total} rapporter. Skriv inn VIN nedenfor.', noReports: 'Ingen rapporter igjen. Kjøp en ny plan for å sjekke et annet kjøretøy.', loading: 'Laster…', error: 'Kunne ikke laste kjøpet. Sjekk lenken.' },
    hero: { title: 'Oppdag kjøretøyets historikk', titleAccent: 'via VIN-kode', desc: 'Sjekk kilometerhistorikk, skaderegistre og markedsverdi på sekunder. Profesjonell verifisering tilgjengelig for alle.', placeholder: 'Skriv inn VIN-nummer...', button: 'Sjekk', sample: 'Prøv med et eksempel' },
    pricing: { title: 'Velg riktig plan', desc: 'Spar ved å kjøpe flere sjekker på en gang. Profesjonelle rapporter hjelper deg å ta riktig beslutning.', bestValue: 'Beste verdi', order: 'Bestill nå', confirm: 'Bekreft', selectPlanForVin: 'Velg en plan for VIN-sjekk', refundPolicy: 'Refusjonspolicy', perReport: 'Per rapport:', orderStepTitle: 'Skriv inn e-post for rapporter', orderStepEmailLabel: 'E-postadresse der rapporter sendes', orderStepEmailPlaceholder: 'eksempel@email.no', orderStepAgreeTerms: 'Jeg godtar vilkårene og har lest personvernreglene', orderStepAgreeBeforeTerms: 'Jeg godtar ', orderStepTermsLink: 'vilkårene', orderStepAgreeBetween: ' og har lest ', orderStepPrivacyLink: 'personvernreglene', orderStepTermsText: 'Her vises tjenestevilkårene. Dette er midlertidig tekst – den endelige versjonen legges til senere.', orderStepPrivacyText: 'Her vises personvernreglene: hvordan vi samler inn, lagrer og bruker dataene dine. Denne beskrivelsen er midlertidig – den fullstendige teksten legges til senere.', orderStepContinue: 'Fortsett', paymentTitle: 'Betaling', paymentOrderSummary: 'Ordresammendrag', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Delsum', paymentDiscount: 'Rabatt', paymentTotal: 'Totalt', paymentDiscountCode: 'Rabattkode', paymentDiscountPlaceholder: 'Skriv inn kode', paymentApply: 'Bruk', paymentPay: 'Betal', paymentSecure: 'Sikker betaling', paymentCodeInvalid: 'Ugyldig rabattkode', paymentCodeApplied: 'Rabatt brukt', paymentApiUnavailable: 'Betalings-API ikke tilgjengelig. Kjør lokalt: vercel dev (ikke npm run dev).', paymentFormLoading: 'Forbereder betalingsskjema…', paymentOrPayAnotherWay: 'Eller betal på en annen måte', paymentMethod: 'Betalingsmetode', paymentCard: 'Kort', paymentLink: 'Lenke', paymentApplePay: 'Apple Pay', paymentEmail: 'E-post', paymentOr: 'eller', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (vises nedenfor hvis støttet)', planSingle: 'Enkelt', planPopular: 'Mest populær', planBestValue: 'Beste verdi', report1: '1 Rapport', reports2: '2 Rapporter', reports3: '3 Rapporter', refundPolicyText: 'Brukeren har rett til å trekke seg fra Tjenestene (Rapportene) innen 30 dager fra kjøpsdatoen ved å sende en forespørsel via e-post med ordrenummer, dato og kontaktinformasjon. Refusjonen behandles innen 14 dager etter mottak av forespørselen.\n\nRefusjoner gjelder ikke hvis rapporten allerede er brukt til å verifisere kjøretøyets historikk, eller hvis minst én rapport fra den kjøpte pakken er brukt.', close: 'Lukk' },
    footer: { desc: 'Pålitelig kilde for kjøretøyhistorikk i Europa. Vårt oppdrag er åpenhet ved hver kilometer.', privacyLink: 'Personvernregler', termsLink: 'Bruksvilkår', usageInstructionsLink: 'Bruksanvisning' },
    about: { body: 'Vinscanner.eu – pålitelige VIN- og kjøretøyhistorikksjekker. Vi leverer rapporter om kilometerstand, skader og markedsverdi slik at du kan kjøpe en bruktbil med tillit.', contactLabel: 'Kontakt oss:' },
    loading: { steps: ['Kobler til internasjonale databaser...', 'Sjekker kilometerregistre...', 'Analyserer skaderegister...', 'Sjekker Interpol-databaser...', 'Genererer rapport...'], ready: 'Klar!', scanningHistory: 'Skanner historikk', secureConnection: 'Sikker tilkobling', sslEncryption: 'SSL-kryptering aktiv' },
    errors: { historyNotFound: 'Historikk ikke funnet.', apiFailed: 'Kunne ikke hente data fra API. Sjekk nøkkel og tilkobling.', networkFailed: 'Kunne ikke hente data. Sjekk tilkoblingen.' },
    features: { mileageHistory: 'Kilometerhistorikk', mileageHistoryDesc: 'Vi analyserer data fra forhandlere og registre i hele Europa.', damageRecords: 'Skaderegister', damageRecordsDesc: 'Detaljert informasjon om trafikkulykker.', theftCheck: 'Tyveriskjekk', theftCheckDesc: 'Vi sjekker Interpol og lokale politidatabaser.' },
    report: { fullReport: 'Full rapport', theftClear: 'Ikke stjålet', theftFlagged: 'STJÅLET / ETTERLYST', theftUnknown: 'IKKE SJEKKET', theftUnknownTooltip: 'Tyveriskjekk kun med UK-registrering (Experian AutoCheck)', saveToCloud: 'Lagre rapport i skyen', downloadPdf: 'Last ned rapport som PDF', supplementTitle: 'Supplér rapport fra kilder:', supplementButton: 'Hent data', supplementLoading: 'Henter…', serviceHistoryNotFound: 'Servicehistorikk ikke funnet – svar ikke mottatt i tide. Kilometergrafen kan være tom.', mileageHistory: 'Kilometerhistorikk (km)', lastMileage: 'Siste kilometerstand:', serviceEvents: 'Serviceregistreringer', damages: 'Registrerte skader', damageLabel: 'Skade:', severityHigh: 'Høy', severityMedium: 'Middels', marketValue: 'Markedsverdi', marketValueBased: 'Basert på salg av lignende modeller.', min: 'Min', max: 'Maks', technicalSpecs: 'Tekniske data', fuelType: 'Drivstoff', power: 'Effekt', engine: 'Motor', transmission: 'Girkasse', bodyType: 'Karosseri', colour: 'Farge', aiInsights: 'AI-analyse', aiInsightsDesc: 'Basert på rapportdata kan AI identifisere mulige problemer og kjøretøyets styrker.', analyzing: 'Analyserer…', problemAreas: 'Mulige problemer / risikoer', strongPoints: 'Styrker', analyzeWithAI: 'Analysér med AI', refreshAnalysis: 'Oppdater AI-analyse', retryIn: 'Prøv igjen om', aiAnalysisFailed: 'Kunne ikke hente AI-analyse.', allApiSources: 'Alle API-kilder', showRawData: 'Full API-informasjon (JSON)', show: 'Vis', hide: 'Skjul', saveAsJson: 'Lagre som JSON', rawDataUnavailable: 'API-data ikke tilgjengelig', yes: 'Ja', no: 'Nei', showOriginal: 'Vis original', translatingServiceComments: 'Oversetter servicekommentarer…', serviceTranslationFailed: 'Oversettelse mislyktes. Viser originalspråk.' },
    myReports: { title: 'Mine rapporter', loading: 'Laster...', noReports: 'Ingen lagrede rapporter.' },
    aiChat: { welcome: 'Hei! Jeg er VinScanner AI-ekspert. Hvordan kan jeg hjelpe deg i dag?', cantRespond: 'Beklager, jeg kan ikke svare nå.', expertTitle: 'AI-ekspert', online: 'Online', placeholder: 'Skriv spørsmålet ditt...' },
  },
  fi: {
    seo: {
      title: 'VinScanner - Ajoneuvon historiatarkistus',
      description: 'Tarkista VIN-koodi ja selvitä ajoneuvon historia: mittarilukema, onnettomuudet, korjaukset, omistushistoria. Nopea ja luotettava tarkistus.',
      ogTitle: 'VinScanner - Ajoneuvon historiatarkistus',
      ogDescription: 'Tarkista VIN-koodi ja selvitä ajoneuvon historia: mittarilukema, onnettomuudet, korjaukset.',
    },
    nav: { services: 'Palvelut', pricing: 'Hinnat', about: 'Tietoa meistä', login: 'Kirjaudu', myReports: 'Omat raportit', signOut: 'Kirjaudu ulos', deleteAccount: 'Poista tili', deleteAccountConfirm: 'Poista tili', deleteAccountConfirmText: 'Oletko varma, että haluat poistaa tilisi? Kaikki tallennetut raportit poistetaan. Tätä toimintoa ei voi peruuttaa.', deleteAccountDeleting: 'Poistetaan…', deleteAccountError: 'Poisto epäonnistui. Yritä uudelleen.' },
    tokenMode: { banner: 'Sinulla on {n}/{total} raporttia jäljellä. Syötä VIN alla.', noReports: 'Ei raportteja jäljellä. Osta uusi paketti toisen ajoneuvon tarkistamiseen.', loading: 'Ladataan…', error: 'Ostoa ei voitu ladata. Tarkista linkki.' },
    hero: { title: 'Selvitä ajoneuvon historia', titleAccent: 'VIN-koodin avulla', desc: 'Tarkista ajokilometrihistoria, vahinkorekisterit ja markkina-arvo sekunneissa. Ammattimainen tarkistus kaikkien saatavilla.', placeholder: 'Syötä VIN-numero...', button: 'Tarkista', sample: 'Kokeile esimerkillä' },
    pricing: { title: 'Valitse oikea paketti', desc: 'Säästä ostamalla useita tarkistuksia kerralla. Ammattimaiset raportit auttavat tekemään oikean päätöksen.', bestValue: 'Paras arvo', order: 'Tilaa nyt', confirm: 'Vahvista', selectPlanForVin: 'Valitse paketti VIN-tarkistukseen', refundPolicy: 'Palautuskäytäntö', perReport: 'Per raportti:', orderStepTitle: 'Syötä sähköposti raportteja varten', orderStepEmailLabel: 'Sähköpostiosoite, johon raportit lähetetään', orderStepEmailPlaceholder: 'esimerkki@email.fi', orderStepAgreeTerms: 'Hyväksyn ehdot ja olen lukenut tietosuojakäytännön', orderStepAgreeBeforeTerms: 'Hyväksyn ', orderStepTermsLink: 'ehdot', orderStepAgreeBetween: ' ja olen lukenut ', orderStepPrivacyLink: 'tietosuojakäytännön', orderStepTermsText: 'Tässä näytetään käyttöehdot. Tämä on väliaikainen teksti – lopullinen versio lisätään myöhemmin.', orderStepPrivacyText: 'Tässä näytetään tietosuojakäytäntö: miten keräämme, tallennamme ja käytämme tietojasi. Tämä kuvaus on väliaikainen – täydellinen teksti lisätään myöhemmin.', orderStepContinue: 'Jatka', paymentTitle: 'Maksu', paymentOrderSummary: 'Tilauksen yhteenveto', paymentPlan: 'Paketti', paymentVin: 'VIN', paymentSubtotal: 'Välisumma', paymentDiscount: 'Alennus', paymentTotal: 'Yhteensä', paymentDiscountCode: 'Alennuskoodi', paymentDiscountPlaceholder: 'Syötä koodi', paymentApply: 'Käytä', paymentPay: 'Maksa', paymentSecure: 'Turvallinen maksu', paymentCodeInvalid: 'Virheellinen alennuskoodi', paymentCodeApplied: 'Alennus käytetty', paymentApiUnavailable: 'Maksu-API ei käytettävissä. Paikallisesti aja: vercel dev (ei npm run dev).', paymentFormLoading: 'Valmistellaan maksulomaketta…', paymentOrPayAnotherWay: 'Tai maksa toisella tavalla', paymentMethod: 'Maksutapa', paymentCard: 'Kortti', paymentLink: 'Linkki', paymentApplePay: 'Apple Pay', paymentEmail: 'Sähköposti', paymentOr: 'tai', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (näytetään alla jos tuettu)', planSingle: 'Yksittäinen', planPopular: 'Suosituin', planBestValue: 'Paras arvo', report1: '1 Raportti', reports2: '2 Raporttia', reports3: '3 Raporttia', refundPolicyText: 'Käyttäjällä on oikeus peruuttaa Palvelut (Raportit) 30 päivän kuluessa ostopäivästä lähettämällä pyynnön sähköpostitse tilausnumerolla, päivämäärällä ja yhteystiedoilla. Palautus käsitellään 14 päivän kuluessa pyynnön vastaanottamisesta.\n\nPalautukset eivät koske tapauksia, joissa raporttia on jo käytetty ajoneuvon historian tarkistamiseen tai jos vähintään yksi raportti ostetusta paketista on käytetty.', close: 'Sulje' },
    footer: { desc: 'Luotettava ajoneuvohistorian lähde Euroopassa. Tehtävämme on läpinäkyvyys jokaisella kilometrillä.', privacyLink: 'Tietosuojakäytäntö', termsLink: 'Käyttöehdot', usageInstructionsLink: 'Käyttöohjeet' },
    about: { body: 'Vinscanner.eu – luotettavat VIN- ja ajoneuvohistoriatarkistukset. Tarjoamme raportteja ajokilometreistä, vahingoista ja markkina-arvosta, jotta voit ostaa käytetyn auton luottavaisin mielin.', contactLabel: 'Ota yhteyttä:' },
    loading: { steps: ['Yhdistetään kansainvälisiin tietokantoihin...', 'Tarkistetaan kilometrirekistereitä...', 'Analysoidaan vahinkorekisteriä...', 'Tarkistetaan Interpol-tietokantoja...', 'Luodaan raporttia...'], ready: 'Valmis!', scanningHistory: 'Skannataan historiaa', secureConnection: 'Suojattu yhteys', sslEncryption: 'SSL-salaus aktiivinen' },
    errors: { historyNotFound: 'Historiaa ei löytynyt.', apiFailed: 'Tietojen haku API:sta epäonnistui. Tarkista avain ja yhteys.', networkFailed: 'Tietojen haku epäonnistui. Tarkista yhteys.' },
    features: { mileageHistory: 'Kilometrihistoria', mileageHistoryDesc: 'Analysoimme tietoja jälleenmyyjiltä ja rekistereistä ympäri Eurooppaa.', damageRecords: 'Vahinkorekisteri', damageRecordsDesc: 'Yksityiskohtaista tietoa liikenneonnettomuuksista.', theftCheck: 'Varkastarkistus', theftCheckDesc: 'Tarkistamme Interpolin ja paikallispoliisin tietokannat.' },
    report: { fullReport: 'Täydellinen raportti', theftClear: 'Ei varastettu', theftFlagged: 'VARASTETTU / ETSITTY', theftUnknown: 'EI TARKISTETTU', theftUnknownTooltip: 'Varkastarkistus vain UK-rekisteröinnillä (Experian AutoCheck)', saveToCloud: 'Tallenna raportti pilveen', downloadPdf: 'Lataa raportti PDF:nä', supplementTitle: 'Täydennä raporttia lähteistä:', supplementButton: 'Hae tiedot', supplementLoading: 'Haetaan…', serviceHistoryNotFound: 'Huoltohistoriaa ei löytynyt – vastausta ei saatu ajoissa. Kilometrikaavio voi olla tyhjä.', mileageHistory: 'Kilometrihistoria (km)', lastMileage: 'Viimeisin kilometerilukema:', serviceEvents: 'Huoltorekisterit', damages: 'Rekisteröidyt vahingot', damageLabel: 'Vahinko:', severityHigh: 'Korkea', severityMedium: 'Keskitaso', marketValue: 'Markkina-arvo', marketValueBased: 'Perustuu vastaavien mallien myyntiin.', min: 'Min', max: 'Max', technicalSpecs: 'Tekniset tiedot', fuelType: 'Polttoaine', power: 'Teho', engine: 'Moottori', transmission: 'Vaihteisto', bodyType: 'Kori', colour: 'Väri', aiInsights: 'AI-analyysi', aiInsightsDesc: 'Raporttitietojen perusteella AI voi tunnistaa mahdolliset ongelmat ja ajoneuvon vahvuudet.', analyzing: 'Analysoidaan…', problemAreas: 'Mahdolliset ongelmat / riskit', strongPoints: 'Vahvuudet', analyzeWithAI: 'Analysoi AI:lla', refreshAnalysis: 'Päivitä AI-analyysi', retryIn: 'Yritä uudelleen', aiAnalysisFailed: 'AI-analyysin haku epäonnistui.', allApiSources: 'Kaikki API-lähteet', showRawData: 'Täydelliset API-tiedot (JSON)', show: 'Näytä', hide: 'Piilota', saveAsJson: 'Tallenna JSON:na', rawDataUnavailable: 'API-tiedot eivät saatavilla', yes: 'Kyllä', no: 'Ei', showOriginal: 'Näytä alkuperäinen', translatingServiceComments: 'Käännetään huoltokommentteja…', serviceTranslationFailed: 'Käännös epäonnistui. Näytetään alkuperäinen kieli.' },
    myReports: { title: 'Omat raportit', loading: 'Ladataan...', noReports: 'Ei tallennettuja raportteja.' },
    aiChat: { welcome: 'Hei! Olen VinScanner AI-asiantuntija. Kuinka voin auttaa sinua tänään?', cantRespond: 'Valitettavasti en voi vastata nyt.', expertTitle: 'AI-asiantuntija', online: 'Online', placeholder: 'Kirjoita kysymyksesi...' },
  },
  sk: {
    seo: {
      title: 'VinScanner - Kontrola histórie vozidla',
      description: 'Skontrolujte VIN kód a zistite históriu vozidla: kilometre, nehody, opravy, história vlastníkov. Rýchla a spoľahlivá kontrola vozidla.',
      ogTitle: 'VinScanner - Kontrola histórie vozidla',
      ogDescription: 'Skontrolujte VIN kód a zistite históriu vozidla: kilometre, nehody, opravy, história vlastníkov.',
    },
    nav: { services: 'Služby', pricing: 'Cenník', about: 'O nás', login: 'Prihlásiť sa', myReports: 'Moje reporty', signOut: 'Odhlásiť sa', deleteAccount: 'Vymazať účet', deleteAccountConfirm: 'Vymazať účet', deleteAccountConfirmText: 'Naozaj chcete vymazať svoj účet? Všetky uložené reporty budú odstránené. Túto akciu nie je možné vrátiť späť.', deleteAccountDeleting: 'Mazanie…', deleteAccountError: 'Vymazanie zlyhalo. Skúste znova.' },
    tokenMode: { banner: 'Máte {n} z {total} reportov. Zadajte VIN nižšie.', noReports: 'Žiadne zostávajúce reporty. Kúpte si nový plán na kontrolu ďalšieho vozidla.', loading: 'Načítava sa…', error: 'Nepodarilo sa načítať nákup. Skontrolujte odkaz.' },
    hero: { title: 'Zistite históriu vozidla', titleAccent: 'podľa VIN kódu', desc: 'Skontrolujte históriu kilometrov, záznamy o poškodení a trhovú hodnotu za pár sekúnd. Profesionálne overenie dostupné pre každého.', placeholder: 'Zadajte číslo VIN...', button: 'Skontrolovať', sample: 'Vyskúšať s príkladom' },
    pricing: { title: 'Vyberte si správny plán', desc: 'Ušetrite nákupom viacerých kontrol naraz. Profesionálne reporty vám pomôžu urobiť správne rozhodnutie.', bestValue: 'Najlepšia hodnota', order: 'Objednať teraz', confirm: 'Potvrdiť', selectPlanForVin: 'Vyberte plán na kontrolu VIN', refundPolicy: 'Zásady vrátenia peňazí', perReport: 'Za report:', orderStepTitle: 'Zadajte e-mail pre reporty', orderStepEmailLabel: 'E-mailová adresa, kam budú zasielané reporty', orderStepEmailPlaceholder: 'priklad@email.sk', orderStepAgreeTerms: 'Súhlasím s podmienkami a prečítal som zásady ochrany osobných údajov', orderStepAgreeBeforeTerms: 'Súhlasím s ', orderStepTermsLink: 'podmienkami', orderStepAgreeBetween: ' a prečítal som ', orderStepPrivacyLink: 'zásady ochrany osobných údajov', orderStepTermsText: 'Tu budú zobrazené podmienky služby. Toto je dočasný text – finálna verzia bude pridaná neskôr.', orderStepPrivacyText: 'Tu budú zobrazené zásady ochrany osobných údajov: ako zhromažďujeme, ukladáme a používame vaše dáta. Tento popis je dočasný – úplný text bude pridaný neskôr.', orderStepContinue: 'Pokračovať', paymentTitle: 'Platba', paymentOrderSummary: 'Zhrnutie objednávky', paymentPlan: 'Plán', paymentVin: 'VIN', paymentSubtotal: 'Medzisúčet', paymentDiscount: 'Zľava', paymentTotal: 'Celkom', paymentDiscountCode: 'Zľavový kód', paymentDiscountPlaceholder: 'Zadajte kód', paymentApply: 'Použiť', paymentPay: 'Zaplatiť', paymentSecure: 'Bezpečná platba', paymentCodeInvalid: 'Neplatný zľavový kód', paymentCodeApplied: 'Zľava použitá', paymentApiUnavailable: 'Platobné API nedostupné. Lokálne spustite: vercel dev (nie npm run dev).', paymentFormLoading: 'Príprava platobného formulára…', paymentOrPayAnotherWay: 'Alebo zaplaťte inak', paymentMethod: 'Spôsob platby', paymentCard: 'Karta', paymentLink: 'Odkaz', paymentApplePay: 'Apple Pay', paymentEmail: 'E-mail', paymentOr: 'alebo', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (zobrazené nižšie, ak je podporované)', planSingle: 'Jednorazový', planPopular: 'Najpopulárnejší', planBestValue: 'Najlepšia hodnota', report1: '1 Report', reports2: '2 Reporty', reports3: '3 Reporty', refundPolicyText: 'Používateľ má právo odstúpiť od Služieb (Reportov) do 30 dní od dátumu nákupu zaslaním žiadosti e-mailom s číslom objednávky, dátumom a kontaktnými údajmi. Vrátenie peňazí bude spracované do 14 dní od prijatia žiadosti.\n\nVrátenie peňazí neplatí, ak bol report už použitý na overenie histórie vozidla alebo ak bol použitý aspoň jeden report zo zakúpeného balíka.', close: 'Zavrieť' },
    footer: { desc: 'Spoľahlivý zdroj histórie vozidiel v Európe. Naším poslaním je transparentnosť na každom kilometri.', privacyLink: 'Zásady ochrany osobných údajov', termsLink: 'Podmienky používania', usageInstructionsLink: 'Návod na použitie' },
    about: { body: 'Vinscanner.eu – spoľahlivé overenie VIN a histórie vozidiel. Poskytujeme reporty o kilometroch, poškodeniach a trhovej hodnote, aby ste mohli kúpiť ojazdené auto s istotou.', contactLabel: 'Kontaktujte nás:' },
    loading: { steps: ['Pripájanie k medzinárodným databázam...', 'Kontrola záznamov o kilometroch...', 'Analýza registra poškodení...', 'Kontrola databáz Interpolu...', 'Generovanie reportu...'], ready: 'Hotovo!', scanningHistory: 'Skenovanie histórie', secureConnection: 'Zabezpečené pripojenie', sslEncryption: 'SSL šifrovanie aktívne' },
    errors: { historyNotFound: 'História nebola nájdená.', apiFailed: 'Nepodarilo sa získať dáta z API. Skontrolujte kľúč a pripojenie.', networkFailed: 'Nepodarilo sa získať dáta. Skontrolujte pripojenie.' },
    features: { mileageHistory: 'História kilometrov', mileageHistoryDesc: 'Analyzujeme dáta od predajcov a registrov po celej Európe.', damageRecords: 'Register poškodení', damageRecordsDesc: 'Podrobné informácie o dopravných nehodách.', theftCheck: 'Kontrola krádeže', theftCheckDesc: 'Kontrolujeme databázy Interpolu a miestnej polície.' },
    report: { fullReport: 'Kompletný report', theftClear: 'Nekradnuté', theftFlagged: 'UKRADNUTÉ / HĽADANÉ', theftUnknown: 'NESKONTROLOVANÉ', theftUnknownTooltip: 'Kontrola krádeže len s UK registráciou (Experian AutoCheck)', saveToCloud: 'Uložiť report do cloudu', downloadPdf: 'Stiahnuť report ako PDF', supplementTitle: 'Doplniť report zo zdrojov:', supplementButton: 'Získať dáta', supplementLoading: 'Načítava sa…', serviceHistoryNotFound: 'Servisná história nenájdená – odpoveď nebola prijatá včas. Graf kilometrov môže byť prázdny.', mileageHistory: 'História kilometrov (km)', lastMileage: 'Posledné kilometre:', serviceEvents: 'Servisné záznamy', damages: 'Zaznamenané škody', damageLabel: 'Škoda:', severityHigh: 'Vysoká', severityMedium: 'Stredná', marketValue: 'Trhová hodnota', marketValueBased: 'Na základe predajov podobných modelov.', min: 'Min', max: 'Max', technicalSpecs: 'Technické údaje', fuelType: 'Palivo', power: 'Výkon', engine: 'Motor', transmission: 'Prevodovka', bodyType: 'Karoséria', colour: 'Farba', aiInsights: 'AI analýza', aiInsightsDesc: 'Na základe dát reportu môže AI identifikovať možné problémy a silné stránky vozidla.', analyzing: 'Analyzuje sa…', problemAreas: 'Možné problémy / riziká', strongPoints: 'Silné stránky', analyzeWithAI: 'Analyzovať s AI', refreshAnalysis: 'Obnoviť AI analýzu', retryIn: 'Skúsiť znova za', aiAnalysisFailed: 'Nepodarilo sa získať AI analýzu.', allApiSources: 'Všetky zdroje API', showRawData: 'Kompletné informácie API (JSON)', show: 'Zobraziť', hide: 'Skryť', saveAsJson: 'Uložiť ako JSON', rawDataUnavailable: 'Dáta API nedostupné', yes: 'Áno', no: 'Nie', showOriginal: 'Zobraziť originál', translatingServiceComments: 'Preklad servisných komentárov…', serviceTranslationFailed: 'Preklad sa nepodaril. Zobrazuje sa pôvodný jazyk.' },
    myReports: { title: 'Moje reporty', loading: 'Načítava sa...', noReports: 'Žiadne uložené reporty.' },
    aiChat: { welcome: 'Ahoj! Som AI expert VinScanner. Ako vám môžem dnes pomôcť?', cantRespond: 'Ospravedlňujem sa, teraz nemôžem odpovedať.', expertTitle: 'AI expert', online: 'Online', placeholder: 'Napíšte svoju otázku...' },
  },
  hr: {
    seo: {
      title: 'VinScanner - Provjera povijesti vozila',
      description: 'Provjerite VIN kod i otkrijte povijest vozila: kilometraža, nesreće, popravci, povijest vlasništva. Brza i pouzdana provjera.',
      ogTitle: 'VinScanner - Provjera povijesti vozila',
      ogDescription: 'Provjerite VIN kod i otkrijte povijest vozila: kilometraža, nesreće, popravci, povijest vlasništva.',
    },
    nav: { services: 'Usluge', pricing: 'Cijene', about: 'O nama', login: 'Prijava', myReports: 'Moja izvješća', signOut: 'Odjava', deleteAccount: 'Obriši račun', deleteAccountConfirm: 'Obriši račun', deleteAccountConfirmText: 'Jeste li sigurni da želite obrisati svoj račun? Sva spremljena izvješća bit će uklonjena. Ova radnja se ne može poništiti.', deleteAccountDeleting: 'Brisanje…', deleteAccountError: 'Brisanje nije uspjelo. Pokušajte ponovno.' },
    tokenMode: { banner: 'Imate {n} od {total} izvješća. Unesite VIN ispod.', noReports: 'Nema preostalih izvješća. Kupite novi plan za provjeru drugog vozila.', loading: 'Učitavanje…', error: 'Učitavanje kupnje nije uspjelo. Provjerite poveznicu.' },
    hero: { title: 'Otkrijte povijest vozila', titleAccent: 'putem VIN koda', desc: 'Provjerite povijest kilometraže, zapisnike o šteti i tržišnu vrijednost u sekundi. Profesionalna verifikacija dostupna svima.', placeholder: 'Unesite VIN broj...', button: 'Provjeri', sample: 'Isprobaj s primjerom' },
    pricing: { title: 'Odaberite pravi plan', desc: 'Uštedite kupujući više provjera odjednom. Profesionalna izvješća pomažu u donošenju prave odluke.', bestValue: 'Najbolja vrijednost', order: 'Naruči sada', confirm: 'Potvrdi', selectPlanForVin: 'Odaberite plan za VIN provjeru', refundPolicy: 'Politika povrata', perReport: 'Po izvješću:', orderStepTitle: 'Unesite email za izvješća', orderStepEmailLabel: 'Email adresa na koju će se slati izvješća', orderStepEmailPlaceholder: 'primjer@email.hr', orderStepAgreeTerms: 'Slažem se s uvjetima i pročitao sam politiku privatnosti', orderStepAgreeBeforeTerms: 'Slažem se s ', orderStepTermsLink: 'uvjetima', orderStepAgreeBetween: ' i pročitao sam ', orderStepPrivacyLink: 'politiku privatnosti', orderStepTermsText: 'Ovdje će biti prikazani uvjeti korištenja. Ovo je privremeni tekst – konačna verzija bit će dodana kasnije.', orderStepPrivacyText: 'Ovdje će biti prikazana politika privatnosti: kako prikupljamo, pohranjujemo i koristimo vaše podatke. Ovaj opis je privremen – puni tekst bit će dodan kasnije.', orderStepContinue: 'Nastavi', paymentTitle: 'Plaćanje', paymentOrderSummary: 'Sažetak narudžbe', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Međuzbroj', paymentDiscount: 'Popust', paymentTotal: 'Ukupno', paymentDiscountCode: 'Kod za popust', paymentDiscountPlaceholder: 'Unesite kod', paymentApply: 'Primijeni', paymentPay: 'Plati', paymentSecure: 'Sigurno plaćanje', paymentCodeInvalid: 'Nevažeći kod za popust', paymentCodeApplied: 'Popust primijenjen', paymentApiUnavailable: 'API za plaćanje nije dostupan. Lokalno pokrenite: vercel dev (ne npm run dev).', paymentFormLoading: 'Priprema obrasca za plaćanje…', paymentOrPayAnotherWay: 'Ili platite na drugi način', paymentMethod: 'Način plaćanja', paymentCard: 'Kartica', paymentLink: 'Poveznica', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'ili', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (prikazano ispod ako je podržano)', planSingle: 'Pojedinačno', planPopular: 'Najpopularnije', planBestValue: 'Najbolja vrijednost', report1: '1 Izvješće', reports2: '2 Izvješća', reports3: '3 Izvješća', refundPolicyText: 'Korisnik ima pravo odustati od Usluga (Izvješća) u roku od 30 dana od datuma kupnje, podnošenjem zahtjeva putem emaila s brojem narudžbe, datumom i kontakt podacima. Povrat se obrađuje u roku od 14 dana od primitka zahtjeva.\n\nPovrat se ne primjenjuje ako je izvješće već korišteno za provjeru povijesti vozila ili ako je korišteno barem jedno izvješće iz kupljenog paketa.', close: 'Zatvori' },
    footer: { desc: 'Pouzdan izvor povijesti vozila u Europi. Naša misija je transparentnost na svakom kilometru.', privacyLink: 'Politika privatnosti', termsLink: 'Uvjeti korištenja', usageInstructionsLink: 'Upute za korištenje' },
    about: { body: 'Vinscanner.eu – pouzdane VIN i provjere povijesti vozila. Pružamo izvješća o kilometraži, štetama i tržišnoj vrijednosti kako biste s povjerenjem kupili rabljeni automobil.', contactLabel: 'Kontaktirajte nas:' },
    loading: { steps: ['Povezivanje s međunarodnim bazama podataka...', 'Provjera zapisa o kilometraži...', 'Analiza registra šteta...', 'Provjera Interpol baza...', 'Generiranje izvješća...'], ready: 'Gotovo!', scanningHistory: 'Skeniranje povijesti', secureConnection: 'Sigurna veza', sslEncryption: 'SSL enkripcija aktivna' },
    errors: { historyNotFound: 'Povijest nije pronađena.', apiFailed: 'Nije uspjelo dohvaćanje podataka iz API-ja. Provjerite ključ i vezu.', networkFailed: 'Nije uspjelo dohvaćanje podataka. Provjerite vezu.' },
    features: { mileageHistory: 'Povijest kilometraže', mileageHistoryDesc: 'Analiziramo podatke od dilera i registara širom Europe.', damageRecords: 'Registar šteta', damageRecordsDesc: 'Detaljne informacije o prometnim nesrećama.', theftCheck: 'Provjera krađe', theftCheckDesc: 'Provjeravamo Interpol i lokalne policijske baze.' },
    report: { fullReport: 'Potpuno izvješće', theftClear: 'Nije ukradeno', theftFlagged: 'UKRADENO / TRAŽENO', theftUnknown: 'NIJE PROVJERENO', theftUnknownTooltip: 'Provjera krađe samo s UK registracijom (Experian AutoCheck)', saveToCloud: 'Spremi izvješće u oblak', downloadPdf: 'Preuzmi izvješće kao PDF', supplementTitle: 'Dopuni izvješće iz izvora:', supplementButton: 'Dohvati podatke', supplementLoading: 'Dohvaćanje…', serviceHistoryNotFound: 'Povijest servisa nije pronađena – odgovor nije primljen na vrijeme. Grafikon kilometraže može biti prazan.', mileageHistory: 'Povijest kilometraže (km)', lastMileage: 'Zadnja kilometraža:', serviceEvents: 'Servisni zapisi', damages: 'Zabilježene štete', damageLabel: 'Šteta:', severityHigh: 'Visoka', severityMedium: 'Srednja', marketValue: 'Tržišna vrijednost', marketValueBased: 'Na temelju prodaja sličnih modela.', min: 'Min', max: 'Max', technicalSpecs: 'Tehnički podaci', fuelType: 'Gorivo', power: 'Snaga', engine: 'Motor', transmission: 'Mjenjač', bodyType: 'Karoserija', colour: 'Boja', aiInsights: 'AI analiza', aiInsightsDesc: 'Na temelju podataka izvješća, AI može identificirati moguće probleme i jake strane vozila.', analyzing: 'Analiziranje…', problemAreas: 'Mogući problemi / rizici', strongPoints: 'Jake strane', analyzeWithAI: 'Analiziraj s AI', refreshAnalysis: 'Osvježi AI analizu', retryIn: 'Pokušaj ponovno za', aiAnalysisFailed: 'Nije uspjelo dohvaćanje AI analize.', allApiSources: 'Svi API izvori', showRawData: 'Potpune API informacije (JSON)', show: 'Prikaži', hide: 'Sakrij', saveAsJson: 'Spremi kao JSON', rawDataUnavailable: 'API podaci nedostupni', yes: 'Da', no: 'Ne', showOriginal: 'Prikaži original', translatingServiceComments: 'Prevođenje servisnih komentara…', serviceTranslationFailed: 'Prijevod nije uspio. Prikazuje se izvorni jezik.' },
    myReports: { title: 'Moja izvješća', loading: 'Učitavanje...', noReports: 'Nema spremljenih izvješća.' },
    aiChat: { welcome: 'Bok! Ja sam VinScanner AI stručnjak. Kako vam mogu pomoći danas?', cantRespond: 'Žao mi je, ne mogu sada odgovoriti.', expertTitle: 'AI stručnjak', online: 'Online', placeholder: 'Napišite svoje pitanje...' },
  },
  bs: {
    seo: {
      title: 'VinScanner - Provjera historije vozila',
      description: 'Provjerite VIN kod i otkrijte historiju vozila: kilometraža, nesreće, popravci, historija vlasništva. Brza i pouzdana provjera.',
      ogTitle: 'VinScanner - Provjera historije vozila',
      ogDescription: 'Provjerite VIN kod i otkrijte historiju vozila: kilometraža, nesreće, popravci.',
    },
    nav: { services: 'Usluge', pricing: 'Cijene', about: 'O nama', login: 'Prijava', myReports: 'Moji izvještaji', signOut: 'Odjava', deleteAccount: 'Obriši račun', deleteAccountConfirm: 'Obriši račun', deleteAccountConfirmText: 'Jeste li sigurni da želite obrisati svoj račun? Svi spremljeni izvještaji bit će uklonjeni. Ova radnja se ne može poništiti.', deleteAccountDeleting: 'Brisanje…', deleteAccountError: 'Brisanje nije uspjelo. Pokušajte ponovo.' },
    tokenMode: { banner: 'Imate {n} od {total} izvještaja. Unesite VIN ispod.', noReports: 'Nema preostalih izvještaja. Kupite novi plan za provjeru drugog vozila.', loading: 'Učitavanje…', error: 'Učitavanje kupovine nije uspjelo. Provjerite link.' },
    hero: { title: 'Otkrijte historiju vozila', titleAccent: 'putem VIN koda', desc: 'Provjerite historiju kilometraže, zapisnike o šteti i tržišnu vrijednost u sekundi. Profesionalna verifikacija dostupna svima.', placeholder: 'Unesite VIN broj...', button: 'Provjeri', sample: 'Isprobaj s primjerom' },
    pricing: { title: 'Odaberite pravi plan', desc: 'Uštedite kupujući više provjera odjednom. Profesionalni izvještaji pomažu u donošenju prave odluke.', bestValue: 'Najbolja vrijednost', order: 'Naruči sada', confirm: 'Potvrdi', selectPlanForVin: 'Odaberite plan za VIN provjeru', refundPolicy: 'Politika povrata', perReport: 'Po izvještaju:', orderStepTitle: 'Unesite email za izvještaje', orderStepEmailLabel: 'Email adresa na koju će se slati izvještaji', orderStepEmailPlaceholder: 'primjer@email.ba', orderStepAgreeTerms: 'Slažem se s uslovima i pročitao sam politiku privatnosti', orderStepAgreeBeforeTerms: 'Slažem se s ', orderStepTermsLink: 'uslovima', orderStepAgreeBetween: ' i pročitao sam ', orderStepPrivacyLink: 'politiku privatnosti', orderStepTermsText: 'Ovdje će biti prikazani uslovi korištenja. Ovo je privremeni tekst – konačna verzija bit će dodana kasnije.', orderStepPrivacyText: 'Ovdje će biti prikazana politika privatnosti: kako prikupljamo, pohranjujemo i koristimo vaše podatke. Ovaj opis je privremen – puni tekst bit će dodan kasnije.', orderStepContinue: 'Nastavi', paymentTitle: 'Plaćanje', paymentOrderSummary: 'Sažetak narudžbe', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Međuzbroj', paymentDiscount: 'Popust', paymentTotal: 'Ukupno', paymentDiscountCode: 'Kod za popust', paymentDiscountPlaceholder: 'Unesite kod', paymentApply: 'Primijeni', paymentPay: 'Plati', paymentSecure: 'Sigurno plaćanje', paymentCodeInvalid: 'Nevažeći kod za popust', paymentCodeApplied: 'Popust primijenjen', paymentApiUnavailable: 'API za plaćanje nije dostupan. Lokalno pokrenite: vercel dev (ne npm run dev).', paymentFormLoading: 'Priprema obrasca za plaćanje…', paymentOrPayAnotherWay: 'Ili platite na drugi način', paymentMethod: 'Način plaćanja', paymentCard: 'Kartica', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'ili', paymentExpressCheckout: 'Express: Apple Pay, Google Pay (prikazano ispod ako je podržano)', planSingle: 'Pojedinačno', planPopular: 'Najpopularnije', planBestValue: 'Najbolja vrijednost', report1: '1 Izvještaj', reports2: '2 Izvještaja', reports3: '3 Izvještaja', refundPolicyText: 'Korisnik ima pravo odustati od Usluga (Izvještaja) u roku od 30 dana od datuma kupovine, podnošenjem zahtjeva putem emaila s brojem narudžbe, datumom i kontakt podacima. Povrat se obrađuje u roku od 14 dana od primitka zahtjeva.\n\nPovrat se ne primjenjuje ako je izvještaj već korišten za provjeru historije vozila ili ako je korišten barem jedan izvještaj iz kupljenog paketa.', close: 'Zatvori' },
    footer: { desc: 'Pouzdan izvor historije vozila u Evropi. Naša misija je transparentnost na svakom kilometru.', privacyLink: 'Politika privatnosti', termsLink: 'Uslovi korištenja', usageInstructionsLink: 'Uputstva za korištenje' },
    about: { body: 'Vinscanner.eu – pouzdane VIN i provjere historije vozila. Pružamo izvještaje o kilometraži, štetama i tržišnoj vrijednosti kako biste s povjerenjem kupili polovni automobil.', contactLabel: 'Kontaktirajte nas:' },
    loading: { steps: ['Povezivanje s međunarodnim bazama podataka...', 'Provjera zapisa o kilometraži...', 'Analiza registra šteta...', 'Provjera Interpol baza...', 'Generisanje izvještaja...'], ready: 'Gotovo!', scanningHistory: 'Skeniranje historije', secureConnection: 'Sigurna veza', sslEncryption: 'SSL enkripcija aktivna' },
    errors: { historyNotFound: 'Historija nije pronađena.', apiFailed: 'Nije uspjelo dohvatanje podataka iz API-ja. Provjerite ključ i vezu.', networkFailed: 'Nije uspjelo dohvatanje podataka. Provjerite vezu.' },
    features: { mileageHistory: 'Historija kilometraže', mileageHistoryDesc: 'Analiziramo podatke od dilera i registara širom Evrope.', damageRecords: 'Registar šteta', damageRecordsDesc: 'Detaljne informacije o saobraćajnim nesrećama.', theftCheck: 'Provjera krađe', theftCheckDesc: 'Provjeravamo Interpol i lokalne policijske baze.' },
    report: { fullReport: 'Potpuni izvještaj', theftClear: 'Nije ukradeno', theftFlagged: 'UKRADENO / TRAŽENO', theftUnknown: 'NIJE PROVJERENO', theftUnknownTooltip: 'Provjera krađe samo s UK registracijom (Experian AutoCheck)', saveToCloud: 'Spremi izvještaj u oblak', downloadPdf: 'Preuzmi izvještaj kao PDF', supplementTitle: 'Dopuni izvještaj iz izvora:', supplementButton: 'Dohvati podatke', supplementLoading: 'Dohvatanje…', serviceHistoryNotFound: 'Historija servisa nije pronađena – odgovor nije primljen na vrijeme. Grafikon kilometraže može biti prazan.', mileageHistory: 'Historija kilometraže (km)', lastMileage: 'Zadnja kilometraža:', serviceEvents: 'Servisni zapisi', damages: 'Zabilježene štete', damageLabel: 'Šteta:', severityHigh: 'Visoka', severityMedium: 'Srednja', marketValue: 'Tržišna vrijednost', marketValueBased: 'Na osnovu prodaja sličnih modela.', min: 'Min', max: 'Max', technicalSpecs: 'Tehnički podaci', fuelType: 'Gorivo', power: 'Snaga', engine: 'Motor', transmission: 'Mjenjač', bodyType: 'Karoserija', colour: 'Boja', aiInsights: 'AI analiza', aiInsightsDesc: 'Na osnovu podataka izvještaja, AI može identificirati moguće probleme i jake strane vozila.', analyzing: 'Analiziranje…', problemAreas: 'Mogući problemi / rizici', strongPoints: 'Jake strane', analyzeWithAI: 'Analiziraj s AI', refreshAnalysis: 'Osvježi AI analizu', retryIn: 'Pokušaj ponovo za', aiAnalysisFailed: 'Nije uspjelo dohvatanje AI analize.', allApiSources: 'Svi API izvori', showRawData: 'Potpune API informacije (JSON)', show: 'Prikaži', hide: 'Sakrij', saveAsJson: 'Spremi kao JSON', rawDataUnavailable: 'API podaci nedostupni', yes: 'Da', no: 'Ne', showOriginal: 'Prikaži original', translatingServiceComments: 'Prevođenje servisnih komentara…', serviceTranslationFailed: 'Prijevod nije uspio. Prikazuje se izvorni jezik.' },
    myReports: { title: 'Moji izvještaji', loading: 'Učitavanje...', noReports: 'Nema spremljenih izvještaja.' },
    aiChat: { welcome: 'Zdravo! Ja sam VinScanner AI stručnjak. Kako vam mogu pomoći danas?', cantRespond: 'Žao mi je, ne mogu sada odgovoriti.', expertTitle: 'AI stručnjak', online: 'Online', placeholder: 'Napišite svoje pitanje...' },
  },
  sq: {
    seo: {
      title: 'VinScanner - Kontrolli i historisë së automjetit',
      description: 'Kontrolloni kodin VIN dhe zbuloni historinë e automjetit: kilometrazhi, aksidentet, riparimet, historia e pronësisë. Kontroll i shpejtë dhe i besueshëm.',
      ogTitle: 'VinScanner - Kontrolli i historisë së automjetit',
      ogDescription: 'Kontrolloni kodin VIN dhe zbuloni historinë e automjetit: kilometrazhi, aksidentet, riparimet.',
    },
    nav: { services: 'Shërbimet', pricing: 'Çmimet', about: 'Rreth nesh', login: 'Hyr', myReports: 'Raportet e mia', signOut: 'Dil', deleteAccount: 'Fshi llogarinë', deleteAccountConfirm: 'Fshi llogarinë', deleteAccountConfirmText: 'Jeni të sigurt që dëshironi të fshini llogarinë tuaj? Të gjitha raportet e ruajtura do të hiqen. Ky veprim nuk mund të zhbëhet.', deleteAccountDeleting: 'Duke fshirë…', deleteAccountError: 'Fshirja dështoi. Provoni përsëri.' },
    tokenMode: { banner: 'Keni {n} nga {total} raporte. Shkruani VIN më poshtë.', noReports: 'Nuk ka raporte të mbetura. Blini një plan të ri për të kontrolluar një automjet tjetër.', loading: 'Duke ngarkuar…', error: 'Ngarkimi i blerjes dështoi. Kontrolloni lidhjen.' },
    hero: { title: 'Zbuloni historinë e automjetit', titleAccent: 'me kodin VIN', desc: 'Kontrolloni historinë e kilometrave, dëmet dhe vlerën e tregut në sekonda. Verifikim profesional i disponueshëm për të gjithë.', placeholder: 'Shkruani numrin VIN...', button: 'Kontrollo', sample: 'Provo me shembull' },
    pricing: { title: 'Zgjidhni planin e duhur', desc: 'Kurseni duke blerë kontrolle të shumëfishta njëherësh. Raportet profesionale ndihmojnë në marrjen e vendimit të duhur.', bestValue: 'Vlera më e mirë', order: 'Porosit tani', confirm: 'Konfirmo', selectPlanForVin: 'Zgjidhni një plan për kontrollin VIN', refundPolicy: 'Politika e rimbursimit', perReport: 'Për raport:', orderStepTitle: 'Shkruani emailin për raporte', orderStepEmailLabel: 'Adresa e emailit ku do të dërgohen raportet', orderStepEmailPlaceholder: 'shembull@email.al', orderStepAgreeTerms: 'Pranoj kushtet dhe kam lexuar politikën e privatësisë', orderStepAgreeBeforeTerms: 'Pranoj ', orderStepTermsLink: 'kushtet', orderStepAgreeBetween: ' dhe kam lexuar ', orderStepPrivacyLink: 'politikën e privatësisë', orderStepTermsText: 'Këtu do të shfaqen kushtet e shërbimit. Ky është tekst i përkohshëm – versioni përfundimtar do të shtohet më vonë.', orderStepPrivacyText: 'Këtu do të shfaqet politika e privatësisë: si mbledhim, ruajmë dhe përdorim të dhënat tuaja. Ky përshkrim është i përkohshëm – teksti i plotë do të shtohet më vonë.', orderStepContinue: 'Vazhdo', paymentTitle: 'Pagesa', paymentOrderSummary: 'Përmbledhja e porosisë', paymentPlan: 'Plani', paymentVin: 'VIN', paymentSubtotal: 'Nëntotali', paymentDiscount: 'Zbritje', paymentTotal: 'Totali', paymentDiscountCode: 'Kodi i zbritjes', paymentDiscountPlaceholder: 'Shkruani kodin', paymentApply: 'Apliko', paymentPay: 'Paguaj', paymentSecure: 'Pagesë e sigurt', paymentCodeInvalid: 'Kod zbritjeje i pavlefshëm', paymentCodeApplied: 'Zbritja u aplikua', paymentApiUnavailable: 'API i pagesës nuk është i disponueshëm.', paymentFormLoading: 'Duke përgatitur formularin e pagesës…', paymentOrPayAnotherWay: 'Ose paguani ndryshe', paymentMethod: 'Metoda e pagesës', paymentCard: 'Kartë', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'ose', paymentExpressCheckout: 'Express: Apple Pay, Google Pay', planSingle: 'I vetëm', planPopular: 'Më popullor', planBestValue: 'Vlera më e mirë', report1: '1 Raport', reports2: '2 Raporte', reports3: '3 Raporte', refundPolicyText: 'Përdoruesi ka të drejtë të tërhiqet nga Shërbimet (Raportet) brenda 30 ditëve nga data e blerjes.', close: 'Mbyll' },
    footer: { desc: 'Burim i besueshëm i historisë së automjeteve në Europë.', privacyLink: 'Politika e privatësisë', termsLink: 'Kushtet e përdorimit', usageInstructionsLink: 'Udhëzimet e përdorimit' },
    about: { body: 'Vinscanner.eu – kontrolle të besueshme VIN dhe histori automjetesh.', contactLabel: 'Na kontaktoni:' },
    loading: { steps: ['Duke u lidhur me bazat e të dhënave ndërkombëtare...', 'Duke kontrolluar regjistrat e kilometrave...', 'Duke analizuar regjistrin e dëmeve...', 'Duke kontrolluar bazat e Interpol...', 'Duke gjeneruar raportin...'], ready: 'Gati!', scanningHistory: 'Duke skanuar historinë', secureConnection: 'Lidhje e sigurt', sslEncryption: 'Enkriptimi SSL aktiv' },
    errors: { historyNotFound: 'Historia nuk u gjet.', apiFailed: 'Marrja e të dhënave nga API dështoi.', networkFailed: 'Marrja e të dhënave dështoi. Kontrolloni lidhjen.' },
    features: { mileageHistory: 'Historia e kilometrave', mileageHistoryDesc: 'Analizojmë të dhënat nga tregtarët dhe regjistrat në të gjithë Europën.', damageRecords: 'Regjistri i dëmeve', damageRecordsDesc: 'Informacion i detajuar mbi aksidentet.', theftCheck: 'Kontrolli i vjedhjes', theftCheckDesc: 'Kontrollojmë bazat e Interpol dhe policisë lokale.' },
    report: { fullReport: 'Raport i plotë', theftClear: 'Jo i vjedhur', theftFlagged: 'I VJEDHUR / I KËRKUAR', theftUnknown: 'NUK U KONTROLLUA', theftUnknownTooltip: 'Kontrolli i vjedhjes vetëm me regjistrim UK', saveToCloud: 'Ruaj raportin në cloud', downloadPdf: 'Shkarko raportin si PDF', supplementTitle: 'Plotëso raportin nga burimet:', supplementButton: 'Merr të dhënat', supplementLoading: 'Duke marrë…', serviceHistoryNotFound: 'Historia e shërbimit nuk u gjet.', mileageHistory: 'Historia e kilometrave (km)', lastMileage: 'Kilometrat e fundit:', serviceEvents: 'Regjistrat e shërbimit', damages: 'Dëmet e regjistruara', damageLabel: 'Dëm:', severityHigh: 'I lartë', severityMedium: 'Mesatar', marketValue: 'Vlera e tregut', marketValueBased: 'Bazuar në shitjet e modeleve të ngjashme.', min: 'Min', max: 'Maks', technicalSpecs: 'Të dhënat teknike', fuelType: 'Karburanti', power: 'Fuqia', engine: 'Motori', transmission: 'Transmisioni', bodyType: 'Karoseria', colour: 'Ngjyra', aiInsights: 'Analiza AI', aiInsightsDesc: 'AI mund të identifikojë problemet dhe pikat e forta.', analyzing: 'Duke analizuar…', problemAreas: 'Problemet e mundshme', strongPoints: 'Pikat e forta', analyzeWithAI: 'Analizo me AI', refreshAnalysis: 'Rifresko analizën AI', retryIn: 'Provo përsëri pas', aiAnalysisFailed: 'Analiza AI dështoi.', allApiSources: 'Të gjitha burimet API', showRawData: 'Informacioni i plotë API (JSON)', show: 'Shfaq', hide: 'Fshih', saveAsJson: 'Ruaj si JSON', rawDataUnavailable: 'Të dhënat API nuk janë të disponueshme', yes: 'Po', no: 'Jo', showOriginal: 'Shfaq origjinalin', translatingServiceComments: 'Duke përkthyer komentet…', serviceTranslationFailed: 'Përkthimi dështoi.' },
    myReports: { title: 'Raportet e mia', loading: 'Duke ngarkuar...', noReports: 'Nuk ka raporte të ruajtura.' },
    aiChat: { welcome: 'Përshëndetje! Unë jam eksperti AI i VinScanner. Si mund t\'ju ndihmoj sot?', cantRespond: 'Na vjen keq, nuk mund të përgjigjem tani.', expertTitle: 'Ekspert AI', online: 'Online', placeholder: 'Shkruani pyetjen tuaj...' },
  },
  sl: {
    seo: {
      title: 'VinScanner - Preverjanje zgodovine vozila',
      description: 'Preverite VIN kodo in odkrijte zgodovino vozila: prevoženi kilometri, nesreče, popravila, zgodovina lastništva. Hitra in zanesljiva preverba.',
      ogTitle: 'VinScanner - Preverjanje zgodovine vozila',
      ogDescription: 'Preverite VIN kodo in odkrijte zgodovino vozila: prevoženi kilometri, nesreče, popravila.',
    },
    nav: { services: 'Storitve', pricing: 'Cene', about: 'O nas', login: 'Prijava', myReports: 'Moja poročila', signOut: 'Odjava', deleteAccount: 'Izbriši račun', deleteAccountConfirm: 'Izbriši račun', deleteAccountConfirmText: 'Ali ste prepričani, da želite izbrisati svoj račun? Vsa shranjena poročila bodo odstranjena. Tega dejanja ni mogoče razveljaviti.', deleteAccountDeleting: 'Brisanje…', deleteAccountError: 'Brisanje ni uspelo. Poskusite znova.' },
    tokenMode: { banner: 'Imate {n} od {total} poročil. Vnesite VIN spodaj.', noReports: 'Ni več poročil. Kupite nov paket za preverjanje drugega vozila.', loading: 'Nalaganje…', error: 'Nalaganje nakupa ni uspelo. Preverite povezavo.' },
    hero: { title: 'Odkrijte zgodovino vozila', titleAccent: 'po VIN kodi', desc: 'Preverite zgodovino kilometrov, škode in tržno vrednost v nekaj sekundah. Profesionalno preverjanje dostopno vsem.', placeholder: 'Vnesite VIN številko...', button: 'Preveri', sample: 'Preizkusi s primerom' },
    pricing: { title: 'Izberite pravi paket', desc: 'Prihranite z nakupom več preverjanj naenkrat. Profesionalna poročila pomagajo pri pravilni odločitvi.', bestValue: 'Najboljša vrednost', order: 'Naroči zdaj', confirm: 'Potrdi', selectPlanForVin: 'Izberite paket za VIN preverjanje', refundPolicy: 'Politika vračila', perReport: 'Na poročilo:', orderStepTitle: 'Vnesite email za poročila', orderStepEmailLabel: 'Email naslov, kamor bodo poslana poročila', orderStepEmailPlaceholder: 'primer@email.si', orderStepAgreeTerms: 'Strinjam se s pogoji in sem prebral politiko zasebnosti', orderStepAgreeBeforeTerms: 'Strinjam se s ', orderStepTermsLink: 'pogoji', orderStepAgreeBetween: ' in sem prebral ', orderStepPrivacyLink: 'politiko zasebnosti', orderStepTermsText: 'Tukaj bodo prikazani pogoji uporabe.', orderStepPrivacyText: 'Tukaj bo prikazana politika zasebnosti.', orderStepContinue: 'Nadaljuj', paymentTitle: 'Plačilo', paymentOrderSummary: 'Povzetek naročila', paymentPlan: 'Paket', paymentVin: 'VIN', paymentSubtotal: 'Vmesna vsota', paymentDiscount: 'Popust', paymentTotal: 'Skupaj', paymentDiscountCode: 'Koda za popust', paymentDiscountPlaceholder: 'Vnesite kodo', paymentApply: 'Uporabi', paymentPay: 'Plačaj', paymentSecure: 'Varno plačilo', paymentCodeInvalid: 'Neveljavna koda za popust', paymentCodeApplied: 'Popust uporabljen', paymentApiUnavailable: 'API za plačilo ni na voljo.', paymentFormLoading: 'Priprava obrazca za plačilo…', paymentOrPayAnotherWay: 'Ali plačajte drugače', paymentMethod: 'Način plačila', paymentCard: 'Kartica', paymentLink: 'Povezava', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'ali', paymentExpressCheckout: 'Express: Apple Pay, Google Pay', planSingle: 'Posamezno', planPopular: 'Najbolj priljubljeno', planBestValue: 'Najboljša vrednost', report1: '1 Poročilo', reports2: '2 Poročili', reports3: '3 Poročila', refundPolicyText: 'Uporabnik ima pravico do odstopa od Storitev (Poročil) v 30 dneh od datuma nakupa.', close: 'Zapri' },
    footer: { desc: 'Zanesljiv vir zgodovine vozil v Evropi.', privacyLink: 'Politika zasebnosti', termsLink: 'Pogoji uporabe', usageInstructionsLink: 'Navodila za uporabo' },
    about: { body: 'Vinscanner.eu – zanesljivo preverjanje VIN in zgodovine vozil.', contactLabel: 'Kontaktirajte nas:' },
    loading: { steps: ['Povezovanje z mednarodnimi bazami podatkov...', 'Preverjanje zapisov o kilometrih...', 'Analiziranje registra škod...', 'Preverjanje baz Interpola...', 'Ustvarjanje poročila...'], ready: 'Pripravljeno!', scanningHistory: 'Skeniranje zgodovine', secureConnection: 'Varna povezava', sslEncryption: 'SSL šifriranje aktivno' },
    errors: { historyNotFound: 'Zgodovina ni bila najdena.', apiFailed: 'Pridobivanje podatkov iz API ni uspelo.', networkFailed: 'Pridobivanje podatkov ni uspelo. Preverite povezavo.' },
    features: { mileageHistory: 'Zgodovina kilometrov', mileageHistoryDesc: 'Analiziramo podatke od trgovcev in registrov po vsej Evropi.', damageRecords: 'Register škod', damageRecordsDesc: 'Podrobne informacije o prometnih nesrečah.', theftCheck: 'Preverjanje kraje', theftCheckDesc: 'Preverjamo baze Interpola in lokalne policije.' },
    report: { fullReport: 'Celotno poročilo', theftClear: 'Ni ukradeno', theftFlagged: 'UKRADENO / ISKANO', theftUnknown: 'NI PREVERJENO', theftUnknownTooltip: 'Preverjanje kraje samo z UK registracijo', saveToCloud: 'Shrani poročilo v oblak', downloadPdf: 'Prenesi poročilo kot PDF', supplementTitle: 'Dopolni poročilo iz virov:', supplementButton: 'Pridobi podatke', supplementLoading: 'Pridobivanje…', serviceHistoryNotFound: 'Zgodovina servisa ni bila najdena.', mileageHistory: 'Zgodovina kilometrov (km)', lastMileage: 'Zadnji kilometri:', serviceEvents: 'Servisni zapisi', damages: 'Zabeležene škode', damageLabel: 'Škoda:', severityHigh: 'Visoka', severityMedium: 'Srednja', marketValue: 'Tržna vrednost', marketValueBased: 'Na podlagi prodaj podobnih modelov.', min: 'Min', max: 'Max', technicalSpecs: 'Tehnični podatki', fuelType: 'Gorivo', power: 'Moč', engine: 'Motor', transmission: 'Menjalnik', bodyType: 'Karoserija', colour: 'Barva', aiInsights: 'AI analiza', aiInsightsDesc: 'AI lahko identificira možne težave in prednosti vozila.', analyzing: 'Analiziranje…', problemAreas: 'Možne težave / tveganja', strongPoints: 'Prednosti', analyzeWithAI: 'Analiziraj z AI', refreshAnalysis: 'Osveži AI analizo', retryIn: 'Poskusi znova čez', aiAnalysisFailed: 'AI analiza ni uspela.', allApiSources: 'Vsi API viri', showRawData: 'Celotne API informacije (JSON)', show: 'Prikaži', hide: 'Skrij', saveAsJson: 'Shrani kot JSON', rawDataUnavailable: 'API podatki niso na voljo', yes: 'Da', no: 'Ne', showOriginal: 'Prikaži izvirnik', translatingServiceComments: 'Prevajanje servisnih komentarjev…', serviceTranslationFailed: 'Prevod ni uspel.' },
    myReports: { title: 'Moja poročila', loading: 'Nalaganje...', noReports: 'Ni shranjenih poročil.' },
    aiChat: { welcome: 'Pozdravljeni! Sem VinScanner AI strokovnjak. Kako vam lahko danes pomagam?', cantRespond: 'Oprostite, trenutno ne morem odgovoriti.', expertTitle: 'AI strokovnjak', online: 'Na spletu', placeholder: 'Napišite svoje vprašanje...' },
  },
  lv: {
    seo: {
      title: 'VinScanner - Transportlīdzekļa vēstures pārbaude',
      description: 'Pārbaudiet VIN kodu un uzziniet transportlīdzekļa vēsturi: nobraukums, avārijas, remonti, īpašnieku vēsture. Ātra un uzticama pārbaude.',
      ogTitle: 'VinScanner - Transportlīdzekļa vēstures pārbaude',
      ogDescription: 'Pārbaudiet VIN kodu un uzziniet transportlīdzekļa vēsturi: nobraukums, avārijas, remonti.',
    },
    nav: { services: 'Pakalpojumi', pricing: 'Cenas', about: 'Par mums', login: 'Pieslēgties', myReports: 'Mani pārskati', signOut: 'Iziet', deleteAccount: 'Dzēst kontu', deleteAccountConfirm: 'Dzēst kontu', deleteAccountConfirmText: 'Vai esat pārliecināts, ka vēlaties dzēst savu kontu? Visi saglabātie pārskati tiks noņemti. Šo darbību nevar atsaukt.', deleteAccountDeleting: 'Dzēš…', deleteAccountError: 'Dzēšana neizdevās. Mēģiniet vēlreiz.' },
    tokenMode: { banner: 'Jums ir {n} no {total} pārskatiem. Ievadiet VIN zemāk.', noReports: 'Nav atlikušo pārskatu. Iegādājieties jaunu plānu cita transportlīdzekļa pārbaudei.', loading: 'Ielādē…', error: 'Pirkuma ielāde neizdevās. Pārbaudiet saiti.' },
    hero: { title: 'Uzziniet transportlīdzekļa vēsturi', titleAccent: 'pēc VIN koda', desc: 'Pārbaudiet nobraukuma vēsturi, bojājumu ierakstus un tirgus vērtību dažās sekundēs. Profesionāla pārbaude pieejama ikvienam.', placeholder: 'Ievadiet VIN numuru...', button: 'Pārbaudīt', sample: 'Izmēģināt ar piemēru' },
    pricing: { title: 'Izvēlieties piemērotu plānu', desc: 'Ietaupiet, pērkot vairākas pārbaudes vienlaikus. Profesionāli pārskati palīdz pieņemt pareizo lēmumu.', bestValue: 'Labākā vērtība', order: 'Pasūtīt tagad', confirm: 'Apstiprināt', selectPlanForVin: 'Izvēlieties plānu VIN pārbaudei', refundPolicy: 'Atmaksas politika', perReport: 'Par pārskatu:', orderStepTitle: 'Ievadiet e-pastu pārskatiem', orderStepEmailLabel: 'E-pasta adrese, uz kuru tiks nosūtīti pārskati', orderStepEmailPlaceholder: 'piemers@epasts.lv', orderStepAgreeTerms: 'Piekrītu noteikumiem un esmu izlasījis privātuma politiku', orderStepAgreeBeforeTerms: 'Piekrītu ', orderStepTermsLink: 'noteikumiem', orderStepAgreeBetween: ' un esmu izlasījis ', orderStepPrivacyLink: 'privātuma politiku', orderStepTermsText: 'Šeit tiks parādīti lietošanas noteikumi.', orderStepPrivacyText: 'Šeit tiks parādīta privātuma politika.', orderStepContinue: 'Turpināt', paymentTitle: 'Maksājums', paymentOrderSummary: 'Pasūtījuma kopsavilkums', paymentPlan: 'Plāns', paymentVin: 'VIN', paymentSubtotal: 'Starpsumma', paymentDiscount: 'Atlaide', paymentTotal: 'Kopā', paymentDiscountCode: 'Atlaides kods', paymentDiscountPlaceholder: 'Ievadiet kodu', paymentApply: 'Lietot', paymentPay: 'Maksāt', paymentSecure: 'Drošs maksājums', paymentCodeInvalid: 'Nederīgs atlaides kods', paymentCodeApplied: 'Atlaide piemērota', paymentApiUnavailable: 'Maksājumu API nav pieejams.', paymentFormLoading: 'Sagatavo maksājuma formu…', paymentOrPayAnotherWay: 'Vai maksājiet citādi', paymentMethod: 'Maksājuma veids', paymentCard: 'Karte', paymentLink: 'Saite', paymentApplePay: 'Apple Pay', paymentEmail: 'E-pasts', paymentOr: 'vai', paymentExpressCheckout: 'Express: Apple Pay, Google Pay', planSingle: 'Atsevišķs', planPopular: 'Populārākais', planBestValue: 'Labākā vērtība', report1: '1 Pārskats', reports2: '2 Pārskati', reports3: '3 Pārskati', refundPolicyText: 'Lietotājam ir tiesības atteikties no Pakalpojumiem (Pārskatiem) 30 dienu laikā no pirkuma datuma.', close: 'Aizvērt' },
    footer: { desc: 'Uzticams transportlīdzekļu vēstures avots Eiropā.', privacyLink: 'Privātuma politika', termsLink: 'Lietošanas noteikumi', usageInstructionsLink: 'Lietošanas instrukcija' },
    about: { body: 'Vinscanner.eu – uzticamas VIN un transportlīdzekļu vēstures pārbaudes.', contactLabel: 'Sazinieties ar mums:' },
    loading: { steps: ['Savienojas ar starptautiskajām datu bāzēm...', 'Pārbauda nobraukuma ierakstus...', 'Analizē bojājumu reģistru...', 'Pārbauda Interpola datu bāzes...', 'Ģenerē pārskatu...'], ready: 'Gatavs!', scanningHistory: 'Skenē vēsturi', secureConnection: 'Droša savienojums', sslEncryption: 'SSL šifrēšana aktīva' },
    errors: { historyNotFound: 'Vēsture netika atrasta.', apiFailed: 'Neizdevās iegūt datus no API.', networkFailed: 'Neizdevās iegūt datus. Pārbaudiet savienojumu.' },
    features: { mileageHistory: 'Nobraukuma vēsture', mileageHistoryDesc: 'Analizējam datus no tirgotājiem un reģistriem visā Eiropā.', damageRecords: 'Bojājumu reģistrs', damageRecordsDesc: 'Detalizēta informācija par ceļu satiksmes negadījumiem.', theftCheck: 'Zādzības pārbaude', theftCheckDesc: 'Pārbaudām Interpola un vietējās policijas datu bāzes.' },
    report: { fullReport: 'Pilns pārskats', theftClear: 'Nav zagts', theftFlagged: 'ZAGTS / MEKLĒTS', theftUnknown: 'NAV PĀRBAUDĪTS', theftUnknownTooltip: 'Zādzības pārbaude tikai ar UK reģistrāciju', saveToCloud: 'Saglabāt pārskatu mākonī', downloadPdf: 'Lejupielādēt pārskatu kā PDF', supplementTitle: 'Papildināt pārskatu no avotiem:', supplementButton: 'Iegūt datus', supplementLoading: 'Iegūst…', serviceHistoryNotFound: 'Servisa vēsture netika atrasta.', mileageHistory: 'Nobraukuma vēsture (km)', lastMileage: 'Pēdējais nobraukums:', serviceEvents: 'Servisa ieraksti', damages: 'Reģistrētie bojājumi', damageLabel: 'Bojājums:', severityHigh: 'Augsta', severityMedium: 'Vidēja', marketValue: 'Tirgus vērtība', marketValueBased: 'Pamatojoties uz līdzīgu modeļu pārdošanu.', min: 'Min', max: 'Maks', technicalSpecs: 'Tehniskie dati', fuelType: 'Degviela', power: 'Jauda', engine: 'Dzinējs', transmission: 'Transmisija', bodyType: 'Virsbūve', colour: 'Krāsa', aiInsights: 'AI analīze', aiInsightsDesc: 'AI var identificēt iespējamās problēmas un transportlīdzekļa stiprās puses.', analyzing: 'Analizē…', problemAreas: 'Iespējamās problēmas / riski', strongPoints: 'Stiprās puses', analyzeWithAI: 'Analizēt ar AI', refreshAnalysis: 'Atjaunot AI analīzi', retryIn: 'Mēģināt vēlreiz pēc', aiAnalysisFailed: 'AI analīze neizdevās.', allApiSources: 'Visi API avoti', showRawData: 'Pilna API informācija (JSON)', show: 'Rādīt', hide: 'Slēpt', saveAsJson: 'Saglabāt kā JSON', rawDataUnavailable: 'API dati nav pieejami', yes: 'Jā', no: 'Nē', showOriginal: 'Rādīt oriģinālu', translatingServiceComments: 'Tulko servisa komentārus…', serviceTranslationFailed: 'Tulkošana neizdevās.' },
    myReports: { title: 'Mani pārskati', loading: 'Ielādē...', noReports: 'Nav saglabātu pārskatu.' },
    aiChat: { welcome: 'Sveiki! Es esmu VinScanner AI eksperts. Kā es varu jums šodien palīdzēt?', cantRespond: 'Atvainojiet, pašlaik nevaru atbildēt.', expertTitle: 'AI eksperts', online: 'Tiešsaistē', placeholder: 'Rakstiet savu jautājumu...' },
  },
  mk: {
    seo: {
      title: 'VinScanner - Проверка на историја на возило',
      description: 'Проверете го VIN кодот и откријте ја историјата на возилото: километража, несреќи, поправки, историја на сопственост. Брза и сигурна проверка.',
      ogTitle: 'VinScanner - Проверка на историја на возило',
      ogDescription: 'Проверете го VIN кодот и откријте ја историјата на возилото: километража, несреќи, поправки.',
    },
    nav: { services: 'Услуги', pricing: 'Цени', about: 'За нас', login: 'Најави се', myReports: 'Мои извештаи', signOut: 'Одјави се', deleteAccount: 'Избриши сметка', deleteAccountConfirm: 'Избриши сметка', deleteAccountConfirmText: 'Дали сте сигурни дека сакате да ја избришете вашата сметка?', deleteAccountDeleting: 'Се брише…', deleteAccountError: 'Бришењето не успеа.' },
    tokenMode: { banner: 'Имате {n} од {total} извештаи.', noReports: 'Нема преостанати извештаи.', loading: 'Се вчитува…', error: 'Вчитувањето не успеа.' },
    hero: { title: 'Откријте ја историјата на возилото', titleAccent: 'по VIN код', desc: 'Проверете историја на километража, штети и пазарна вредност за неколку секунди.', placeholder: 'Внесете VIN број...', button: 'Провери', sample: 'Пробај со пример' },
    pricing: { title: 'Изберете план', desc: 'Заштедете купувајќи повеќе проверки одеднаш.', bestValue: 'Најдобра вредност', order: 'Нарачај сега', confirm: 'Потврди', selectPlanForVin: 'Изберете план за VIN проверка', refundPolicy: 'Политика за поврат', perReport: 'По извештај:', orderStepTitle: 'Внесете email за извештаи', orderStepEmailLabel: 'Email адреса', orderStepEmailPlaceholder: 'пример@email.mk', orderStepAgreeTerms: 'Се согласувам со условите', orderStepAgreeBeforeTerms: 'Се согласувам со ', orderStepTermsLink: 'условите', orderStepAgreeBetween: ' и ', orderStepPrivacyLink: 'политиката за приватност', orderStepTermsText: 'Условите за употреба.', orderStepPrivacyText: 'Политика за приватност.', orderStepContinue: 'Продолжи', paymentTitle: 'Плаќање', paymentOrderSummary: 'Резиме на нарачка', paymentPlan: 'План', paymentVin: 'VIN', paymentSubtotal: 'Меѓузбир', paymentDiscount: 'Попуст', paymentTotal: 'Вкупно', paymentDiscountCode: 'Код за попуст', paymentDiscountPlaceholder: 'Внесете код', paymentApply: 'Примени', paymentPay: 'Плати', paymentSecure: 'Безбедно плаќање', paymentCodeInvalid: 'Невалиден код', paymentCodeApplied: 'Попустот е применет', paymentApiUnavailable: 'API не е достапен.', paymentFormLoading: 'Се подготвува…', paymentOrPayAnotherWay: 'Или платете поинаку', paymentMethod: 'Начин на плаќање', paymentCard: 'Картичка', paymentLink: 'Линк', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'или', paymentExpressCheckout: 'Express', planSingle: 'Поединечен', planPopular: 'Најпопуларен', planBestValue: 'Најдобра вредност', report1: '1 Извештај', reports2: '2 Извештаи', reports3: '3 Извештаи', refundPolicyText: 'Политика за поврат.', close: 'Затвори' },
    footer: { desc: 'Доверлив извор за историја на возила во Европа.', privacyLink: 'Политика за приватност', termsLink: 'Услови', usageInstructionsLink: 'Упатства' },
    about: { body: 'Vinscanner.eu – доверливи VIN проверки.', contactLabel: 'Контактирајте не:' },
    loading: { steps: ['Поврзување...', 'Проверка на километража...', 'Анализа на штети...', 'Проверка на Интерпол...', 'Генерирање извештај...'], ready: 'Готово!', scanningHistory: 'Скенирање', secureConnection: 'Безбедна врска', sslEncryption: 'SSL активно' },
    errors: { historyNotFound: 'Историјата не е пронајдена.', apiFailed: 'API грешка.', networkFailed: 'Мрежна грешка.' },
    features: { mileageHistory: 'Историја на километража', mileageHistoryDesc: 'Анализираме податоци од цела Европа.', damageRecords: 'Регистар на штети', damageRecordsDesc: 'Информации за сообраќајни несреќи.', theftCheck: 'Проверка на кражба', theftCheckDesc: 'Проверуваме Интерпол бази.' },
    report: { fullReport: 'Целосен извештај', theftClear: 'Не е украден', theftFlagged: 'УКРАДЕН', theftUnknown: 'НЕ Е ПРОВЕРЕНО', theftUnknownTooltip: 'Само UK регистрација', saveToCloud: 'Зачувај во облак', downloadPdf: 'Преземи PDF', supplementTitle: 'Дополни од извори:', supplementButton: 'Земи податоци', supplementLoading: 'Се зема…', serviceHistoryNotFound: 'Сервисна историја не е пронајдена.', mileageHistory: 'Километража (км)', lastMileage: 'Последна:', serviceEvents: 'Сервисни записи', damages: 'Штети', damageLabel: 'Штета:', severityHigh: 'Висока', severityMedium: 'Средна', marketValue: 'Пазарна вредност', marketValueBased: 'Врз основа на слични модели.', min: 'Мин', max: 'Макс', technicalSpecs: 'Технички податоци', fuelType: 'Гориво', power: 'Моќност', engine: 'Мотор', transmission: 'Менувач', bodyType: 'Каросерија', colour: 'Боја', aiInsights: 'AI анализа', aiInsightsDesc: 'AI идентификува проблеми и предности.', analyzing: 'Анализа…', problemAreas: 'Проблеми', strongPoints: 'Предности', analyzeWithAI: 'Анализирај', refreshAnalysis: 'Освежи', retryIn: 'Обиди се повторно', aiAnalysisFailed: 'AI анализата не успеа.', allApiSources: 'Сите API извори', showRawData: 'API информации (JSON)', show: 'Прикажи', hide: 'Скриј', saveAsJson: 'Зачувај JSON', rawDataUnavailable: 'API недостапен', yes: 'Да', no: 'Не', showOriginal: 'Оригинал', translatingServiceComments: 'Превод…', serviceTranslationFailed: 'Преводот не успеа.' },
    myReports: { title: 'Мои извештаи', loading: 'Вчитување...', noReports: 'Нема извештаи.' },
    aiChat: { welcome: 'Здраво! Јас сум AI експерт. Како можам да помогнам?', cantRespond: 'Не можам да одговорам сега.', expertTitle: 'AI експерт', online: 'Онлајн', placeholder: 'Напишете прашање...' },
  },
  et: {
    seo: {
      title: 'VinScanner - Sõiduki ajaloo kontroll',
      description: 'Kontrollige VIN-koodi ja avastage sõiduki ajalugu: läbisõit, õnnetused, remondid, omanike ajalugu. Kiire ja usaldusväärne kontroll.',
      ogTitle: 'VinScanner - Sõiduki ajaloo kontroll',
      ogDescription: 'Kontrollige VIN-koodi ja avastage sõiduki ajalugu: läbisõit, õnnetused, remondid.',
    },
    nav: { services: 'Teenused', pricing: 'Hinnad', about: 'Meist', login: 'Logi sisse', myReports: 'Minu aruanded', signOut: 'Logi välja', deleteAccount: 'Kustuta konto', deleteAccountConfirm: 'Kustuta konto', deleteAccountConfirmText: 'Kas olete kindel, et soovite oma konto kustutada?', deleteAccountDeleting: 'Kustutamine…', deleteAccountError: 'Kustutamine ebaõnnestus.' },
    tokenMode: { banner: 'Teil on {n}/{total} aruannet.', noReports: 'Aruandeid pole. Ostke uus pakett.', loading: 'Laadimine…', error: 'Laadimine ebaõnnestus.' },
    hero: { title: 'Avastage sõiduki ajalugu', titleAccent: 'VIN-koodi järgi', desc: 'Kontrollige läbisõidu ajalugu, kahjustusi ja turuväärtust sekunditega.', placeholder: 'Sisestage VIN-number...', button: 'Kontrolli', sample: 'Proovi näitega' },
    pricing: { title: 'Valige õige pakett', desc: 'Säästate mitme kontrolli korraga ostmisega.', bestValue: 'Parim väärtus', order: 'Telli nüüd', confirm: 'Kinnita', selectPlanForVin: 'Valige pakett VIN-kontrolliks', refundPolicy: 'Tagastuspoliitika', perReport: 'Aruande kohta:', orderStepTitle: 'Sisestage e-post aruannete jaoks', orderStepEmailLabel: 'E-posti aadress', orderStepEmailPlaceholder: 'näide@email.ee', orderStepAgreeTerms: 'Nõustun tingimustega', orderStepAgreeBeforeTerms: 'Nõustun ', orderStepTermsLink: 'tingimustega', orderStepAgreeBetween: ' ja lugesin ', orderStepPrivacyLink: 'privaatsuspoliitikat', orderStepTermsText: 'Kasutustingimused.', orderStepPrivacyText: 'Privaatsuspoliitika.', orderStepContinue: 'Jätka', paymentTitle: 'Makse', paymentOrderSummary: 'Tellimuse kokkuvõte', paymentPlan: 'Pakett', paymentVin: 'VIN', paymentSubtotal: 'Vahesumma', paymentDiscount: 'Allahindlus', paymentTotal: 'Kokku', paymentDiscountCode: 'Sooduskood', paymentDiscountPlaceholder: 'Sisestage kood', paymentApply: 'Rakenda', paymentPay: 'Maksa', paymentSecure: 'Turvaline makse', paymentCodeInvalid: 'Vale kood', paymentCodeApplied: 'Allahindlus rakendatud', paymentApiUnavailable: 'Makse API pole saadaval.', paymentFormLoading: 'Ettevalmistamine…', paymentOrPayAnotherWay: 'Või makske teisiti', paymentMethod: 'Makseviis', paymentCard: 'Kaart', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'E-post', paymentOr: 'või', paymentExpressCheckout: 'Express', planSingle: 'Üksik', planPopular: 'Populaarseim', planBestValue: 'Parim väärtus', report1: '1 Aruanne', reports2: '2 Aruannet', reports3: '3 Aruannet', refundPolicyText: 'Tagastuspoliitika.', close: 'Sulge' },
    footer: { desc: 'Usaldusväärne sõidukite ajaloo allikas Euroopas.', privacyLink: 'Privaatsuspoliitika', termsLink: 'Kasutustingimused', usageInstructionsLink: 'Kasutusjuhend' },
    about: { body: 'Vinscanner.eu – usaldusväärsed VIN-kontrollid.', contactLabel: 'Kontakt:' },
    loading: { steps: ['Ühendamine…', 'Läbisõidu kontrollimine…', 'Kahjustuste analüüs…', 'Interpoli kontroll…', 'Aruande loomine…'], ready: 'Valmis!', scanningHistory: 'Skannimine', secureConnection: 'Turvaline ühendus', sslEncryption: 'SSL aktiivne' },
    errors: { historyNotFound: 'Ajalugu ei leitud.', apiFailed: 'API viga.', networkFailed: 'Võrguviga.' },
    features: { mileageHistory: 'Läbisõidu ajalugu', mileageHistoryDesc: 'Analüüsime andmeid kogu Euroopast.', damageRecords: 'Kahjustuste register', damageRecordsDesc: 'Info liiklusõnnetuste kohta.', theftCheck: 'Varguse kontroll', theftCheckDesc: 'Kontrollime Interpoli andmebaase.' },
    report: { fullReport: 'Täielik aruanne', theftClear: 'Pole varastatud', theftFlagged: 'VARASTATUD', theftUnknown: 'KONTROLLIMATA', theftUnknownTooltip: 'Ainult UK registreeringuga', saveToCloud: 'Salvesta pilve', downloadPdf: 'Laadi PDF alla', supplementTitle: 'Täienda allikatest:', supplementButton: 'Hangi andmed', supplementLoading: 'Hankimine…', serviceHistoryNotFound: 'Hooldusajalugu puudub.', mileageHistory: 'Läbisõit (km)', lastMileage: 'Viimane:', serviceEvents: 'Hoolduskirjed', damages: 'Kahjustused', damageLabel: 'Kahjustus:', severityHigh: 'Kõrge', severityMedium: 'Keskmine', marketValue: 'Turuväärtus', marketValueBased: 'Sarnaste mudelite põhjal.', min: 'Min', max: 'Max', technicalSpecs: 'Tehnilised andmed', fuelType: 'Kütus', power: 'Võimsus', engine: 'Mootor', transmission: 'Käigukast', bodyType: 'Kere', colour: 'Värv', aiInsights: 'AI analüüs', aiInsightsDesc: 'AI tuvastab probleemid ja tugevused.', analyzing: 'Analüüsimine…', problemAreas: 'Probleemid', strongPoints: 'Tugevused', analyzeWithAI: 'Analüüsi', refreshAnalysis: 'Värskenda', retryIn: 'Proovi uuesti', aiAnalysisFailed: 'AI analüüs ebaõnnestus.', allApiSources: 'Kõik API allikad', showRawData: 'API info (JSON)', show: 'Näita', hide: 'Peida', saveAsJson: 'Salvesta JSON', rawDataUnavailable: 'API pole saadaval', yes: 'Jah', no: 'Ei', showOriginal: 'Originaal', translatingServiceComments: 'Tõlkimine…', serviceTranslationFailed: 'Tõlge ebaõnnestus.' },
    myReports: { title: 'Minu aruanded', loading: 'Laadimine...', noReports: 'Aruandeid pole.' },
    aiChat: { welcome: 'Tere! Olen VinScanner AI ekspert. Kuidas saan aidata?', cantRespond: 'Vabandust, ei saa praegu vastata.', expertTitle: 'AI ekspert', online: 'Võrgus', placeholder: 'Kirjutage küsimus...' },
  },
  tr: {
    seo: {
      title: 'VinScanner - Araç Geçmişi Kontrolü',
      description: 'VIN kodunu kontrol edin ve araç geçmişini keşfedin: kilometre, kazalar, onarımlar, sahiplik geçmişi. Hızlı ve güvenilir kontrol.',
      ogTitle: 'VinScanner - Araç Geçmişi Kontrolü',
      ogDescription: 'VIN kodunu kontrol edin ve araç geçmişini keşfedin: kilometre, kazalar, onarımlar.',
    },
    nav: { services: 'Hizmetler', pricing: 'Fiyatlar', about: 'Hakkımızda', login: 'Giriş', myReports: 'Raporlarım', signOut: 'Çıkış', deleteAccount: 'Hesabı Sil', deleteAccountConfirm: 'Hesabı Sil', deleteAccountConfirmText: 'Hesabınızı silmek istediğinizden emin misiniz?', deleteAccountDeleting: 'Siliniyor…', deleteAccountError: 'Silme başarısız.' },
    tokenMode: { banner: '{n}/{total} raporunuz var.', noReports: 'Rapor kalmadı.', loading: 'Yükleniyor…', error: 'Yükleme başarısız.' },
    hero: { title: 'Araç geçmişini keşfedin', titleAccent: 'VIN koduyla', desc: 'Kilometre geçmişini, hasar kayıtlarını ve piyasa değerini saniyeler içinde kontrol edin.', placeholder: 'VIN numarası girin...', button: 'Kontrol Et', sample: 'Örnekle dene' },
    pricing: { title: 'Doğru planı seçin', desc: 'Toplu kontrol alarak tasarruf edin.', bestValue: 'En İyi Değer', order: 'Şimdi Sipariş Ver', confirm: 'Onayla', selectPlanForVin: 'VIN kontrolü için plan seçin', refundPolicy: 'İade Politikası', perReport: 'Rapor başına:', orderStepTitle: 'Raporlar için e-posta girin', orderStepEmailLabel: 'E-posta adresi', orderStepEmailPlaceholder: 'ornek@email.com', orderStepAgreeTerms: 'Şartları kabul ediyorum', orderStepAgreeBeforeTerms: '', orderStepTermsLink: 'Şartlar', orderStepAgreeBetween: ' ve ', orderStepPrivacyLink: 'Gizlilik Politikası', orderStepTermsText: 'Kullanım şartları.', orderStepPrivacyText: 'Gizlilik politikası.', orderStepContinue: 'Devam', paymentTitle: 'Ödeme', paymentOrderSummary: 'Sipariş Özeti', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Ara Toplam', paymentDiscount: 'İndirim', paymentTotal: 'Toplam', paymentDiscountCode: 'İndirim Kodu', paymentDiscountPlaceholder: 'Kod girin', paymentApply: 'Uygula', paymentPay: 'Öde', paymentSecure: 'Güvenli Ödeme', paymentCodeInvalid: 'Geçersiz kod', paymentCodeApplied: 'İndirim uygulandı', paymentApiUnavailable: 'Ödeme API mevcut değil.', paymentFormLoading: 'Hazırlanıyor…', paymentOrPayAnotherWay: 'Veya başka şekilde öde', paymentMethod: 'Ödeme Yöntemi', paymentCard: 'Kart', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'E-posta', paymentOr: 'veya', paymentExpressCheckout: 'Express', planSingle: 'Tekli', planPopular: 'En Popüler', planBestValue: 'En İyi Değer', report1: '1 Rapor', reports2: '2 Rapor', reports3: '3 Rapor', refundPolicyText: 'İade politikası.', close: 'Kapat' },
    footer: { desc: 'Avrupa\'da güvenilir araç geçmişi kaynağı.', privacyLink: 'Gizlilik Politikası', termsLink: 'Kullanım Şartları', usageInstructionsLink: 'Kullanım Talimatları' },
    about: { body: 'Vinscanner.eu – güvenilir VIN kontrolleri.', contactLabel: 'İletişim:' },
    loading: { steps: ['Bağlanıyor...', 'Kilometre kontrol ediliyor...', 'Hasar analizi...', 'Interpol kontrolü...', 'Rapor oluşturuluyor...'], ready: 'Hazır!', scanningHistory: 'Taranıyor', secureConnection: 'Güvenli Bağlantı', sslEncryption: 'SSL Aktif' },
    errors: { historyNotFound: 'Geçmiş bulunamadı.', apiFailed: 'API hatası.', networkFailed: 'Ağ hatası.' },
    features: { mileageHistory: 'Kilometre Geçmişi', mileageHistoryDesc: 'Avrupa genelinde veri analizi.', damageRecords: 'Hasar Kaydı', damageRecordsDesc: 'Kaza bilgileri.', theftCheck: 'Hırsızlık Kontrolü', theftCheckDesc: 'Interpol veritabanı kontrolü.' },
    report: { fullReport: 'Tam Rapor', theftClear: 'Çalıntı Değil', theftFlagged: 'ÇALINTI', theftUnknown: 'KONTROL EDİLMEDİ', theftUnknownTooltip: 'Sadece UK plakalı', saveToCloud: 'Buluta kaydet', downloadPdf: 'PDF indir', supplementTitle: 'Kaynaklardan tamamla:', supplementButton: 'Veri al', supplementLoading: 'Alınıyor…', serviceHistoryNotFound: 'Servis geçmişi bulunamadı.', mileageHistory: 'Kilometre (km)', lastMileage: 'Son:', serviceEvents: 'Servis kayıtları', damages: 'Hasarlar', damageLabel: 'Hasar:', severityHigh: 'Yüksek', severityMedium: 'Orta', marketValue: 'Piyasa Değeri', marketValueBased: 'Benzer modellere göre.', min: 'Min', max: 'Maks', technicalSpecs: 'Teknik Veriler', fuelType: 'Yakıt', power: 'Güç', engine: 'Motor', transmission: 'Şanzıman', bodyType: 'Kasa', colour: 'Renk', aiInsights: 'AI Analizi', aiInsightsDesc: 'AI sorunları ve güçlü yönleri belirler.', analyzing: 'Analiz ediliyor…', problemAreas: 'Sorunlar', strongPoints: 'Güçlü Yönler', analyzeWithAI: 'AI ile Analiz', refreshAnalysis: 'Yenile', retryIn: 'Tekrar dene', aiAnalysisFailed: 'AI analizi başarısız.', allApiSources: 'Tüm API kaynakları', showRawData: 'API bilgisi (JSON)', show: 'Göster', hide: 'Gizle', saveAsJson: 'JSON kaydet', rawDataUnavailable: 'API mevcut değil', yes: 'Evet', no: 'Hayır', showOriginal: 'Orijinal', translatingServiceComments: 'Çevriliyor…', serviceTranslationFailed: 'Çeviri başarısız.' },
    myReports: { title: 'Raporlarım', loading: 'Yükleniyor...', noReports: 'Rapor yok.' },
    aiChat: { welcome: 'Merhaba! Ben VinScanner AI uzmanıyım. Size nasıl yardımcı olabilirim?', cantRespond: 'Şu an yanıt veremiyorum.', expertTitle: 'AI Uzmanı', online: 'Çevrimiçi', placeholder: 'Sorunuzu yazın...' },
  },
  ca: {
    seo: {
      title: 'VinScanner - Verificació historial del vehicle',
      description: 'Comproveu el codi VIN i descobriu l\'historial del vehicle: quilometratge, accidents, reparacions, historial de propietat. Verificació ràpida i fiable.',
      ogTitle: 'VinScanner - Verificació historial del vehicle',
      ogDescription: 'Comproveu el codi VIN i descobriu l\'historial del vehicle: quilometratge, accidents, reparacions.',
    },
    nav: { services: 'Serveis', pricing: 'Preus', about: 'Sobre nosaltres', login: 'Iniciar sessió', myReports: 'Els meus informes', signOut: 'Tancar sessió', deleteAccount: 'Eliminar compte', deleteAccountConfirm: 'Eliminar compte', deleteAccountConfirmText: 'Esteu segur que voleu eliminar el vostre compte?', deleteAccountDeleting: 'Eliminant…', deleteAccountError: 'Error en eliminar.' },
    tokenMode: { banner: 'Teniu {n} de {total} informes.', noReports: 'No queden informes.', loading: 'Carregant…', error: 'Error en carregar.' },
    hero: { title: 'Descobriu la història del vehicle', titleAccent: 'per codi VIN', desc: 'Comproveu la història del quilometratge, danys i valor de mercat en segons.', placeholder: 'Introduïu el número VIN...', button: 'Comprovar', sample: 'Provar amb exemple' },
    pricing: { title: 'Trieu el pla adequat', desc: 'Estalvieu comprant múltiples comprovacions.', bestValue: 'Millor valor', order: 'Demanar ara', confirm: 'Confirmar', selectPlanForVin: 'Seleccioneu un pla', refundPolicy: 'Política de reemborsament', perReport: 'Per informe:', orderStepTitle: 'Introduïu email', orderStepEmailLabel: 'Adreça email', orderStepEmailPlaceholder: 'exemple@email.cat', orderStepAgreeTerms: 'Accepto els termes', orderStepAgreeBeforeTerms: 'Accepto ', orderStepTermsLink: 'els termes', orderStepAgreeBetween: ' i ', orderStepPrivacyLink: 'política de privacitat', orderStepTermsText: 'Termes de servei.', orderStepPrivacyText: 'Política de privacitat.', orderStepContinue: 'Continuar', paymentTitle: 'Pagament', paymentOrderSummary: 'Resum de comanda', paymentPlan: 'Pla', paymentVin: 'VIN', paymentSubtotal: 'Subtotal', paymentDiscount: 'Descompte', paymentTotal: 'Total', paymentDiscountCode: 'Codi de descompte', paymentDiscountPlaceholder: 'Introduïu codi', paymentApply: 'Aplicar', paymentPay: 'Pagar', paymentSecure: 'Pagament segur', paymentCodeInvalid: 'Codi invàlid', paymentCodeApplied: 'Descompte aplicat', paymentApiUnavailable: 'API no disponible.', paymentFormLoading: 'Preparant…', paymentOrPayAnotherWay: 'O pagueu altrament', paymentMethod: 'Mètode de pagament', paymentCard: 'Targeta', paymentLink: 'Enllaç', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'o', paymentExpressCheckout: 'Express', planSingle: 'Únic', planPopular: 'Més popular', planBestValue: 'Millor valor', report1: '1 Informe', reports2: '2 Informes', reports3: '3 Informes', refundPolicyText: 'Política de reemborsament.', close: 'Tancar' },
    footer: { desc: 'Font fiable d\'història de vehicles a Europa.', privacyLink: 'Política de privacitat', termsLink: 'Termes d\'ús', usageInstructionsLink: 'Instruccions' },
    about: { body: 'Vinscanner.eu – comprovacions VIN fiables.', contactLabel: 'Contacte:' },
    loading: { steps: ['Connectant...', 'Comprovant quilometratge...', 'Analitzant danys...', 'Comprovant Interpol...', 'Generant informe...'], ready: 'Llest!', scanningHistory: 'Escanejant', secureConnection: 'Connexió segura', sslEncryption: 'SSL actiu' },
    errors: { historyNotFound: 'Història no trobada.', apiFailed: 'Error API.', networkFailed: 'Error de xarxa.' },
    features: { mileageHistory: 'Història quilometratge', mileageHistoryDesc: 'Analitzem dades de tota Europa.', damageRecords: 'Registre de danys', damageRecordsDesc: 'Informació d\'accidents.', theftCheck: 'Comprovació robatori', theftCheckDesc: 'Comprovem Interpol.' },
    report: { fullReport: 'Informe complet', theftClear: 'No robat', theftFlagged: 'ROBAT', theftUnknown: 'NO COMPROVAT', theftUnknownTooltip: 'Només UK', saveToCloud: 'Desar al núvol', downloadPdf: 'Descarregar PDF', supplementTitle: 'Completar de fonts:', supplementButton: 'Obtenir dades', supplementLoading: 'Obtenint…', serviceHistoryNotFound: 'Història de servei no trobada.', mileageHistory: 'Quilometratge (km)', lastMileage: 'Últim:', serviceEvents: 'Registres de servei', damages: 'Danys', damageLabel: 'Dany:', severityHigh: 'Alt', severityMedium: 'Mitjà', marketValue: 'Valor de mercat', marketValueBased: 'Basat en models similars.', min: 'Mín', max: 'Màx', technicalSpecs: 'Dades tècniques', fuelType: 'Combustible', power: 'Potència', engine: 'Motor', transmission: 'Transmissió', bodyType: 'Carrosseria', colour: 'Color', aiInsights: 'Anàlisi IA', aiInsightsDesc: 'IA identifica problemes i punts forts.', analyzing: 'Analitzant…', problemAreas: 'Problemes', strongPoints: 'Punts forts', analyzeWithAI: 'Analitzar amb IA', refreshAnalysis: 'Actualitzar', retryIn: 'Reintentar', aiAnalysisFailed: 'Anàlisi IA fallida.', allApiSources: 'Totes les fonts API', showRawData: 'Info API (JSON)', show: 'Mostrar', hide: 'Amagar', saveAsJson: 'Desar JSON', rawDataUnavailable: 'API no disponible', yes: 'Sí', no: 'No', showOriginal: 'Original', translatingServiceComments: 'Traduint…', serviceTranslationFailed: 'Traducció fallida.' },
    myReports: { title: 'Els meus informes', loading: 'Carregant...', noReports: 'Cap informe.' },
    aiChat: { welcome: 'Hola! Sóc l\'expert IA de VinScanner. Com puc ajudar-vos?', cantRespond: 'No puc respondre ara.', expertTitle: 'Expert IA', online: 'En línia', placeholder: 'Escriviu pregunta...' },
  },
  is: {
    seo: {
      title: 'VinScanner - Ökutækjasöguskoðun',
      description: 'Athugaðu VIN-númerið og uppgötvaðu sögu ökutækis: ekinn vegalengd, slys, viðgerðir, eignarhaldssaga. Hröð og áreiðanleg skoðun.',
      ogTitle: 'VinScanner - Ökutækjasöguskoðun',
      ogDescription: 'Athugaðu VIN-númerið og uppgötvaðu sögu ökutækis: ekinn vegalengd, slys, viðgerðir.',
    },
    nav: { services: 'Þjónusta', pricing: 'Verð', about: 'Um okkur', login: 'Innskráning', myReports: 'Skýrslurnar mínar', signOut: 'Útskráning', deleteAccount: 'Eyða reikningi', deleteAccountConfirm: 'Eyða reikningi', deleteAccountConfirmText: 'Ertu viss um að þú viljir eyða reikningnum þínum?', deleteAccountDeleting: 'Eyðir…', deleteAccountError: 'Eyðing mistókst.' },
    tokenMode: { banner: 'Þú átt {n} af {total} skýrslum.', noReports: 'Engar skýrslur eftir.', loading: 'Hleður…', error: 'Hleðsla mistókst.' },
    hero: { title: 'Uppgötvaðu sögu ökutækis', titleAccent: 'með VIN númer', desc: 'Athugaðu kílómetrasögu, tjón og markaðsverð á sekúndum.', placeholder: 'Sláðu inn VIN númer...', button: 'Athuga', sample: 'Prófa með dæmi' },
    pricing: { title: 'Veldu rétta pakka', desc: 'Sparaðu með því að kaupa margar athuganir.', bestValue: 'Besta gildi', order: 'Panta núna', confirm: 'Staðfesta', selectPlanForVin: 'Veldu pakka fyrir VIN athugun', refundPolicy: 'Endurgreiðslustefna', perReport: 'Á skýrslu:', orderStepTitle: 'Sláðu inn tölvupóst', orderStepEmailLabel: 'Tölvupóstfang', orderStepEmailPlaceholder: 'daemi@postur.is', orderStepAgreeTerms: 'Ég samþykki skilmála', orderStepAgreeBeforeTerms: 'Ég samþykki ', orderStepTermsLink: 'skilmála', orderStepAgreeBetween: ' og ', orderStepPrivacyLink: 'persónuverndarstefnu', orderStepTermsText: 'Þjónustuskilmálar.', orderStepPrivacyText: 'Persónuverndarstefna.', orderStepContinue: 'Halda áfram', paymentTitle: 'Greiðsla', paymentOrderSummary: 'Samantekt pöntunar', paymentPlan: 'Pakki', paymentVin: 'VIN', paymentSubtotal: 'Millisamtala', paymentDiscount: 'Afsláttur', paymentTotal: 'Samtals', paymentDiscountCode: 'Afsláttarkóði', paymentDiscountPlaceholder: 'Sláðu inn kóða', paymentApply: 'Nota', paymentPay: 'Greiða', paymentSecure: 'Örugg greiðsla', paymentCodeInvalid: 'Ógildur kóði', paymentCodeApplied: 'Afsláttur notaður', paymentApiUnavailable: 'Greiðslu API ekki tiltækt.', paymentFormLoading: 'Undirbýr…', paymentOrPayAnotherWay: 'Eða greiddu á annan hátt', paymentMethod: 'Greiðslumáti', paymentCard: 'Kort', paymentLink: 'Hlekkur', paymentApplePay: 'Apple Pay', paymentEmail: 'Tölvupóstur', paymentOr: 'eða', paymentExpressCheckout: 'Express', planSingle: 'Stök', planPopular: 'Vinsælust', planBestValue: 'Besta gildi', report1: '1 Skýrsla', reports2: '2 Skýrslur', reports3: '3 Skýrslur', refundPolicyText: 'Endurgreiðslustefna.', close: 'Loka' },
    footer: { desc: 'Áreiðanleg heimild fyrir sögu ökutækja í Evrópu.', privacyLink: 'Persónuverndarstefna', termsLink: 'Notkunarskilmálar', usageInstructionsLink: 'Notkunarleiðbeiningar' },
    about: { body: 'Vinscanner.eu – áreiðanleg VIN athugun.', contactLabel: 'Hafðu samband:' },
    loading: { steps: ['Tengist gagnagrunnum...', 'Athugar kílómetra...', 'Greinir tjón...', 'Athugar Interpol...', 'Býr til skýrslu...'], ready: 'Tilbúið!', scanningHistory: 'Skannar sögu', secureConnection: 'Örugg tenging', sslEncryption: 'SSL virkt' },
    errors: { historyNotFound: 'Saga fannst ekki.', apiFailed: 'API villa.', networkFailed: 'Netvilla.' },
    features: { mileageHistory: 'Kílómetrasaga', mileageHistoryDesc: 'Greinum gögn frá Evrópu.', damageRecords: 'Tjónaskrá', damageRecordsDesc: 'Upplýsingar um slys.', theftCheck: 'Þjófnaðarathugun', theftCheckDesc: 'Athugum Interpol gagnagrunna.' },
    report: { fullReport: 'Full skýrsla', theftClear: 'Ekki stolið', theftFlagged: 'STOLIÐ', theftUnknown: 'EKKI ATHUGAÐ', theftUnknownTooltip: 'Aðeins UK skráning', saveToCloud: 'Vista í skýi', downloadPdf: 'Hlaða niður PDF', supplementTitle: 'Bæta við úr heimildum:', supplementButton: 'Sækja gögn', supplementLoading: 'Sækir…', serviceHistoryNotFound: 'Þjónustusaga fannst ekki.', mileageHistory: 'Kílómetrar (km)', lastMileage: 'Síðast:', serviceEvents: 'Þjónustuskrár', damages: 'Tjón', damageLabel: 'Tjón:', severityHigh: 'Hátt', severityMedium: 'Miðlungs', marketValue: 'Markaðsverð', marketValueBased: 'Byggt á svipuðum gerðum.', min: 'Lágm', max: 'Hám', technicalSpecs: 'Tæknigögn', fuelType: 'Eldsneyti', power: 'Afl', engine: 'Vél', transmission: 'Gírkassi', bodyType: 'Yfirbygging', colour: 'Litur', aiInsights: 'AI greining', aiInsightsDesc: 'AI greinir vandamál og styrkleika.', analyzing: 'Greinir…', problemAreas: 'Vandamál', strongPoints: 'Styrkleika', analyzeWithAI: 'Greina með AI', refreshAnalysis: 'Endurnýja', retryIn: 'Reyna aftur', aiAnalysisFailed: 'AI greining mistókst.', allApiSources: 'Allar API heimildir', showRawData: 'API upplýsingar (JSON)', show: 'Sýna', hide: 'Fela', saveAsJson: 'Vista JSON', rawDataUnavailable: 'API ekki tiltækt', yes: 'Já', no: 'Nei', showOriginal: 'Upprunalegt', translatingServiceComments: 'Þýðir…', serviceTranslationFailed: 'Þýðing mistókst.' },
    myReports: { title: 'Skýrslurnar mínar', loading: 'Hleður...', noReports: 'Engar skýrslur.' },
    aiChat: { welcome: 'Halló! Ég er VinScanner AI sérfræðingur. Hvernig get ég hjálpað?', cantRespond: 'Fyrirgefðu, get ekki svarað núna.', expertTitle: 'AI sérfræðingur', online: 'Á netinu', placeholder: 'Skrifaðu spurningu...' },
  },
  lb: {
    seo: {
      title: 'VinScanner - Autosgeschicht kontrolléieren',
      description: 'Iwwerpréift de VIN-Code an entdeckt d\'Geschicht vum Gefier: Kilometer, Accidenter, Reparaturen, Besëtzergeschicht. Séier a zouverlässeg Kontroll.',
      ogTitle: 'VinScanner - Autosgeschicht kontrolléieren',
      ogDescription: 'Iwwerpréift de VIN-Code an entdeckt d\'Geschicht vum Gefier: Kilometer, Accidenter, Reparaturen.',
    },
    nav: { services: 'Servicer', pricing: 'Präisser', about: 'Iwwer eis', login: 'Aloggen', myReports: 'Meng Berichter', signOut: 'Ausloggen', deleteAccount: 'Kont läschen', deleteAccountConfirm: 'Kont läschen', deleteAccountConfirmText: 'Sidd Dir sécher?', deleteAccountDeleting: 'Läscht…', deleteAccountError: 'Läschen huet net funktionéiert.' },
    tokenMode: { banner: 'Dir hutt {n} vun {total} Berichter.', noReports: 'Keng Berichter méi.', loading: 'Lueden…', error: 'Lueden huet net funktionéiert.' },
    hero: { title: 'Entdeckt d\'Geschicht vum Gefier', titleAccent: 'mat VIN Code', desc: 'Préift Kilometer, Schued an Maartpräis a Sekonnen.', placeholder: 'VIN Nummer aginn...', button: 'Préifen', sample: 'Mat Beispill probéieren' },
    pricing: { title: 'De richtege Plang wielen', desc: 'Spuert mat méi Préifungen op eemol.', bestValue: 'Beschte Wäert', order: 'Elo bestellen', confirm: 'Confirméieren', selectPlanForVin: 'Plang fir VIN Préifung wielen', refundPolicy: 'Remboursement Politik', perReport: 'Pro Bericht:', orderStepTitle: 'E-Mail aginn', orderStepEmailLabel: 'E-Mail Adress', orderStepEmailPlaceholder: 'beispill@email.lu', orderStepAgreeTerms: 'Ech akzeptéieren d\'Konditiounen', orderStepAgreeBeforeTerms: 'Ech akzeptéieren ', orderStepTermsLink: 'd\'Konditiounen', orderStepAgreeBetween: ' an ', orderStepPrivacyLink: 'Dateschutz Politik', orderStepTermsText: 'Notzungskonditiounen.', orderStepPrivacyText: 'Dateschutz Politik.', orderStepContinue: 'Weider', paymentTitle: 'Bezuelen', paymentOrderSummary: 'Bestellung Resumé', paymentPlan: 'Plang', paymentVin: 'VIN', paymentSubtotal: 'Tëschesumm', paymentDiscount: 'Remise', paymentTotal: 'Total', paymentDiscountCode: 'Remise Code', paymentDiscountPlaceholder: 'Code aginn', paymentApply: 'Applizéieren', paymentPay: 'Bezuelen', paymentSecure: 'Sécher Bezuelen', paymentCodeInvalid: 'Ongëltege Code', paymentCodeApplied: 'Remise applizéiert', paymentApiUnavailable: 'API net disponibel.', paymentFormLoading: 'Virbereedung…', paymentOrPayAnotherWay: 'Oder anescht bezuelen', paymentMethod: 'Bezuelmethod', paymentCard: 'Kaart', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'E-Mail', paymentOr: 'oder', paymentExpressCheckout: 'Express', planSingle: 'Eenzel', planPopular: 'Am Populäersten', planBestValue: 'Beschte Wäert', report1: '1 Bericht', reports2: '2 Berichter', reports3: '3 Berichter', refundPolicyText: 'Remboursement Politik.', close: 'Zoumaachen' },
    footer: { desc: 'Zouverlässeg Quell fir Gefiergeschicht an Europa.', privacyLink: 'Dateschutz', termsLink: 'Konditiounen', usageInstructionsLink: 'Instruktioune' },
    about: { body: 'Vinscanner.eu – zouverlässeg VIN Préifungen.', contactLabel: 'Kontakt:' },
    loading: { steps: ['Connectéiert...', 'Kilometer préifen...', 'Schued analyséieren...', 'Interpol préifen...', 'Bericht erstellen...'], ready: 'Prett!', scanningHistory: 'Scannt', secureConnection: 'Sécher Verbindung', sslEncryption: 'SSL aktiv' },
    errors: { historyNotFound: 'Geschicht net fonnt.', apiFailed: 'API Feeler.', networkFailed: 'Netzwierk Feeler.' },
    features: { mileageHistory: 'Kilometer Geschicht', mileageHistoryDesc: 'Mir analyséieren Daten aus ganz Europa.', damageRecords: 'Schued Register', damageRecordsDesc: 'Informatiounen iwwer Accidenter.', theftCheck: 'Déifstall Préifung', theftCheckDesc: 'Mir préifen Interpol Datenbanken.' },
    report: { fullReport: 'Vollstännege Bericht', theftClear: 'Net geklaut', theftFlagged: 'GEKLAUT', theftUnknown: 'NET GEPRÉIFT', theftUnknownTooltip: 'Nëmmen UK Immatrikulatioun', saveToCloud: 'An d\'Cloud späicheren', downloadPdf: 'PDF eroflueden', supplementTitle: 'Vu Quellen ergänzen:', supplementButton: 'Donnéeën huelen', supplementLoading: 'Hëlt…', serviceHistoryNotFound: 'Service Geschicht net fonnt.', mileageHistory: 'Kilometer (km)', lastMileage: 'Lescht:', serviceEvents: 'Service Opzeechnungen', damages: 'Schued', damageLabel: 'Schued:', severityHigh: 'Héich', severityMedium: 'Mëttel', marketValue: 'Maartpräis', marketValueBased: 'Baséiert op ähnleche Modeller.', min: 'Min', max: 'Max', technicalSpecs: 'Technesch Donnéeën', fuelType: 'Brennstoff', power: 'Leeschtung', engine: 'Motor', transmission: 'Transmissioun', bodyType: 'Karosserie', colour: 'Faarf', aiInsights: 'AI Analyse', aiInsightsDesc: 'AI identifizéiert Problemer a Stäerkten.', analyzing: 'Analyséiert…', problemAreas: 'Problemer', strongPoints: 'Stäerkten', analyzeWithAI: 'Mat AI analyséieren', refreshAnalysis: 'Nei laden', retryIn: 'Nach eng Kéier', aiAnalysisFailed: 'AI Analyse huet net funktionéiert.', allApiSources: 'All API Quellen', showRawData: 'API Info (JSON)', show: 'Weisen', hide: 'Verstoppen', saveAsJson: 'JSON späicheren', rawDataUnavailable: 'API net disponibel', yes: 'Jo', no: 'Nee', showOriginal: 'Original', translatingServiceComments: 'Iwwersetzen…', serviceTranslationFailed: 'Iwwersetzung huet net funktionéiert.' },
    myReports: { title: 'Meng Berichter', loading: 'Lueden...', noReports: 'Keng Berichter.' },
    aiChat: { welcome: 'Moien! Ech sinn den VinScanner AI Expert. Wéi kann ech hëllefen?', cantRespond: 'Sorry, kann net elo äntweren.', expertTitle: 'AI Expert', online: 'Online', placeholder: 'Är Fro schreiwen...' },
  },
  cnr: {
    seo: {
      title: 'VinScanner - Provjera istorije vozila',
      description: 'Provjerite VIN kod i otkrijte istoriju vozila: kilometraža, nesreće, popravke, istorija vlasništva. Brza i pouzdana provjera.',
      ogTitle: 'VinScanner - Provjera istorije vozila',
      ogDescription: 'Provjerite VIN kod i otkrijte istoriju vozila: kilometraža, nesreće, popravke.',
    },
    nav: { services: 'Usluge', pricing: 'Cijene', about: 'O nama', login: 'Prijava', myReports: 'Moji izvještaji', signOut: 'Odjava', deleteAccount: 'Obriši nalog', deleteAccountConfirm: 'Obriši nalog', deleteAccountConfirmText: 'Jeste li sigurni?', deleteAccountDeleting: 'Brisanje…', deleteAccountError: 'Brisanje nije uspjelo.' },
    tokenMode: { banner: 'Imate {n} od {total} izvještaja.', noReports: 'Nema izvještaja.', loading: 'Učitavanje…', error: 'Greška.' },
    hero: { title: 'Otkrijte istoriju vozila', titleAccent: 'putem VIN koda', desc: 'Provjerite kilometražu, štete i tržišnu vrijednost.', placeholder: 'Unesite VIN...', button: 'Provjeri', sample: 'Probaj' },
    pricing: { title: 'Izaberite plan', desc: 'Uštedite kupovinom više provjera.', bestValue: 'Najbolja vrijednost', order: 'Naruči', confirm: 'Potvrdi', selectPlanForVin: 'Izaberite plan', refundPolicy: 'Povrat novca', perReport: 'Po izvještaju:', orderStepTitle: 'Email', orderStepEmailLabel: 'Email adresa', orderStepEmailPlaceholder: 'primjer@email.me', orderStepAgreeTerms: 'Prihvatam uslove', orderStepAgreeBeforeTerms: 'Prihvatam ', orderStepTermsLink: 'uslove', orderStepAgreeBetween: ' i ', orderStepPrivacyLink: 'privatnost', orderStepTermsText: 'Uslovi.', orderStepPrivacyText: 'Privatnost.', orderStepContinue: 'Nastavi', paymentTitle: 'Plaćanje', paymentOrderSummary: 'Rezime', paymentPlan: 'Plan', paymentVin: 'VIN', paymentSubtotal: 'Međuzbir', paymentDiscount: 'Popust', paymentTotal: 'Ukupno', paymentDiscountCode: 'Kod', paymentDiscountPlaceholder: 'Kod', paymentApply: 'Primijeni', paymentPay: 'Plati', paymentSecure: 'Sigurno', paymentCodeInvalid: 'Nevažeći kod', paymentCodeApplied: 'Primijenjeno', paymentApiUnavailable: 'API nedostupan.', paymentFormLoading: 'Priprema…', paymentOrPayAnotherWay: 'Ili drugačije', paymentMethod: 'Način', paymentCard: 'Kartica', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'ili', paymentExpressCheckout: 'Express', planSingle: 'Pojedinačno', planPopular: 'Najpopularnije', planBestValue: 'Najbolja vrijednost', report1: '1 Izvještaj', reports2: '2 Izvještaja', reports3: '3 Izvještaja', refundPolicyText: 'Politika povrata.', close: 'Zatvori' },
    footer: { desc: 'Pouzdan izvor istorije vozila.', privacyLink: 'Privatnost', termsLink: 'Uslovi', usageInstructionsLink: 'Uputstva' },
    about: { body: 'Vinscanner.eu – pouzdane VIN provjere.', contactLabel: 'Kontakt:' },
    loading: { steps: ['Povezivanje...', 'Provjera kilometraže...', 'Analiza šteta...', 'Interpol...', 'Generisanje...'], ready: 'Gotovo!', scanningHistory: 'Skeniranje', secureConnection: 'Sigurna veza', sslEncryption: 'SSL' },
    errors: { historyNotFound: 'Nije pronađeno.', apiFailed: 'API greška.', networkFailed: 'Mrežna greška.' },
    features: { mileageHistory: 'Kilometraža', mileageHistoryDesc: 'Podaci iz Evrope.', damageRecords: 'Štete', damageRecordsDesc: 'Info o nesrećama.', theftCheck: 'Krađa', theftCheckDesc: 'Interpol provjera.' },
    report: { fullReport: 'Puni izvještaj', theftClear: 'Nije ukradeno', theftFlagged: 'UKRADENO', theftUnknown: 'NEPROVJERENO', theftUnknownTooltip: 'Samo UK', saveToCloud: 'Sačuvaj', downloadPdf: 'PDF', supplementTitle: 'Dopuni:', supplementButton: 'Uzmi', supplementLoading: 'Uzima…', serviceHistoryNotFound: 'Servis nije pronađen.', mileageHistory: 'Km', lastMileage: 'Zadnja:', serviceEvents: 'Servis', damages: 'Štete', damageLabel: 'Šteta:', severityHigh: 'Visoka', severityMedium: 'Srednja', marketValue: 'Vrijednost', marketValueBased: 'Slični modeli.', min: 'Min', max: 'Max', technicalSpecs: 'Tehnički', fuelType: 'Gorivo', power: 'Snaga', engine: 'Motor', transmission: 'Mjenjač', bodyType: 'Karoserija', colour: 'Boja', aiInsights: 'AI', aiInsightsDesc: 'AI analiza.', analyzing: 'Analiza…', problemAreas: 'Problemi', strongPoints: 'Prednosti', analyzeWithAI: 'AI', refreshAnalysis: 'Osvježi', retryIn: 'Ponovo', aiAnalysisFailed: 'AI greška.', allApiSources: 'API', showRawData: 'JSON', show: 'Prikaži', hide: 'Sakrij', saveAsJson: 'JSON', rawDataUnavailable: 'Nedostupno', yes: 'Da', no: 'Ne', showOriginal: 'Original', translatingServiceComments: 'Prevod…', serviceTranslationFailed: 'Greška.' },
    myReports: { title: 'Izvještaji', loading: 'Učitavanje...', noReports: 'Nema.' },
    aiChat: { welcome: 'Zdravo! Kako mogu pomoći?', cantRespond: 'Ne mogu odgovoriti.', expertTitle: 'AI', online: 'Online', placeholder: 'Pitanje...' },
  },
  mt: {
    seo: {
      title: 'VinScanner - Verifika tal-istorja tal-vettura',
      description: 'Iċċekkja l-kodiċi VIN u skopri l-istorja tal-vettura: kilometraġġ, inċidenti, tiswijiet, storja tas-sjieda. Verifika mgħaġġla u affidabbli.',
      ogTitle: 'VinScanner - Verifika tal-istorja tal-vettura',
      ogDescription: 'Iċċekkja l-kodiċi VIN u skopri l-istorja tal-vettura: kilometraġġ, inċidenti, tiswijiet.',
    },
    nav: { services: 'Servizzi', pricing: 'Prezzijiet', about: 'Dwarna', login: 'Idħol', myReports: 'Ir-Rapporti Tiegħi', signOut: 'Oħroġ', deleteAccount: 'Ħassar Kont', deleteAccountConfirm: 'Ħassar', deleteAccountConfirmText: 'Int ċert?', deleteAccountDeleting: 'Qed jitħassar…', deleteAccountError: 'Żball.' },
    tokenMode: { banner: 'Għandek {n} minn {total} rapporti.', noReports: 'L-ebda rapporti.', loading: 'Qed jitgħabba…', error: 'Żball.' },
    hero: { title: 'Skopri l-istorja tal-vettura', titleAccent: 'permezz tal-VIN', desc: 'Iċċekkja l-kilometraġġ, ħsara u valur tas-suq fi sekondi.', placeholder: 'Daħħal in-numru VIN...', button: 'Iċċekkja', sample: 'Prova b\'eżempju' },
    pricing: { title: 'Agħżel il-pjan', desc: 'Iffranka billi tixtri aktar kontrolli.', bestValue: 'L-Aħjar Valur', order: 'Ordna Issa', confirm: 'Ikkonferma', selectPlanForVin: 'Agħżel pjan', refundPolicy: 'Politika ta\' Rifużjoni', perReport: 'Għal kull rapport:', orderStepTitle: 'Email', orderStepEmailLabel: 'Indirizz email', orderStepEmailPlaceholder: 'eżempju@email.mt', orderStepAgreeTerms: 'Naċċetta t-termini', orderStepAgreeBeforeTerms: 'Naċċetta ', orderStepTermsLink: 't-termini', orderStepAgreeBetween: ' u ', orderStepPrivacyLink: 'privatezza', orderStepTermsText: 'Termini.', orderStepPrivacyText: 'Privatezza.', orderStepContinue: 'Kompli', paymentTitle: 'Ħlas', paymentOrderSummary: 'Sommarju', paymentPlan: 'Pjan', paymentVin: 'VIN', paymentSubtotal: 'Subtotal', paymentDiscount: 'Skont', paymentTotal: 'Total', paymentDiscountCode: 'Kodiċi', paymentDiscountPlaceholder: 'Kodiċi', paymentApply: 'Applika', paymentPay: 'Ħallas', paymentSecure: 'Ħlas sigur', paymentCodeInvalid: 'Kodiċi invalidu', paymentCodeApplied: 'Applikat', paymentApiUnavailable: 'API mhux disponibbli.', paymentFormLoading: 'Qed jipprepara…', paymentOrPayAnotherWay: 'Jew ħallas mod ieħor', paymentMethod: 'Metodu', paymentCard: 'Karta', paymentLink: 'Link', paymentApplePay: 'Apple Pay', paymentEmail: 'Email', paymentOr: 'jew', paymentExpressCheckout: 'Express', planSingle: 'Wieħed', planPopular: 'L-Aktar Popolari', planBestValue: 'L-Aħjar Valur', report1: '1 Rapport', reports2: '2 Rapporti', reports3: '3 Rapporti', refundPolicyText: 'Politika.', close: 'Agħlaq' },
    footer: { desc: 'Sors ta\' fiduċja għall-istorja tal-vetturi fl-Ewropa.', privacyLink: 'Privatezza', termsLink: 'Termini', usageInstructionsLink: 'Istruzzjonijiet' },
    about: { body: 'Vinscanner.eu – kontrolli VIN ta\' fiduċja.', contactLabel: 'Kuntatt:' },
    loading: { steps: ['Qed jikkonnettja...', 'Qed jiċċekkja kilometraġġ...', 'Qed janalizza ħsara...', 'Interpol...', 'Qed jiġġenera rapport...'], ready: 'Lest!', scanningHistory: 'Qed jiskennja', secureConnection: 'Konnessjoni sigura', sslEncryption: 'SSL attiv' },
    errors: { historyNotFound: 'Storja ma nstabitx.', apiFailed: 'Żball API.', networkFailed: 'Żball tan-netwerk.' },
    features: { mileageHistory: 'Istorja Kilometraġġ', mileageHistoryDesc: 'Data mill-Ewropa kollha.', damageRecords: 'Rekords ta\' Ħsara', damageRecordsDesc: 'Info dwar inċidenti.', theftCheck: 'Kontroll Serq', theftCheckDesc: 'Niċċekkjaw l-Interpol.' },
    report: { fullReport: 'Rapport Sħiħ', theftClear: 'Mhux misruq', theftFlagged: 'MISRUQ', theftUnknown: 'MA ĠIEX IĊĊEKKJAT', theftUnknownTooltip: 'Biss UK', saveToCloud: 'Issejvja fil-cloud', downloadPdf: 'Niżżel PDF', supplementTitle: 'Kompli minn sorsi:', supplementButton: 'Ikseb data', supplementLoading: 'Qed jikseb…', serviceHistoryNotFound: 'Storja tas-servizz ma nstabitx.', mileageHistory: 'Km', lastMileage: 'L-aħħar:', serviceEvents: 'Rekords servizz', damages: 'Ħsarat', damageLabel: 'Ħsara:', severityHigh: 'Għoli', severityMedium: 'Medju', marketValue: 'Valur', marketValueBased: 'Ibbażat fuq mudelli simili.', min: 'Min', max: 'Max', technicalSpecs: 'Data Teknika', fuelType: 'Fjuwil', power: 'Qawwa', engine: 'Magna', transmission: 'Transmissjoni', bodyType: 'Tip', colour: 'Kulur', aiInsights: 'AI', aiInsightsDesc: 'AI jidentifika problemi.', analyzing: 'Qed janalizza…', problemAreas: 'Problemi', strongPoints: 'Punti b\'saħħithom', analyzeWithAI: 'AI', refreshAnalysis: 'Aġġorna', retryIn: 'Erġa\' pprova', aiAnalysisFailed: 'AI falla.', allApiSources: 'Sorsi API', showRawData: 'JSON', show: 'Uri', hide: 'Aħbi', saveAsJson: 'JSON', rawDataUnavailable: 'Mhux disponibbli', yes: 'Iva', no: 'Le', showOriginal: 'Oriġinal', translatingServiceComments: 'Qed jittraduċi…', serviceTranslationFailed: 'Traduzzjoni falliet.' },
    myReports: { title: 'Ir-Rapporti Tiegħi', loading: 'Qed jitgħabba...', noReports: 'L-ebda rapporti.' },
    aiChat: { welcome: 'Bonġu! Jien l-espert AI. Kif nista\' ngħin?', cantRespond: 'Ma nistax nirrispondi issa.', expertTitle: 'Espert AI', online: 'Online', placeholder: 'Ikteb mistoqsija...' },
  },
};

/**
 * Gauna vertimus pagal kalbą. Jei kalba nepalaikoma – grąžina fallback (en).
 */
export function getTranslations(lang: LangCode | string): Translations {
  const key = SUPPORTED_LANGUAGES.includes(lang as SupportedLang) ? (lang as SupportedLang) : FALLBACK_LANG;
  return translationsMap[key];
}

/** Tėvinėms komponentams: naudok getTranslations(lang) arba translations[lang] (tik lt|en|de) */
export const translations = translationsMap;
