// Expo's Metro defaults, with the folders the app never imports kept out of the
// bundler's file map: the design bundles, the run tooling and its output. A
// change there (a screenshot, a regenerated script) used to reload the app.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const skip = ['pixel-diff', 'Vici UI 2', 'Vici Overhaul', '.overhaul', 'scripts', 'specs', 'ios.bak-20261009', 'design-references', 'docs', 'legal'];
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
config.resolver.blockList = [...[].concat(config.resolver.blockList ?? []), ...skip.map((d) => new RegExp(`^${escape(__dirname)}/${escape(d)}/.*`))];

module.exports = config;
