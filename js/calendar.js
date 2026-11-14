/* ============================================================
   Tatil Takvimi — Ana uygulama
   Takvim görünümü · geri sayım · ICS dışa aktarma · harita
   ============================================================ */

(() => {
  /* ---------- durum ---------- */
  let currentYear = new Date().getFullYear();
  let map = null;            // MapLibre GL instance
  let mapReady = false;      // stil yüklendi mi
  let markers = [];          // maplibregl.Marker[] — temizlemek için
  let routesSource = null;   // GeoJSON source (rotalar)

  const YEARS = Object.keys(HOLIDAYS).map(Number).sort((a, b) => a - b);

  /* HTML koruması (kullanıcı girişli otel adları için) */
  const ESC_MAP = { "&": "&" + "amp;", "<": "&" + "lt;", ">": "&" + "gt;", '"': "&" + "quot;", "'": "&#39;" };
  function esc(v) { return String(v ?? "").replace(/[&<>"']/g, c => ESC_MAP[c]); }

  /* =========================================================================
     Gezi günlerini mini takvim için "tarih -> işaretçi" haritasına dök
     (aktif gezi değil, TÜM geziler işaretlenir)
     ========================================================================= */
  function tripMarkersByDate() {
    const marks = {};
    for (const t of TT.all()) {
      t.flights.forEach(f => {
        if (!f.date) return;
        const mark = f.mode === "train" ? "🚆" : f.mode === "car" ? "🚗" : "✈";
        marks[f.date] = (marks[f.date] || "") + mark;
      });
      t.hotels.forEach(h => {
        if (!h.checkIn) return;
        const end = h.checkOut || h.checkIn;
        let cur = h.checkIn;
        let guard = 0;
        while (cur <= end && guard++ < 60) {
          marks[cur] = (marks[cur] || "") + "🏨";
          cur = shiftKey(cur, 1);
        }
      });
    }
    return marks;
  }

  function tripRangeOf(t) {
    /* artık TT.tripRange kullanılıyor — geriye dönük uyumluluk için bırakıldı */
    return TT.tripRange(t);
  }

  /* Tüm gezilerin aralığındaki günler (mini takvimde bordürlü gösterilir) */
  function tripRangeDays() {
    const days = new Set();
    for (const t of TT.all()) {
      const r = TT.tripRange(t);
      if (!r) continue;
      let cur = r.start;
      let guard = 0;
      while (cur <= r.end && guard++ < 90) {
        days.add(cur);
        cur = shiftKey(cur, 1);
      }
    }
    return days;
  }

  /* =========================================================================
     HERO — geri sayım kartları
     ========================================================================= */
  function renderHero() {
    const el = document.getElementById("heroGrid");
    const today = todayKey();
    const cards = [];

    /* 1) Sıradaki resmi tatil */
    const nextHol = allHolidays().find(h => h.key >= today);
    if (nextHol) {
      const d = daysUntil(nextHol.key);
      cards.push(`
        <div class="hero-card red">
          <p class="kicker">Sıradaki Resmi Tatil</p>
          <div class="big">${d === 0 ? "Bugün! 🎉" : d + " gün"}</div>
          <div class="name">${nextHol.name}</div>
          <p class="muted">${longDate(nextHol.key)}${nextHol.type === "half" ? " · yarım gün" : ""}</p>
        </div>`);
    }

    /* 2) Sıradaki gezi */
    let upcoming = null;
    for (const t of TT.all()) {
      const r = TT.tripRange(t);
      if (!r) continue;
      if (daysUntil(r.end) < 0) continue;
      if (!upcoming || r.start < upcoming.range.start) upcoming = { trip: t, range: r };
    }
    if (upcoming) {
      const d = daysUntil(upcoming.range.start);
      const ongoing = d <= 0 && daysUntil(upcoming.range.end) >= 0;
      cards.push(`
        <div class="hero-card teal">
          <p class="kicker">Sıradaki Gezi</p>
          <div class="big">${ongoing ? "Şu an 🌴" : d + " gün"}</div>
          <div class="name">${upcoming.trip.emoji} ${esc(upcoming.trip.name)}</div>
          <p class="muted">${longDate(upcoming.range.start)} → ${longDate(upcoming.range.end).split(",")[0]}</p>
        </div>`);
    }

    /* 3) Bu yıl kalan resmi tatil */
    const thisYear = new Date().getFullYear();
    const remainingFull = (HOLIDAYS[thisYear] || []).filter(h => h.type === "full" && h.key >= today).length;
    const remainingHalf = (HOLIDAYS[thisYear] || []).filter(h => h.type === "half" && h.key >= today).length;
    cards.push(`
      <div class="hero-card indigo">
        <p class="kicker">Bu Yıl Kalan Resmi Tatil</p>
        <div class="big">${remainingFull} tam gün</div>
        <p class="muted">${remainingHalf ? `+ ${remainingHalf} arife (yarım gün)` : "bu yılda arife kalmadı"} · toplam yapı: ${(remainingFull + remainingHalf * 0.5).toString().replace(".", ",")} gün</p>
      </div>`);

    el.innerHTML = cards.join("");
  }

  /* =========================================================================
     YILLIK TAKVİM (12 ay mini takvim)
     ========================================================================= */
  function renderMonths() {
    document.getElementById("yearLabel").textContent = currentYear;
    const grid = document.getElementById("monthsGrid");
    const holMap = {};
    (HOLIDAYS[currentYear] || []).forEach(h => { holMap[h.key] = h; });
    const tripMap = tripMarkersByDate();
    const rangeSet = tripRangeDays();
    const today = todayKey();

    grid.innerHTML = MONTH_NAMES.map((mName, mi) => {
      const first = new Date(currentYear, mi, 1);
      const daysInMonth = new Date(currentYear, mi + 1, 0).getDate();
      const lead = (first.getDay() + 6) % 7; // hafta Pazartesi ile başlar

      let cells = "";
      for (let i = 0; i < lead; i++) cells += `<span class="day-cell empty"></span>`;

      for (let dd = 1; dd <= daysInMonth; dd++) {
        const key = `${currentYear}-${String(mi + 1).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
        const hol = holMap[key];
        const tripMark = tripMap[key] || "";
        const weekend = isWeekend(key);
        const cls = [
          "day-cell",
          hol ? (hol.type === "full" ? "hol" : "half") : (weekend ? "we" : ""),
          tripMap[key] ? "trip" : (rangeSet.has(key) ? "trip-range" : ""),
          key === today ? "today" : ""
        ].filter(Boolean).join(" ");
        const holTxt = hol ? ` — ${hol.name}${hol.type === "half" ? " (yarım gün)" : ""}` : (weekend ? " — hafta sonu" : "");
        const tripTxt = tripMark ? ` — gezi ${tripMark}` : "";
        cells += `<span class="${cls}" title="${dd} ${MONTH_NAMES[mi]}${holTxt}${tripTxt}">${dd}${tripMark ? `<span class="marker">${tripMark}</span>` : ""}</span>`;
      }

      return `
        <div class="month-card">
          <h3>${mName} ${currentYear}</h3>
          <div class="days-head">${WEEKDAY_SHORT.map(w => `<span>${w}</span>`).join("")}</div>
          <div class="days-grid">${cells}</div>
        </div>`;
    }).join("");
  }

  /* =========================================================================
     TATİL LİSTESİ — bayram grupları + hafta sonu köprüsü
     ========================================================================= */
  function seriesLabel(series) {
    if (series === "ramazan") return "Ramazan Bayramı";
    if (series === "kurban") return "Kurban Bayramı";
    if (series === "cumhuriyet") return "Cumhuriyet Bayramı";
    return series;
  }

  function renderHolidayList() {
    const listEl = document.getElementById("holidayList");
    const today = todayKey();
    const hol = (HOLIDAYS[currentYear] || []).slice().sort((a, b) => a.key.localeCompare(b.key));

    /* ardışık aynı serili (veya tek) girişleri grupla */
    const groups = [];
    let g = null;
    for (const h of hol) {
      const cont = g && ((h.series && g.series === h.series) || (!h.series && g.series === null && g.name === h.name));
      if (!cont) {
        g = { series: h.series || null, name: h.series ? null : h.name, halves: [], fulls: [] };
        groups.push(g);
      }
      if (h.type === "half") g.halves.push(h);
      else g.fulls.push(h);
    }

    listEl.innerHTML = groups.map(gr => {
      const allDates = [...gr.halves, ...gr.fulls].sort((a, b) => a.key.localeCompare(b.key));
      const firstFull = gr.fulls[0] || allDates[0];
      const lastFull = gr.fulls[gr.fulls.length - 1];
      const name = gr.series ? seriesLabel(gr.series) : firstFull.name;

      /* ilk tam günden ilerleyip hafta sonuna yapışan blok */
      let blockEnd = lastFull ? lastFull.key : allDates[0].key;
      if (lastFull) {
        let cur = lastFull.key;
        for (let i = 0; i < 4; i++) {
          const nxt = shiftKey(cur, 1);
          if (isWeekend(nxt)) { blockEnd = nxt; cur = nxt; } else break;
        }
      }
      const blockLen = lastFull ? dayDiff(lastFull.key, blockEnd) + 1 : 0;
      const isPast = blockEnd < today;

      /* üstteki kırmızı tarih kutusu */
      const dStart = parseKey(firstFull.key);
      const dateBlock = `
        <div class="hol-date ${(gr.fulls.length ? "" : "half-style")}">
          <div class="day-num">${dStartDay(gr)}</div>
          <div class="mon">${MONTH_NAMES[dStartMonth(gr)].slice(0, 3)}</div>
        </div>`;

      const dateText = gr.fulls.length >= 2
        ? `${parseKey(firstFull.key).getDate()}\u2013${parseKey(lastFull.key).getDate()} ${MONTH_NAMES[dStartMonth(gr)]}`
        : `${parseKey(allDates[0].key).getDate()} ${MONTH_NAMES[parseKey(allDates[0].key).getMonth()]}`;

      const weekdays = gr.fulls.length >= 2
        ? `${WEEKDAY_LONG[weekdayIndex(firstFull.key)]} → ${WEEKDAY_LONG[weekdayIndex(lastFull.key)]}`
        : WEEKDAY_LONG[weekdayIndex(firstFull.key)];

      return `
        <div class="hol-item" style="${isPast ? "opacity:.55" : ""}">
          ${dateBlock}
          <div class="info">
            <b>${name}</b>
            <div class="weekday">${dateText} · ${weekdays}</div>
          </div>
          <div class="hol-badges">
            ${gr.halves.map(h =>
              `<span class="badge half">arife: ${parseKey(h.key).getDate()} ${MONTH_NAMES[parseKey(h.key).getMonth()].slice(0, 3)} (yarım gün)</span>`
            ).join("")}
            ${gr.fulls.length ? `<span class="badge hol">${gr.fulls.length} gün tatil</span>` : ""}
            ${blockLen > 1 ? `<span class="badge block">hafta sonu dahil ${blockLen} gün</span>` : ""}
          </div>
        </div>`;
    }).join("");
  }

  function dStartDay(gr) { return parseKey((gr.fulls[0] || gr.halves[0]).key).getDate(); }
  function dStartMonth(gr) { return parseKey((gr.fulls[0] || gr.halves[0]).key).getMonth(); }

  /* =========================================================================
     ICS DIŞA AKTARMA
     ========================================================================= */
  function icsEscape(v) {
    return String(v).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  }

  function ymd(key) { return key.replace(/-/g, ""); }

  function buildICS() {
    const now = new Date();
    const stamp =
      now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0") +
      "T" + String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0") + String(now.getSeconds()).padStart(2, "0");

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Tatil Takvimi//TR//",
      "CALSCALE:GREGORIAN"
    ];

    /* resmi tatiller */
    allHolidays().forEach(h => {
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${h.key}-tatil@tatilex`);
      lines.push(`DTSTAMP:${stamp}`);
      lines.push(`SUMMARY:${icsEscape(h.name + (h.type === "half" ? " (yarım gün)" : ""))}`);
      lines.push(`DTSTART;VALUE=DATE:${ymd(h.key)}`);
      lines.push(`DTEND;VALUE=DATE:${ymd(shiftKey(h.key, 1))}`);
      lines.push(`DESCRIPTION:${icsEscape("Resmi tatil — Türkiye")}`);
      lines.push("END:VEVENT");
    });

    /* geziler: uçuş/tren + oteller */
    TT.all().forEach(t => {
      t.flights.forEach(f => {
        if (!f.date) return;
        lines.push("BEGIN:VEVENT");
        lines.push(`UID:${f.id}-${t.id}@tatilex`);
        lines.push(`DTSTAMP:${stamp}`);
        const kind = f.mode === "train" ? "Tren" : f.mode === "car" ? "Araç yolculuğu" : (f.dir === "out" ? "Gidiş uçuşu" : "Dönüş uçuşu");
        const timeTxt = f.time ? (f.timeArr ? ` ${f.time}-${f.timeArr}` : ` ${f.time}`) : "";
        lines.push(`SUMMARY:${icsEscape(`${kind}: ${f.from}-${f.to}${timeTxt}${f.no ? ` (${f.no})` : ""} — ${t.name}`)}`);
        if (f.time) {
          lines.push(`DTSTART:${ymd(f.date)}T${f.time.replace(":", "")}00`);
          let endMin = null;
          if (f.timeArr) {
            const [ah, am] = f.timeArr.split(":").map(Number);
            endMin = ah * 60 + am;
          } else {
            const [hh, mm] = f.time.split(":").map(Number);
            endMin = hh * 60 + mm + 150; // tahmini 2,5 saatlik uçuş
          }
          lines.push(`DTEND:${ymd(f.date)}T${String(Math.floor(endMin / 60)).padStart(2, "0")}${String(endMin % 60).padStart(2, "0")}00`);
        } else {
          lines.push(`DTSTART;VALUE=DATE:${ymd(f.date)}`);
          lines.push(`DTEND;VALUE=DATE:${ymd(shiftKey(f.date, 1))}`);
        }
        if (f.note) lines.push(`DESCRIPTION:${icsEscape(f.note)}`);
        lines.push("END:VEVENT");
      });

      t.hotels.forEach(h => {
        if (!h.checkIn) return;
        const end = h.checkOut || shiftKey(h.checkIn, 1);
        lines.push("BEGIN:VEVENT");
        lines.push(`UID:${h.id}-${t.id}@tatilex`);
        lines.push(`DTSTAMP:${stamp}`);
        lines.push(`SUMMARY:${icsEscape(`Otel: ${h.name}${h.city ? ` (${h.city})` : ""}`)}`);
        lines.push(`DTSTART;VALUE=DATE:${ymd(h.checkIn)}`);
        lines.push(`DTEND;VALUE=DATE:${ymd(end)}`);
        lines.push(`LOCATION:${icsEscape(`${h.city || ""}${h.area ? ", " + h.area : ""}`)}`);
        lines.push("END:VEVENT");
      });
    });

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  function downloadICS() {
    const blob = new Blob([buildICS()], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tatil-takvimi.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* =========================================================================
     HARİTA
     ========================================================================= */
  function initMap() {
    if (map || typeof maplibregl === "undefined") return;
    map = new maplibregl.Map({
      container: "mapDiv",
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [31.9, 31.5],
      zoom: 3.2,
      attributionControl: false
    });
    map.on("error", e => {
      const msg = e && e.error && e.error.message ? e.error.message : String(e && e.error || e);
      console.error("Harita hatası:", msg);
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    /* imza satırı: OpenFreeMap/OSM atıfı kendi kontrolümüzde */
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.on("load", () => {
      mapReady = true;
      /* rota katmanları: önce yumuşak "glow", sonra ana çizgiler.
         line-dasharray data-driven desteklenmediği için tip başına katman + filtre kullanılır. */
      map.addSource("tt-routes", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      routesSource = map.getSource("tt-routes");
      const ortakPaint = { "line-color": ["get", "color"], "line-width": 2.5, "line-opacity": 0.9 };
      map.addLayer({
        id: "tt-routes-glow",
        type: "line",
        source: "tt-routes",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": ["get", "color"], "line-width": 7, "line-opacity": 0.16 }
      });
      /* ✈ uçak + 🚆 tren: noktalı çizgi (Leaflet "3 7" karşılığı) */
      map.addLayer({
        id: "tt-routes-nokta",
        type: "line",
        source: "tt-routes",
        filter: ["in", ["get", "kind"], ["literal", ["out", "return", "train"]]],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { ...ortakPaint, "line-dasharray": [1.2, 2.8] }
      });
      /* 🚗 araç: uzun kesikli (Leaflet "10 8" karşılığı) */
      map.addLayer({
        id: "tt-routes-arac",
        type: "line",
        source: "tt-routes",
        filter: ["==", ["get", "kind"], "car"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { ...ortakPaint, "line-dasharray": [4, 3.2] }
      });
      /* rota çizgilerine tıklayınca bilgi kartı açılır */
      ["tt-routes-nokta", "tt-routes-arac"].forEach(katman => {
        map.on("click", katman, e => {
          const p = e.features && e.features[0] && e.features[0].properties;
          if (!p || !p.popup) return;
          new maplibregl.Popup({ offset: 6 })
            .setLngLat(e.lngLat)
            .setHTML(p.popup)
            .addTo(map);
        });
        map.on("mouseenter", katman, () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", katman, () => { map.getCanvas().style.cursor = ""; });
      });
      renderMap();
    });
  }

  function markerEl(cls, inner) {
    const el = document.createElement("div");
    el.className = cls;
    el.textContent = inner;
    return el;
  }

  function popupHtml(kind, lines) {
    return new maplibregl.Popup({ offset: 26, closeButton: true })
      .setHTML(`<div class="tt-popup">${lines.map(l => `<div>${l}</div>`).join("")}</div>`);
  }

  function addMarker(latLng, cls, inner, popup) {
    const m = new maplibregl.Marker({ element: markerEl(cls, inner), anchor: "center" })
      .setLngLat(latLng)
      .addTo(map);
    if (popup) m.setPopup(popup);
    markers.push(m);
  }

  function renderMap() {
    if (!map || !mapReady || !routesSource) return;
    markers.forEach(m => m.remove());
    markers = [];
    const side = document.getElementById("mapSide");
    const routeFeatures = [];
    const boundsPts = [];

    /* Veri: AKTİF gezi değil — TÜM geziler haritada gösterilir */
    const trips = TT.all()
      .map(t => ({ t, data: TT.mapData(t) }))
      .filter(x => x.data.flights.length || x.data.hotels.length);

    /* ---- Uçuş/tren rotaları + oteller (gezi başına) ---- */
    trips.forEach(({ t, data }) => {
      const tLabel = esc(`${t.emoji || "🧳"} ${t.name}`);

      data.flights.forEach(f => {
        const fromPt = [f.fromPos.lng, f.fromPos.lat];
        const toPt = [f.toPos.lng, f.toPos.lat];
        const isTrain = f.mode === "train";
        const isCar = f.mode === "car";
        const dist = Math.round(haversineKm(f.fromPos.lat, f.fromPos.lng, f.toPos.lat, f.toPos.lng));
        boundsPts.push(fromPt, toPt);
        /* renkler: uçak mavi (gidiş)/teal (dönüş) · tren amber · araç mor */
        const kind = isCar ? "car" : isTrain ? "train" : (f.dir === "out" ? "out" : "return");
        const color = isCar ? "#8b5cf6" : isTrain ? "#f59e0b" : (f.dir === "out" ? "#2563eb" : "#0d9488");
        routeFeatures.push({
          type: "Feature",
          properties: { kind, color, popup: `<div class="tt-popup"><div><b>${tLabel}</b></div><div>${isCar ? "🚗 Araç" : isTrain ? "🚆 Tren" : (f.dir === "out" ? "🛫 Gidiş" : "🛬 Dönüş")}: <b>${f.from} → ${f.to}</b></div><small>${longDate(f.date)}${f.time ? ` · Saat ${f.time}${f.timeArr ? " → " + f.timeArr : ""}` : ""} · ≈${dist} km</small></div>` },
          geometry: { type: "LineString", coordinates: [fromPt, toPt] }
        });
      });

      data.hotels.forEach(h => {
        const pt = [h.pos.lng, h.pos.lat];
        boundsPts.push(pt);
        addMarker(pt, "hotel-icon", "🏨",
          popupHtml("hotel", [`<b>${esc(h.name)}</b>`, `<small>${tLabel}</small>`, `<small>${esc(h.city)}${h.area ? ", " + esc(h.area) : ""}</small>`, h.checkIn ? `<small>${h.checkIn} → ${h.checkOut || "—"}</small>` : "", h.link ? `<small><a href="${esc(h.link)}" target="_blank" rel="noopener">otel sayfası</a></small>` : ""].filter(Boolean)));
      });
    });

    /* ---- Havalimanı işaretçileri (tüm gezilerden toplanır, tekil) ---- */
    const airportSet = new Map();
    trips.forEach(({ t }) => {
      TT.airportsUsed(t).forEach(a => {
        if (!airportSet.has(a.code)) airportSet.set(a.code, a);
      });
    });
    airportSet.forEach(a => {
      const pt = [a.lng, a.lat];
      boundsPts.push(pt);
      addMarker(pt, "poi-icon", a.code, popupHtml("poi", [`<b>${a.code}</b> ${esc(a.name)}`]));
    });

    routesSource.setData({ type: "FeatureCollection", features: routeFeatures });

    /* ---- Yan panel: gezi başına grup ---- */
    side.innerHTML = trips.map(({ t, data }) => {
      const label = esc(`${t.emoji || "🧳"} ${t.name}`);
      const airports = [...new Set(data.flights.flatMap(f => [f.from, f.to]))]
        .filter(k => PLACES[k])
        .map(k => `
          <li data-act="focus" data-lat="${PLACES[k].lat}" data-lng="${PLACES[k].lng}" data-zoom="12">
            <span class="m-emoji">🛫</span><span><b>${k}</b> ${esc(PLACES[k].name)}</span>
          </li>`).join("");
      const routes = data.flights.map(f => {
        const isTrain = f.mode === "train";
        const isCar = f.mode === "car";
        const dist = Math.round(haversineKm(f.fromPos.lat, f.fromPos.lng, f.toPos.lat, f.toPos.lng));
        return `
          <li data-act="route" data-fl="${f.fromPos.lat},${f.fromPos.lng},${f.toPos.lat},${f.toPos.lng}">
            <span class="m-emoji">${isCar ? "🚗" : isTrain ? "🚆" : "✈️"}</span>
            <span>${isCar ? "Araç" : isTrain ? "Tren" : (f.dir === "out" ? "Gidiş" : "Dönüş")}: <b>${f.from} → ${f.to}</b><br>
            <small>${parseKey(f.date).getDate()} ${MONTH_NAMES[parseKey(f.date).getMonth()]}${f.time ? ` · ${f.time}${f.timeArr ? " → " + f.timeArr : ""}` : ""} · ≈${dist} km</small></span>
          </li>`;
      }).join("");
      const hotels = data.hotels.map(h => `
        <li data-act="focus" data-lat="${h.pos.lat}" data-lng="${h.pos.lng}" data-zoom="14">
          <span class="m-emoji">🏨</span>
          <span><b>${esc(h.name)}</b><br><small>${esc(h.city)}${h.area ? ", " + esc(h.area) : ""}</small></span>
        </li>`).join("");
      return `
        <div class="m-trip">
          <h3>${label}</h3>
          <h4>Lokasyonlar</h4><ul>${airports || "<li><small>yok</small></li>"}</ul>
          <h4>Rotalar</h4><ul>${routes || "<li><small>yok</small></li>"}</ul>
          ${hotels ? `<h4>Oteller</h4><ul>${hotels}</ul>` : ""}
        </div>`;
    }).join("") || `<p class="muted">Haritada gösterilecek gezi verisi yok.</p>`;

    side.querySelectorAll("[data-act]").forEach(li => {
      li.addEventListener("click", () => {
        if (li.dataset.act === "focus") {
          map.flyTo({ center: [+li.dataset.lng, +li.dataset.lat], zoom: +(li.dataset.zoom || 12), duration: 900 });
        } else if (li.dataset.act === "route") {
          const [a, b, c, d] = li.dataset.fl.split(",").map(Number);
          map.fitBounds([[Math.min(b, d), Math.min(a, c)], [Math.max(b, d), Math.max(a, c)]], { padding: 60, duration: 900 });
        }
      });
    });

    if (boundsPts.length) {
      const lngs = boundsPts.map(p => p[0]);
      const lats = boundsPts.map(p => p[1]);
      map.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding: 60, duration: 800, maxZoom: 5.2 }
      );
    }
  }

  /* =========================================================================
     SEKMELER + BOOT
     ========================================================================= */
  function switchTab(name) {
    document.querySelectorAll("#tabs .tab").forEach(b =>
      b.classList.toggle("active", b.dataset.tab === name));
    document.querySelectorAll(".tab-panel").forEach(p =>
      p.classList.toggle("active", p.id === `tab-${name}`));
    if (name === "harita") {
      initMap();
      if (map) setTimeout(() => map.resize(), 60);
    }
  }

  function renderAll() {
    renderHero();
    renderMonths();
    renderHolidayList();
    TT.setTripHtml(document.getElementById("tripMain"));
    if (map) renderMap();
  }

  function boot() {
    document.getElementById("tabs").addEventListener("click", e => {
      const btn = e.target.closest(".tab");
      if (btn) switchTab(btn.dataset.tab);
    });
    document.getElementById("prevYear").addEventListener("click", () => {
      currentYear = Math.max(YEARS[0], currentYear - 1);
      renderMonths();
      renderHolidayList();
    });
    document.getElementById("nextYear").addEventListener("click", () => {
      currentYear = Math.min(YEARS[YEARS.length - 1], currentYear + 1);
      renderMonths();
      renderHolidayList();
    });
    document.getElementById("icsBtn").addEventListener("click", downloadICS);
    TT.onChange(renderAll);
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
