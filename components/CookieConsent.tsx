import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
  lang: string;
}

const COOKIE_CONSENT_KEY = 'vinscanner_cookie_consent';

type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'custom';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieTranslation {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  save: string;
  back: string;
  necessary: string;
  necessaryDesc: string;
  analytics: string;
  analyticsDesc: string;
  marketing: string;
  marketingDesc: string;
  privacyLink: string;
}

const translations: Record<string, CookieTranslation> = {
  lt: { title: 'Slapukų nustatymai', description: 'Naudojame slapukus, kad pagerintume jūsų patirtį. Analitiniai slapukai padeda mums suprasti, kaip naudojatės svetaine.', acceptAll: 'Priimti visus', rejectAll: 'Atmesti nebūtinus', customize: 'Nustatymai', save: 'Išsaugoti', back: 'Atgal', necessary: 'Būtini slapukai', necessaryDesc: 'Reikalingi svetainės veikimui. Negali būti išjungti.', analytics: 'Analitiniai slapukai', analyticsDesc: 'Padeda suprasti, kaip lankytojai naudojasi svetaine (Google Analytics).', marketing: 'Rinkodaros slapukai', marketingDesc: 'Naudojami reklamai pritaikyti pagal jūsų interesus.', privacyLink: 'Privatumo politika' },
  en: { title: 'Cookie Settings', description: 'We use cookies to improve your experience. Analytics cookies help us understand how you use the website.', acceptAll: 'Accept All', rejectAll: 'Reject Non-essential', customize: 'Customize', save: 'Save', back: 'Back', necessary: 'Necessary Cookies', necessaryDesc: 'Required for the website to function. Cannot be disabled.', analytics: 'Analytics Cookies', analyticsDesc: 'Help us understand how visitors use the website (Google Analytics).', marketing: 'Marketing Cookies', marketingDesc: 'Used to personalize ads based on your interests.', privacyLink: 'Privacy Policy' },
  de: { title: 'Cookie-Einstellungen', description: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Analytische Cookies helfen uns zu verstehen, wie Sie die Website nutzen.', acceptAll: 'Alle akzeptieren', rejectAll: 'Nicht erforderliche ablehnen', customize: 'Anpassen', save: 'Speichern', back: 'Zurück', necessary: 'Erforderliche Cookies', necessaryDesc: 'Für die Funktion der Website erforderlich. Können nicht deaktiviert werden.', analytics: 'Analytische Cookies', analyticsDesc: 'Helfen uns zu verstehen, wie Besucher die Website nutzen (Google Analytics).', marketing: 'Marketing-Cookies', marketingDesc: 'Werden verwendet, um Werbung auf Ihre Interessen abzustimmen.', privacyLink: 'Datenschutz' },
  pl: { title: 'Ustawienia plików cookie', description: 'Używamy plików cookie, aby poprawić Twoje doświadczenia. Analityczne pliki cookie pomagają nam zrozumieć, jak korzystasz z witryny.', acceptAll: 'Zaakceptuj wszystkie', rejectAll: 'Odrzuć nieistotne', customize: 'Dostosuj', save: 'Zapisz', back: 'Wstecz', necessary: 'Niezbędne pliki cookie', necessaryDesc: 'Wymagane do działania strony. Nie można ich wyłączyć.', analytics: 'Analityczne pliki cookie', analyticsDesc: 'Pomagają zrozumieć, jak użytkownicy korzystają ze strony (Google Analytics).', marketing: 'Marketingowe pliki cookie', marketingDesc: 'Służą do personalizacji reklam na podstawie Twoich zainteresowań.', privacyLink: 'Polityka prywatności' },
  fr: { title: 'Paramètres des cookies', description: 'Nous utilisons des cookies pour améliorer votre expérience. Les cookies analytiques nous aident à comprendre comment vous utilisez le site.', acceptAll: 'Accepter tout', rejectAll: 'Refuser les non-essentiels', customize: 'Personnaliser', save: 'Enregistrer', back: 'Retour', necessary: 'Cookies nécessaires', necessaryDesc: 'Requis pour le fonctionnement du site. Ne peuvent pas être désactivés.', analytics: 'Cookies analytiques', analyticsDesc: 'Nous aident à comprendre comment les visiteurs utilisent le site (Google Analytics).', marketing: 'Cookies marketing', marketingDesc: 'Utilisés pour personnaliser les annonces selon vos intérêts.', privacyLink: 'Politique de confidentialité' },
  es: { title: 'Configuración de cookies', description: 'Usamos cookies para mejorar su experiencia. Las cookies analíticas nos ayudan a entender cómo usa el sitio.', acceptAll: 'Aceptar todas', rejectAll: 'Rechazar no esenciales', customize: 'Personalizar', save: 'Guardar', back: 'Volver', necessary: 'Cookies necesarias', necessaryDesc: 'Requeridas para el funcionamiento del sitio. No se pueden desactivar.', analytics: 'Cookies analíticas', analyticsDesc: 'Nos ayudan a entender cómo los visitantes usan el sitio (Google Analytics).', marketing: 'Cookies de marketing', marketingDesc: 'Usadas para personalizar anuncios según sus intereses.', privacyLink: 'Política de privacidad' },
  it: { title: 'Impostazioni cookie', description: 'Utilizziamo i cookie per migliorare la tua esperienza. I cookie analitici ci aiutano a capire come utilizzi il sito.', acceptAll: 'Accetta tutti', rejectAll: 'Rifiuta non essenziali', customize: 'Personalizza', save: 'Salva', back: 'Indietro', necessary: 'Cookie necessari', necessaryDesc: 'Necessari per il funzionamento del sito. Non possono essere disabilitati.', analytics: 'Cookie analitici', analyticsDesc: 'Ci aiutano a capire come i visitatori utilizzano il sito (Google Analytics).', marketing: 'Cookie di marketing', marketingDesc: 'Utilizzati per personalizzare gli annunci in base ai tuoi interessi.', privacyLink: 'Informativa sulla privacy' },
  nl: { title: 'Cookie-instellingen', description: 'We gebruiken cookies om uw ervaring te verbeteren. Analytische cookies helpen ons te begrijpen hoe u de website gebruikt.', acceptAll: 'Alles accepteren', rejectAll: 'Niet-essentiële weigeren', customize: 'Aanpassen', save: 'Opslaan', back: 'Terug', necessary: 'Noodzakelijke cookies', necessaryDesc: 'Vereist voor de werking van de website. Kunnen niet worden uitgeschakeld.', analytics: 'Analytische cookies', analyticsDesc: 'Helpen ons te begrijpen hoe bezoekers de website gebruiken (Google Analytics).', marketing: 'Marketing cookies', marketingDesc: 'Gebruikt om advertenties te personaliseren op basis van uw interesses.', privacyLink: 'Privacybeleid' },
  cs: { title: 'Nastavení cookies', description: 'Používáme cookies ke zlepšení vašeho zážitku. Analytické cookies nám pomáhají pochopit, jak web používáte.', acceptAll: 'Přijmout vše', rejectAll: 'Odmítnout nepotřebné', customize: 'Přizpůsobit', save: 'Uložit', back: 'Zpět', necessary: 'Nezbytné cookies', necessaryDesc: 'Nutné pro fungování webu. Nelze vypnout.', analytics: 'Analytické cookies', analyticsDesc: 'Pomáhají pochopit, jak návštěvníci web používají (Google Analytics).', marketing: 'Marketingové cookies', marketingDesc: 'Slouží k personalizaci reklam podle vašich zájmů.', privacyLink: 'Zásady ochrany osobních údajů' },
  uk: { title: 'Налаштування cookie', description: 'Ми використовуємо cookie для покращення вашого досвіду. Аналітичні cookie допомагають нам зрозуміти, як ви використовуєте сайт.', acceptAll: 'Прийняти всі', rejectAll: 'Відхилити необов\'язкові', customize: 'Налаштувати', save: 'Зберегти', back: 'Назад', necessary: 'Необхідні cookie', necessaryDesc: 'Потрібні для роботи сайту. Не можна вимкнути.', analytics: 'Аналітичні cookie', analyticsDesc: 'Допомагають зрозуміти, як відвідувачі користуються сайтом (Google Analytics).', marketing: 'Маркетингові cookie', marketingDesc: 'Використовуються для персоналізації реклами за вашими інтересами.', privacyLink: 'Політика конфіденційності' },
  ro: { title: 'Setări cookie', description: 'Folosim cookie-uri pentru a îmbunătăți experiența. Cookie-urile analitice ne ajută să înțelegem cum folosiți site-ul.', acceptAll: 'Acceptă toate', rejectAll: 'Respinge neesențiale', customize: 'Personalizează', save: 'Salvează', back: 'Înapoi', necessary: 'Cookie-uri necesare', necessaryDesc: 'Necesare pentru funcționarea site-ului. Nu pot fi dezactivate.', analytics: 'Cookie-uri analitice', analyticsDesc: 'Ne ajută să înțelegem cum vizitatorii folosesc site-ul (Google Analytics).', marketing: 'Cookie-uri de marketing', marketingDesc: 'Folosite pentru personalizarea reclamelor după interesele dvs.', privacyLink: 'Politica de confidențialitate' },
  sv: { title: 'Cookie-inställningar', description: 'Vi använder cookies för att förbättra din upplevelse. Analytiska cookies hjälper oss förstå hur du använder webbplatsen.', acceptAll: 'Acceptera alla', rejectAll: 'Avvisa icke-nödvändiga', customize: 'Anpassa', save: 'Spara', back: 'Tillbaka', necessary: 'Nödvändiga cookies', necessaryDesc: 'Krävs för att webbplatsen ska fungera. Kan inte inaktiveras.', analytics: 'Analytiska cookies', analyticsDesc: 'Hjälper oss förstå hur besökare använder webbplatsen (Google Analytics).', marketing: 'Marknadsförings-cookies', marketingDesc: 'Används för att anpassa annonser efter dina intressen.', privacyLink: 'Integritetspolicy' },
  el: { title: 'Ρυθμίσεις cookies', description: 'Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας. Τα αναλυτικά cookies μας βοηθούν να κατανοήσουμε πώς χρησιμοποιείτε τον ιστότοπο.', acceptAll: 'Αποδοχή όλων', rejectAll: 'Απόρριψη μη απαραίτητων', customize: 'Προσαρμογή', save: 'Αποθήκευση', back: 'Πίσω', necessary: 'Απαραίτητα cookies', necessaryDesc: 'Απαιτούνται για τη λειτουργία του ιστότοπου. Δεν μπορούν να απενεργοποιηθούν.', analytics: 'Αναλυτικά cookies', analyticsDesc: 'Μας βοηθούν να κατανοήσουμε πώς οι επισκέπτες χρησιμοποιούν τον ιστότοπο (Google Analytics).', marketing: 'Cookies μάρκετινγκ', marketingDesc: 'Χρησιμοποιούνται για την εξατομίκευση διαφημίσεων βάσει των ενδιαφερόντων σας.', privacyLink: 'Πολιτική απορρήτου' },
  pt: { title: 'Definições de cookies', description: 'Usamos cookies para melhorar a sua experiência. Os cookies analíticos ajudam-nos a compreender como utiliza o site.', acceptAll: 'Aceitar todos', rejectAll: 'Rejeitar não essenciais', customize: 'Personalizar', save: 'Guardar', back: 'Voltar', necessary: 'Cookies necessários', necessaryDesc: 'Necessários para o funcionamento do site. Não podem ser desativados.', analytics: 'Cookies analíticos', analyticsDesc: 'Ajudam-nos a compreender como os visitantes utilizam o site (Google Analytics).', marketing: 'Cookies de marketing', marketingDesc: 'Usados para personalizar anúncios de acordo com os seus interesses.', privacyLink: 'Política de privacidade' },
  hu: { title: 'Cookie beállítások', description: 'Sütiket használunk a felhasználói élmény javításához. Az analitikai sütik segítenek megérteni, hogyan használja az oldalt.', acceptAll: 'Összes elfogadása', rejectAll: 'Nem szükségesek elutasítása', customize: 'Testreszabás', save: 'Mentés', back: 'Vissza', necessary: 'Szükséges sütik', necessaryDesc: 'Az oldal működéséhez szükségesek. Nem kapcsolhatók ki.', analytics: 'Analitikai sütik', analyticsDesc: 'Segítenek megérteni, hogyan használják a látogatók az oldalt (Google Analytics).', marketing: 'Marketing sütik', marketingDesc: 'Az érdeklődési körnek megfelelő hirdetések megjelenítésére szolgálnak.', privacyLink: 'Adatvédelmi szabályzat' },
  bg: { title: 'Настройки за бисквитки', description: 'Използваме бисквитки, за да подобрим вашето изживяване. Аналитичните бисквитки ни помагат да разберем как използвате сайта.', acceptAll: 'Приемам всички', rejectAll: 'Отхвърлям ненужните', customize: 'Персонализиране', save: 'Запази', back: 'Назад', necessary: 'Необходими бисквитки', necessaryDesc: 'Необходими за работата на сайта. Не могат да бъдат изключени.', analytics: 'Аналитични бисквитки', analyticsDesc: 'Помагат ни да разберем как посетителите използват сайта (Google Analytics).', marketing: 'Маркетингови бисквитки', marketingDesc: 'Използват се за персонализиране на реклами според вашите интереси.', privacyLink: 'Политика за поверителност' },
  sr: { title: 'Подешавања колачића', description: 'Користимо колачиће за побољшање вашег искуства. Аналитички колачићи нам помажу да разумемо како користите сајт.', acceptAll: 'Прихвати све', rejectAll: 'Одбиј непотребне', customize: 'Прилагоди', save: 'Сачувај', back: 'Назад', necessary: 'Неопходни колачићи', necessaryDesc: 'Потребни за рад сајта. Не могу се искључити.', analytics: 'Аналитички колачићи', analyticsDesc: 'Помажу нам да разумемо како посетиоци користе сајт (Google Analytics).', marketing: 'Маркетиншки колачићи', marketingDesc: 'Користе се за персонализацију огласа према вашим интересовањима.', privacyLink: 'Политика приватности' },
  da: { title: 'Cookie-indstillinger', description: 'Vi bruger cookies til at forbedre din oplevelse. Analytiske cookies hjælper os med at forstå, hvordan du bruger webstedet.', acceptAll: 'Accepter alle', rejectAll: 'Afvis ikke-nødvendige', customize: 'Tilpas', save: 'Gem', back: 'Tilbage', necessary: 'Nødvendige cookies', necessaryDesc: 'Nødvendige for at webstedet fungerer. Kan ikke deaktiveres.', analytics: 'Analytiske cookies', analyticsDesc: 'Hjælper os med at forstå, hvordan besøgende bruger webstedet (Google Analytics).', marketing: 'Marketing cookies', marketingDesc: 'Bruges til at personalisere annoncer baseret på dine interesser.', privacyLink: 'Privatlivspolitik' },
  no: { title: 'Cookie-innstillinger', description: 'Vi bruker informasjonskapsler for å forbedre opplevelsen din. Analytiske informasjonskapsler hjelper oss å forstå hvordan du bruker nettstedet.', acceptAll: 'Godta alle', rejectAll: 'Avvis ikke-nødvendige', customize: 'Tilpass', save: 'Lagre', back: 'Tilbake', necessary: 'Nødvendige informasjonskapsler', necessaryDesc: 'Nødvendig for at nettstedet skal fungere. Kan ikke deaktiveres.', analytics: 'Analytiske informasjonskapsler', analyticsDesc: 'Hjelper oss å forstå hvordan besøkende bruker nettstedet (Google Analytics).', marketing: 'Markedsførings-informasjonskapsler', marketingDesc: 'Brukes til å tilpasse annonser basert på dine interesser.', privacyLink: 'Personvernregler' },
  fi: { title: 'Evästeasetukset', description: 'Käytämme evästeitä parantaaksemme kokemustasi. Analyyttiset evästeet auttavat meitä ymmärtämään, miten käytät sivustoa.', acceptAll: 'Hyväksy kaikki', rejectAll: 'Hylkää tarpeettomat', customize: 'Mukauta', save: 'Tallenna', back: 'Takaisin', necessary: 'Välttämättömät evästeet', necessaryDesc: 'Välttämättömiä sivuston toiminnalle. Ei voi poistaa käytöstä.', analytics: 'Analyyttiset evästeet', analyticsDesc: 'Auttavat meitä ymmärtämään, miten kävijät käyttävät sivustoa (Google Analytics).', marketing: 'Markkinointievästeet', marketingDesc: 'Käytetään mainosten personointiin kiinnostuksiesi mukaan.', privacyLink: 'Tietosuojakäytäntö' },
  sk: { title: 'Nastavenia cookies', description: 'Používame cookies na zlepšenie vášho zážitku. Analytické cookies nám pomáhajú pochopiť, ako web používate.', acceptAll: 'Prijať všetko', rejectAll: 'Odmietnuť nepotrebné', customize: 'Prispôsobiť', save: 'Uložiť', back: 'Späť', necessary: 'Nevyhnutné cookies', necessaryDesc: 'Nutné na fungovanie webu. Nedajú sa vypnúť.', analytics: 'Analytické cookies', analyticsDesc: 'Pomáhajú pochopiť, ako návštevníci web používajú (Google Analytics).', marketing: 'Marketingové cookies', marketingDesc: 'Slúžia na personalizáciu reklám podľa vašich záujmov.', privacyLink: 'Zásady ochrany osobných údajov' },
  hr: { title: 'Postavke kolačića', description: 'Koristimo kolačiće za poboljšanje vašeg iskustva. Analitički kolačići pomažu nam razumjeti kako koristite stranicu.', acceptAll: 'Prihvati sve', rejectAll: 'Odbij nepotrebne', customize: 'Prilagodi', save: 'Spremi', back: 'Natrag', necessary: 'Neophodni kolačići', necessaryDesc: 'Potrebni za rad stranice. Ne mogu se isključiti.', analytics: 'Analitički kolačići', analyticsDesc: 'Pomažu nam razumjeti kako posjetitelji koriste stranicu (Google Analytics).', marketing: 'Marketinški kolačići', marketingDesc: 'Koriste se za personalizaciju oglasa prema vašim interesima.', privacyLink: 'Politika privatnosti' },
  bs: { title: 'Postavke kolačića', description: 'Koristimo kolačiće za poboljšanje vašeg iskustva. Analitički kolačići pomažu nam razumjeti kako koristite stranicu.', acceptAll: 'Prihvati sve', rejectAll: 'Odbij nepotrebne', customize: 'Prilagodi', save: 'Spremi', back: 'Nazad', necessary: 'Neophodni kolačići', necessaryDesc: 'Potrebni za rad stranice. Ne mogu se isključiti.', analytics: 'Analitički kolačići', analyticsDesc: 'Pomažu nam razumjeti kako posjetitelji koriste stranicu (Google Analytics).', marketing: 'Marketinški kolačići', marketingDesc: 'Koriste se za personalizaciju oglasa prema vašim interesima.', privacyLink: 'Politika privatnosti' },
  sq: { title: 'Cilësimet e cookie', description: 'Përdorim cookie për të përmirësuar përvojën tuaj. Cookie-t analitikë na ndihmojnë të kuptojmë si e përdorni faqen.', acceptAll: 'Prano të gjitha', rejectAll: 'Refuzo jo-thelbësoret', customize: 'Personalizo', save: 'Ruaj', back: 'Kthehu', necessary: 'Cookie të nevojshme', necessaryDesc: 'Të nevojshme për funksionimin e faqes. Nuk mund të çaktivizohen.', analytics: 'Cookie analitike', analyticsDesc: 'Na ndihmojnë të kuptojmë si vizitorët përdorin faqen (Google Analytics).', marketing: 'Cookie marketingu', marketingDesc: 'Përdoren për të personalizuar reklamat sipas interesave tuaja.', privacyLink: 'Politika e privatësisë' },
  sl: { title: 'Nastavitve piškotkov', description: 'Uporabljamo piškotke za izboljšanje vaše izkušnje. Analitični piškotki nam pomagajo razumeti, kako uporabljate spletno mesto.', acceptAll: 'Sprejmi vse', rejectAll: 'Zavrni nebistvene', customize: 'Prilagodi', save: 'Shrani', back: 'Nazaj', necessary: 'Nujni piškotki', necessaryDesc: 'Potrebni za delovanje spletnega mesta. Ni jih mogoče onemogočiti.', analytics: 'Analitični piškotki', analyticsDesc: 'Pomagajo nam razumeti, kako obiskovalci uporabljajo spletno mesto (Google Analytics).', marketing: 'Trženjski piškotki', marketingDesc: 'Uporabljajo se za prilagajanje oglasov glede na vaše interese.', privacyLink: 'Politika zasebnosti' },
  lv: { title: 'Sīkdatņu iestatījumi', description: 'Mēs izmantojam sīkdatnes, lai uzlabotu jūsu pieredzi. Analītiskie sīkfaili palīdz mums saprast, kā jūs izmantojat vietni.', acceptAll: 'Pieņemt visas', rejectAll: 'Noraidīt nevajadzīgās', customize: 'Pielāgot', save: 'Saglabāt', back: 'Atpakaļ', necessary: 'Nepieciešamās sīkdatnes', necessaryDesc: 'Nepieciešamas vietnes darbībai. Nevar izslēgt.', analytics: 'Analītiskās sīkdatnes', analyticsDesc: 'Palīdz mums saprast, kā apmeklētāji izmanto vietni (Google Analytics).', marketing: 'Mārketinga sīkdatnes', marketingDesc: 'Tiek izmantotas, lai personalizētu reklāmas pēc jūsu interesēm.', privacyLink: 'Privātuma politika' },
  mk: { title: 'Поставки за колачиња', description: 'Користиме колачиња за да го подобриме вашето искуство.', acceptAll: 'Прифати ги сите', rejectAll: 'Одбиј ги непотребните', customize: 'Прилагоди', save: 'Зачувај', back: 'Назад', necessary: 'Неопходни колачиња', necessaryDesc: 'Потребни за работа на страницата.', analytics: 'Аналитички колачиња', analyticsDesc: 'Помагаат да разбереме како ја користите страницата.', marketing: 'Маркетинг колачиња', marketingDesc: 'За персонализирање на реклами.', privacyLink: 'Политика за приватност' },
  et: { title: 'Küpsiste seaded', description: 'Kasutame küpsiseid teie kogemuse parandamiseks.', acceptAll: 'Nõustu kõigiga', rejectAll: 'Keeldu mittevajalikest', customize: 'Kohanda', save: 'Salvesta', back: 'Tagasi', necessary: 'Vajalikud küpsised', necessaryDesc: 'Vajalikud saidi toimimiseks. Ei saa keelata.', analytics: 'Analüütilised küpsised', analyticsDesc: 'Aitavad mõista, kuidas külastajad saiti kasutavad.', marketing: 'Turundusküpsised', marketingDesc: 'Kasutatakse reklaamide isikupärastamiseks.', privacyLink: 'Privaatsuspoliitika' },
  tr: { title: 'Çerez Ayarları', description: 'Deneyiminizi geliştirmek için çerezler kullanıyoruz.', acceptAll: 'Tümünü Kabul Et', rejectAll: 'Gereksizleri Reddet', customize: 'Özelleştir', save: 'Kaydet', back: 'Geri', necessary: 'Gerekli Çerezler', necessaryDesc: 'Sitenin çalışması için gerekli. Devre dışı bırakılamaz.', analytics: 'Analitik Çerezler', analyticsDesc: 'Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur.', marketing: 'Pazarlama Çerezleri', marketingDesc: 'İlgi alanlarınıza göre reklamları kişiselleştirmek için kullanılır.', privacyLink: 'Gizlilik Politikası' },
  ca: { title: 'Configuració de cookies', description: 'Utilitzem cookies per millorar la vostra experiència.', acceptAll: 'Acceptar totes', rejectAll: 'Rebutjar no essencials', customize: 'Personalitzar', save: 'Desar', back: 'Enrere', necessary: 'Cookies necessàries', necessaryDesc: 'Necessàries per al funcionament del lloc.', analytics: 'Cookies analítiques', analyticsDesc: 'Ens ajuden a entendre com s\'utilitza el lloc.', marketing: 'Cookies de màrqueting', marketingDesc: 'Utilitzades per personalitzar anuncis.', privacyLink: 'Política de privacitat' },
  is: { title: 'Vafrakökustillingar', description: 'Við notum vafrakökur til að bæta upplifun þína.', acceptAll: 'Samþykkja allar', rejectAll: 'Hafna óþarfa', customize: 'Sérsníða', save: 'Vista', back: 'Til baka', necessary: 'Nauðsynlegar vafrakökur', necessaryDesc: 'Nauðsynlegar fyrir virkni síðunnar.', analytics: 'Greiningarvafrakökur', analyticsDesc: 'Hjálpa okkur að skilja hvernig gestir nota síðuna.', marketing: 'Markaðsvafrakökur', marketingDesc: 'Notaðar til að persónusníða auglýsingar.', privacyLink: 'Persónuverndarstefna' },
  lb: { title: 'Cookie Astellungen', description: 'Mir benotzen Cookien fir Är Erfahrung ze verbesseren.', acceptAll: 'All akzeptéieren', rejectAll: 'Net noutwendeg ofleenen', customize: 'Upassen', save: 'Späicheren', back: 'Zréck', necessary: 'Noutwendeg Cookien', necessaryDesc: 'Gebraucht fir d\'Websäit ze funktionnéieren.', analytics: 'Analytesch Cookien', analyticsDesc: 'Hëllefen eis ze verstoen wéi Besucher d\'Websäit benotzen.', marketing: 'Marketing Cookien', marketingDesc: 'Benotzt fir Reklammen ze personaliséieren.', privacyLink: 'Dateschutz Politik' },
  cnr: { title: 'Postavke kolačića', description: 'Koristimo kolačiće za poboljšanje iskustva.', acceptAll: 'Prihvati sve', rejectAll: 'Odbij nepotrebne', customize: 'Prilagodi', save: 'Sačuvaj', back: 'Nazad', necessary: 'Neophodni kolačići', necessaryDesc: 'Potrebni za rad stranice.', analytics: 'Analitički kolačići', analyticsDesc: 'Pomažu razumjeti kako koristite stranicu.', marketing: 'Marketing kolačići', marketingDesc: 'Za personalizaciju oglasa.', privacyLink: 'Privatnost' },
  mt: { title: 'Setings tal-cookies', description: 'Nużaw cookies biex intejbu l-esperjenza tiegħek.', acceptAll: 'Aċċetta kollha', rejectAll: 'Irrifjuta mhux essenzjali', customize: 'Personalizza', save: 'Issejvja', back: 'Lura', necessary: 'Cookies meħtieġa', necessaryDesc: 'Meħtieġa biex is-sit jaħdem.', analytics: 'Cookies analitiċi', analyticsDesc: 'Jgħinuna nifhmu kif il-viżitaturi jużaw is-sit.', marketing: 'Cookies tal-marketing', marketingDesc: 'Użati biex jippersonalizzaw reklamar.', privacyLink: 'Politika tal-privatezza' },
};

function getTranslation(lang: string): CookieTranslation {
  return translations[lang] || translations.en;
}

export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return null;
}

