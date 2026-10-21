# 🌴 Tatil Takvimi

Türkiye resmi tatillerini, kişisel seyahat planlarını, otalleri ve rotaları tek yerde toplayan hafif bir web uygulaması. Hiçbir kurulum veya sunucu gerekmez.

## Çalıştırma

1. Yol: `index.html` dosyasını herhangi bir tarayıcıda açın, **veya**
2. Klasik lokal sunucu:

   ```bash
   python3 -m http.server 8799
   # → http://localhost:8799
   ```

Harita (OpenStreetMap/Leaflet CDN) ve bayram verileri internet ister; diğer her şey çevrimdışsız çalışır.

## Özellikler

| sekme | içerik |
|-------|--------|
| 📅 Takvim | 12 aylık mini takvimler, resmi tatil/hafta sonu/arife vurguları, gezi gününde ✈️/🏨 işaretçisi, geri sayım kartları |
| 🧳 Gezi | Çoklu gezi (aktif gezi seçimi), uçuş ekle/düzenle/sil (kalkış, varış, saat, uçuş kodu), otel kayıtları (giriş/çıkış, fiyat, link, not, opsiyonel koordinat) |
| 🗺️ Harita | Havalimanı otel işaretçileri, uçuş rotaları (kesikli çizgiler), mesafe bilgisi, yan panelde tıklayarak odak widescreen |

- **Takvimi indir (.ics)** düğmesiyle tüm tatiller + gezilerdi etkinlikleri Google/Apple takvimine aktarılabilir.
- Tüm gezi/otel verileri `localStorage`'da tutulur (anahtar: `tatilTakvimi.trips.v11`). Tarayıcıyı değiştirirken veriler taşınmaz, gerekirse ICS indirip yedekleyin.

## Veriler

- **Resmi tatiller:** `js/holidays.js` — 2026 ve 2027 Diyanet İşleri Başkanlığı takvimine göre doğrulanmıştır.
- **Havalimanları & şehir merkezleri:** `js/holidays.js` içindeki `PLACES` ve `CITY_CENTERS` haritaya yeni nokta eklemek isterseniz burası genişletilir.

## Bilinen Adımlar

- Arife günü "yarım gün" olarak işaretlenir; tam gün sayımı yapılmaz.
- Harita projesinin şehir merkezini otel için tapınakların ortası değpildeceği için doğru nokta için "Konum (lat, lng)" alanını kullanın.

## Ulaşım Segmentleri

Gezi içindeki her segment için "Ulaşım türü" seçilebilir:
- ✈️ **Uçak** — havalimanları arasında kesikli mavi/yeşil rota
- 🚆 **Tren / Ara güzergah** — garları (örn. München Hbf → Wien Hbf) arasında turuncu noktalı rota; kalkış/varış saati, sefer kodu ve bilet notu desteklenir

Gar noktaları `PLACES` içine eklenebilir (mode: "train").
