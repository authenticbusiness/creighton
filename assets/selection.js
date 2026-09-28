/* Machine-authored by Codex/OpenAI. Uniform choice with no immediate repeat when previous selection is available. */
(function (root) {
  'use strict';
  function chooseStart(count, previous, random = Math.random) {
    if (!Number.isInteger(count) || count < 1) throw new RangeError('No photographs available');
    if (count === 1) return 0;
    const validPrevious = Number.isInteger(previous) && previous >= 0 && previous < count;
    const eligible = count - (validPrevious ? 1 : 0);
    const sample = Math.min(1 - Number.EPSILON, Math.max(0, random()));
    const pick = Math.floor(sample * eligible);
    return validPrevious && pick >= previous ? pick + 1 : pick;
  }
  root.CreightonSelection = { chooseStart };
  if (typeof module !== 'undefined' && module.exports) module.exports = { chooseStart };
})(globalThis);
