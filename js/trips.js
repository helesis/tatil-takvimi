/* ============================================================
   Tatil Takvimi — Gezi / Uçuş / Otel yönetimi
   Veriler localStorage'da tutulur. İlk açılışta hazır gelir:
   - Münih & Viyana (uçak + tren)
   - Vietnam: 29 Kas – 6 Ara 2026 (AYT–IST–HAN, HAN–DAD–HAN, HAN–IST–AYT)
   - Mısır: 13-19 Aralık 2026, Kahire & Şarm El Şeyh (XQ224 gidiş / PC5089 dönüş)
   - Çanakkale: 27-29 Aralık 2026, Hotel Caeli & Caeli Winery (araç yolculuğu)
   - Los Angeles: 27 Oca – 3 Şub 2027, THY TK2445/TK179 gidiş, TK10/TK2430 dönüş (VANWNF)
   ============================================================ */

const TT = (() => {
  const LS_KEY = "tatilTakvimi.trips.v21";

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
      ],
      itinerary: [
        {
          date: "2026-11-17",
          title: "Münih",
          lines: [
            "07:00 Antalya → Münih uçuşu (XQ132)",
            "08:30 Münih'e varış",
            "10:00 Maritim Hotel — valiz bırakma",
            "11:00–12:30 Brandy Melville & Subdued",
            "12:30–13:30 Öğle yemeği (FÉLA Cafe / Gigi Trattoria)",
            "13:30–14:00 Asamkirche",
            "14:00–15:30 Marienplatz",
            "15:30–16:30 Residenz Christmas Village",
            "Akşam: dinlenme ve akşam yemeği"
          ]
        },
        {
          date: "2026-11-18",
          title: "Münih → Viyana",
          lines: [
            "08:30–09:30 Otelde kahvaltı",
            "09:30–10:30 Serbest zaman",
            "10:30–11:15 Valizleri alma",
            "11:15 Münih Hbf'e hareket",
            "12:09 Münih → Viyana treni (16:47 Wien Hbf varış)",
            "17:30–18:30 Leonardo Hotel — yerleşme",
            "19:00–21:00 Rathausplatz Noel pazarı",
            "21:00 sonrası: otele dönüş"
          ]
        },
        {
          date: "2026-11-19",
          title: "Viyana",
          lines: [
            "08:30–09:30 Otelde kahvaltı",
            "10:00–11:00 Votivkirche",
            "11:00–12:30 Viyana tarihi merkezi",
            "12:30–13:30 Öğle yemeği (ONYX / Le Fou)",
            "13:30–14:30 Hernstorferstraße 14",
            "14:30–16:30 Donauturm / Schönbrunn",
            "16:30–18:00 Otele dönüş ve dinlenme",
            "20:00 Chez Bernard — akşam yemeği · REZERVASYON ONAYLANDI ✓ (2 kişi · Salon: Restaurant · Zenchef)"
          ]
        },
        {
          date: "2026-11-20",
          title: "Viyana → Antalya",
          lines: [
            "08:30–09:30 Otelde kahvaltı",
            "09:30–10:30 Son gezinti ve alışveriş",
            "10:30–11:00 Valizleri alma",
            "11:00 Havalimanına hareket",
            "13:55 Viyana → Antalya uçuşu (XQ191)",
            "18:40 Antalya'ya varış"
          ]
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
      hotels: [
        {
          id: "eg-hotel-cairo", name: "Sofitel Cairo Nile El Gezirah", city: "Kahire", area: "Nil / Gezira Adası",
          checkIn: "2026-12-13", checkOut: "2026-12-15", price: "", link: "",
          note: "5★ · giriş 15:00, çıkış 12:00 · program no: 72081155966960", coords: ""
        }
      ],
      weatherStops: [
        { city: "Şarm El Şeyh", start: "2026-12-15", end: "2026-12-19" }
      ]
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
    },
    {
      id: "los-angeles-2027",
      name: "Los Angeles",
      emoji: "🇺🇸",
      startDate: "2027-01-27",
      endDate: "2027-02-03",
      flights: [
        {
          id: "la-out-1", dir: "out", mode: "fly", date: "2027-01-27",
          from: "AYT", to: "IST", time: "04:25", timeArr: "05:55", no: "TK2445",
          note: "THY · B737 · aktarma ve uçak değişikliği · rezervasyon VANWNF"
        },
        {
          id: "la-out-2", dir: "out", mode: "fly", date: "2027-01-27",
          from: "IST", to: "LAX", time: "08:00", timeArr: "10:50", no: "TK179",
          note: "THY · B787-9 · 13s 50dk · LA yerel saatiyle varış"
        },
        {
          id: "la-ret-1", dir: "return", mode: "fly", date: "2027-02-03",
          from: "LAX", to: "IST", time: "18:30", timeArr: "18:55", no: "TK10",
          note: "THY · B777 · 13s 25dk · varış +1 gün (4 Şub)"
        },
        {
          id: "la-ret-2", dir: "return", mode: "fly", date: "2027-02-03",
          from: "IST", to: "AYT", time: "20:10", timeArr: "21:35", no: "TK2430",
          note: "THY · B777 · varış +1 gün (4 Şub)"
        }
      ],
      hotels: [],
      weatherStops: [
        { city: "Los Angeles", start: "2027-01-27", end: "2027-02-03" }
      ],
      itinerary: [
        {
          date: "2027-01-27",
          title: "Antalya → Los Angeles",
          lines: [
            "04:25 Antalya → İstanbul uçuşu (TK2445)",
            "08:00 İstanbul → Los Angeles uçuşu (TK179)",
            "10:50 Los Angeles varış (yerel saat)"
          ]
        },
        {
          date: "2027-02-03",
          title: "Los Angeles → Antalya",
          lines: [
            "18:30 Los Angeles → İstanbul uçuşu (TK10)",
            "18:55 İstanbul varış (+1 gün, 4 Şub)",
            "20:10 İstanbul → Antalya uçuşu (TK2430)",
            "21:35 Antalya varış"
          ]
        }
      ]
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
    updateWeather(mainEl);
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

      ${weatherBoxHtml(t)}
      ${itineraryHtml(t)}
      ${checklistHtml(t)}
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

  /* Havayolu logoları: uçuş no ön eki veya nottan şirket tespiti (Kiwi.com logo CDN) */
  const AIRLINE_LOGOS = {
    TK: "Turkish Airlines",
    XQ: "SunExpress",
    PC: "Pegasus",
    "9G": "Sun PhuQuoc Airways"
  };

  function airlineCodeOf(f) {
    if (f.mode !== "fly") return null;
    const m = (f.no || "").match(/^([A-Z0-9]{2})/);
    if (m && AIRLINE_LOGOS[m[1]]) return m[1];
    const note = (f.note || "").toLowerCase();
    if (/turkish|thy/.test(note)) return "TK";
    if (/sunexpress/.test(note)) return "XQ";
    if (/pegasus/.test(note)) return "PC";
    if (/sun phuquoc/.test(note)) return "9G";
    return null;
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
    const airCode = airlineCodeOf(f);
    const logoHtml = airCode
      ? `<img class="f-logo" src="https://images.kiwi.com/airlines/32/${airCode}.png" alt="${esc(AIRLINE_LOGOS[airCode])}" title="${esc(AIRLINE_LOGOS[airCode])}" decoding="async" onerror="this.style.display='none'" />`
      : "";
    return `
      <div class="f-card ${isCar ? "car" : isTrain ? "leg" : (f.dir === "out" ? "out" : "return")}">
        <div class="f-dir">
          <div class="emoji">${emoji}</div>
          ${logoHtml}
          <div class="dir-lbl">${dirLbl}</div>
        </div>
        <div class="f-route">
          <div class="route-line">${esc(f.from)}<span class="arrow">→</span>${esc(f.to)}</div>
          <div class="meta">${esc(from.name)} → ${esc(to.name)}${dist}</div>
          <div class="meta">${longDate(f.date)}${timeTxt ? ` · ${timeTxt}` : ""}${f.no ? ` · ${esc(f.no)}` : ""}${airCode ? ` · ${esc(AIRLINE_LOGOS[airCode])}` : ""}</div>
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

  /* Otel marka logoları: Wikimedia Commons hotlink (SVG raster servis) */
  const HOTEL_BRANDS = [
    { test: /maritim/i, name: "Maritim Hotels", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Maritim_Hotelgesellschaft_logo.svg?width=48" },
    { test: /leonardo/i, name: "Leonardo Hotels", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo_Hotels_Logo.png?width=48" },
    { test: /sofitel/i, name: "Sofitel", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Sofitel_logo.svg?width=48" }
  ];

  function hotelBrandOf(h) {
    if (h.brand) return HOTEL_BRANDS.find(b => b.name === h.brand) || null;
    const kaynak = `${h.name} ${h.city || ""}`;
    return HOTEL_BRANDS.find(b => b.test.test(kaynak)) || null;
  }

  function hotelCardHtml(h) {
    const nights = h.checkIn && h.checkOut ? dayDiff(h.checkIn, h.checkOut) : null;
    const marked = hotelCoords(h) ? "Konum haritada işaretli 🗺️" : "Konum girilmedi (haritada şehir merkezine yakınsız)";
    const brand = hotelBrandOf(h);
    const badge = brand
      ? `<img class="h-logo" src="${brand.url}" alt="${esc(brand.name)}" title="${esc(brand.name)}" decoding="async" onerror="this.closest('.h-emoji').textContent='🏨'" />`
      : "🏨";
    return `
      <div class="h-card">
        <div class="h-emoji">${badge}</div>
        <div class="info">
          <h4>${esc(h.name)} ${brand ? `<small class="brand-tag">${esc(brand.name)}</small>` : ""} ${h.link ? `<a href="${esc(h.link)}" target="_blank" rel="noopener" title="Otel linkini aç">🔗</a>` : ""}</h4>
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

  /* ---------- valiz hazırlama kontrol listeleri (geziye özel) ---------- */
  const DEFAULT_CHECKLISTS = {
    "munih-viyana-2026": [
      { emoji: "🧥", title: "Kıyafetler", items: [
        "1 adet rüzgâr ve yağmura dayanıklı mont veya kaban",
        "2 adet kazak / sweatshirt",
        "3 adet uzun kollu üst veya tişört",
        "2 adet pantolon (biri üzerinizde)",
        "1 adet şık akşam kombini (Chez Bernard için)",
        "4 adet iç çamaşırı",
        "4 çift çorap (en az 1 çift kalın)",
        "1 takım pijama",
        "1 adet atkı",
        "1 adet bere",
        "1 çift ince eldiven (isteğe bağlı)"
      ]},
      { emoji: "👟", title: "Ayakkabı ve aksesuar", items: [
        "1 çift rahat, suya dayanıklı yürüyüş ayakkabısı (ayakta)",
        "1 çift alternatif / şık ayakkabı (isteğe bağlı)",
        "1 adet küçük günlük sırt çantası veya çapraz çanta",
        "1 adet katlanabilir şemsiye",
        "1 adet güneş gözlüğü"
      ]},
      { emoji: "🪥", title: "Kişisel bakım", items: [
        "Diş fırçaları ve diş macunu",
        "Deodorant ve parfüm",
        "Yüz temizleme ve nemlendirici",
        "Dudak nemlendiricisi",
        "Saç fırçası ve saç bakım ürünleri",
        "Tıraş / makyaj malzemeleri (gerekiyorsa)",
        "Kişisel ilaçlar ve küçük ilk yardım seti",
        "Islak mendil ve kâğıt mendil"
      ]},
      { emoji: "📱", title: "Elektronik", items: [
        "Telefonlar ve şarj kabloları",
        "Powerbank",
        "Kulaklık",
        "Akıllı saat şarj cihazı (kullanılıyorsa)",
        "Avrupa'da kullanım için mobil internet / roaming ayarı",
        "Telefonlarda çevrimdışı Münih ve Viyana haritaları"
      ]},
      { emoji: "🛂", title: "Belgeler ve para", items: [
        "Her iki yolcunun pasaportu",
        "Geçerli Schengen vizesi / giriş hakkı (gerekiyorsa)",
        "Uçak biletleri ve check-in belgeleri",
        "18 Kasım DB tren biletleri ve koltuk rezervasyonu",
        "Münih ve Viyana otel rezervasyonları",
        "Seyahat sağlık sigortası",
        "Banka/kredi kartları",
        "Bir miktar euro nakit",
        "Önemli rezervasyonların telefonda çevrimdışı kopyaları"
      ]},
      { emoji: "🎒", title: "El bagajı", items: [
        "Pasaportlar ve biletler",
        "Cüzdan ve telefonlar",
        "Powerbank ve şarj kabloları",
        "İlaçlar ve gerekli kişisel eşyalar",
        "Küçük atıştırmalıklar",
        "Boş veya güvenlikten sonra doldurulmuş su şişesi",
        "Yedek bir üst ve iç çamaşırı",
        "Mendil ve dudak kremi"
      ]}
    ],
    "vietnam-2026": [
      { emoji: "🧥", title: "Kıyafetler (sıcak & nemli · kuzeyde serin akşamlar)", items: [
        "Hafif, terletmeyen kumaş kıyafetler (gün sayısınca üst/alt)",
        "1 adet ince yağmurluk veya rüzgârlık (tekne & Hanoi akşamları)",
        "1 adet hafif kazak / sweatshirt (Hanoi + Ha Long akşamı ~15-20°)",
        "1 adet şık akşam kombini (Michelin restoran için)",
        "2 adet mayo / pareo (Lan Ha Bay & Da Nang)",
        "İç çamaşırı ve çorap (gün sayısınca + 1 yedek)",
        "1 takım pijama"
      ]},
      { emoji: "👟", title: "Ayakkabı ve aksesuar", items: [
        "1 çift rahat yürüyüş ayakkabısı (Mua Cave ~500 basamak için)",
        "1 çift sandalet / terlik",
        "1 çift su ayakkabısı (tekne & kayak)",
        "1 adet güneş şapkası / şapka",
        "1 adet güneş gözlüğü",
        "1 adet küçük çapraz çanta (scooter/city için)"
      ]},
      { emoji: "🪥", title: "Kişisel bakım & sağlık", items: [
        "Böcek kovucu (DEET'li — yıldız ateşi riskine karşı)",
        "Güneş kremi SPF 50+",
        "İshal ilacı + elektrolit tozu (seyahat hastalığına karşı)",
        "Islak mendil ve el dezenfektanı",
        "Kişisel ilaçlar ve küçük ilk yardım seti",
        "Diş fırçaları, deodorant, dudak kremi (standart set)"
      ]},
      { emoji: "📱", title: "Elektronik", items: [
        "Telefonlar ve şarj kabloları",
        "Powerbank (uçuşlar uzun)",
        "Kulaklık",
        "Vietnam eSIM / roaming aktivasyonu",
        "Çevrimdışı Hanoi, Da Nang, Hoi An haritaları",
        "Google Translate Vietnamca çevrimdışı paketi"
      ]},
      { emoji: "🛂", title: "Belgeler ve para", items: [
        "3 yolcunun pasaportu (en az 6 ay geçerli)",
        "Vietnam e-vizesi — basılmış çıktılar",
        "6 uçuş segmentinin biletleri (THY + Sun PhuQuoc)",
        "Otel rezervasyonları (De Syloia, Athena Cruise, Le Sands)",
        "Seyahat sağlık sigortası",
        "Banka/kredi kartları + yedek kart",
        "USD nakit (vize harcı + bahşiş) · ufak tutarda VND"
      ]},
      { emoji: "🎒", title: "El bagajı (uçuşlar 1 parça kayıtlı bagaj)", items: [
        "Pasaportlar + e-vize çıktıları",
        "Cüzdan ve telefonlar",
        "Powerbank ve kablolar",
        "İlaçlar ve kişisel eşyalar",
        "Boyun yastığı + kulak tıkacı + göz maskesi (gece uçuşları)",
        "Küçük atıştırmalıklar",
        "Boş su şişesi + yedek üst"
      ]}
    ],
    "misir-2026": [
      { emoji: "🧥", title: "Kıyafetler (ılık–sıcak · 20-25°)", items: [
        "Hafif yazlık kıyafetler (gün sayısınca)",
        "1 adet ince uzun kollu gömlek (güneş + akşam serinliği)",
        "2 adet mayo / bikini (Şarm El Şeyh)",
        "1 pareo veya şort",
        "1 adet şık akşam kombini",
        "İç çamaşırı ve çorap (gün sayısınca)",
        "1 takım pijama"
      ]},
      { emoji: "👟", title: "Ayakkabı ve aksesuar", items: [
        "1 çift rahat yürüyüş ayakkabısı (piramit/tarihi alanlar)",
        "1 çift sandalet / terlik",
        "1 çift su ayakkabısı (şnorkel & mercan)",
        "1 adet geniş güneş şapkası",
        "1 adet güneş gözlüğü",
        "1 adet küçük çanta"
      ]},
      { emoji: "🪥", title: "Kişisel bakım & sağlık", items: [
        "Güneş kremi SPF 50+ (yeterli olsun)",
        "Aloe vera / after-sun nemlendirici",
        "Böcek kovucu",
        "İshal ilacı + elektrolit tozu",
        "Dudak kremi (kuru hava)",
        "Kişisel ilaçlar ve küçük ilk yardım seti",
        "Islak mendil"
      ]},
      { emoji: "📱", title: "Elektronik", items: [
        "Telefonlar ve şarj kabloları",
        "Powerbank",
        "Kulaklık",
        "Telefon için su geçirmez poşet (plaj/tekne)",
        "Mısır eSIM / roaming",
        "Çevrimdışı Kahire haritası"
      ]},
      { emoji: "🛂", title: "Belgeler ve para", items: [
        "Yolcuların pasaportu (en az 6 ay geçerli)",
        "Mısır vizesi (varışta / e-visa çıktısı)",
        "Uçak biletleri (XQ224 gidiş · PC5089 dönüş)",
        "Otel rezervasyonları (Sofitel Kahire + Şarm oteli)",
        "Seyahat sağlık sigortası",
        "Banka/kredi kartları",
        "USD/EUR nakit (bahşiş için) · ufak EGP"
      ]},
      { emoji: "🎒", title: "El bagajı", items: [
        "Pasaportlar ve biletler",
        "Cüzdan ve telefonlar",
        "Powerbank ve kablolar",
        "İlaçlar ve kişisel eşyalar",
        "Şnorkel maskesi (isteğe bağlı — havayolu izin verir)",
        "Küçük atıştırmalıklar + boş su şişesi",
        "Yedek üst ve iç çamaşırı"
      ]}
    ],
    "caeli-canakkale-2026": [
      { emoji: "🧥", title: "Kıyafetler (kışlık · 5-12°, yağmurlu olabilir)", items: [
        "1 adet kalın mont veya kaban",
        "2-3 adet kazak / triko",
        "2 adet pantolon (biri üzerinizde)",
        "1 adet şık akşam kombini (winery yemeği için)",
        "İç çamaşırı ve yün çorap (2 gece + yedek)",
        "1 takım pijama",
        "Atkı + bere + eldiven"
      ]},
      { emoji: "👟", title: "Ayakkabı ve aksesuar", items: [
        "1 çift su geçirmez rahat ayakkabı / bot",
        "1 çift alternatif ayakkabı",
        "1 adet katlanabilir şemsiye",
        "1 adet küçük çanta"
      ]},
      { emoji: "🪥", title: "Kişisel bakım", items: [
        "Diş fırçaları ve diş macunu",
        "Deodorant, nemlendirici",
        "Dudak kremi (soğuk hava)",
        "Kişisel ilaçlar ve küçük ilk yardım seti",
        "Islak mendil"
      ]},
      { emoji: "🚗", title: "Araç (27-29 Ara yolculuğu)", items: [
        "Ehliyet + araç ruhsatı + kasko belgesi",
        "Üçgen reflektör + reflektörlü yelek (bagajda)",
        "Cam suyu / antifriz kontrolü (hareket öncesi)",
        "Yedek anahtar",
        "Telefon tutucu + şarj kablosu",
        "Çevrimdışı haritalar / navigasyon"
      ]},
      { emoji: "🛂", title: "Belgeler ve para", items: [
        "Kimlik kartları (oteller için)",
        "Hotel Caeli rezervasyonu",
        "Seyahat sağlık sigortası (isteğe bağlı)",
        "Banka/kredi kartları",
        "Bir miktar TL nakit"
      ]},
      { emoji: "🎒", title: "Araç içi / yol", items: [
        "Yol atıştırmalıkları ve su",
        "Müzik listesi / podcast",
        "Şarap dönüşü için koruyucu taşıma (köpük/karton)",
        "Boyun yastığı (yolcu için)"
      ]}
    ],
    "los-angeles-2027": [
      { emoji: "🧥", title: "Kıyafetler (gündüz 18-22° · akşam serin — katmanlı giyinin)", items: [
        "Tişörtler + 1-2 hafif gömlek (katman için)",
        "1 adet sweatshirt / hafif kazak",
        "1 adet orta kalınlık mont (akşam & LAX 04:25 sabah soğuğu)",
        "2 adet pantolon (biri üzerinizde)",
        "1 adet şık akşam kombini",
        "1 adet mayo (Santa Monica / Venice plajları)",
        "İç çamaşırı ve çorap (gün sayısınca)",
        "1 takım pijama"
      ]},
      { emoji: "👟", title: "Ayakkabı ve aksesuar", items: [
        "1 çift rahat sneakers (çok yürünecek)",
        "1 çift sandalet",
        "1 adet güneş gözlüğü",
        "1 adet şapka",
        "1 adet küçük günlük çanta"
      ]},
      { emoji: "🪥", title: "Kişisel bakım", items: [
        "Güneş kremi SPF 30+",
        "Dudak kremi (kuru California havası)",
        "Diş fırçaları, deodorant, nemlendirici",
        "Kişisel ilaçlar ve küçük ilk yardım seti",
        "Islak mendil"
      ]},
      { emoji: "📱", title: "Elektronik", items: [
        "ABD priz adaptörü (Type A/B) — mutlaka",
        "Telefonlar ve şarj kabloları",
        "Powerbank (13+ saat uçuşlar)",
        "Kulaklık + boyun yastığı",
        "ABD eSIM / roaming aktivasyonu",
        "Çevrimdışı Los Angeles haritası"
      ]},
      { emoji: "🛂", title: "Belgeler ve para", items: [
        "3 yolcunun pasaportu (en az 6 ay geçerli)",
        "ABD vizesi (B1/B2) — geçerliliğini hareket öncesi kontrol edin",
        "Uçuş biletleri (TK2445/TK179 gidiş · TK10/TK2430 dönüş · VANWNF)",
        "Seyahat sağlık sigortası (ABD sağlık sistemi pahalı)",
        "Banka/kredi kartları",
        "USD nakit (bahşiş kültürü: %15-20)",
        "Otel/etkinlik rezervasyonlarının kopyaları"
      ]},
      { emoji: "🎒", title: "El bagajı (13s 50dk + 13s 25dk uçuşlar)", items: [
        "Pasaportlar + vize belgeleri",
        "Cüzdan ve telefonlar",
        "Powerbank ve kablolar",
        "Boyun yastığı + kulak tıkacı + göz maskesi",
        "İlaçlar ve kişisel eşyalar",
        "Küçük atıştırmalıklar",
        "Boş su şişesi + yedek üst + iç çamaşırı",
        "Kozmetik sıvılar 100 ml kuralına uygun"
      ]}
    ]
  };

  /* Checklist durumu: localStorage'da (açık/kapalı + işaretli maddeler) */
  const CL_LS = "tatilTakvimi.checklist.v1";
  let clState = {};
  try { clState = JSON.parse(localStorage.getItem(CL_LS) || "{}") || {}; } catch (e) { clState = {}; }
  function clOf(tripId) {
    if (!clState[tripId]) clState[tripId] = { acik: false, isaretli: [] };
    return clState[tripId];
  }
  function clSave() {
    try { localStorage.setItem(CL_LS, JSON.stringify(clState)); } catch (e) {}
  }

  function checklistHtml(t) {
    const cats = DEFAULT_CHECKLISTS[t.id];
    if (!cats) return "";
    const st = clOf(t.id);
    const toplam = cats.reduce((n, c) => n + c.items.length, 0);
    const acik = !!st.acik;
    return `
      <div class="section-bar" style="margin-top:26px">
        <h2 style="margin:0">🧳 Valiz hazırlama kontrol listesi <small style="color:var(--muted);font-weight:600">${st.isaretli.length}/${toplam}</small></h2>
        <button class="btn small" data-action="cl-toggle">${acik ? "▲ Kapat" : "▼ Aç"}</button>
      </div>
      ${acik
        ? cats.map(c => `
          <div class="card cl-cat">
            <h3 class="cl-title">${c.emoji} ${esc(c.title)}</h3>
            <ul class="cl-list">
              ${c.items.map(it => {
                const ok = st.isaretli.includes(it);
                return `<li class="cl-item ${ok ? "ok" : ""}" data-action="cl-check" data-cl="${esc(it)}">
                  <span class="cl-box">${ok ? "☑" : "☐"}</span><span class="cl-text">${esc(it)}</span>
                </li>`;
              }).join("")}
            </ul>
          </div>`).join("")
        : `<div class="empty-note">Liste kapalı — valiz hazırlarken açın. İşaretlemeleriniz tarayıcıda saklanır.</div>`}
    `;
  }

  /* ---------- hava durumu (Open-Meteo — ücretsiz, API anahtarı gerekmez) ---------- */
  const WX_CODES = {
    0: ["☀️", "Açık"], 1: ["🌤️", "Az bulutlu"], 2: ["⛅", "Parçalı bulutlu"], 3: ["☁️", "Kapalı"],
    45: ["🌫️", "Sis"], 48: ["🌫️", "Kırağılı sis"],
    51: ["🌦️", "Hafif çisenti"], 53: ["🌦️", "Çisenti"], 55: ["🌦️", "Yoğun çisenti"],
    56: ["🌧️", "Donan çisenti"], 57: ["🌧️", "Yoğun donan çisenti"],
    61: ["🌧️", "Hafif yağmur"], 63: ["🌧️", "Yağmur"], 65: ["🌧️", "Şiddetli yağmur"],
    66: ["🌧️", "Donan yağmur"], 67: ["🌧️", "Şiddetli donan yağmur"],
    71: ["🌨️", "Hafif kar"], 73: ["🌨️", "Kar"], 75: ["❄️", "Şiddetli kar"], 77: ["🌨️", "Kar taneleri"],
    80: ["🌦️", "Hafif sağanak"], 81: ["🌧️", "Sağanak"], 82: ["⛈️", "Şiddetli sağanak"],
    85: ["🌨️", "Kar sağanağı"], 86: ["❄️", "Şiddetli kar sağanağı"],
    95: ["⛈️", "Gök gürültülü fırtına"], 96: ["⛈️", "Fırtına + dolu"], 99: ["⛈️", "Şiddetli fırtına + dolu"]
  };
  const wxCache = new Map();   // key → { at, data } — 10 dk TTL
  let wxToken = 0;             // eski async doldurmaları geçersiz kılmak için

  function wxClampRange(start, end) {
    const today = todayKey();
    const maxEnd = shiftKey(today, 15);
    const s = start < today ? today : start;
    const e = end > maxEnd ? maxEnd : end;
    return { s, e, disinda: s > e, kalanVar: e < end };
  }

  function weatherStopsOf(t) {
    const stops = [];
    const push = (city, s, e) => {
      const c = CITY_CENTERS.find(x => x.name.toLowerCase() === String(city).toLowerCase());
      if (c && s && e && s <= e) stops.push({ city, lat: c.lat, lng: c.lng, start: s, end: e });
    };
    (t.weatherStops || []).forEach(w => push(w.city, w.start, w.end));
    t.hotels
      .filter(h => h.checkIn)
      .sort((a, b) => (a.checkIn || "").localeCompare(b.checkIn || ""))
      .forEach(h => push(h.city, h.checkIn, h.checkOut || h.checkIn));
    stops.sort((a, b) => a.start.localeCompare(b.start));
    return stops;
  }

  function weatherBoxHtml(t) {
    const stops = weatherStopsOf(t);
    if (!stops.length) return "";
    return `
      <div class="section-bar" style="margin-top:26px">
        <h2 style="margin:0">🌤️ Hava durumu <small style="color:var(--muted);font-weight:600">Open-Meteo · site açılınca güncellenir</small></h2>
      </div>
      <div class="wx-list">
        ${stops.map((w, i) => `
          <div class="card wx-card" data-wx="${i}">
            <h4 class="wx-city">${esc(w.city)} <small>${shortDay(w.start)} – ${shortDay(w.end)}</small></h4>
            <div class="wx-days"><span class="wx-note">Yükleniyor…</span></div>
          </div>`).join("")}
      </div>
    `;
  }

  async function wxFetch(w, s, e) {
    const key = `${w.lat}|${w.lng}|${s}|${e}`;
    const hit = wxCache.get(key);
    if (hit && Date.now() - hit.at < 10 * 60 * 1000) return hit.data;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${w.lat}&longitude=${w.lng}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=auto&start_date=${s}&end_date=${e}`;
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error("http " + r.status);
      const j = await r.json();
      const data = j.daily;
      wxCache.set(key, { at: Date.now(), data });
      return data;
    } catch (err) {
      return null;
    }
  }

  async function fillWeatherStop(mainEl, token, w, i) {
    const { s, e, disinda, kalanVar } = wxClampRange(w.start, w.end);
    if (disinda) {
      const el = mainEl.querySelector(`[data-wx="${i}"] .wx-days`);
      if (el && token === wxToken) {
        el.innerHTML = `<div class="wx-note">📅 Tahmin aralığında değil — geziye 15 gün kala burada otomatik görünecek.</div>`;
      }
      return;
    }
    const data = await wxFetch(w, s, e);
    if (token !== wxToken) return; /* bu arada yeni render oldu → geç */
    const el = mainEl.querySelector(`[data-wx="${i}"] .wx-days`);
    if (!el) return;
    if (!data) {
      el.innerHTML = `<div class="wx-note">Hava durumu yüklenemedi — internet bağlantısını kontrol edin.</div>`;
      return;
    }
    const gunler = data.time.map((d, k) => {
      const c = WX_CODES[data.weather_code[k]] || ["🌡️", ""];
      const dt = parseKey(d);
      const wd = WEEKDAY_SHORT[(dt.getDay() + 6) % 7];
      const yagis = data.precipitation_probability_max ? data.precipitation_probability_max[k] : null;
      return `<div class="wx-day">
        <div class="wd">${dt.getDate()} <small>${wd}</small></div>
        <div class="ic" title="${esc(c[1])}">${c[0]}</div>
        <div class="t">${Math.round(data.temperature_2m_max[k])}°<small>${Math.round(data.temperature_2m_min[k])}°</small></div>
        ${yagis != null ? `<div class="p">💧 ${yagis}%</div>` : ""}
      </div>`;
    }).join("");
    el.innerHTML = `<div class="wx-row">${gunler}</div>` +
      (kalanVar ? `<div class="wx-note">📅 ${shortDay(shiftKey(e, 1))} sonrası tahmin aralığına girince otomatik eklenir.</div>` : "");
  }

  function updateWeather(mainEl) {
    const t = active();
    if (!t || !mainEl) return;
    const stops = weatherStopsOf(t);
    if (!stops.length) return;
    const token = ++wxToken;
    stops.forEach((w, i) => { fillWeatherStop(mainEl, token, w, i); });
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
          case "cl-toggle": {
            const s = clOf(t.id);
            s.acik = !s.acik;
            clSave();
            break;
          }
          case "cl-check": {
            const s = clOf(t.id);
            const lbl = btn.dataset.cl;
            const ix = s.isaretli.indexOf(lbl);
            if (ix >= 0) s.isaretli.splice(ix, 1); else s.isaretli.push(lbl);
            clSave();
            break;
          }
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
