// High-speed in-memory serverless cache for public menu catalog
let menuMemoryCache = null;
let menuCacheExpiresAt = 0;

export function getMenuCache() {
  const now = Date.now();
  if (menuMemoryCache && now < menuCacheExpiresAt) {
    return menuMemoryCache;
  }
  return null;
}

export function setMenuCache(data, ttlMs = 60000) {
  menuMemoryCache = data;
  menuCacheExpiresAt = Date.now() + ttlMs;
}

export function invalidateMenuCache() {
  menuMemoryCache = null;
  menuCacheExpiresAt = 0;
}
