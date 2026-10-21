/* ============================================================
   Tatil Takvimi — Resmi tatil verileri (Türkiye)
   Tarihler: Diyanet İşleri Başkanlığı resmi takvimi + resmi duyurular
   - 2026: Ramazan 20-22 Mart, Kurban 27-30 Mayıs
   - 2027: Ramazan 9-11 Mart, Kurban 16-19 Mayıs
   format: key "YYYY-MM-DD"
   ============================================================ */

const HOLIDAYS = {
  2026: [
    { key: "2026-01-01", name: "Yılbaşı", type: "full" },
    { key: "2026-03-19", name: "Ramazan Bayramı Arifesi", type: "half", series: "ramazan" },
    { key: "2026-03-20", name: "Ramazan Bayramı (1. Gün)", type: "full", series: "ramazan" },
    { key: "2026-03-21", name: "Ramazan Bayramı (2. Gün)", type: "full", series: "ramazan" },
    { key: "2026-03-22", name: "Ramazan Bayramı (3. Gün)", type: "full", series: "ramazan" },
    { key: "2026-04-23", name: "Ulusal Egemenlik ve Çocuk Bayramı", type: "full" },
    { key: "2026-05-01", name: "Emek ve Dayanışma Günü", type: "full" },
    { key: "2026-05-19", name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", type: "full" },
    { key: "2026-05-26", name: "Kurban Bayramı Arifesi", type: "half", series: "kurban" },
    { key: "2026-05-27", name: "Kurban Bayramı (1. Gün)", type: "full", series: "kurban" },
    { key: "2026-05-28", name: "Kurban Bayramı (2. Gün)", type: "full", series: "kurban" },
    { key: "2026-05-29", name: "Kurban Bayramı (3. Gün)", type: "full", series: "kurban" },
    { key: "2026-05-30", name: "Kurban Bayramı (4. Gün)", type: "full", series: "kurban" },
    { key: "2026-07-15", name: "Demokrasi ve Millî Birlik Günü", type: "full" },
    { key: "2026-08-30", name: "Zafer Bayramı", type: "full" },
    { key: "2026-10-28", name: "Cumhuriyet Bayramı Arifesi", type: "half", series: "cumhuriyet" },
    { key: "2026-10-29", name: "Cumhuriyet Bayramı", type: "full", series: "cumhuriyet" }
  ],
  2027: [
    { key: "2027-01-01", name: "Yılbaşı", type: "full" },
    { key: "2027-03-08", name: "Ramazan Bayramı Arifesi", type: "half", series: "ramazan" },
    { key: "2027-03-09", name: "Ramazan Bayramı (1. Gün)", type: "full", series: "ramazan" },
    { key: "2027-03-10", name: "Ramazan Bayramı (2. Gün)", type: "full", series: "ramazan" },
    { key: "2027-03-11", name: "Ramazan Bayramı (3. Gün)", type: "full", series: "ramazan" },
    { key: "2027-04-23", name: "Ulusal Egemenlik ve Çocuk Bayramı", type: "full" },
    { key: "2027-05-01", name: "Emek ve Dayanışma Günü", type: "full" },
    { key: "2027-05-15", name: "Kurban Bayramı Arifesi", type: "half", series: "kurban" },
    { key: "2027-05-16", name: "Kurban Bayramı (1. Gün)", type: "full", series: "kurban" },
    { key: "2027-05-17", name: "Kurban Bayramı (2. Gün)", type: "full", series: "kurban" },
    { key: "2027-05-18", name: "Kurban Bayramı (3. Gün)", type: "full", series: "kurban" },
    {
      key: "2027-05-19",
      name: "Kurban Bayramı (4. Gün) · Atatürk'ü Anma, Gençlik ve Spor Bayramı",
      type: "full",
      series: "kurban"
    },
    { key: "2027-07-15", name: "Demokrasi ve Millî Birlik Günü", type: "full" },
    { key: "2027-08-30", name: "Zafer Bayramı", type: "full" },
    { key: "2027-10-28", name: "Cumhuriyet Bayramı Arifesi", type: "half", series: "cumhuriyet" },
    { key: "2027-10-29", name: "Cumhuriyet Bayramı", type: "full", series: "cumhuriyet" }
  ]
};

/* Tüm tatilleri tek düz liste olarak şişisiyle döndürür */
function allHolidays() {
  const list = [];
  for (const year of Object.keys(HOLIDAYS)) {
    for (const h of HOLIDAYS[year]) list.push(h);
  }
  list.sort((a, b) => a.key.localeCompare(b.key));
  return list;
}

/* ============ Uçuş / şehir konum verileri (harita) ============ */
const PLACES = {
  AYT: { name: "Antalya Havalimanı", emoji: "🛫", mode: "fly", lat: 36.8987, lng: 30.7957 },
  CAI: { name: "Kahire Uluslararası Havalimanı", emoji: "🛬", mode: "fly", lat: 30.1145, lng: 31.4055 },
  SSH: { name: "Şarm El Şeyh Havalimanı", emoji: "🛬", mode: "fly", lat: 27.9757, lng: 34.3949 },
  MUC: { name: "Münih Havalimanı", emoji: "🛬", mode: "fly", lat: 48.3538, lng: 11.7861 },
  VIE: { name: "Viyana Havalimanı", emoji: "🛬", mode: "fly", lat: 48.1103, lng: 16.5697 },
  MHF: { name: "München Hbf (tren garı)", emoji: "🚉", mode: "train", lat: 48.1403, lng: 11.5604 },
  WHB: { name: "Wien Hbf (tren garı)", emoji: "🚉", mode: "train", lat: 48.1851, lng: 16.3777 },
  IST: { name: "İstanbul Havalimanı", emoji: "🛫", mode: "fly", lat: 41.2619, lng: 28.7419 },
  HAN: { name: "Hanoi Noi Bai Havalimanı", emoji: "🛬", mode: "fly", lat: 21.2212, lng: 105.8072 },
  DAD: { name: "Da Nang Havalimanı", emoji: "🛬", mode: "fly", lat: 16.0439, lng: 108.1993 },
  CAN: { name: "Çanakkale (Hotel Caeli bölgesi)", emoji: "🚗", mode: "car", lat: 40.1470, lng: 26.4131 }
};

/* Otel listesinde şehir yazıldığında koordinat bulunmak için merkezler */
const CITY_CENTERS = [
  { name: "Kahire", lat: 30.0444, lng: 31.2357 },
  { name: "Gize", lat: 29.9870, lng: 31.2118 },
  { name: "Şarm El Şeyh", lat: 27.9158, lng: 34.3299 },
  { name: "Antalya", lat: 36.8841, lng: 30.7053 },
  { name: "Hurghada", lat: 27.2579, lng: 33.8116 },
  { name: "Luksor", lat: 25.6872, lng: 32.6396 },
  { name: "Asvan", lat: 24.0889, lng: 32.8998 },
  { name: "Marsa Alam", lat: 25.0678, lng: 34.5116 },
  { name: "Münih", lat: 48.1351, lng: 11.5820 },
  { name: "Viyana", lat: 48.2082, lng: 16.3738 },
  { name: "Hanoi", lat: 21.0285, lng: 105.8542 },
  { name: "Da Nang", lat: 16.0544, lng: 108.2022 },
  { name: "Ha Long", lat: 20.9101, lng: 107.1839 },
  { name: "Hoi An", lat: 15.8801, lng: 108.3380 },
  { name: "Çanakkale", lat: 40.1470, lng: 26.4131 }
];

/* ============ Ortak yardımcılar ============ */
const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];
const WEEKDAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const WEEKDAY_LONG = [
  "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"
];

