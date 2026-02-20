/**
 * Vertimai – visi vartotojui matomi tekstai.
 *
 * Kaip pridėti naują kalbą (pvz. 'de'):
 * 1. Pridėk 'de' į SUPPORTED_LANGUAGES masyvą
 * 2. Pridėk translationsMap['de'] = { ... } su visais vertimais (galima nukopijuoti iš 'en' ir išversti)
 * 3. Pridėk į ALL_LANGUAGES masyvą (jei dar ne)
 */

export const SUPPORTED_LANGUAGES = ['lt', 'en', 'de'] as const;
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
};

/**
 * Gauna vertimus pagal kalbą. Jei kalba nepalaikoma (lt, en, de) – grąžina fallback (en).
 */
export function getTranslations(lang: LangCode | string): Translations {
  const key = SUPPORTED_LANGUAGES.includes(lang as SupportedLang) ? (lang as SupportedLang) : FALLBACK_LANG;
  return translationsMap[key];
}

/** Tėvinėms komponentams: naudok getTranslations(lang) arba translations[lang] (tik lt|en|de) */
export const translations = translationsMap;
