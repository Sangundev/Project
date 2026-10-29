// ===== Components =====
function requireElement(selector, within = document) {
  const found = within.querySelector(selector);
  if (!found) throw new Error(`Missing element "${selector}".`);
  return found;
}

class Loader {
  constructor(selector) {
    this.element = requireElement(selector);
    this.label = requireElement('.loader-label', this.element);
    this.bar = requireElement('.loader-bar', this.element);
    this.shown = 0;
  }
  setProgress(fraction, message) {
    this.shown = Math.max(this.shown, Math.min(Math.max(fraction, 0), 1));
    const percent = Math.round(this.shown * 100);
    this.bar.style.transform = `scaleX(${this.shown})`;
    this.element.setAttribute('aria-valuenow', String(percent));
    if (message) this.label.textContent = `${message} ${percent}%`;
  }
  done() {
    this.setProgress(1);
    this.element.closest('.viewer')?.classList.add('is-ready');
    this.element.setAttribute('aria-busy', 'false');
  }
  fail(message) {
    this.element.classList.add('is-failed');
    this.label.textContent = message;
  }
}

class Notice {
  constructor(selector) {
    this.element = requireElement(selector);
  }
  show(message, seconds) {
    this.element.textContent = message;
    this.element.hidden = false;
    if (seconds) {
      window.setTimeout(() => {
        this.element.hidden = true;
      }, seconds * 1000);
    }
  }
}

class Uploader {
  constructor(buttonSelector, fieldSelector, resetSelector) {
    this.button = requireElement(buttonSelector);
    this.field = requireElement(fieldSelector);
    this.reset = requireElement(resetSelector);
  }
  setDisabled(disabled) {
    this.button.disabled = disabled;
  }
  setCustom(custom) {
    this.reset.hidden = !custom;
  }
  onReset(callback) {
    this.reset.addEventListener('click', () => {
      this.setCustom(false);
      callback();
    });
  }
  onChange(callback) {
    this.button.addEventListener('click', () => this.field.click());
    this.field.addEventListener('change', () => {
      const file = this.field.files?.[0];
      this.field.value = '';
      if (file) callback(file);
    });
  }
}

// ===== Highlights =====
const QUARTER = Math.PI / 2;
const TENT_OPENNESS = 0.4;
const TENT_TILT = QUARTER - ((1 - TENT_OPENNESS) * Math.PI) / 2;

const HIGHLIGHTS = [
  {
    id: 'foldable',
    label: 'Foldable design',
    body: 'Offers exceptional viewing experiences in a design that fits in your pocket.',
    openness: 0.3333,
    pose: [0, 0, 0],
    view: { distance: 43, pitch: QUARTER, yaw: 0 },
    adjustable: true,
  },
  {
    id: 'landscape',
    label: 'Landscape',
    body: 'A spacious display for incredibly immersive entertainment. You can even use two apps side by side with Split View multitasking.',
    openness: 1,
    pose: [0, 0, 0],
    view: { distance: 48, pitch: 1.5, yaw: 0 },
  },
  {
    id: 'portrait',
    label: 'Portrait',
    body: 'Type comfortably on a wider keyboard. Enjoy more room to browse and scroll. Pin a video to the top and watch it while using another app.',
    openness: 1,
    pose: [0, 0, QUARTER],
    view: { distance: 46, pitch: 1.52, yaw: 0 },
    roll: 'clockwise',
    lift: 0,
    tapTarget: 'landscape',
    image: 'portrait',
  },
  {
    id: 'closed',
    label: 'Closed',
    body: "Compact and comfortable to hold. With essential controls moved to the side, théy're easy to reach. And you get more vertical space for apps.",
    openness: 0,
    pose: [0, 0, 0],
    view: { distance: 47, pitch: QUARTER, yaw: -0.12 },
    screen: 'outer',
  },
  {
    id: 'seated',
    label: 'Seated',
    body: 'Set iPhone Duo down and watch a show or follow a workout at the perfect viewing angle — with easy access to the controls on the bottom.',
    openness: 0.5,
    pose: [0, 0, QUARTER],
    view: { distance: 44, pitch: 1.34, yaw: 0 },
    roll: 'clockwise',
    lift: -0.4,
    tapTarget: 'closed',
    image: 'portrait',
  },
  {
    id: 'standing',
    label: 'Standing',
    body: 'Display a bedside clock, photos, widgets and more with StandBy. And watch movies and shows at an adjustable angle on the outer display.',
    openness: TENT_OPENNESS,
    pose: [TENT_TILT, 0, -QUARTER],
    view: { distance: 50, pitch: 1.3, yaw: -0.3 },
    roll: 'anticlockwise',
    screen: 'outer',
    lift: 2,
    tapTarget: 'closed',
  },
  {
    id: 'durability',
    label: 'Durability',
    body: 'Grade 5 titanium frame and hinge cover. Scratch-resistant coating on the inner display. Ceramic Shield, front and back. IP68 water and dust resistant.',
    openness: 0.45,
    pose: [-0.1, 2.3, 0],
    view: { distance: 27.5, pitch: 1.52, yaw: 0 },
    screen: 'outer',
    lift: -2.2,
    shift: -2.2,
    tapTarget: 'closed',
  },
  // {
  //   id: 'stele',
  //   label: 'Stele',
  //   body: "If you're still manually inspecting elements and taking UI screenshots, you're wasting time. Capture any web UI straight to React code and Figma layers, instantly.",
  //   openness: 1,
  //   pose: [0, 0, 0],
  //   view: { distance: 48, pitch: 1.5, yaw: 0 },
  //   image: 'stele',
  //   link: { url: 'https://stele.so', label: 'Try Stele' },
  //   sponsored: true,
  // },
];

