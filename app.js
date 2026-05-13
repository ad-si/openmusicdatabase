// Open Music Database SPA
// Hash-routed single-page app: home, instruments, range, upload, about, imprint, terms, privacy.

// ---------- Note utilities ----------
// Semitone offset is measured from C4 (middle C = 0).

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const STANDARD_PITCH = 440 // Hz for A4
const A4_OFFSET = 9        // A4 is 9 semitones above C4

const mod12 = (n) => ((n % 12) + 12) % 12
const pitchClass = (offset) => NOTE_NAMES[mod12(offset)]
const noteName = (offset) => `${pitchClass(offset)}${4 + Math.floor(offset / 12)}`
const isBlackKey = (offset) => pitchClass(offset).includes("#")
const frequency = (offset) => STANDARD_PITCH * 2 ** ((offset - A4_OFFSET) / 12)

// ---------- Instrument fingering data ----------
// Keys are semitone offsets from C4. Values describe fingerings.

// Trumpet (Bb), written pitch. Each entry is three valves [v1, v2, v3] (1 = pressed).
const TRUMPET = {
  "-6": [1, 1, 1],   // F#3
  "-5": [1, 0, 1],   // G3
  "-4": [0, 1, 1],   // G#3
  "-3": [1, 1, 0],   // A3
  "-2": [1, 0, 0],   // A#3 / Bb3
  "-1": [0, 1, 0],   // B3
  "0":  [0, 0, 0],   // C4
  "1":  [1, 1, 1],   // C#4
  "2":  [1, 0, 1],   // D4
  "3":  [0, 1, 1],   // D#4
  "4":  [1, 1, 0],   // E4
  "5":  [1, 0, 0],   // F4
  "6":  [0, 1, 0],   // F#4
  "7":  [0, 0, 0],   // G4
  "8":  [0, 1, 1],   // G#4
  "9":  [1, 1, 0],   // A4
  "10": [1, 0, 0],   // A#4
  "11": [0, 1, 0],   // B4
  "12": [0, 0, 0],   // C5
  "13": [1, 1, 0],   // C#5
  "14": [1, 0, 0],   // D5
  "15": [0, 1, 0],   // D#5
  "16": [0, 0, 0],   // E5
  "17": [1, 0, 0],   // F5
  "18": [0, 1, 0],   // F#5
  "19": [0, 0, 0],   // G5
  "20": [0, 1, 1],   // G#5
  "21": [1, 1, 0],   // A5
  "22": [1, 0, 0],   // A#5
  "23": [0, 1, 0],   // B5
  "24": [0, 0, 0],   // C6
}

// Tenor trombone. Each entry is [primary position, alternate?] (1-7).
const TROMBONE = {
  "-20": [7],         // E2
  "-19": [6],         // F2
  "-18": [5],         // F#2
  "-17": [4],         // G2
  "-16": [3],         // G#2
  "-15": [2],         // A2
  "-14": [1],         // Bb2
  "-13": [7],         // B2
  "-12": [6],         // C3
  "-11": [5],         // C#3
  "-10": [4],         // D3
  "-9":  [3],         // Eb3
  "-8":  [2, 7],      // E3
  "-7":  [1, 6],      // F3
  "-6":  [5],         // F#3
  "-5":  [4],         // G3
  "-4":  [3, 7],      // G#3
  "-3":  [2, 6],      // A3
  "-2":  [1, 5],      // Bb3
  "-1":  [4],         // B3
  "0":   [3, 6],      // C4
  "1":   [2, 5],      // C#4
  "2":   [1, 4],      // D4
  "3":   [5],         // Eb4
  "4":   [4],         // E4
  "5":   [1, 6],      // F4
  "6":   [5],         // F#4
  "7":   [4],         // G4
}

