
// Use of Gitmojis to create rules
const gitmojis = require("gitmojis").gitmojis;

const MAJOR = "major";
const MINOR = "minor";
const PATCH = "patch";
// Store rules based on Gitmoji semver key in a object for later
const RULES = {
  major: gitmojis
    .filter(({ semver }) => semver === MAJOR)
    .map(({ emoji }) => emoji),
  minor: gitmojis
    .filter(({ semver }) => semver === MINOR)
    .map(({ emoji }) => emoji),
  patch: gitmojis
    .filter(({ semver }) => semver === PATCH)
    .map(({ emoji }) => emoji),
  // Not needed, just if you wish to render commit
  // with gitmojis without semver.
  others: gitmojis
    .filter(({ semver }) => semver === null)
    .map(({ emoji }) => emoji),
};

module.exports = RULES;