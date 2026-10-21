/* ============================================================
   Tatil Takvimi — Gezi / Uçuş / Otel yönetimi
   Veriler localStorage'da tutulur. İlk açılışta hazır gelir:
   - Münih & Viyana (uçak + tren)
   - Vietnam: 29 Kas – 6 Ara 2026 (AYT–IST–HAN, HAN–DAD–HAN, HAN–IST–AYT)
   - Mısır: 13-19 Aralık 2026, Kahire & Şarm El Şeyh (XQ224 gidiş / PC5089 dönüş)
   - Çanakkale: 27-29 Aralık 2026, Hotel Caeli & Caeli Winery (araç yolculuğu)
   ============================================================ */

const TT = (() => {
  const LS_KEY = "tatilTakvimi.trips.v12";

  const DEFAULT_TRIPS = [
    {
      id: "munih-viyana-2026",
      name: "Münih & Viyana",
      emoji: "🇦🇹",
      startDate: "2026-11-17",
      endDate: "2026-11-20",
      flights: [
        {
          id: "fly-muc-1", dir: "out", mode: "fly", date: "2026-11-17",
          from: "AYT", to: "MUC", time: "07:00", timeArr: "08:30", no: "XQ132",
          note: "SunExpress · SUNVALUE · 20 kg bagaj ×2 · yolcu: Ali Mursit & Arya"
        },
        {
          id: "rail-mh-wh", dir: "leg", mode: "train", date: "2026-11-18",
          from: "MHF", to: "WHB", time: "12:09", timeArr: "16:47",
          no: "", note: "DB Super Sparpreis Europa · koltuk rezervasyonlu"
        },
        {
          id: "fly-vie-1", dir: "return", mode: "fly", date: "2026-11-20",
          from: "VIE", to: "AYT", time: "13:55", timeArr: "18:40", no: "XQ191",
          note: "SunExpress · 20 kg bagaj ×2 · g/d toplam 26.539,34 TRY (ödendi 14.10)"
        }
      ],
      hotels: [
        {
          id: "mh-hotel-muc", name: "Maritim Hotel Munich", city: "Münih", area: "Hauptbahnhof yakını",
          checkIn: "2026-11-17", checkOut: "2026-11-18", price: "", link: "",
          note: "Onaylandı ✓", coords: ""
        },
        {
          id: "mh-hotel-vie", name: "Leonardo Hotel Vienna Hauptbahnhof", city: "Viyana", area: "Hauptbahnhof",
          checkIn: "2026-11-18", checkOut: "2026-11-20", price: "", link: "",
          note: "Onaylandı ✓ · giriş 15:00, çıkış 12:00", coords: ""
        }
      ]
    },
    {
      id: "vietnam-2026",
      name: "Vietnam",
      emoji: "🇻🇳",
      startDate: "2026-11-29",
      endDate: "2026-12-06",
      flights: [
        {
          id: "vn-out-1", dir: "out", mode: "fly", date: "2026-11-29",
          from: "AYT", to: "IST", time: "14:10", timeArr: "15:45", no: "", note: "THY"
        },
        {
          id: "vn-out-2", dir: "out", mode: "fly", date: "2026-11-29",
          from: "IST", to: "HAN", time: "18:05", timeArr: "07:05", no: "", note: "THY · varış +1 gün (30 Kas)"
        },
        {
          id: "vn-leg-1", dir: "leg", mode: "fly", date: "2026-12-03",
          from: "HAN", to: "DAD", time: "15:55", timeArr: "17:15", no: "9G929", note: "Sun PhuQuoc Airways"
        },
        {
          id: "vn-leg-2", dir: "leg", mode: "fly", date: "2026-12-05",
          from: "DAD", to: "HAN", time: "15:55", timeArr: "17:15", no: "9G928", note: "Sun PhuQuoc Airways"
        },
        {
          id: "vn-ret-1", dir: "return", mode: "fly", date: "2026-12-05",
          from: "HAN", to: "IST", time: "22:55", timeArr: "05:35", no: "", note: "THY · varış +1 gün (6 Ara)"
        },
        {
          id: "vn-ret-2", dir: "return", mode: "fly", date: "2026-12-06",
          from: "IST", to: "AYT", time: "07:35", timeArr: "08:55", no: "", note: "THY"
        }
      ],
      hotels: [
        {
          id: "vn-hotel-han", name: "De Syloia Hanoi", city: "Hanoi", area: "Hoan Kiem / Old Quarter",
          checkIn: "2026-11-30", checkOut: "2026-12-02", price: "", link: "",
          note: "4★", coords: ""
        },
        {
          id: "vn-hotel-cruise", name: "Athena Luxury Cruise", city: "Ha Long Bay", area: "Lan Ha Bay",
          checkIn: "2026-12-02", checkOut: "2026-12-03", price: "", link: "",
          note: "5★ · gemi konaklaması", coords: ""
        },
        {
          id: "vn-hotel-dad", name: "Le Sands Oceanfront Danang Hotel", city: "Da Nang", area: "",
          checkIn: "2026-12-03", checkOut: "2026-12-05", price: "", link: "",
          note: "4★ · deniz kenarı", coords: ""
        }
      ],
      itinerary: [
        {
          date: "2026-11-30",
          title: "Hanoi: Hoan Kiem, Old Quarter, Train Street",
          lines: ["Akşam: Michelin yıldızlı restoranda yemek (teyit edilecek)"]
        },
        {
          date: "2026-12-01",
          title: "Ninh Binh: Mua Cave, Bich Dong, Trang An tekne turu",
          lines: []
        },
        {
          date: "2026-12-02",
          title: "Ha Long & Lan Ha Bay: Athena Luxury Cruise",
          lines: []
        },
        {
          date: "2026-12-03",
          title: "Tai Chi, Dark & Bright Cave",
          lines: ["15:55 Hanoi → Da Nang uçuşu (9G929)"]
        },
        {
          date: "2026-12-04",
          title: "Marble Mountains, Hoi An, dilek fenerleri",
          lines: []
        },
        {
          date: "2026-12-05",
          title: "",
          lines: ["15:55 Da Nang → Hanoi uçuşu (9G928)", "22:55 Hanoi → İstanbul uçuşu (THY)"]
        },
        {
          date: "2026-12-06",
          title: "",
          lines: ["05:35 İstanbul varış", "07:35 İstanbul → Antalya uçuşu", "08:55 Antalya varış"]
        }
      ]
    },
    {
      id: "misir-2026",
      name: "Mısır · Kahire & Şarm El Şeyh",
      emoji: "🇪🇬",
      startDate: "2026-12-13",
      endDate: "2026-12-19",
      flights: [
        { id: "fly-out-1", dir: "out", mode: "fly", date: "2026-12-13", from: "AYT", to: "CAI", time: "20:30", timeArr: "21:20", no: "XQ224", note: "SunExpress · rezervasyon SC44P8" },
        { id: "fly-ret-1", dir: "return", mode: "fly", date: "2026-12-19", from: "SSH", to: "AYT", time: "02:15", timeArr: "05:10", no: "PC5089", note: "Pegasus · rezervasyon 2HZ1MU" }
      ],
      hotels: []
    },
    {
      id: "caeli-canakkale-2026",
      name: "Çanakkale · Hotel Caeli",
      emoji: "🍷",
      startDate: "2026-12-27",
      endDate: "2026-12-29",
      flights: [
        {
          id: "car-out-1", dir: "out", mode: "car", date: "2026-12-27",
          from: "AYT", to: "CAN", time: "08:00", timeArr: "", no: "",
          note: "araç ile gidiş · çıkış 08:00"
        },
        {
          id: "car-ret-1", dir: "return", mode: "car", date: "2026-12-29",
          from: "CAN", to: "AYT", time: "12:00", timeArr: "", no: "",
          note: "araç ile dönüş · çıkış 12:00"
        }
      ],
      hotels: [
        {
          id: "caeli-hotel", name: "Hotel Caeli & Caeli Winery", city: "Çanakkale", area: "bağ evleri / bağ bölgesi",
          checkIn: "2026-12-27", checkOut: "2026-12-29", price: "", link: "",
          note: "2 gece · bağ konaklaması", coords: ""
        }
      ],
      itinerary: []
    }
  ];

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* bozuk veri → varsayılana dön */ }
    return JSON.parse(JSON.stringify(DEFAULT_TRIPS));
  }

  let trips = load();
  let activeId = trips.length ? trips[0].id : null;

  /* Açık formun durumu: null | "new" | kayıt id */
  let formFlight = null;
  let formHotel = null;
  let formTrip = null;

  const onChangeHandlers = [];
  function notify() {
    save();
    onChangeHandlers.forEach(fn => fn());
  }
  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(trips)); } catch (e) {}
  }

  function uid() {
    return "id" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /* ---------- erişim ---------- */
  function active() {
    return trips.find(t => t.id === activeId) || trips[0] || null;
  }
  function all() { return trips; }

  /* ---------- gezi CRUD ---------- */
  function saveTrip(data) {
    if (formTrip === "new") {
      if (data.endDate && data.startDate && data.endDate < data.startDate) data.endDate = data.startDate;
      const t = {
        id: uid(),
        name: data.name,
        emoji: data.emoji || "🧳",
        startDate: data.startDate,
        endDate: data.endDate,
        flights: [],
        hotels: []
      };
      trips.push(t);
      activeId = t.id;
    } else {
      const t = trips.find(x => x.id === formTrip);
      if (t && data.endDate && data.startDate && data.endDate < data.startDate) data.endDate = data.startDate;
      if (t) Object.assign(t, data);
    }
    formTrip = null;
    notify();
  }
  function removeTrip(id) {
    if (!confirm("Bu gezi ve içindeki tüm uçuş/oteller silinsin mi?")) return;
    trips = trips.filter(t => t.id !== id);
    activeId = trips.length ? trips[0].id : null;
    notify();
  }

  /* ---------- uçuş CRUD ---------- */
  const CLEAN_MODES = ["fly", "train", "car"];   /* ✈ uçak · 🚆 tren · 🚗 araç */
  function saveFlight(tripId, data) {
    const t = trips.find(x => x.id === tripId);
    if (!t) return;
    const clean = { ...data };
    clean.mode = CLEAN_MODES.includes(clean.mode) ? clean.mode : "fly";
    clean.time = (clean.time || "").trim();
    clean.timeArr = (clean.timeArr || "").trim();
    clean.no = (clean.no || "").trim();
    clean.note = (clean.note || "").trim();
    if (formFlight === "new") {
      t.flights.push({ ...clean, id: uid() });
    } else {
      const f = t.flights.find(f => f.id === formFlight);
      if (f) Object.assign(f, clean);
    }
    formFlight = null;
    notify();
  }
  function deleteFlight(tripId, fid) {
    const t = trips.find(x => x.id === tripId);
    if (!t || !confirm("Uçuş silinsin mi?")) return;
    t.flights = t.flights.filter(f => f.id !== fid);
    if (formFlight === fid) formFlight = null;
    notify();
  }

  /* ---------- otel CRUD ---------- */
  function saveHotel(tripId, data) {
    const t = trips.find(x => x.id === tripId);
    if (!t) return;
    const clean = { ...data };
    clean.price = (clean.price || "").trim();
    clean.coords = (clean.coords || "").trim();
    if (formHotel === "new") {
      t.hotels.push({ ...clean, id: uid() });
    } else {
      const h = t.hotels.find(h => h.id === formHotel);
      if (h) Object.assign(h, clean);
    }
    formHotel = null;
    notify();
  }
  function deleteHotel(tripId, hid) {
    const t = trips.find(x => x.id === tripId);
    if (!t || !confirm("Otel kaydı silinsin mi?")) return;
    t.hotels = t.hotels.filter(h => h.id !== hid);
    if (formHotel === hid) formHotel = null;
    notify();
  }

  /* ---------- yardımcılar ---------- */
  const ESC_MAP = { "&": "&" + "amp;", "<": "&" + "lt;", ">": "&" + "gt;", '"': "&" + "quot;", "'": "&#39;" };
  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ESC_MAP[c]);
  }

  function placeSelectOptionsHtml(selected) {
    return Object.keys(PLACES)
      .map(k => `<option value="${esc(k)}" ${selected === k ? "selected" : ""}>${esc(k)} — ${esc(PLACES[k].name)}${PLACES[k].mode === "train" ? " 🚆" : ""}</option>`)
      .join("");
  }

  function airportSelectOptionsHtml(selected) {
    return placeSelectOptionsHtml(selected);
  }

  /* Bir gezinin başlangıç/bitiş anahtarları: açık tarihler + uçuş + otel tarihleri */
  function tripRange(t) {
    const keys = [];
    if (t.startDate) keys.push(t.startDate);
    if (t.endDate) keys.push(t.endDate);
    t.flights.forEach(f => { if (f.date) keys.push(f.date); });
    t.hotels.forEach(h => {
      if (h.checkIn) keys.push(h.checkIn);
      if (h.checkOut) keys.push(h.checkOut);
    });
    if (!keys.length) return null;
    keys.sort();
    return { start: keys[0], end: keys[keys.length - 1] };
  }

  function totalNights(t) {
    return t.hotels.reduce((s, h) => {
      return s + (h.checkIn && h.checkOut ? Math.max(0, dayDiff(h.checkIn, h.checkOut)) : 0);
    }, 0);
  }

  /* Otel koordinatı: elle girilmişse onu, yoksa şehir merkezini kullan */
  function hotelCoords(h) {
    const m = (h.coords || "").match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (m) return { lat: +m[1], lng: +m[2] };
    const city = (h.city || "").toLowerCase();
    if (!city) return null;
    const center = CITY_CENTERS.find(c =>
      city.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(city)
    );
    return center ? { lat: center.lat, lng: center.lng } : null;
  }

  /* =========================================================================
     RENDER
     ========================================================================= */
  function render(mainEl) {
    if (!mainEl) return;
    mainEl.innerHTML = buildMainHtml();
    bind(mainEl);
  }

  function buildMainHtml() {
    const t = active();
    if (!t) {
      return `<div class="empty-note">Henüz gezi yok. "＋ Gezi ekle" ile başlayın.</div>`;
    }
    const range = tripRange(t);

    /* geri sayım metni */
    let countdownText = "";
    if (range) {
      const d = daysUntil(range.start);
      const endDiff = daysUntil(range.end);
      if (endDiff < 0) countdownText = "Gezi geçmişte";
      else if (d <= 0 && endDiff >= 0) countdownText = "Seyahat sürüyor 🎉";
      else countdownText = `${d} gün sonra`;
    }

    return `
      <div class="trip-bar">
        ${trips.map(x => `
          <button class="trip-chip ${x.id === activeId ? "active" : ""}" data-action="pick" data-id="${x.id}">
            ${esc(x.emoji)} ${esc(x.name)}
          </button>`).join("")}
        <button class="btn small" data-action="add-trip">＋ Gezi ekle</button>
      </div>

      <div class="trip-head">
        <div class="title">
          <span>${esc(t.emoji)}</span> ${esc(t.name)}
          <button class="btn tiny" data-action="edit-trip" data-id="${t.id}" title="Geziyi düzenle">✏️</button>
          ${trips.length > 1 ? `<button class="btn tiny danger" data-action="del-trip" data-id="${t.id}" title="Geziyi sil">🗑️</button>` : ""}
        </div>
        <div class="trip-stats">
          <div class="trip-stat">
            <div class="num">${range ? shortDay(range.start) : "—"}</div>
            <div class="lbl">Başlangıç</div>
          </div>
          <div class="trip-stat">
            <div class="num">${range ? dayDiff(range.start, range.end) + 1 : "—"}</div>
            <div class="lbl">Süre (gün)</div>
          </div>
          <div class="trip-stat">
            <div class="num">${totalNights(t) || "—"}</div>
            <div class="lbl">Otel gecesi</div>
          </div>
          <div class="trip-stat">
            <div class="num" style="font-size:.95rem;line-height:2.6">${countdownText}</div>
          </div>
        </div>
      </div>

      ${tripFormHtml(t)}

      <!-- UÇUŞLAR -->
      <div class="section-bar">
        <h2 style="margin:0">✈️ Uçuşlar</h2>
        <button class="btn primary small" data-action="new-flight">＋ Uçuş ekle</button>
      </div>
      <div class="cards2">
        ${t.flights.length === 0
          ? `<div class="empty-note">Henüz uçuş eklenmedi. Gidiş ve dönüş seferlerini buraya ekleyin.</div>`
          : t.flights.slice().sort((a, b) => a.date.localeCompare(b.date)).map(flightCardHtml).join("")}
      </div>
      ${flightFormHtml(t)}

      <!-- OTELLER -->
      <div class="section-bar" style="margin-top:26px">
        <h2 style="margin:0">🏨 Oteller</h2>
        <button class="btn primary small" data-action="new-hotel">＋ Otel ekle</button>
      </div>
      <div class="cards2">
        ${t.hotels.length === 0
          ? `<div class="empty-note">Henüz otel eklenmedi. Konaklayacağınız otelleri buraya ekleyin — haritada işaretlenir.</div>`
          : t.hotels.slice().sort((a, b) => (a.checkIn || "").localeCompare(b.checkIn || "")).map(hotelCardHtml).join("")}
      </div>
      ${hotelFormHtml(t)}

      ${itineraryHtml(t)}
    `;
  }

  /* "15 Ar" biçiminde kısa gün/ay */
  function shortDay(key) {
    const d = parseKey(key);
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
  }

  /* Gezi adı/emoji/tarih formu (yeni + düzenleme) */
  function tripFormHtml(t) {
    if (!formTrip) return "";
    const isNew = formTrip === "new";
    const data = isNew
      ? { name: "", emoji: "🧳", startDate: "", endDate: "" }
      : t || null;
    if (!data) return "";
    return `
      <form class="card" style="margin-top:12px" data-form="trip">
        <div class="form-grid">
          <label style="grid-column: span 2">Gezi adı
            <input required type="text" name="name" placeholder="örn. İtalya · Roma & Floransa" value="${esc(data.name)}" />
          </label>
          <label>Emoji
            <input type="text" name="emoji" maxlength="4" placeholder="🧳" value="${esc(data.emoji || "")}" />
          </label>
          <label>Başlangıç <input required type="date" name="startDate" value="${esc(data.startDate || "")}" /></label>
          <label>Bitiş <input required type="date" name="endDate" value="${esc(data.endDate || "")}" /></label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn primary">Kaydet</button>
          <button type="button" class="btn" data-action="cancel">İptal</button>
        </div>
      </form>
    `;
  }

  function flightCardHtml(f) {
    const from = PLACES[f.from] || { name: f.from };
    const to = PLACES[f.to] || { name: f.to };
    const isTrain = f.mode === "train";
    const isCar = f.mode === "car";
    const dist = PLACES[f.from] && PLACES[f.to]
      ? ` · ≈ ${Math.round(haversineKm(PLACES[f.from].lat, PLACES[f.from].lng, PLACES[f.to].lat, PLACES[f.to].lng))} km`
      : "";
    const emoji = isCar ? "🚗" : isTrain ? "🚆" : (f.dir === "out" ? "🛫" : "🛬");
    const dirLbl = isCar ? "Araç" : isTrain ? "Tren" : (f.dir === "out" ? "Gidiş" : (f.dir === "leg" ? "Ara güzergah" : "Dönüş"));
    const timeTxt = f.time
      ? (f.timeArr ? `Saat ${esc(f.time)} → ${esc(f.timeArr)}` : `Saat ${esc(f.time)}`)
      : "";
    return `
      <div class="f-card ${isCar ? "car" : isTrain ? "leg" : (f.dir === "out" ? "out" : "return")}">
        <div class="f-dir">
          <div class="emoji">${emoji}</div>
          <div class="dir-lbl">${dirLbl}</div>
        </div>
        <div class="f-route">
          <div class="route-line">${esc(f.from)}<span class="arrow">→</span>${esc(f.to)}</div>
          <div class="meta">${esc(from.name)} → ${esc(to.name)}${dist}</div>
          <div class="meta">${longDate(f.date)}${timeTxt ? ` · ${timeTxt}` : ""}${f.no ? ` · ${esc(f.no)}` : ""}</div>
          ${f.note ? `<div class="meta">📝 ${esc(f.note)}</div>` : ""}
        </div>
        <div class="f-actions">
          <button class="btn tiny" data-action="edit-flight" data-fid="${f.id}">Düzenle</button>
          <button class="btn tiny danger" data-action="del-flight" data-fid="${f.id}">Sil</button>
        </div>
      </div>
    `;
  }

  function flightFormHtml(t) {
    if (!formFlight) return "";
    const isNew = formFlight === "new";
    const f = isNew
      ? { dir: "out", mode: "fly", date: "", from: "AYT", to: "CAI", time: "", timeArr: "", no: "", note: "" }
      : findFlight(t, formFlight);
    if (!f) return "";
    const isTrain = f.mode === "train";
    const isCar = f.mode === "car";
    return `
      <form class="card" style="margin-top:10px" data-form="flight">
        <div class="form-grid">
          <label>Ulaşım türü
            <select name="mode">
              <option value="fly" ${isTrain || isCar ? "" : "selected"}>✈️ Uçak</option>
              <option value="train" ${isTrain ? "selected" : ""}>🚆 Tren / Ara güzergah</option>
              <option value="car" ${isCar ? "selected" : ""}>🚗 Araba (karayolu)</option>
            </select>
          </label>
          <label>Yön
            <select name="dir">
              <option value="out" ${f.dir === "out" ? "selected" : ""}>🛫 Gidiş</option>
              <option value="return" ${f.dir === "return" ? "selected" : ""}>🛬 Dönüş</option>
              <option value="leg" ${f.dir === "leg" ? "selected" : ""}>↔️ Ara güzergah (iç hat)</option>
            </select>
          </label>
          <label>Tarih <input required type="date" name="date" value="${esc(f.date)}" /></label>
          <label>Kalkış
            <select name="from">${placeSelectOptionsHtml(f.from)}</select>
          </label>
          <label>Varış
            <select name="to">${placeSelectOptionsHtml(f.to)}</select>
          </label>
          <label>Kalkış saati (ops.) <input type="time" name="time" value="${esc(f.time)}" /></label>
          <label>Varış saati (ops.) <input type="time" name="timeArr" value="${esc(f.timeArr)}" /></label>
          <label>Uçuş/sefer kodu (ops.) <input type="text" name="no" placeholder="örn. TK545 / RJX 262" value="${esc(f.no)}" /></label>
          <label style="grid-column: span 3">Not (ops.)
            <input type="text" name="note" placeholder="örn. bilet türü, koltuk bilgisi..." value="${esc(f.note)}" />
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn primary">Kaydet</button>
          <button type="button" class="btn" data-action="cancel">İptal</button>
        </div>
      </form>
    `;
  }

  function findFlight(t, fid) {
    return t?.flights?.find(f => f.id === fid) || null;
  }

  function hotelCardHtml(h) {
    const nights = h.checkIn && h.checkOut ? dayDiff(h.checkIn, h.checkOut) : null;
    const marked = hotelCoords(h) ? "Konum haritada işaretli 🗺️" : "Konum girilmedi (haritada şehir merkezine yakınsız)";
    return `
      <div class="h-card">
        <div class="h-emoji">🏨</div>
        <div class="info">
          <h4>${esc(h.name)} ${h.link ? `<a href="${esc(h.link)}" target="_blank" rel="noopener" title="Otel linkini aç">🔗</a>` : ""}</h4>
          <div class="dates">
            ${esc(h.city)}${h.area ? ` · ${esc(h.area)}` : ""}
            ${h.checkIn ? ` · Giriş: ${longDate(h.checkIn).split(",")[0]}` : ""}
            ${h.checkOut ? ` · Çıkış: ${longDate(h.checkOut).split(",")[0]}` : ""}
            ${nights !== null ? ` · <b>${nights} gece</b>` : ""}
          </div>
          ${h.price ? `<div class="note">💰 ${esc(h.price)}</div>` : ""}
          ${h.note ? `<div class="note">📝 ${esc(h.note)}</div>` : ""}
          <div class="note muted">${marked}</div>
        </div>
        <div class="f-actions">
          <button class="btn tiny" data-action="edit-hotel" data-hid="${h.id}">Düzenle</button>
          <button class="btn tiny danger" data-action="del-hotel" data-hid="${h.id}">Sil</button>
        </div>
      </div>
    `;
  }

  function hotelFormHtml(t) {
    if (!formHotel) return "";
    const isNew = formHotel === "new";
    const h = isNew
      ? { name: "", city: "", area: "", checkIn: "", checkOut: "", price: "", link: "", note: "", coords: "" }
      : t.hotels.find(x => x.id === formHotel) || null;
    if (!h) return "";
    return `
      <form class="card" style="margin-top:10px" data-form="hotel">
        <div class="form-grid">
          <label style="grid-column: span 2">Otel adı <input required type="text" name="name" placeholder="örn. Marriott Mena House" value="${esc(h.name)}" /></label>
          <label>Şehir <input required type="text" name="city" placeholder="örn. Kahire / Şarm El Şeyh" value="${esc(h.city)}" /></label>
          <label>Bölge / mahalle <input type="text" name="area" placeholder="örn. Naama Bay" value="${esc(h.area)}" /></label>
          <label>Giriş <input required type="date" name="checkIn" value="${esc(h.checkIn)}" /></label>
          <label>Çıkış <input type="date" name="checkOut" value="${esc(h.checkOut)}" /></label>
          <label>Fiyat <input type="text" name="price" placeholder="örn. 120 € / gece" value="${esc(h.price)}" /></label>
          <label style="grid-column: span 2">Link <input type="url" name="link" placeholder="https://..." value="${esc(h.link)}" /></label>
          <label style="grid-column: span 3">Not
            <textarea name="note" rows="2" placeholder="örn. deniz manzaralı, kahvaltı dahil...">${esc(h.note)}</textarea>
          </label>
          <label>Konum (lat, lng — ops.)
            <input type="text" name="coords" placeholder="27.9158, 34.3299" value="${esc(h.coords)}" />
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn primary">Kaydet</button>
          <button type="button" class="btn" data-action="cancel">İptal</button>
        </div>
      </form>
    `;
  }

  /* ---------- gün gün program ---------- */
  function itineraryHtml(t) {
    const days = (t.itinerary || [])
      .filter(d => d.date)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date));
    if (!days.length) return "";
    return `
      <div class="section-bar" style="margin-top:26px">
        <h2 style="margin:0">🗓️ Gün gün program</h2>
      </div>
      <div class="it-list">
        ${days.map(d => {
          const dt = parseKey(d.date);
          const wd = WEEKDAY_LONG[(dt.getDay() + 6) % 7];
          const lines = (d.lines || []).filter(Boolean);
          return `
            <div class="it-card">
              <div class="it-date">
                <div class="d">${dt.getDate()}</div>
                <div class="m">${MONTH_NAMES[dt.getMonth()].slice(0, 3)}</div>
                <div class="w">${wd.slice(0, 3)}</div>
              </div>
              <div class="it-info">
                ${d.title ? `<b>${esc(d.title)}</b>` : ""}
                ${lines.map(l => `<div class="it-line">• ${esc(l)}</div>`).join("")}
              </div>
            </div>`;
        }).join("")}
      </div>
    `;
  }

  /* ---------- olay bağlama ---------- */
  function bind(root) {
    root.querySelectorAll("[data-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = active();
        switch (btn.dataset.action) {
          case "pick": activeId = btn.dataset.id; break;
          case "add-trip": formTrip = "new"; formFlight = null; formHotel = null; break;
          case "edit-trip": formTrip = btn.dataset.id; formFlight = null; formHotel = null; break;
          case "del-trip": removeTrip(btn.dataset.id); return;
          case "new-flight": formFlight = "new"; formHotel = null; formTrip = null; break;
          case "edit-flight": formFlight = btn.dataset.fid; formHotel = null; formTrip = null; break;
          case "new-hotel": formHotel = "new"; formFlight = null; formTrip = null; break;
          case "edit-hotel": formHotel = btn.dataset.hid; formFlight = null; formTrip = null; break;
          case "cancel": formFlight = null; formHotel = null; formTrip = null; break;
          case "del-flight": deleteFlight(t.id, btn.dataset.fid); break;
          case "del-hotel": deleteHotel(t.id, btn.dataset.hid); break;
        }
        render(root);
      });
    });

    root.querySelector('form[data-form="trip"]')?.addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      saveTrip({
        name: (fd.get("name") || "").trim(),
        emoji: (fd.get("emoji") || "").trim() || "🧳",
        startDate: fd.get("startDate"),
        endDate: fd.get("endDate")
      });
    });
    root.querySelector('form[data-form="flight"]')?.addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      saveFlight(active().id, {
        mode: fd.get("mode"),
        dir: fd.get("dir"),
        date: fd.get("date"),
        from: fd.get("from"),
        to: fd.get("to"),
        time: fd.get("time") || "",
        timeArr: fd.get("timeArr") || "",
        no: (fd.get("no") || "").trim(),
        note: (fd.get("note") || "").trim()
      });
    });
    root.querySelector('form[data-form="hotel"]')?.addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      saveHotel(active().id, {
        name: fd.get("name"),
        city: fd.get("city"),
        area: fd.get("area"),
        checkIn: fd.get("checkIn"),
        checkOut: fd.get("checkOut"),
        price: fd.get("price"),
        link: fd.get("link"),
        note: fd.get("note"),
        coords: fd.get("coords")
      });
    });
  }

  /* ---------- harita için veri çıkarıcı ---------- */
  function mapData(trip) {
    const t = trip || active();
    if (!t) return { hotels: [], flights: [] };
    return {
      hotels: t.hotels
        .map(h => ({ ...h, pos: hotelCoords(h) }))
        .filter(h => h.pos),
      flights: t.flights
        .filter(f => PLACES[f.from] && PLACES[f.to])
        .map(f => ({ ...f, fromPos: PLACES[f.from], toPos: PLACES[f.to] }))
    };
  }

  function airportsUsed(trip) {
    const t = trip || active();
    const used = new Set();
    t?.flights?.forEach(f => { used.add(f.from); used.add(f.to); });
    return [...used].filter(k => PLACES[k]).map(k => ({ code: k, ...PLACES[k] }));
  }

  return {
    active, all,
    tripRange,
    setTripHtml: render,
    mainElement: () => document.getElementById("tripMain"),
    mapData, airportsUsed,
    onChange: fn => onChangeHandlers.push(fn),
    notify
  };
})();