// Tenor-bass trombone (Bb/F). Adds F attachment positions and alternates.
const TENORBASS = {
  ...TROMBONE,
  "-26": [1],          // B1 (F attachment, slightly extended)
  "-25": [4],          // C2 (F)
  "-24": [3],          // C2... approximate
  "-23": [2],          // C#2 (F)
  "-22": [1],          // D2 (F)
  "-13": [7, null, 1], // B2 (alt F-attachment 1st)
  "-12": [6, null, 2], // C3 (F-attachment alternate)
  "-11": [5, null, 3], // C#3
  "-10": [4, null, 4], // D3
}

// Tenor saxophone written-pitch fingering layout.
const TENORSAX_RANGE = { lo: -15, hi: 18 } // Bb3 to F#6 (concert Ab2 to E5)

// Approximate Boehm-like sax fingerings keyed by pitch class.
// Order: [lh1, lh2, lh3, rh1, rh2, rh3, low-key]
const SAX_KEYMAP = {
  0:  [1, 1, 1, 1, 1, 1, 0], // C
  1:  [1, 1, 1, 1, 1, 0, 0], // C#
  2:  [1, 1, 1, 1, 1, 0, 0], // D
  3:  [1, 1, 1, 1, 0, 0, 0], // Eb
  4:  [1, 1, 1, 1, 0, 0, 0], // E
  5:  [1, 1, 1, 0, 0, 0, 0], // F
  6:  [1, 1, 0, 1, 0, 0, 0], // F#
  7:  [1, 1, 0, 0, 0, 0, 0], // G
  8:  [1, 0, 1, 0, 0, 0, 0], // G#
  9:  [1, 0, 0, 0, 0, 0, 0], // A
  10: [0, 1, 0, 0, 0, 0, 0], // Bb
  11: [0, 0, 0, 0, 0, 0, 0], // B
}

const saxFingering = (offset) => ({
  octave: offset >= 9,
  keys: SAX_KEYMAP[mod12(offset)] ?? [0, 0, 0, 0, 0, 0, 0],
})

// ---------- Range data (lo, hi inclusive, in semitones from C4) ----------
const RANGES = {
  piano:        { lo: -39, hi: 48 },  // A0 to C8
  humanVoice:   { lo: -20, hi: 24 },  // E2 to C6
  bass:         { lo: -20, hi: 4  },  // E2 to E4
  baritone:     { lo: -15, hi: 9  },  // A2 to A4
  tenor:        { lo: -12, hi: 12 },  // C3 to C5
  alto:         { lo: -7,  hi: 17 },  // F3 to F5
  mezzosoprano: { lo: -3,  hi: 21 },  // A3 to A5
  soprano:      { lo: 0,   hi: 24 },  // C4 to C6
  trumpet:      { lo: -6,  hi: 24 },  // F#3 to C6 (written)
  trombone:     { lo: -20, hi: 17 },  // E2 to F5
  tenorbass:    { lo: -26, hi: 17 },  // B1 to F5 (with F attachment)
  tenorSax:     { lo: -15, hi: 18 },  // Bb3 to F#6 (written)
}

// ---------- View helpers ----------
const el = (tag, attrs, children) => {
  const node = document.createElement(tag)
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue
      if (k === "class") node.className = v
      else if (k === "html") node.innerHTML = v
      else if (k.startsWith("on") && typeof v === "function") {
        node.addEventListener(k.slice(2), v)
      } else {
        node.setAttribute(k, v)
      }
    }
  }
  if (children != null) {
    const list = Array.isArray(children) ? children : [children]
    node.append(...list.filter((c) => c != null))
  }
  return node
}

const SVG_NS = "http://www.w3.org/2000/svg"
const svgEl = (tag, attrs) => {
  const node = document.createElementNS(SVG_NS, tag)
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v != null) node.setAttribute(k, String(v))
    }
  }
  return node
}