/* "YYYY-MM-DD" -> Date (yerel saat, UTC sürüklenmesi olmasın diye parça parça) */
function parseKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function makeKey(date) {
  const p = x => String(x).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

function todayKey() {
  return makeKey(new Date());
}

/* Belirli bir anahtar günün haftanın günü indeksi (0 = Pazartesi) */
function weekdayIndex(key) {
  return (parseKey(key).getDay() + 6) % 7;
}

function isWeekend(key) {
  return weekdayIndex(key) >= 5; // Cumartesi/Pazar
}

/* "20 Aralık 2026, Pazar" biçiminde uzun tarih */
function longDate(key) {
  const d = parseKey(key);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}, ${WEEKDAY_LONG[(d.getDay() + 6) % 7]}`;
}

/* İki tarih anahtarı arasındaki gün farkı (b - a) */
function dayDiff(aKey, bKey) {
  const a = parseKey(aKey), b = parseKey(bKey);
  return Math.round((b - a) / 86400000);
}

function shiftKey(key, days) {
  const d = parseKey(key);
  d.setDate(d.getDate() + days);
  return makeKey(d);
}

/* Bugüne kalan gün sayısı: 0 = bugün, 1 = yarın */
function daysUntil(key) {
  const now = new Date();
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parseKey(key) - t) / 86400000);
}

/* Haversine mesafesi (km) */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const rad = v => (v * Math.PI) / 180;
  const dLat = rad(lat2 - lat1), dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
