/**
 * Deterministic Key Generator for Sanity Portable Text
 * goutamprusty.com v2 Rebuild — Milestone 1B
 *
 * Produces stable, collision-resistant 12-character alphanumeric keys
 * derived deterministically from document ID, structural path, and content seeds.
 */

const crypto = require('crypto');

/**
 * Generate a deterministic 12-character key from an arbitrary seed string.
 * @param {string} seed
 * @returns {string}
 */
function makeKey(seed) {
  return crypto.createHash('sha256').update(seed).digest('hex').slice(0, 12);
}

module.exports = {
  makeKey
};