// ---------- Renderers ----------
const renderTrumpet = () => {
  const charts = el("div", { class: "charts" })
  for (let i = -6; i <= 24; i++) {
    const fingering = TRUMPET[i] ?? [0, 0, 0]
    charts.append(el("div", { class: "valves" }, [
      el("div", { class: "key" }, noteName(i)),
      ...fingering.map((v) => el("div", { class: `valve pressed${v}` })),
    ]))
  }
  return el("div", { class: "fingering-chart" }, charts)
}

const renderTrombone = (data, lo, hi, withFAttachment) => {
  const wrap = el("div", { class: "fingering-chart" })
  for (let i = lo; i <= hi; i++) {
    const entry = data[i]
    if (!entry) continue
    const [primary, alt, fAtt] = entry
    const slide = el("div", { class: "slide" }, el("div", { class: "key" }, noteName(i)))

    const addValve = (value, cls) => {
      if (!value) return
      slide.append(el("div", {
        class: cls,
        style: `height:${value * 18 + 6}px;`,
      }, el("span", { class: "num" }, String(value))))
    }

    addValve(primary, "valve")
    addValve(alt, "valve alt")
    if (withFAttachment) addValve(fAtt, "valve f_attachment")
    wrap.append(slide)
  }
  return wrap
}

const saxSVG = ({ octave, keys }) => {
  const svg = svgEl("svg", { width: 40, height: 120, viewBox: "0 0 40 120" })
  svg.append(
    svgEl("rect", { x: 17, y: 5, width: 6, height: 110, fill: "#cccccc" }),
    svgEl("circle", {
      cx: 10, cy: 12, r: 4,
      fill: octave ? "#323232" : "#ffffff",
      stroke: "#000",
    }),
    ...keys.map((pressed, k) => svgEl("circle", {
      cx: 20, cy: 25 + k * 13, r: 5,
      fill: pressed ? "#323232" : "#ffffff",
      stroke: "#000",
    })),
  )
  return svg
}

const renderTenorSax = () => {
  const wrap = el("div", { class: "fingering-chart sax-grid" })
  for (let i = TENORSAX_RANGE.lo; i <= TENORSAX_RANGE.hi; i++) {
    wrap.append(el("div", { class: "sax-cell" }, [
      el("div", { class: "key" }, noteName(i)),
      saxSVG(saxFingering(i)),
    ]))
  }
  return wrap
}

const renderPianoRange = (range, freq) => {
  const lo = -39
  const hi = 48
  const row = el("div", { class: `piano-row${freq ? " frequenz" : ""}` })
  for (let i = lo; i <= hi; i++) {
    const black = isBlackKey(i)
    const inRange = range && i >= range.lo && i <= range.hi
    const variant = inRange
      ? (black ? "blackplayable" : "whiteplayable")
      : (black ? "black" : "white")
    const label = freq ? String(Math.round(frequency(i))) : pitchClass(i)
    row.append(el("div", { class: `piano_button ${variant}`, title: noteName(i) }, label))
  }
  return row
}

// ---------- Views ----------
const viewHome = () => el("div", null, [
  el("section", { class: "home-intro" }, [
    el("h2", null, "Open Music Database"),
    el("p", null,
      "An open collection of musical reference material: instrument fingering charts, " +
      "pitch ranges and frequency tables. Free to browse, free to contribute."),
    el("p", null,
      "Use the navigation above to explore instruments, compare ranges, or upload " +
      "a piece of music."),
  ]),
  el("section", { class: "home-grid" }, [
    el("a", { class: "home-card", href: "#instruments" }, [
      el("h3", null, "Instruments"),
      el("p", null, "Valve and slide fingerings for trumpet, trombone and tenor saxophone."),
    ]),
    el("a", { class: "home-card", href: "#range" }, [
      el("h3", null, "Range"),
      el("p", null, "Piano-keyboard range charts for voices and instruments with frequencies."),
    ]),
    el("a", { class: "home-card", href: "#upload" }, [
      el("h3", null, "Upload"),
      el("p", null, "Submit a song with metadata, audio, video, MIDI or MusicXML."),
    ]),
    el("a", { class: "home-card", href: "#about" }, [
      el("h3", null, "About"),
      el("p", null, "Project background and useful music-notation links."),
    ]),
  ]),
])

