# 🎨 Tatil Takvimi — Tasarım Rehberi (DESIGN.md)

Bu rehber, uygulamanın görsel dilinin tek kaynağıdır. Yeni bir bileşen ya da değişiklik
eklerken buradaki kurallar izlenir. Token tanımları `css/styles.css` içindeki `:root`
bloğundadır.

---

## 1. Renk Teması

### Marka ailesi (indigo)
| Token | Değer | Kullanım |
|-------|-------|----------|
| `--brand-900` | `#0e0b33` | Topbar gradyanının en koyu ucu |
| `--brand-700` | `#312e81` | Topbar gradyan ortası |
| `--brand-500` / `--accent` | `#6366f1` | Primer buton, aktif çip, bugün halkası, odak ringi |
| `--brand-300` | `#a5b4fc` | Gradyan metin ucundaki geçiş, ince vurgular |
| `--sky-500` | `#3b82f6` | Gidiş uçuşu rengi |

> Kural: **Uygulamanın tek primer rengi indigodur.** Düğme, aktif öğe ve odak halkası
> her yerde `--brand-500` kullanır; mavi/yeşil/sarı farklıluklar yalnızca anlamsal
> durumlar içindir (aşağıda).

### Durum renk aileleri
Her aile üç parçadır: `*` (dolgu/kontrast), `*-bg` (zemin), `*-line` (kenar).

| Anlam | Dolgu | Zemin | Kenar |
|-------|-------|-------|-------|
| 🧳 Gezi / dönüş | `--teal` `#0d9488` | `--teal-bg` `#ccfbf1` | `--teal-line` |
| 🔴 Resmi tatil | `--hol` `#dc2626` | `--hol-bg` `#fee2e2` | `--hol-line` |
| 🕐 Arife / yarım | `--half` `#b45309` | `--half-bg` `#fef3c7` | `--half-line` |
| 🏨 Otel | `--amber` `#f59e0b` | (`--half-bg` paylaşır) | `--amber-line` |

> Renk = anlamsaldır: yeşil **geziye**, kırmızı **tatili**, amber **konaklamayı**
> temsil eder ve bu eşleme tüm sekmelerde aynıdır.

### Nötrler
| Token | Değer | Kullanım |
|-------|-------|----------|
| `--bg` | `#f5f6fa` | Sayfa zemini |
| `--card` | `#ffffff` | Kart/yüzey zemini |
| `--ink` | `#1e2233` | Ana metin |
| `--text-soft` | `#4b5563` | Kart içi vurgulu ikincil metin |
| `--muted` | `#6b7280` | İkincil metin, etiket, meta bilgiler |
| `--line` | `#e5e7eb` | Kenarlık, ayırıcı |
| `--soft` | `#f8fafc` | Hover zeminleri |
| `--weekend-bg` | `#eef1f6` | Hafta sonu hücre zemini |

---

## 2. Ölçekler

### Yarıçap
`--radius-sm` 9px (form girişleri) · `--radius` 14px (kart) · `--radius-lg` 18px
(logo bloğu, büyük panel) · `--radius-full` 999px (çip, düğme kapsülleri, sekme)

### Gölge
- `--shadow-sm` — statik kartlar (ay kartı, trip-head)
- `--shadow-md` — hover'da verilen "yükselme" gölgesi
- `--shadow-brand` — indigo tonlu dolgulu Düğmeler (`btn.primary`, aktif trip-chip)
- `--shadow-topbar` — üst bar altına yumuşak gölge

### Boşluk
4px grid: `4 · 8 · 12 · 16 · 20 · 26 · 40`. Kart içi `12–18px`, panel dışı `14px`,
bölüm boşluğu `26px` (h2 üst marjı).

---

## 3. Tipografi
- Aile: sistem stack (`-apple-system, Segoe UI, Roboto ...`) — harici font yok.
- Başlıklar: 800 kalınlık. Numara/rakam vurguları 800. Gövde metni 400–600.
- Etiketler (`.lbl`, `.kicker`, `.dir-lbl`, `.hol-date .mon`): **0.66–0.75rem,
  UPPERCASE, `letter-spacing: .06–.18em`** — bu motif uygulamanın "imzası"dır.
- Marka alanı: `h1` gradyan metin (beyaz → `--brand-300`), alt satır uppercase
  spaced kicker.

---

## 4. Etkileşim Kuralları

| Durum | Davranış |
|-------|----------|
| Hover (satır/kart) | `--shadow-md` + `translateY(-1px)` |
| Hover (düğme) | hafif brightness + yükselme |
| Aktif (çip/sekme) | renk dolgusu (`--brand-500` gradyan veya beyaz) |
| Odak (klavye) | `:focus-visible` → 2px `--brand-500` ring, 2px offset |
| Geçiş süresi | `var(--dur)` = `0.18s` + `var(--ease)` |

`prefers-reduced-motion` seçiliyse tüm animasyon/transition kapatılır.

---

## 5. Bileşen Envanteri (class → token eşlemesi)

| Bileşen | Sınıf | Ana token'lar |
|---------|-------|----------------|
| Sekme çubuğu | `.tabs`, `.tab` | cam zemin + beyaz aktif |
| Sekme çubuğu aktif | `.tab.active` | beyaz zemin, `--ink` metin |
| Düğme (primer) | `.btn.primary` | `--brand-500` gradyan + `--shadow-brand` |
| Düğme (çerçeve) | `.btn` | `--line`, `--card` |
| Hero kart | `.hero-card` | `--card` + `--shadow-md` + sol durum şeridi |
| Takvim hücresi | `.day-cell.*` | durum aileleri |
| Tatil listesi | `.hol-item` | `--hol` ailesi |
| Uçuş kartı | `.f-card` | gidiş `--sky-500`, dönüş `--teal`, sol şerit 4px |
| Otel kartı | `.h-card` | `--amber` şerit |
| Program kartı | `.it-card` | `--teal` şerit + `--teal-bg` tarih bloğu |
| Gezi çipi | `.trip-chip` | pasif `--line`, aktif marka gradyanı |
| Harita | `#mapDiv`, `.map-side` | `--sky-100` deniz zemini, `--card` panel |

**Evrensel kalıp:** "sol renk şeridi" (`border-left: 4px`) — kartın anlamını
gösterir. Yeni kart tipi eklerken bu kalıbı ve uygun durum rengini kullanın.

---

## 6. Yapma/Do's & Don'ts

✅ **Do**
- Yeni renk gerekiyorsa önce `:root`'a token ekle, sonra selector'da kullan.
- Kart hover'larında `--shadow-md` + `translateY(-1px)` ikilisi kullan.
- Aynı anlam için her yerde aynı aileyi kullan (gezi = teal, tatil = kırmızı...).

❌ **Don't**
- Selector içinde siyah hex yazma (`#abc` haricinde) — Leaflet popup ikonundaki
  nötr kenarlık istisnadır.
- Yeni bir durum rengi icat etme; mevcut ailelerden birine bağla.
- `letter-spacing: .06em` motifini bozan farklı stil etiketler ekleme.

---

## 7. Yeni Sekme/Panel Eklerken
1. Panel zemininde her panel beyaz kartlar (`--card`) üstüne kurulu; sayfa zemini
   `--bg` asla görünür kart renkli olmaz.
2. Bölüm başlığı `h2` + isteğe bağlı `.section-bar` (başlık + eylem düğmesi).
3. Boş durum: `.empty-note` (kesik çerçeve).
4. Form: `.card` + `.form-grid` + `.form-actions`;ödeme/uyarı renkleri amber ailesi.

Renk/vurgu karışıklığında önce buradaki tabloya bak.
