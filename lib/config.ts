/**
 * Configuration settings for the dual-database architecture
 */

export const AGGREGATION_CONFIG = {
  // How far back to look for events to aggregate (in minutes)
  CUTOFF_TIME_MINUTES: 20,
  
  // Session cache TTL (in hours)
  SESSION_CACHE_TTL_HOURS: 24,
  
  // Maximum time per hour per user (in minutes)
  MAX_TIME_PER_HOUR: 60,
  
  // Maximum time per event (in minutes)
  MAX_TIME_PER_EVENT: 10,
} as const;

// Helper function to get cutoff time
export function getCutoffTime(): Date {
  return new Date(Date.now() - AGGREGATION_CONFIG.CUTOFF_TIME_MINUTES * 60 * 1000);
}

// Helper function to get session cache expiry
export function getSessionCacheExpiry(): Date {
  return new Date(Date.now() + AGGREGATION_CONFIG.SESSION_CACHE_TTL_HOURS * 60 * 60 * 1000);
}