const viewInstruments = () => el("div", { class: "instrument-section" }, [
  el("h2", null, "Trumpet"),
  el("img", { class: "instrument-image", src: "img/trumpet.svg", style: "height:150px;", alt: "Trumpet" }),
  renderTrumpet(),

  el("h2", null, "Tenor Trombone"),
  el("img", { class: "instrument-image", src: "img/tenortrombone.svg", style: "height:160px;", alt: "Tenor trombone" }),
  renderTrombone(TROMBONE, -20, 7, false),

  el("h2", null, "Tenor-Bass Trombone"),
  el("img", { class: "instrument-image", src: "img/tenortrombone.svg", style: "height:160px;", alt: "Tenor-bass trombone" }),
  renderTrombone(TENORBASS, -26, 7, true),

  el("h2", null, "Tenor Saxophone"),
  renderTenorSax(),
])

const RANGE_ROWS = [
  { label: "Frequency (Hz)",      range: null,               freq: true },
  { label: "Piano",               range: RANGES.piano },
  { label: "Human Voice",         range: RANGES.humanVoice },
  { label: "Bass",                range: RANGES.bass },
  { label: "Baritone",            range: RANGES.baritone },
  { label: "Tenor",               range: RANGES.tenor },
  { label: "Alto",                range: RANGES.alto },
  { label: "Mezzo-soprano",       range: RANGES.mezzosoprano },
  { label: "Soprano",             range: RANGES.soprano },
  { label: "Trumpet",             range: RANGES.trumpet },
  { label: "Tenor Trombone",      range: RANGES.trombone },
  { label: "Tenor-Bass Trombone", range: RANGES.tenorbass },
  { label: "Tenor Saxophone",     range: RANGES.tenorSax },
]

const viewRange = () => {
  const table = el("table", { class: "range-table" })
  for (const { label, range, freq } of RANGE_ROWS) {
    table.append(el("tr", null, [
      el("td", { class: "label" }, label),
      el("td", null, el("div", { class: "range-wrap" }, renderPianoRange(range, !!freq))),
    ]))
  }
  return el("div", null, [
    el("h2", null, "Pitch Range"),
    el("p", null,
      "Each row highlights the typical playable range of the instrument or voice " +
      `on a piano keyboard. The top row shows frequencies in Hz at A4 = ${STANDARD_PITCH} Hz.`),
    table,
  ])
}

const option = (label) => el("option", null, label)

const viewUpload = () => el("form", {
  class: "upload-form",
  onsubmit: (e) => {
    e.preventDefault()
    alert("Upload is not wired up in this demo build.")
  },
}, [
  el("h2", null, "Upload a piece"),

  el("fieldset", null, [
    el("input", { type: "text", name: "songtitle", placeholder: "Song title" }),
    el("input", { type: "text", name: "composer",  placeholder: "Composer" }),
    el("input", { type: "text", name: "arranger",  placeholder: "Arranger" }),
  ]),

  el("div", null, [
    el("label", null, "Instrument"),
    el("select", { name: "instrument" },
      ["Piano", "Grand Piano", "E-Piano", "Trumpet", "Trombone", "Saxophone"].map(option)),
  ]),

  el("div", null, [
    el("label", null, "Instrumentation"),
    el("select", { name: "instrumentation" },
      ["Solo", "Duo", "Quartet", "Big Band", "Orchestra"].map(option)),
  ]),

  el("fieldset", null, [
    el("label", null, "Meter"),
    el("span", { class: "meter" }, [
      el("input", { type: "number", min: "2", max: "16", value: "4" }),
      el("input", { type: "number", min: "2", max: "16", value: "4" }),
    ]),
    el("label", null, "Bar"),
    el("input", { type: "number", min: "1", value: "1" }),
    el("label", null, "Tempo (bpm)"),
    el("input", { type: "number", min: "1", max: "230", value: "120" }),
    el("label", null, "Time"),
    el("input", { type: "time", value: "00:00" }),
  ]),

  el("div", null, [
    el("label", null, "Key"),
    el("select", null, NOTE_NAMES.map(option)),
    el("select", null, ["Major", "Minor"].map(option)),
  ]),

  el("div", null, [
    el("label", null, "Difficulty"),
    el("select", null,
      Array.from({ length: 10 }, (_, i) => option(String(i + 1)))),
  ]),

  el("div", { class: "links-row" },
    ["Audio", "Video", "Image", "Midi", "MusicXML"].map((l) => el("div", { class: "links" }, l))),

  el("input", { type: "submit", value: "Upload" }),
])