// ===== Rail =====

const MORPH_MS = 720;
const MORPH_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';
const NUDGE = 0.5;
const SLIDER_STEPS = 1000;
const PLUS_MARK = '<path d="M12 6.6v10.8M6.6 12h10.8" />';
const DRAG_MARK = '<path d="M9.6 8 5.6 12l4 4M14.4 8l4 4-4 4" />';
const COMPACT_QUERY = '(max-width: 900px), (max-height: 540px) and (orientation: landscape)';

function mark(paths) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = paths;
  return svg;
}

function foldControl() {
  const slider = document.createElement('input');
  slider.id = 'fold';
  slider.className = 'fold-slider';
  slider.type = 'range';
  slider.min = '0';
  slider.max = String(SLIDER_STEPS);
  slider.step = '1';
  slider.disabled = true;
  slider.setAttribute('aria-label', 'Fold amount');
  return slider;
}

function buildItem(highlight) {
  const item = document.createElement('li');
  item.className = 'highlight';
  item.id = `highlight-${highlight.id}`;
  const box = document.createElement('div');
  box.className = 'highlight-box';
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'highlight-chip';
  chip.setAttribute('aria-expanded', 'false');
  const badge = document.createElement('span');
  badge.className = highlight.adjustable ? 'highlight-mark highlight-mark--drag' : 'highlight-mark';
  badge.append(mark(highlight.adjustable ? DRAG_MARK : PLUS_MARK));
  const name = document.createElement('span');
  name.textContent = highlight.label;
  chip.append(badge, name);
  const detail = document.createElement('div');
  detail.className = 'highlight-detail';
  if (highlight.sponsored) {
    const tag = document.createElement('span');
    tag.className = 'sponsored-tag';
    tag.textContent = 'check out my work';
    detail.append(tag);
  }
  const copy = document.createElement('p');
  copy.className = 'info-copy';
  const lead = document.createElement('strong');
  lead.textContent = `${highlight.label}.`;
  copy.append(lead, ` ${highlight.body}`);
  detail.append(copy);
  if (highlight.link) {
    const link = document.createElement('a');
    link.className = 'highlight-link';
    link.href = highlight.link.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${highlight.link.label} →`;
    detail.append(link);
  }
  box.append(chip, detail);
  item.append(box);
  return { item, box, chip, detail };
}

function createRail(list, sheet, previous, upcoming, onSelect) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact = window.matchMedia(COMPACT_QUERY);
  const slider = foldControl();
  const boxes = [];
  const items = [];
  const details = [];
  let current = HIGHLIGHTS[0];
  let openId = current.id;
  let locked = true;

  HIGHLIGHTS.forEach((highlight) => {
    const { item, box, chip, detail } = buildItem(highlight);
    if (highlight.adjustable) {
      const control = document.createElement('label');
      control.className = 'fold-control';
      const hint = document.createElement('span');
      hint.className = 'fold-label';
      hint.textContent = 'Drag below to open and close';
      control.append(hint, slider);
      detail.append(control);
    }
    chip.addEventListener('click', () => select(highlight));
    list.append(item);
    boxes.push(box);
    items.push(item);
    details.push(detail);
  });

  function morph(change) {
    if (reduced) {
      change();
      return;
    }
    const targets = compact.matches ? [sheet] : boxes;
    const before = targets.map((box) => box.getBoundingClientRect());
    const shown = sheet.firstElementChild;
    targets.forEach((box) => box.getAnimations().forEach((animation) => animation.cancel()));
    change();
    targets.forEach((box, index) => {
      const from = before[index];
      const to = box.getBoundingClientRect();
      const shift = compact.matches ? 0 : from.top - to.top;
      const still =
        Math.abs(from.width - to.width) < NUDGE &&
        Math.abs(from.height - to.height) < NUDGE &&
        Math.abs(shift) < NUDGE;
      if (still) return;
      box.animate(
        [
          { width: `${from.width}px`, height: `${from.height}px`, transform: `translateY(${shift}px)` },
          { width: `${to.width}px`, height: `${to.height}px`, transform: 'translateY(0)' },
        ],
        { duration: MORPH_MS, easing: MORPH_EASING },
      );
    });
    const incoming = sheet.firstElementChild;
    if (compact.matches && incoming && incoming !== shown) {
      incoming.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 320,
        delay: 120,
        easing: 'ease',
        fill: 'backwards',
      });
    }
  }

  function reveal(index, smooth) {
    const item = items[index];
    if (!item) return;
    const behavior = smooth && !reduced ? 'smooth' : 'auto';
    if (compact.matches) {
      list.scrollTo({
        left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
        behavior,
      });
    } else {
      const growing = boxes.flatMap((box) => box.getAnimations());
      void Promise.allSettled(growing.map((animation) => animation.finished)).then(() => {
        if (compact.matches || list.scrollHeight <= list.clientHeight) return;
        const box = item.getBoundingClientRect();
        const view = list.getBoundingClientRect();
        const top = box.top - view.top - NUDGE * 8;
        const bottom = box.bottom - view.bottom + NUDGE * 8;
        const delta = top < 0 ? top : bottom > 0 ? Math.min(bottom, top) : 0;
        if (delta !== 0) list.scrollBy({ top: delta, behavior });
      });
    }
  }

  function paint() {
    const index = HIGHLIGHTS.indexOf(current);
    items.forEach((item, at) => {
      const open = HIGHLIGHTS[at].id === openId;
      item.classList.toggle('is-open', open);
      item.classList.toggle('is-current', at === index);
      item.querySelector('.highlight-chip')?.setAttribute('aria-expanded', String(open));
    });
    if (compact.matches) {
      const open = details[index];
      if (open && sheet.firstElementChild !== open) sheet.replaceChildren(open);
      sheet.classList.toggle('is-collapsed', openId === null);
    } else {
      details.forEach((detail, at) => {
        if (detail.parentElement !== boxes[at]) boxes[at].append(detail);
      });
      sheet.classList.add('is-collapsed');
    }
    previous.disabled = index <= 0;
    upcoming.disabled = index >= HIGHLIGHTS.length - 1;
    slider.disabled = locked || !current.adjustable || openId !== current.id;
  }

  function select(highlight) {
    current = highlight;
    openId = highlight.id;
    morph(paint);
    reveal(HIGHLIGHTS.indexOf(highlight), true);
    onSelect(highlight);
  }

  function collapse() {
    if (openId === null) return;
    openId = null;
    morph(paint);
  }

  function step(delta) {
    const next = HIGHLIGHTS[Math.min(HIGHLIGHTS.length - 1, Math.max(0, HIGHLIGHTS.indexOf(current) + delta))];
    if (next && next !== current) select(next);
  }

  previous.addEventListener('click', () => step(-1));
  upcoming.addEventListener('click', () => step(1));
  compact.addEventListener('change', () => {
    paint();
    reveal(HIGHLIGHTS.indexOf(current), false);
  });
  paint();

  return {
    slider,
    get current() {
      return current;
    },
    get isOpen() {
      return openId !== null;
    },
    select,
    collapse,
    step,
    unlock() {
      locked = false;
      paint();
    },
  };
}

export { requireElement, Loader, Notice, Uploader, HIGHLIGHTS, createRail };