/* ============================================================
   Tatil Takvimi — Ana uygulama
   Takvim görünümü · geri sayım · ICS dışa aktarma · harita
   ============================================================ */

(() => {
  /* ---------- durum ---------- */
  let currentYear = new Date().getFullYear();
  let map = null;           // Leaflet instance
  let markerLayer = null;   // layerGroup

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
        const mark = f.mode === "train" ? "🚆" : "✈";
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
        const kind = f.mode === "train" ? "Tren" : (f.dir === "out" ? "Gidiş uçuşu" : "Dönüş uçuşu");
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
    if (map || typeof L === "undefined") return;
    map = L.map("mapDiv", { scrollWheelZoom: true }).setView([31.5, 31.9], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap katkıcıları"
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    renderMap();
  }

  function poiIconHtml(cls, inner) {
    return L.divIcon({
      className: "",
      html: `<div class="${cls}">${inner}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  }

  function renderMap() {
    if (!map || !markerLayer) return;
    markerLayer.clearLayers();
    const side = document.getElementById("mapSide");
    const data = TT.mapData();
    const airports = TT.airportsUsed();
    const markers = [];

    /* havalimanı işaretçileri */
    airports.forEach(a => {
      markers.push({ lat: a.lat, lng: a.lng });
      L.marker([a.lat, a.lng], { icon: poiIconHtml("poi-icon", a.code) })
        .addTo(markerLayer)
        .bindPopup(`<b>${a.code}</b> ${a.name}`);
    });

    /* uçuş/tren rotaları */
    const routeRows = [];
    data.flights.forEach(f => {
      const fromPt = [f.fromPos.lat, f.fromPos.lng];
      const toPt = [f.toPos.lat, f.toPos.lng];
      const isTrain = f.mode === "train";
      const dist = Math.round(haversineKm(f.fromPos.lat, f.fromPos.lng, f.toPos.lat, f.toPos.lng));
      L.polyline([fromPt, toPt], {
        color: isTrain ? "#f59e0b" : (f.dir === "out" ? "#2563eb" : "#0d9488"),
        weight: 2.5,
        dashArray: isTrain ? "3 7" : "8 6",
        opacity: 0.85
      }).addTo(markerLayer)
        .bindPopup(`${isTrain ? "🚆 Tren" : (f.dir === "out" ? "🛫 Gidiş" : "🛬 Dönüş")}: ${f.from} → ${f.to}<br><small>${longDate(f.date)}${f.time ? ` · Saat ${f.time}${f.timeArr ? " → " + f.timeArr : ""}` : ""} · ≈${dist} km</small>`);
      routeRows.push(`
        <li data-act="route" data-fl="${f.fromPos.lat},${f.fromPos.lng},${f.toPos.lat},${f.toPos.lng}">
          <span class="m-emoji">${isTrain ? "🚆" : "✈️"}</span>
          <span>${isTrain ? "Tren" : (f.dir === "out" ? "Gidiş" : "Dönüş")}: <b>${f.from} → ${f.to}</b><br>
          <small>${parseKey(f.date).getDate()} ${MONTH_NAMES[parseKey(f.date).getMonth()]}${f.time ? ` · ${f.time}${f.timeArr ? " → " + f.timeArr : ""}` : ""} · ≈${dist} km</small></span>
        </li>`);
    });

    /* oteller */
    const hotelRows = [];
    data.hotels.forEach(h => {
      markers.push(h.pos);
      L.marker([h.pos.lat, h.pos.lng], { icon: poiIconHtml("hotel-icon", "🏨") })
        .addTo(markerLayer)
        .bindPopup(`<b>${esc(h.name)}</b><br>${esc(h.city)}${h.area ? ", " + esc(h.area) : ""}${h.checkIn ? `<br>${h.checkIn} → ${h.checkOut || "—"}` : ""}${h.link ? `<br><a href="${esc(h.link)}" target="_blank" rel="noopener">otel sayfası</a>` : ""}`);
      hotelRows.push(`
        <li data-act="focus" data-lat="${h.pos.lat}" data-lng="${h.pos.lng}" data-zoom="14">
          <span class="m-emoji">🏨</span>
          <span><b>${esc(h.name)}</b><br><small>${esc(h.city)}${h.area ? ", " + esc(h.area) : ""}</small></span>
        </li>`);
    });

    /* yan panel */
    const airportRows = airports.map(a => `
      <li data-act="focus" data-lat="${a.lat}" data-lng="${a.lng}" data-zoom="12">
        <span class="m-emoji">🛫</span><span><b>${a.code}</b> ${a.name}</span>
      </li>`).join("");

    side.innerHTML = `
      <h3>Lokasyonlar</h3><ul>${airportRows || "<li><small>Uçuş yok</small></li>"}</ul>
      <h3>Rotalar</h3><ul>${routeRows.join("") || "<li><small>Rota yok</small></li>"}</ul>
      <h3>Oteller</h3><ul>${hotelRows.join("") || "<li><small>Otel yok</small></li>"}</ul>`;

    side.querySelectorAll("[data-act]").forEach(li => {
      li.addEventListener("click", () => {
        if (li.dataset.act === "focus") {
          map.flyTo([+li.dataset.lat, +li.dataset.lng], +(li.dataset.zoom || 12));
        } else if (li.dataset.act === "route") {
          const [a, b, c, d] = li.dataset.fl.split(",").map(Number);
          map.flyToBounds([[a, b], [c, d]], { padding: [40, 40] });
        }
      });
    });

    if (markers.length) {
      map.fitBounds(L.latLngBounds(markers).pad(0.35));
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
      if (map) setTimeout(() => map.invalidateSize(), 60);
    }
  }

  function renderAll() {
    renderHero();
    renderMonths();
    renderHolidayList();
    TT.setTripHtml(document.getElementById("tripMain"));
    if (markerLayer) renderMap();
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