export function hasAnalyticsConsent(): boolean {
  const prefs = getConsentPreferences();
  return prefs?.analytics ?? false;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ lang }) => {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const t = getTranslation(lang);

  useEffect(() => {
    const stored = getConsentPreferences();
    if (!stored) {
      setVisible(true);
    } else {
      setPreferences(stored);
    }
  }, []);

  const saveConsent = (prefs: ConsentPreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setVisible(false);
    setShowCustomize(false);

    // Dispatch event for GA to listen
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: prefs }));

    // If analytics rejected, try to disable GA
    if (!prefs.analytics && typeof window !== 'undefined') {
      (window as unknown as Record<string, boolean>)['ga-disable-' + (import.meta.env.VITE_GA_MEASUREMENT_ID || '')] = true;
    }
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                <path d="M8.5 8.5v.01"/>
                <path d="M16 15.5v.01"/>
                <path d="M12 12v.01"/>
                <path d="M11 17v.01"/>
                <path d="M7 14v.01"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{t.description}</p>
        </div>

        {/* Customize Panel */}
        {showCustomize && (
          <div className="px-6 pb-4 space-y-3 border-t border-slate-100 pt-4">
            {/* Necessary */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="mt-1 w-5 h-5 rounded border-slate-300"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900 text-sm">{t.necessary}</div>
                <div className="text-xs text-slate-500">{t.necessaryDesc}</div>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900 text-sm">{t.analytics}</div>
                <div className="text-xs text-slate-500">{t.analyticsDesc}</div>
              </div>
            </div>

            {/* Marketing */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900 text-sm">{t.marketing}</div>
                <div className="text-xs text-slate-500">{t.marketingDesc}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
          {showCustomize ? (
            <>
              <button
                onClick={() => setShowCustomize(false)}
                className="flex-1 px-4 py-3 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                ← {t.back}
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors"
              >
                {t.save}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRejectAll}
                className="flex-1 px-4 py-3 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
              >
                {t.rejectAll}
              </button>
              <button
                onClick={() => setShowCustomize(true)}
                className="flex-1 px-4 py-3 text-indigo-600 font-medium rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm"
              >
                {t.customize}
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors text-sm"
              >
                {t.acceptAll}
              </button>
            </>
          )}
        </div>

        {/* Privacy link */}
        <div className="px-6 pb-4 text-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openPrivacyPolicy'))}
            className="text-xs text-slate-500 hover:text-indigo-600 underline"
          >
            {t.privacyLink}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
