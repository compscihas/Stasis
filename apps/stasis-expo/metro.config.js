const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite uses wa-sqlite in browser previews. Metro must treat the wasm
// binary as an asset or production web exports fail before route rendering.
config.resolver.assetExts.push('wasm');

module.exports = config;
