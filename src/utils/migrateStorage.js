import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from "./storageKeys";

// One-time move of saved data from the legacy `furniture_*` keys to the
// `vermera_*` ones. Imported for its side effect as the FIRST import in
// main.jsx, so it runs before store.js (whose cart slice reads localStorage
// while the module loads). Never overwrites data already under a new key,
// and storage being unavailable (private mode, blocked site data) just
// skips the migration.
try {
  for (const [name, legacyKey] of Object.entries(LEGACY_STORAGE_KEYS)) {
    const legacyValue = localStorage.getItem(legacyKey);
    if (legacyValue === null) continue;
    if (localStorage.getItem(STORAGE_KEYS[name]) === null) {
      localStorage.setItem(STORAGE_KEYS[name], legacyValue);
    }
    localStorage.removeItem(legacyKey);
  }
} catch {
  // Storage unavailable: nothing to migrate.
}
