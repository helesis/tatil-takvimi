# 🗓️ Tatil Takvimi

Türkiye resmi tatilleri, kişisel seyahatler (uçuşlar, trenler, oteller) ve gün gün gezi programını tek ekranda toplayan statik web uygulaması.

## Çalıştırma

Kütüphane yok, build yok — herhangi bir statik sunucu yeterli:

```bash
python3 -m http.server 8799
# http://localhost:8799
```

Doğrudan `index.html`'i tarayıcıda açmak da çalışır (harita için internet gerekir).

## Özellikler

- **Takvim:** 2026–2027 resmi tatiller (Diyanet takvimi), arife/yarım gün ve hafta sonu işaretleri, gezi günleri (✈ uçuş, 🚆 tren, 🏨 otel) ve gezi aralıkları için yeşil bordürler, geri sayım kartları, yıl navigasyonu.
- **Geziler:** Gezi ekle/düzenle/sil; uçuş, tren ve araç segmentleri (kalkış/varış saati, sefer kodu, not — +1 gün varış desteği), otel rezervasyonları, gün gün gezi programı kartları.
- **Harita:** MapLibre GL JS + OpenFreeMap (Liberty stili, ücretsiz vektör tiles, API anahtarı gerekmez); havalimanı/gar/otel işaretçileri, uçuş ve tren rotaları, yan panel (Lokasyonlar / Rotalar / Oteller).
- **ICS dışa aktarma:** Tatiller, ulaşım segmentleri (varış saati ve +1 gün DTEND desteği) ve otelleri takvim uygulamanıza aktarın.

## Veriler

Tüm veriler tarayıcının `localStorage`'ında tutulur (`tatilTakvimi.trips.v12`) — sunucuya hiçbir şey gönderilmez. İlk açılışta örnek geziler hazır gelir; kendi verileriniz düzenlemelerinizle tarayıcınızda kalır.

## Yapı

```
index.html        — tek sayfa uygulama (Takvim / Gezi / Harita sekmeleri)
css/styles.css    — tüm stiller
js/holidays.js    — resmi tatiller, konum verileri (PLACES, CITY_CENTERS), yardımcılar
js/trips.js       — gezi/segment/otel/itinerary CRUD + render (localStorage)
js/calendar.js    — mini takvim, geri sayımlar, ICS üretimi, Leaflet haritası
```