const viewAbout = () => el("div", { class: "legal" }, [
  el("h2", null, "About"),
  el("p", null,
    "Open Music Database is an open project collecting musical reference material: " +
    "fingering charts, instrument ranges, frequencies and (eventually) sheet music."),
  el("h3", null, "Related projects"),
  el("ul", null, [
    el("li", null, el("a", { href: "http://balanced-keyboard.com", target: "_blank", rel: "noopener" }, "balanced-keyboard.com")),
    el("li", null, el("a", { href: "http://musicnotation.org", target: "_blank", rel: "noopener" }, "musicnotation.org")),
    el("li", null, el("a", { href: "http://denemo.org", target: "_blank", rel: "noopener" }, "denemo.org — open-source music notation editor")),
  ]),
  el("h3", null, "Notation example"),
  el("pre", { style: "background:#f4f4f4;padding:10px;border-radius:6px;display:inline-block;" },
    "c=== | d d e f# | a b c d |"),
])

const viewImprint = () => el("div", { class: "legal" }, [
  el("h2", null, "Imprint"),
  el("p", null, "Open Music Database is a non-commercial project."),
  el("p", null, "Contact the maintainers via the project repository."),
])

const viewTerms = () => el("div", { class: "legal" }, [
  el("h2", null, "Terms of Use"),
  el("p", null,
    "Content on Open Music Database is provided for educational and informational " +
    "purposes. Users are responsible for ensuring that any material they upload " +
    "respects applicable copyright and licensing."),
  el("p", null,
    "The maintainers offer no warranty regarding accuracy of fingering charts or " +
    "range data. Reference material should be verified against authoritative sources " +
    "before professional use."),
])

const viewPrivacy = () => el("div", { class: "legal" }, [
  el("h2", null, "Privacy"),
  el("p", null,
    "This static site does not collect or transmit personal data. No cookies are set " +
    "and no tracking scripts are loaded."),
])

const viewNotFound = () => el("div", { class: "legal" }, [
  el("h2", null, "Not found"),
  el("p", null, "No view exists at this route."),
  el("p", null, el("a", { href: "#home" }, "Back to home")),
])

// ---------- Router ----------
const ROUTES = {
  "":            viewHome,
  home:          viewHome,
  instruments:   viewInstruments,
  range:         viewRange,
  upload:        viewUpload,
  about:         viewAbout,
  imprint:       viewImprint,
  terms:         viewTerms,
  privacy:       viewPrivacy,
}

const render = () => {
  const hash = window.location.hash.replace(/^#/, "")
  const view = ROUTES[hash] ?? viewNotFound
  const target = document.getElementById("view")
  target.replaceChildren(view())
  window.scrollTo(0, 0)
}

const init = () => {
  const searchForm = document.getElementById("search-form")
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault()
    const q = searchForm.querySelector("input[name=\"search\"]").value.trim()
    if (q) alert(`Search is not implemented yet: ${q}`)
  })
  if (!window.location.hash) window.location.hash = "#home"
  else render()
}

window.addEventListener("hashchange", render)
document.addEventListener("DOMContentLoaded", init)
