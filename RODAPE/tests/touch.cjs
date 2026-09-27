const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const listeners = () => ({
  handlers: {},
  addEventListener(name, fn) { (this.handlers[name] ??= []).push(fn); },
  emit(name, event) { this.handlers[name]?.forEach(fn => fn(event)); },
});
const style = () => ({ values: {}, setProperty(key, value) { this.values[key] = value; } });
const letters = Array.from({ length: 3 }, (_, i) => ({
  style: style(),
  classList: { active: false, toggle(name, value) { this.active = value; } },
  getBoundingClientRect: () => ({ left: i * 100, right: (i + 1) * 100, top: 0 }),
}));
const stage = {
  ...listeners(), style: style(), querySelectorAll: () => letters,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 150 }),
};
const window = { ...listeners(), innerWidth: 390 };
const frames = new Map();
let nextFrame = 0;
let now = 0;
const advance = time => {
  now = time;
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach(fn => fn(now));
};
vm.runInNewContext(fs.readFileSync('footer.js', 'utf8'), {
  window,
  performance: { now: () => now },
  document: { ...listeners(), querySelectorAll: () => [], getElementById: () => stage, fonts: { ready: Promise.resolve() } },
  ResizeObserver: class { observe() {} },
  requestAnimationFrame: fn => { frames.set(++nextFrame, fn); return nextFrame; },
  cancelAnimationFrame: id => frames.delete(id),
});
const touch = (x, extra = {}) => ({ pointerType: 'touch', pointerId: 7, isPrimary: true, clientX: x, clientY: 60, ...extra });
const visible = () => stage.style.values['--reveal-opacity'];
stage.emit('pointerenter', touch(30));
assert.notEqual(visible(), '1', 'Touch hover must not start the effect');
stage.emit('pointerdown', touch(30));
assert.equal(visible(), '1', 'Touch down starts mobile brush');
assert.equal((letters[0].style.values['--brush-fill'].match(/radial-gradient/g) || []).length, 13);
now = 1000;
stage.emit('pointermove', touch(130));
assert.deepEqual(letters.map(l => l.classList.active), [true, true, false]);
stage.emit('pointerdown', touch(230, { pointerId: 8, isPrimary: false }));
assert.deepEqual(letters.map(l => l.classList.active), [true, true, false], 'Second finger must not switch letters');
window.emit('pointerup', touch(130));
assert.equal(visible(), '1', 'Paint persists after finger lift');
advance(2500);
assert.ok(letters[0].style.values['--brush-fill'].includes('0.708'), 'Older O paint fades first');
assert.ok(letters[1].style.values['--brush-fill'].includes('1.000'), 'Newer S paint still holds');
advance(3500);
assert.deepEqual(letters.map(l => l.classList.active), [false, true, false], 'Paint disappears in traversal order');
advance(4500);
assert.equal(visible(), '0', 'All paint expires');
assert.equal(frames.size, 0, 'Idle animation stops after paint expires');
stage.emit('pointerdown', touch(230));
window.emit('pointercancel', touch(230));
assert.equal(visible(), '1', 'Cancellation retains existing paint without drawing more');
advance(8000);
assert.equal(visible(), '0');
stage.emit('pointerdown', touch(30));
stage.emit('pointermove', touch(30, { clientY: 170 }));
assert.equal(visible(), '1', 'Contact outside leaves only existing paint');
stage.emit('pointermove', touch(30));
assert.equal(visible(), '1', 'Contact can return to lettering');
window.emit('pointerup', touch(30));
stage.emit('pointerenter', touch(130, { pointerType: 'mouse' }));
assert.equal(visible(), '1', 'Mouse interaction remains available');
stage.emit('pointerleave', touch(130, { pointerType: 'mouse' }));
advance(12000);
assert.equal(visible(), '0');
assert.equal(frames.size, 0);
console.log('PASS: touch and mouse painting, persistence, chronological fading, multitouch, cancellation, and idle cleanup.');
