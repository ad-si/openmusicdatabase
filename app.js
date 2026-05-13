// Open Music Database SPA
// Hash-routed single-page app: home, instruments, range, upload, about, imprint, terms, privacy.

(function () {
  'use strict';

  // ---------- Note utilities ----------
  // Semitone offset is measured from C4 (middle C = 0).

  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const STANDARD_PITCH = 440; // Hz for A4
  const A4_OFFSET = 9; // A4 is 9 semitones above C4

  function noteName(offset) {
    const pc = ((offset % 12) + 12) % 12;
    const octave = 4 + Math.floor(offset / 12);
    return NOTE_NAMES[pc] + octave;
  }

  function pitchClass(offset) {
    return NOTE_NAMES[((offset % 12) + 12) % 12];
  }

  function isBlackKey(offset) {
    return pitchClass(offset).includes('#');
  }

  function frequency(offset) {
    return STANDARD_PITCH * Math.pow(2, (offset - A4_OFFSET) / 12);
  }

  // ---------- Instrument fingering data ----------
  // Keys are semitone offsets from C4. Values describe fingerings.

  // Trumpet (Bb), written pitch. Each entry is three valves [v1, v2, v3] (1 = pressed).
  const TRUMPET = {
    '-6': [1, 1, 1],   // F#3
    '-5': [1, 0, 1],   // G3
    '-4': [0, 1, 1],   // G#3
    '-3': [1, 1, 0],   // A3
    '-2': [1, 0, 0],   // A#3 / Bb3
    '-1': [0, 1, 0],   // B3
    '0':  [0, 0, 0],   // C4
    '1':  [1, 1, 1],   // C#4
    '2':  [1, 0, 1],   // D4
    '3':  [0, 1, 1],   // D#4
    '4':  [1, 1, 0],   // E4
    '5':  [1, 0, 0],   // F4
    '6':  [0, 1, 0],   // F#4
    '7':  [0, 0, 0],   // G4
    '8':  [0, 1, 1],   // G#4
    '9':  [1, 1, 0],   // A4
    '10': [1, 0, 0],   // A#4
    '11': [0, 1, 0],   // B4
    '12': [0, 0, 0],   // C5
    '13': [1, 1, 0],   // C#5
    '14': [1, 0, 0],   // D5
    '15': [0, 1, 0],   // D#5
    '16': [0, 0, 0],   // E5
    '17': [1, 0, 0],   // F5
    '18': [0, 1, 0],   // F#5
    '19': [0, 0, 0],   // G5
    '20': [0, 1, 1],   // G#5
    '21': [1, 1, 0],   // A5
    '22': [1, 0, 0],   // A#5
    '23': [0, 1, 0],   // B5
    '24': [0, 0, 0],   // C6
  };

  // Tenor trombone. Each entry is [primary position, alternate?] (1-7).
  const TROMBONE = {
    '-20': [7],         // E2
    '-19': [6],         // F2
    '-18': [5],         // F#2
    '-17': [4],         // G2
    '-16': [3],         // G#2
    '-15': [2],         // A2
    '-14': [1],         // Bb2
    '-13': [7],         // B2
    '-12': [6],         // C3
    '-11': [5],         // C#3
    '-10': [4],         // D3
    '-9':  [3],         // Eb3
    '-8':  [2, 7],      // E3
    '-7':  [1, 6],      // F3
    '-6':  [5],         // F#3
    '-5':  [4],         // G3
    '-4':  [3, 7],      // G#3
    '-3':  [2, 6],      // A3
    '-2':  [1, 5],      // Bb3
    '-1':  [4],         // B3
    '0':   [3, 6],      // C4
    '1':   [2, 5],      // C#4
    '2':   [1, 4],      // D4
    '3':   [5],         // Eb4
    '4':   [4],         // E4
    '5':   [1, 6],      // F4
    '6':   [5],         // F#4
    '7':   [4],         // G4
  };

  // Tenor-bass trombone (Bb/F). Adds F attachment positions for notes between
  // pedal Bb1 and E2 normally inaccessible, and gives alternate positions.
  const TENORBASS = Object.assign({}, TROMBONE, {
    // With F attachment engaged, low register fills in.
    '-26': [1], // B1 (F attachment, slightly extended)
    '-25': [4], // C2 (F)
    '-24': [3], // C2... approximate
    '-23': [2], // C#2 (F)
    '-22': [1], // D2 (F)
    // Marking F-attachment alternates on selected mid-low notes:
    '-13': [7, null, 1], // B2 (alt F-attachment 1st)
    '-12': [6, null, 2], // C3 (F-attachment alternate)
    '-11': [5, null, 3], // C#3
    '-10': [4, null, 4], // D3
  });

  // Tenor saxophone written-pitch fingering layout.
  // Sax has many keys; we'll show a compact key-state diagram per note.
  // Each entry is an object with octave-key and finger states.
  // Simplified: left-hand keys lh1-lh3, right-hand keys rh1-rh3, octave key, lower keys.
  const TENORSAX_RANGE = { lo: -15, hi: 18 }; // Bb3 to F#6 (concert Ab2 to E5)

  // Standard fingerings: which holes are closed (true = closed).
  // Indexed by semitone offset from C4 (written pitch).
  // Order of keys for display: oct, lh1, lh2, lh3, rh1, rh2, rh3, pinky
  function saxFingering(offset) {
    // Normalize to within-octave repetition.
    const oct = offset >= 9; // upper octave from A4 up uses octave key
    const pc = ((offset % 12) + 12) % 12;
    // Approximate Boehm-like fingerings (close-enough for visual purposes):
    const map = {
      // [lh1, lh2, lh3, rh1, rh2, rh3, low-key]
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
    };
    return { octave: oct, keys: map[pc] || [0, 0, 0, 0, 0, 0, 0] };
  }

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
  };

  // ---------- View helpers ----------
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.startsWith('on') && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2), attrs[k]);
        } else if (attrs[k] != null) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  // ---------- Renderers ----------
  function renderTrumpet() {
    const wrap = el('div', { class: 'fingering-chart' });
    const charts = el('div', { class: 'charts' });
    const lo = -6, hi = 24;
    for (let i = lo; i <= hi; i++) {
      const fingering = TRUMPET[String(i)] || [0, 0, 0];
      const cell = el('div', { class: 'valves' }, [
        el('div', { class: 'key' }, noteName(i)),
        ...fingering.map(v =>
          el('div', { class: 'valve pressed' + v })
        ),
      ]);
      charts.appendChild(cell);
    }
    wrap.appendChild(charts);
    return wrap;
  }

  function renderTrombone(data, lo, hi, withFAttachment) {
    const wrap = el('div', { class: 'fingering-chart' });
    for (let i = lo; i <= hi; i++) {
      const entry = data[String(i)];
      if (!entry) continue;
      const slide = el('div', { class: 'slide' }, [
        el('div', { class: 'key' }, noteName(i)),
      ]);
      const primary = entry[0];
      const alt = entry[1];
      const fAtt = entry[2];
      if (primary) {
        slide.appendChild(el('div', {
          class: 'valve',
          style: 'height:' + (primary * 18 + 6) + 'px;',
        }, el('span', { class: 'num' }, String(primary))));
      }
      if (alt) {
        slide.appendChild(el('div', {
          class: 'valve alt',
          style: 'height:' + (alt * 18 + 6) + 'px;',
        }, el('span', { class: 'num' }, String(alt))));
      }
      if (withFAttachment && fAtt) {
        slide.appendChild(el('div', {
          class: 'valve f_attachment',
          style: 'height:' + (fAtt * 18 + 6) + 'px;',
        }, el('span', { class: 'num' }, String(fAtt))));
      }
      wrap.appendChild(slide);
    }
    return wrap;
  }

  function renderTenorSax() {
    const wrap = el('div', { class: 'fingering-chart sax-grid' });
    for (let i = TENORSAX_RANGE.lo; i <= TENORSAX_RANGE.hi; i++) {
      const fing = saxFingering(i);
      const cell = el('div', { class: 'sax-cell' }, [
        el('div', { class: 'key' }, noteName(i)),
        saxSVG(fing),
      ]);
      wrap.appendChild(cell);
    }
    return wrap;
  }

  function saxSVG({ octave, keys }) {
    // Compact stylized rendering: stem with key dots.
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '40');
    svg.setAttribute('height', '120');
    svg.setAttribute('viewBox', '0 0 40 120');

    const body = document.createElementNS(svgNS, 'rect');
    body.setAttribute('x', '17');
    body.setAttribute('y', '5');
    body.setAttribute('width', '6');
    body.setAttribute('height', '110');
    body.setAttribute('fill', '#cccccc');
    svg.appendChild(body);

    // Octave key (top circle)
    const oct = document.createElementNS(svgNS, 'circle');
    oct.setAttribute('cx', '10');
    oct.setAttribute('cy', '12');
    oct.setAttribute('r', '4');
    oct.setAttribute('fill', octave ? '#323232' : '#ffffff');
    oct.setAttribute('stroke', '#000');
    svg.appendChild(oct);

    // Main keys down the body
    for (let k = 0; k < 7; k++) {
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('cx', '20');
      dot.setAttribute('cy', String(25 + k * 13));
      dot.setAttribute('r', '5');
      dot.setAttribute('fill', keys[k] ? '#323232' : '#ffffff');
      dot.setAttribute('stroke', '#000');
      svg.appendChild(dot);
    }
    return svg;
  }

  function renderPianoRange(range, freq) {
    const lo = -39;
    const hi = 48;
    const row = el('div', { class: 'piano-row' + (freq ? ' frequenz' : '') });
    for (let i = lo; i <= hi; i++) {
      const black = isBlackKey(i);
      let cls = 'piano_button ' + (black ? 'black' : 'white');
      if (range && i >= range.lo && i <= range.hi) {
        cls = 'piano_button ' + (black ? 'blackplayable' : 'whiteplayable');
      }
      const label = freq
        ? String(Math.round(frequency(i)))
        : pitchClass(i);
      const cell = el('div', { class: cls, title: noteName(i) }, label);
      row.appendChild(cell);
    }
    return row;
  }

  // ---------- Views ----------
  function viewHome() {
    return el('div', null, [
      el('section', { class: 'home-intro' }, [
        el('h2', null, 'Open Music Database'),
        el('p', null,
          'An open collection of musical reference material: instrument fingering charts, ' +
          'pitch ranges and frequency tables. Free to browse, free to contribute.'),
        el('p', null,
          'Use the navigation above to explore instruments, compare ranges, or upload ' +
          'a piece of music.'),
      ]),
      el('section', { class: 'home-grid' }, [
        el('a', { class: 'home-card', href: '#instruments' }, [
          el('h3', null, 'Instruments'),
          el('p', null, 'Valve and slide fingerings for trumpet, trombone and tenor saxophone.'),
        ]),
        el('a', { class: 'home-card', href: '#range' }, [
          el('h3', null, 'Range'),
          el('p', null, 'Piano-keyboard range charts for voices and instruments with frequencies.'),
        ]),
        el('a', { class: 'home-card', href: '#upload' }, [
          el('h3', null, 'Upload'),
          el('p', null, 'Submit a song with metadata, audio, video, MIDI or MusicXML.'),
        ]),
        el('a', { class: 'home-card', href: '#about' }, [
          el('h3', null, 'About'),
          el('p', null, 'Project background and useful music-notation links.'),
        ]),
      ]),
    ]);
  }

  function viewInstruments() {
    return el('div', { class: 'instrument-section' }, [
      el('h2', null, 'Trumpet'),
      el('img', { class: 'instrument-image', src: 'img/trumpet.svg', style: 'height:150px;', alt: 'Trumpet' }),
      renderTrumpet(),

      el('h2', null, 'Tenor Trombone'),
      el('img', { class: 'instrument-image', src: 'img/tenortrombone.svg', style: 'height:160px;', alt: 'Tenor trombone' }),
      renderTrombone(TROMBONE, -20, 7, false),

      el('h2', null, 'Tenor-Bass Trombone'),
      el('img', { class: 'instrument-image', src: 'img/tenortrombone.svg', style: 'height:160px;', alt: 'Tenor-bass trombone' }),
      renderTrombone(TENORBASS, -26, 7, true),

      el('h2', null, 'Tenor Saxophone'),
      renderTenorSax(),
    ]);
  }

  function viewRange() {
    const rows = [
      { label: 'Frequency (Hz)', range: null, freq: true },
      { label: 'Piano',          range: RANGES.piano },
      { label: 'Human Voice',    range: RANGES.humanVoice },
      { label: 'Bass',           range: RANGES.bass },
      { label: 'Baritone',       range: RANGES.baritone },
      { label: 'Tenor',          range: RANGES.tenor },
      { label: 'Alto',           range: RANGES.alto },
      { label: 'Mezzo-soprano',  range: RANGES.mezzosoprano },
      { label: 'Soprano',        range: RANGES.soprano },
      { label: 'Trumpet',        range: RANGES.trumpet },
      { label: 'Tenor Trombone', range: RANGES.trombone },
      { label: 'Tenor-Bass Trombone', range: RANGES.tenorbass },
      { label: 'Tenor Saxophone', range: RANGES.tenorSax },
    ];

    const table = el('table', { class: 'range-table' });
    rows.forEach(r => {
      const tr = el('tr', null, [
        el('td', { class: 'label' }, r.label),
        el('td', null, el('div', { class: 'range-wrap' },
          renderPianoRange(r.range, !!r.freq))),
      ]);
      table.appendChild(tr);
    });

    return el('div', null, [
      el('h2', null, 'Pitch Range'),
      el('p', null,
        'Each row highlights the typical playable range of the instrument or voice ' +
        'on a piano keyboard. The top row shows frequencies in Hz at A4 = ' + STANDARD_PITCH + ' Hz.'),
      table,
    ]);
  }

  function viewUpload() {
    const form = el('form', {
      class: 'upload-form',
      onsubmit: e => {
        e.preventDefault();
        alert('Upload is not wired up in this demo build.');
      },
    }, [
      el('h2', null, 'Upload a piece'),

      el('fieldset', null, [
        el('input', { type: 'text', name: 'songtitle', placeholder: 'Song title' }),
        el('input', { type: 'text', name: 'composer',  placeholder: 'Composer' }),
        el('input', { type: 'text', name: 'arranger',  placeholder: 'Arranger' }),
      ]),

      el('div', null, [
        el('label', null, 'Instrument'),
        el('select', { name: 'instrument' }, ['Piano', 'Grand Piano', 'E-Piano', 'Trumpet', 'Trombone', 'Saxophone'].map(o => el('option', null, o))),
      ]),

      el('div', null, [
        el('label', null, 'Instrumentation'),
        el('select', { name: 'instrumentation' }, ['Solo', 'Duo', 'Quartet', 'Big Band', 'Orchestra'].map(o => el('option', null, o))),
      ]),

      el('fieldset', null, [
        el('label', null, 'Meter'),
        el('span', { class: 'meter' }, [
          el('input', { type: 'number', min: '2', max: '16', value: '4' }),
          el('input', { type: 'number', min: '2', max: '16', value: '4' }),
        ]),
        el('label', null, 'Bar'),
        el('input', { type: 'number', min: '1', value: '1' }),
        el('label', null, 'Tempo (bpm)'),
        el('input', { type: 'number', min: '1', max: '230', value: '120' }),
        el('label', null, 'Time'),
        el('input', { type: 'time', value: '00:00' }),
      ]),

      el('div', null, [
        el('label', null, 'Key'),
        el('select', null, NOTE_NAMES.map(n => el('option', null, n))),
        el('select', null, [el('option', null, 'Major'), el('option', null, 'Minor')]),
      ]),

      el('div', null, [
        el('label', null, 'Difficulty'),
        el('select', null,
          Array.from({ length: 10 }, (_, i) => el('option', null, String(i + 1)))),
      ]),

      el('div', { class: 'links-row' }, [
        el('div', { class: 'links' }, 'Audio'),
        el('div', { class: 'links' }, 'Video'),
        el('div', { class: 'links' }, 'Image'),
        el('div', { class: 'links' }, 'Midi'),
        el('div', { class: 'links' }, 'MusicXML'),
      ]),

      el('input', { type: 'submit', value: 'Upload' }),
    ]);
    return form;
  }

  function viewAbout() {
    return el('div', { class: 'legal' }, [
      el('h2', null, 'About'),
      el('p', null,
        'Open Music Database is an open project collecting musical reference material: ' +
        'fingering charts, instrument ranges, frequencies and (eventually) sheet music.'),
      el('h3', null, 'Related projects'),
      el('ul', null, [
        el('li', null, el('a', { href: 'http://balanced-keyboard.com', target: '_blank', rel: 'noopener' }, 'balanced-keyboard.com')),
        el('li', null, el('a', { href: 'http://musicnotation.org', target: '_blank', rel: 'noopener' }, 'musicnotation.org')),
        el('li', null, el('a', { href: 'http://denemo.org', target: '_blank', rel: 'noopener' }, 'denemo.org — open-source music notation editor')),
      ]),
      el('h3', null, 'Notation example'),
      el('pre', { style: 'background:#f4f4f4;padding:10px;border-radius:6px;display:inline-block;' },
        'c=== | d d e f# | a b c d |'),
    ]);
  }

  function viewImprint() {
    return el('div', { class: 'legal' }, [
      el('h2', null, 'Imprint'),
      el('p', null, 'Open Music Database is a non-commercial project.'),
      el('p', null, 'Contact the maintainers via the project repository.'),
    ]);
  }

  function viewTerms() {
    return el('div', { class: 'legal' }, [
      el('h2', null, 'Terms of Use'),
      el('p', null,
        'Content on Open Music Database is provided for educational and informational ' +
        'purposes. Users are responsible for ensuring that any material they upload ' +
        'respects applicable copyright and licensing.'),
      el('p', null,
        'The maintainers offer no warranty regarding accuracy of fingering charts or ' +
        'range data. Reference material should be verified against authoritative sources ' +
        'before professional use.'),
    ]);
  }

  function viewPrivacy() {
    return el('div', { class: 'legal' }, [
      el('h2', null, 'Privacy'),
      el('p', null,
        'This static site does not collect or transmit personal data. No cookies are set ' +
        'and no tracking scripts are loaded.'),
    ]);
  }

  function viewNotFound() {
    return el('div', { class: 'legal' }, [
      el('h2', null, 'Not found'),
      el('p', null, 'No view exists at this route.'),
      el('p', null, el('a', { href: '#home' }, 'Back to home')),
    ]);
  }

  // ---------- Router ----------
  const ROUTES = {
    '':            viewHome,
    'home':        viewHome,
    'instruments': viewInstruments,
    'range':       viewRange,
    'upload':      viewUpload,
    'about':       viewAbout,
    'imprint':     viewImprint,
    'terms':       viewTerms,
    'privacy':     viewPrivacy,
  };

  function render() {
    const hash = window.location.hash.replace(/^#/, '');
    const view = ROUTES[hash] || viewNotFound;
    const target = document.getElementById('view');
    target.innerHTML = '';
    target.appendChild(view());
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const q = searchForm.querySelector('input[name="search"]').value.trim();
        if (q) alert('Search is not implemented yet: ' + q);
      });
    }
    if (!window.location.hash) window.location.hash = '#home';
    else render();
  });
})();
